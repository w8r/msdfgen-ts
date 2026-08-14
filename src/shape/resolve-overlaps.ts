/**
 * Polygon-union preprocessor for overlapping same-winding contours.
 *
 * NOT a port of C++ msdfgen — msdfgen delegates this to Skia's Path::Op
 * (see MSDFGEN_USE_SKIA / `-preprocess` in main.cpp). This file provides a
 * tiny, isolated, dependency-free alternative that only the runtime atlas
 * path opts into; the M3 golden gate (which starts from `shape.txt`
 * fixtures produced by the reference binary) never calls it and stays
 * bit-exact against the reference.
 *
 * Rewrites a shape whose fill region is the non-zero union of several
 * overlapping contours into an equivalent shape whose edges lie exactly
 * on the boundary of that union — an outer contour traced with material
 * on the left plus holes traced with material on the left (i.e. CCW
 * outer + CW holes in the y-up convention msdfgen uses internally).
 *
 * Algorithm:
 *   1. Recursive-AABB intersection: for every pair of edges from
 *      different contours, subdivide bounding boxes until the pair is
 *      point-sized, snapping duplicate intersections to a shared point.
 *   2. de Casteljau split: cut each edge at its accumulated crossing
 *      parameters, preserving segment type (LINEAR / QUADRATIC / CUBIC).
 *   3. Boundary test: sample the shape's non-zero winding number at a
 *      small offset on each side of every sub-edge's midpoint. Both sides
 *      material → hidden edge, discard. Both sides empty → degenerate,
 *      discard. Material on the direction's right → reverse the edge so
 *      the surviving graph consistently has material on the left.
 *   4. Reconnect: walk sub-edges through a quantized-coordinate hash of
 *      endpoints until closed loops emerge. Fragments that never close
 *      are dropped rather than emitted as broken contours.
 *
 * Complexity is O(Σ pairs · subdivision depth); acceptable at
 * per-glyph-first-use inside the atlas cache. The winding sampler reuses
 * `computeShapeScanline`, so no separate spatial index is introduced.
 */

import { type Contour } from "./contour.js";
import { EdgeSegment, LINEAR, QUADRATIC, CUBIC } from "./segments.js";
import { computeShapeScanline, Scanline } from "./scanline.js";
import { type Shape } from "./shape.js";

// ── Tuning ──────────────────────────────────────────────────────────────

/** Coincident-point tolerance (em units). Two intersections closer than this
 *  in either edge's parameter space are treated as one. */
const SNAP_EPS = 1e-6;
/** Endpoint-join tolerance (em units) used by the reconnection step's hash
 *  buckets. Coarser than SNAP_EPS because each edge subdivided at a shared
 *  intersection produces its endpoint independently via `subsegmentOf` — the
 *  two "same" endpoints drift by a handful of ulps. This must stay well below
 *  SIDE_EPS (1e-4) so genuinely distinct features never collide. */
const JOIN_EPS = 1e-5;
/** Off-edge sampling distance for the material-side test (em units). Small
 *  enough to fit inside typical glyph features, large enough to escape
 *  floating-point noise on the split boundary. */
const SIDE_EPS = 1e-4;
/** Maximum subdivision depth of the AABB intersection finder. 30 halvings of
 *  a unit range resolve intersections to ~1e-9 in em space. */
const MAX_SUBDIV_DEPTH = 24;
/** Bounding-box diagonal below which a subsegment is considered a point. */
const BOX_EPS = 1e-8;

// ── Module-scope scratch (library is single-threaded per worker) ────────

const _pt: number[] = [0, 0];
const _dir: number[] = [0, 0];
const _boxA: number[] = [0, 0, 0, 0];
const _boxB: number[] = [0, 0, 0, 0];

/** Per-edge accumulator: t, snapped x, snapped y. */
interface Split {
  t: number;
  x: number;
  y: number;
}

// ── Sub-segment construction (de Casteljau) ─────────────────────────────

/**
 * Computes the control points of `seg` restricted to parameter range
 * [t0, t1] and writes them into `cp` (8 numbers). Returns the segment's
 * order so the caller knows how many control points are valid.
 *
 * Uses the identity Q1 = Q0 + (t1-t0) * direction(t0), Q_end = P(t1),
 * and (for cubics) Q2 = Q3 - (t1-t0) * direction(t1). `EdgeSegment.direction()`
 * returns P'(t)/order, which lets the same expression handle quadratics
 * and cubics without special-casing the derivative scale.
 */
function subControlPoints(
  seg: EdgeSegment,
  t0: number,
  t1: number,
  cp: number[],
): number {
  const dt = t1 - t0;
  seg.point(t0, _pt);
  const q0x = _pt[0]!;
  const q0y = _pt[1]!;
  seg.point(t1, _pt);
  const qEx = _pt[0]!;
  const qEy = _pt[1]!;
  cp[0] = q0x;
  cp[1] = q0y;
  switch (seg.type) {
    case LINEAR:
      cp[2] = qEx;
      cp[3] = qEy;
      return 2;
    case QUADRATIC: {
      seg.direction(t0, _dir);
      cp[2] = q0x + dt * _dir[0]!;
      cp[3] = q0y + dt * _dir[1]!;
      cp[4] = qEx;
      cp[5] = qEy;
      return 3;
    }
    default: {
      seg.direction(t0, _dir);
      cp[2] = q0x + dt * _dir[0]!;
      cp[3] = q0y + dt * _dir[1]!;
      seg.direction(t1, _dir);
      cp[4] = qEx - dt * _dir[0]!;
      cp[5] = qEy - dt * _dir[1]!;
      cp[6] = qEx;
      cp[7] = qEy;
      return 4;
    }
  }
}

/**
 * Returns a new EdgeSegment covering `seg` over [t0, t1], with the shared
 * endpoints overridden by the caller so intersections match exactly
 * across the two edges they split.
 */
function subsegmentOf(
  seg: EdgeSegment,
  t0: number,
  t1: number,
  p0x: number,
  p0y: number,
  p1x: number,
  p1y: number,
): EdgeSegment {
  const dt = t1 - t0;
  switch (seg.type) {
    case LINEAR:
      return new EdgeSegment(LINEAR, p0x, p0y, p1x, p1y, 0, 0, 0, 0);
    case QUADRATIC: {
      seg.direction(t0, _dir);
      return new EdgeSegment(
        QUADRATIC,
        p0x,
        p0y,
        p0x + dt * _dir[0]!,
        p0y + dt * _dir[1]!,
        p1x,
        p1y,
        0,
        0,
      );
    }
    default: {
      seg.direction(t0, _dir);
      const c1x = p0x + dt * _dir[0]!;
      const c1y = p0y + dt * _dir[1]!;
      seg.direction(t1, _dir);
      return new EdgeSegment(
        CUBIC,
        p0x,
        p0y,
        c1x,
        c1y,
        p1x - dt * _dir[0]!,
        p1y - dt * _dir[1]!,
        p1x,
        p1y,
      );
    }
  }
}

/**
 * Returns an EdgeSegment with the same geometry as `seg` but traversed in
 * the opposite direction.
 */
function reversedEdge(seg: EdgeSegment): EdgeSegment {
  switch (seg.type) {
    case LINEAR:
      return new EdgeSegment(LINEAR, seg.p1x, seg.p1y, seg.p0x, seg.p0y, 0, 0, 0, 0);
    case QUADRATIC:
      return new EdgeSegment(
        QUADRATIC,
        seg.p2x,
        seg.p2y,
        seg.p1x,
        seg.p1y,
        seg.p0x,
        seg.p0y,
        0,
        0,
      );
    default:
      return new EdgeSegment(
        CUBIC,
        seg.p3x,
        seg.p3y,
        seg.p2x,
        seg.p2y,
        seg.p1x,
        seg.p1y,
        seg.p0x,
        seg.p0y,
      );
  }
}

// ── Bounding-box AABB intersection ──────────────────────────────────────

/**
 * Writes the axis-aligned bounding box of the control polygon of the
 * subsegment of `seg` over [t0, t1] into `box` (minX, minY, maxX, maxY).
 * A Bezier curve is contained in the convex hull of its control points,
 * so this bounds the actual geometry too.
 */
function subBoundingBox(seg: EdgeSegment, t0: number, t1: number, box: number[]): void {
  const cp: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  const n = subControlPoints(seg, t0, t1, cp);
  let minX = cp[0]!;
  let minY = cp[1]!;
  let maxX = minX;
  let maxY = minY;
  for (let i = 1; i < n; i++) {
    const x = cp[i * 2]!;
    const y = cp[i * 2 + 1]!;
    if (x < minX) minX = x;
    else if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    else if (y > maxY) maxY = y;
  }
  box[0] = minX;
  box[1] = minY;
  box[2] = maxX;
  box[3] = maxY;
}

/** Records an inter-edge crossing at parameters (ta, tb). */
interface CrossPoint {
  ta: number;
  tb: number;
}

/**
 * Depth-first AABB subdivision that appends each detected crossing to
 * `out`. Subdivides whichever segment currently has the larger bounding
 * box, keeping the two ranges roughly matched in extent.
 */
function findEdgeIntersections(
  a: EdgeSegment,
  b: EdgeSegment,
  tA0: number,
  tA1: number,
  tB0: number,
  tB1: number,
  depth: number,
  out: CrossPoint[],
): void {
  subBoundingBox(a, tA0, tA1, _boxA);
  subBoundingBox(b, tB0, tB1, _boxB);
  if (
    _boxA[2]! < _boxB[0]! ||
    _boxB[2]! < _boxA[0]! ||
    _boxA[3]! < _boxB[1]! ||
    _boxB[3]! < _boxA[1]!
  ) {
    return;
  }
  const diagA = _boxA[2]! - _boxA[0]! + (_boxA[3]! - _boxA[1]!);
  const diagB = _boxB[2]! - _boxB[0]! + (_boxB[3]! - _boxB[1]!);
  if (depth >= MAX_SUBDIV_DEPTH || diagA < BOX_EPS || diagB < BOX_EPS) {
    out.push({ ta: 0.5 * (tA0 + tA1), tb: 0.5 * (tB0 + tB1) });
    return;
  }
  if (diagA > diagB) {
    const mid = 0.5 * (tA0 + tA1);
    findEdgeIntersections(a, b, tA0, mid, tB0, tB1, depth + 1, out);
    findEdgeIntersections(a, b, mid, tA1, tB0, tB1, depth + 1, out);
  } else {
    const mid = 0.5 * (tB0 + tB1);
    findEdgeIntersections(a, b, tA0, tA1, tB0, mid, depth + 1, out);
    findEdgeIntersections(a, b, tA0, tA1, mid, tB1, depth + 1, out);
  }
}

/**
 * Fast path for two LINEAR edges: solves the 2×2 line-line system
 * directly. Returns null when the edges are parallel or the intersection
 * falls outside either edge's [0, 1] range.
 */
function linearLinearIntersection(a: EdgeSegment, b: EdgeSegment): CrossPoint | null {
  const ux = a.p1x - a.p0x;
  const uy = a.p1y - a.p0y;
  const vx = b.p1x - b.p0x;
  const vy = b.p1y - b.p0y;
  const det = ux * vy - uy * vx;
  if (det === 0) return null;
  const wx = b.p0x - a.p0x;
  const wy = b.p0y - a.p0y;
  const ta = (wx * vy - wy * vx) / det;
  const tb = (wx * uy - wy * ux) / det;
  if (ta <= SNAP_EPS || ta >= 1 - SNAP_EPS) return null;
  if (tb <= SNAP_EPS || tb >= 1 - SNAP_EPS) return null;
  return { ta, tb };
}

/**
 * Projects point (px, py) onto LINEAR edge `seg`. Returns t ∈ (0, 1) when
 * the perpendicular foot lies strictly inside the edge and the point is
 * geometrically close to the edge (within SNAP_EPS); returns -1 otherwise.
 *
 * Used for T-junction and collinear-overlap resolution: when an endpoint of
 * one edge coincides with the interior of another (a case AABB subdivision
 * either misses because parameters are exactly at 0/1, or reports as an
 * unhelpful zero-width intersection along the whole overlap), we split the
 * receiving edge at the projected parameter so the two edges share an
 * endpoint and stop overlapping.
 */
function projectOntoLinear(px: number, py: number, seg: EdgeSegment): number {
  const ux = seg.p1x - seg.p0x;
  const uy = seg.p1y - seg.p0y;
  const len2 = ux * ux + uy * uy;
  if (len2 === 0) return -1;
  const t = ((px - seg.p0x) * ux + (py - seg.p0y) * uy) / len2;
  if (t <= SNAP_EPS || t >= 1 - SNAP_EPS) return -1;
  const bx = seg.p0x + t * ux;
  const by = seg.p0y + t * uy;
  const dx = bx - px;
  const dy = by - py;
  if (dx * dx + dy * dy > SNAP_EPS * SNAP_EPS) return -1;
  return t;
}

/**
 * Collapses crossings that are within SNAP_EPS of each other on either
 * edge into a single crossing (subdivision commonly produces small
 * clusters around a single true intersection).
 */
function dedupCrossings(crossings: CrossPoint[]): CrossPoint[] {
  if (crossings.length <= 1) return crossings;
  crossings.sort((p, q) => p.ta - q.ta);
  const out: CrossPoint[] = [crossings[0]!];
  for (let i = 1; i < crossings.length; i++) {
    const c = crossings[i]!;
    let merged = false;
    for (let j = 0; j < out.length; j++) {
      const o = out[j]!;
      if (Math.abs(c.ta - o.ta) < SNAP_EPS && Math.abs(c.tb - o.tb) < SNAP_EPS) {
        merged = true;
        break;
      }
    }
    if (!merged) out.push(c);
  }
  return out;
}

// ── Main entry point ────────────────────────────────────────────────────

/**
 * Rewrites `shape.contours` so its filled region (under the non-zero fill
 * rule) is represented as boundary-only contours: outer loops with
 * material on the left of the traversal direction and holes with
 * material on the left of the traversal direction.
 *
 * No-op when the shape already has ≤ 1 contour (nothing to union) or
 * when no inter-contour intersections are found (contours are disjoint,
 * so the shape is already in canonical form).
 *
 * Mutates `shape` in place. Must run AFTER `emNormalizeShape` +
 * `normalizeShape` (which fixes zero-length edges and coloring-critical
 * corners) and BEFORE `edgeColoringSimple` (which needs the resolved
 * geometry to hand out compatible channel colors).
 *
 * @param shape Shape to resolve (mutated in-place).
 */
export function resolveOverlaps(shape: Shape): void {
  const contours = shape.contours;
  if (contours.length <= 1) return;

  // 1. Collect intersections; group per edge with snapped shared point.
  const splits = new Map<EdgeSegment, Split[]>();
  const addSplit = (edge: EdgeSegment, t: number, x: number, y: number): void => {
    if (t <= SNAP_EPS || t >= 1 - SNAP_EPS) return;
    let arr = splits.get(edge);
    if (!arr) {
      arr = [];
      splits.set(edge, arr);
    }
    arr.push({ t, x, y });
  };
  let anyCrossings = false;
  const crossBuf: CrossPoint[] = [];

  // Helper: intersect one pair of edges and push splits. Accepts a
  // predicate for whether `ea` and `eb` may be neighbours in the same
  // contour (touching-endpoint cross is not an intersection).
  const intersectPair = (ea: EdgeSegment, eb: EdgeSegment, adjacent: boolean): void => {
    crossBuf.length = 0;
    if (ea.type === LINEAR && eb.type === LINEAR) {
      const hit = linearLinearIntersection(ea, eb);
      if (hit) crossBuf.push(hit);
    } else {
      findEdgeIntersections(ea, eb, 0, 1, 0, 1, 0, crossBuf);
    }
    const deduped = dedupCrossings(crossBuf.slice());
    for (const { ta, tb } of deduped) {
      // Skip trivial endpoint touches when the two edges share a vertex.
      if (adjacent && (ta < SNAP_EPS || ta > 1 - SNAP_EPS) &&
        (tb < SNAP_EPS || tb > 1 - SNAP_EPS)) continue;
      ea.point(ta, _pt);
      const ax = _pt[0]!;
      const ay = _pt[1]!;
      eb.point(tb, _pt);
      const sx = 0.5 * (ax + _pt[0]!);
      const sy = 0.5 * (ay + _pt[1]!);
      addSplit(ea, ta, sx, sy);
      addSplit(eb, tb, sx, sy);
      anyCrossings = true;
    }
    // T-junctions / collinear overlap: project each endpoint of the
    // other edge onto this one (LINEAR receiving side only — enough
    // for the axis-aligned overlaps in Roboto's multi-piece letters).
    if (eb.type === LINEAR) {
      const t1 = projectOntoLinear(ea.p0x, ea.p0y, eb);
      if (t1 > 0) {
        addSplit(eb, t1, ea.p0x, ea.p0y);
        anyCrossings = true;
      }
      const t2 = projectOntoLinear(ea.endX(), ea.endY(), eb);
      if (t2 > 0) {
        addSplit(eb, t2, ea.endX(), ea.endY());
        anyCrossings = true;
      }
    }
    if (ea.type === LINEAR) {
      const t1 = projectOntoLinear(eb.p0x, eb.p0y, ea);
      if (t1 > 0) {
        addSplit(ea, t1, eb.p0x, eb.p0y);
        anyCrossings = true;
      }
      const t2 = projectOntoLinear(eb.endX(), eb.endY(), ea);
      if (t2 > 0) {
        addSplit(ea, t2, eb.endX(), eb.endY());
        anyCrossings = true;
      }
    }
  };

  // Inter-contour intersections.
  for (let ci = 0; ci < contours.length; ci++) {
    const ca = contours[ci]!;
    for (let cj = ci + 1; cj < contours.length; cj++) {
      const cb = contours[cj]!;
      for (const ea of ca) {
        for (const eb of cb) intersectPair(ea, eb, false);
      }
    }
  }
  // Fast path: no crossings anywhere means contours are disjoint (or
  // properly nested outer/hole with no overlap). Nothing to union — leave
  // the shape untouched to avoid re-orienting clean contours whose original
  // winding downstream code (edge coloring, distance sign correction) may
  // depend on.
  if (!anyCrossings) return;

  // Intra-contour self-intersections. Roboto's uppercase B/E/etc encode
  // their counters as detours in the outer contour that self-cross the
  // stem's inner edge; without splitting at those, long spans miss the
  // topological cuts they need. Only run when we already found
  // inter-contour crossings — clean glyphs (Noto Sans, PT Serif) never
  // self-intersect, and running this pass on them wastes work and can
  // introduce false-positive T-junction splits via `projectOntoLinear`.
  if (anyCrossings) {
    for (let ci = 0; ci < contours.length; ci++) {
      const ca = contours[ci]!;
      for (let i = 0; i < ca.length; i++) {
        for (let j = i + 1; j < ca.length; j++) {
          const adjacent = j === i + 1 || (i === 0 && j === ca.length - 1);
          intersectPair(ca[i]!, ca[j]!, adjacent);
        }
      }
    }
  }

  // 2. Split each edge at its accumulated crossings.
  const splitContours: EdgeSegment[][] = [];
  for (const contour of contours) {
    const outC: EdgeSegment[] = [];
    for (const edge of contour) {
      const ts = splits.get(edge);
      if (!ts || ts.length === 0) {
        outC.push(edge);
        continue;
      }
      ts.sort((p, q) => p.t - q.t);
      let prevT = 0;
      let prevX = edge.p0x;
      let prevY = edge.p0y;
      for (const s of ts) {
        outC.push(subsegmentOf(edge, prevT, s.t, prevX, prevY, s.x, s.y));
        prevT = s.t;
        prevX = s.x;
        prevY = s.y;
      }
      outC.push(subsegmentOf(edge, prevT, 1, prevX, prevY, edge.endX(), edge.endY()));
    }
    splitContours.push(outC);
  }

  // 3. For every sub-edge, sample winding on both sides of its midpoint.
  //    Winding is computed against the ORIGINAL contours: geometrically
  //    identical to the split shape but cheaper for scanline crossings.
  const line = new Scanline();
  const kept: EdgeSegment[] = [];
  for (let ci = 0; ci < splitContours.length; ci++) {
    const contour = splitContours[ci]!;
    for (let ei = 0; ei < contour.length; ei++) {
      const edge = contour[ei]!;
      // Skip zero-length sub-edges left over from splits at coincident
      // intersections. They add nothing geometrically, and — if kept —
      // spuriously satisfy the "endKey === startKey" chain-close test
      // during reconnection, emitting phantom 1-edge contours.
      {
        const dx0 = edge.endX() - edge.p0x;
        const dy0 = edge.endY() - edge.p0y;
        if (dx0 * dx0 + dy0 * dy0 < JOIN_EPS * JOIN_EPS) continue;
      }
      edge.point(0.5, _pt);
      const mx = _pt[0]!;
      const my = _pt[1]!;
      edge.direction(0.5, _dir);
      const dlen = Math.sqrt(_dir[0]! * _dir[0]! + _dir[1]! * _dir[1]!);
      if (dlen === 0) continue;
      // Left normal = rotate direction 90° CCW = (-dy, dx).
      const nx = -_dir[1]! / dlen;
      const ny = _dir[0]! / dlen;
      const lx = mx + SIDE_EPS * nx;
      const ly = my + SIDE_EPS * ny;
      const rx = mx - SIDE_EPS * nx;
      const ry = my - SIDE_EPS * ny;
      computeShapeScanline(shape, ly, line);
      const wLeft = line.sumIntersections(lx);
      computeShapeScanline(shape, ry, line);
      const wRight = line.sumIntersections(rx);
      const leftMat = wLeft !== 0;
      const rightMat = wRight !== 0;
      if (leftMat === rightMat) continue;
      kept.push(leftMat ? edge : reversedEdge(edge));
    }
  }
  if (kept.length === 0) return;

  // 3b. Dedupe geometrically-coincident kept edges. When two source
  //     contours share a boundary segment (typical of Roboto's B/E where
  //     multiple same-winding pieces meet at a middle bar), the same
  //     boundary edge lands in `kept` twice with the same orientation.
  //     Leaving both breaks the reconnection walk — it can enter a
  //     2-edge "loop" between the two duplicates instead of continuing
  //     around the union. Compare endpoints + a midpoint sample so both
  //     LINEAR and curved coincidences collapse.
  {
    const JOIN_TOL2_LOCAL = JOIN_EPS * JOIN_EPS;
    const near2 = (ax: number, ay: number, bx: number, by: number): boolean => {
      const dx = ax - bx;
      const dy = ay - by;
      return dx * dx + dy * dy < JOIN_TOL2_LOCAL;
    };
    const midX: number[] = [];
    const midY: number[] = [];
    for (let i = 0; i < kept.length; i++) {
      kept[i]!.point(0.5, _pt);
      midX.push(_pt[0]!);
      midY.push(_pt[1]!);
    }
    const dedup: EdgeSegment[] = [];
    const dropped = new Uint8Array(kept.length);
    for (let i = 0; i < kept.length; i++) {
      if (dropped[i]) continue;
      const ai = kept[i]!;
      for (let j = i + 1; j < kept.length; j++) {
        if (dropped[j]) continue;
        const aj = kept[j]!;
        if (
          near2(ai.p0x, ai.p0y, aj.p0x, aj.p0y) &&
          near2(ai.endX(), ai.endY(), aj.endX(), aj.endY()) &&
          near2(midX[i]!, midY[i]!, midX[j]!, midY[j]!)
        ) {
          dropped[j] = 1;
        }
      }
      dedup.push(ai);
    }
    kept.length = 0;
    for (const e of dedup) kept.push(e);
  }

  // 4. Reconnect kept edges into closed contours. Endpoints are matched
  //    with a small spatial tolerance rather than exact-key equality:
  //    duplicate splits at the same intersection sample the crossing point
  //    at slightly different parametric locations, so the "same" endpoint
  //    can drift by a handful of microns. Linear search is fine — a glyph
  //    has O(50) sub-edges after splitting.
  const JOIN_TOL2 = JOIN_EPS * JOIN_EPS;
  const near = (ax: number, ay: number, bx: number, by: number): boolean => {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy < JOIN_TOL2;
  };
  const findNextFrom = (
    x: number,
    y: number,
    visited: Uint8Array,
  ): number => {
    for (let i = 0; i < kept.length; i++) {
      if (visited[i]) continue;
      if (near(kept[i]!.p0x, kept[i]!.p0y, x, y)) return i;
    }
    return -1;
  };

  const visited = new Uint8Array(kept.length);
  const newContours: Contour[] = [];
  for (let start = 0; start < kept.length; start++) {
    if (visited[start]) continue;
    const chain: Contour = [];
    let idx: number = start;
    const startX = kept[start]!.p0x;
    const startY = kept[start]!.p0y;
    let closed = false;
    while (idx >= 0 && !visited[idx]) {
      visited[idx] = 1;
      const edge = kept[idx]!;
      chain.push(edge);
      const ex = edge.endX();
      const ey = edge.endY();
      if (near(ex, ey, startX, startY)) {
        closed = true;
        break;
      }
      idx = findNextFrom(ex, ey, visited);
    }
    if (closed) newContours.push(chain);
  }

  if (newContours.length > 0) shape.contours = newContours;
}