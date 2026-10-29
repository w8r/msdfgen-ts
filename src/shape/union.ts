/**
 * Overlap removal: rewrites a shape as the boundary of its nonzero fill, so
 * overlapping contours (variable fonts, composite glyphs) no longer leave
 * holes where msdfgen's overlapping-contour combiner gets their interior
 * edges wrong. msdfgen itself does this step with Skia path ops
 * (MSDFGEN_USE_SKIA: resolveShapeGeometry); this file is original.
 *
 * Every edge is split where it crosses another, each piece is kept iff the
 * fill differs on its two sides, and the kept pieces are relinked into
 * contours. Shapes without overlaps are returned untouched, and anything
 * ambiguous (coincident curves, pieces that don't link up) also leaves the
 * shape as it was — never worse than no preprocessing.
 *
 * Runs on every glyph the Atlas generates, overlapping or not, so the
 * crossing search skips what can't matter: edge pairs whose bounds don't
 * overlap (sweep over sorted bounds), and the endpoint consecutive edges
 * share (see corner()). Module-scope scratch below is safe because the
 * library is synchronous and single-threaded per worker.
 */

import { EdgeSegment, type SegmentType } from "./segments";
import { type Shape } from "./shape";
import { cross } from "../math/scalar";

/** Em-space size below which sub-curves are treated as straight chords. */
const FLAT = 1e-5;
/** Em-space tolerance for relinking endpoints and matching duplicate pieces. */
const LINK = 1e-6;
/** Subdivision steps allowed per edge pair; running out means coincident curves. */
const BUDGET = 20000;
/** Subdivision steps allowed per shape; running out (many near-coincident
 *  pairs, each under BUDGET) leaves the shape as it was instead of stalling. */
const SHAPE_BUDGET = 100000;

/** Control points of `e` as a flat [x0, y0, x1, y1, ...] array. */
function cps(e: EdgeSegment): number[] {
  return [e.p0x, e.p0y, e.p1x, e.p1y, e.p2x, e.p2y, e.p3x, e.p3y].slice(0, 2 * e.type + 4);
}

/** Segment from a flat control-point array (2, 3 or 4 points). */
function seg(q: number[]): EdgeSegment {
  const type = (q.length / 2 - 2) as SegmentType;
  return new EdgeSegment(
    type,
    q[0]!,
    q[1]!,
    q[2]!,
    q[3]!,
    q[4] ?? 0,
    q[5] ?? 0,
    q[6] ?? 0,
    q[7] ?? 0,
  );
}

// crossings() scratch: the current pair of sub-curves. Each call is done
// with them before it recurses; sub() borrows _p outside the search.
const _p = new Float64Array(8);
const _q = new Float64Array(8);
const _w = new Float64Array(8);

/** Writes the control points of `p`'s sub-curve over [t0, t1] into `out`, by blossoming. */
function subInto(p: number[], t0: number, t1: number, out: Float64Array): void {
  const m = p.length;
  const n = m / 2 - 1;
  for (let k = 0; k <= n; k++) {
    for (let i = 0; i < m; i++) _w[i] = p[i]!;
    for (let j = 0, len = m; j < n; j++, len -= 2) {
      const t = j < n - k ? t0 : t1;
      for (let i = 0; i < len - 2; i++) _w[i] = _w[i]! + t * (_w[i + 2]! - _w[i]!);
    }
    out[2 * k] = _w[0]!;
    out[2 * k + 1] = _w[1]!;
  }
}

/** Control points of `p`'s sub-curve over [t0, t1], as a new array. */
function sub(p: number[], t0: number, t1: number): number[] {
  subInto(p, t0, t1, _p);
  return Array.from(_p.subarray(0, p.length));
}

let _budget = 0;
let _shapeBudget = 0;
// Endpoint shared by the current pair, set by corner(): which end of each
// curve (-1 none, 0 start, 1 end), the point, and a normal separating the
// directions in which the two curves leave it.
let _ea = -1;
let _eb = -1;
let _cx = 0;
let _cy = 0;
let _nx = 0;
let _ny = 0;

/**
 * Sets up the shared-endpoint pruning in crossings() for curves `a` and `b`.
 * Consecutive contour edges always meet at a common endpoint, so their
 * bounds always overlap there; without pruning, the subdivision chases that
 * meeting point down to FLAT on every such pair (84-99% of all steps on the
 * corpus fonts) only to find a t = 0 / t = 1 hit that gets discarded.
 */
function corner(a: number[], b: number[]): void {
  _ea = -1;
  _eb = -1;
  let found = 0;
  for (let ea = 0; ea < 2; ea++) {
    const ia = ea ? a.length - 2 : 0;
    for (let eb = 0; eb < 2; eb++) {
      const ib = eb ? b.length - 2 : 0;
      if (a[ia] === b[ib] && a[ia + 1] === b[ib + 1]) {
        found++;
        _ea = ea;
        _eb = eb;
      }
    }
  }
  if (found !== 1) {
    _ea = -1; // none, or both ends shared (a lens): no pruning
    return;
  }
  const ia = _ea ? a.length - 2 : 0;
  _cx = a[ia]!;
  _cy = a[ia + 1]!;
  // Unit directions from the shared point to each curve's nearest distinct control point.
  let ux = 0;
  let uy = 0;
  for (let k = 2; k < a.length && ux === 0 && uy === 0; k += 2) {
    const i = _ea ? a.length - 2 - k : k;
    ux = a[i]! - _cx;
    uy = a[i + 1]! - _cy;
  }
  let vx = 0;
  let vy = 0;
  for (let k = 2; k < b.length && vx === 0 && vy === 0; k += 2) {
    const i = _eb ? b.length - 2 - k : k;
    vx = b[i]! - _cx;
    vy = b[i + 1]! - _cy;
  }
  const ul = Math.hypot(ux, uy);
  const vl = Math.hypot(vx, vy);
  _nx = ux / ul - vx / vl;
  _ny = uy / ul - vy / vl;
  // Degenerate curve, or both leave in the same direction (they fold back
  // over each other): nothing separates them near the shared point.
  if (!(Math.hypot(_nx, _ny) > 1e-9)) _ea = -1;
}

/**
 * True when the current sub-curves (`_p`, `_q`) can only meet at the shared
 * endpoint: all of `_p`'s other control points lie strictly on one side of
 * the line through it, all of `_q`'s strictly on the other, so their convex
 * hulls (which contain the curves) touch nowhere else.
 */
function apart(na: number, nb: number): boolean {
  const ka = _ea ? na - 2 : 0;
  for (let i = 0; i < na; i += 2) {
    if (i !== ka && (_p[i]! - _cx) * _nx + (_p[i + 1]! - _cy) * _ny <= 0) return false;
  }
  const kb = _eb ? nb - 2 : 0;
  for (let i = 0; i < nb; i += 2) {
    if (i !== kb && (_q[i]! - _cx) * _nx + (_q[i + 1]! - _cy) * _ny >= 0) return false;
  }
  return true;
}

/**
 * Pushes (ta, tb) parameter pairs where curves `a` and `b` meet within
 * [a0, a1] × [b0, b1]: bounding-box subdivision down to near-flat pieces,
 * then an exact chord-chord intersection.
 */
function crossings(
  a: number[],
  a0: number,
  a1: number,
  b: number[],
  b0: number,
  b1: number,
  hits: number[],
): void {
  if (--_budget < 0 || --_shapeBudget < 0) return;
  const na = a.length;
  const nb = b.length;
  subInto(a, a0, a1, _p);
  subInto(b, b0, b1, _q);
  let ax0 = Infinity;
  let ay0 = Infinity;
  let ax1 = -Infinity;
  let ay1 = -Infinity;
  for (let i = 0; i < na; i += 2) {
    ax0 = Math.min(ax0, _p[i]!);
    ay0 = Math.min(ay0, _p[i + 1]!);
    ax1 = Math.max(ax1, _p[i]!);
    ay1 = Math.max(ay1, _p[i + 1]!);
  }
  let bx0 = Infinity;
  let by0 = Infinity;
  let bx1 = -Infinity;
  let by1 = -Infinity;
  for (let i = 0; i < nb; i += 2) {
    bx0 = Math.min(bx0, _q[i]!);
    by0 = Math.min(by0, _q[i + 1]!);
    bx1 = Math.max(bx1, _q[i]!);
    by1 = Math.max(by1, _q[i + 1]!);
  }
  if (ax0 > bx1 || bx0 > ax1 || ay0 > by1 || by0 > ay1) return;
  if (_ea >= 0 && (_ea ? a1 === 1 : a0 === 0) && (_eb ? b1 === 1 : b0 === 0) && apart(na, nb)) {
    return;
  }
  const sa = Math.max(ax1 - ax0, ay1 - ay0);
  const sb = Math.max(bx1 - bx0, by1 - by0);
  if (sa < FLAT && sb < FLAT) {
    const rx = _p[na - 2]! - _p[0]!;
    const ry = _p[na - 1]! - _p[1]!;
    const sx = _q[nb - 2]! - _q[0]!;
    const sy = _q[nb - 1]! - _q[1]!;
    const d = cross(rx, ry, sx, sy);
    const u = cross(_q[0]! - _p[0]!, _q[1]! - _p[1]!, sx, sy) / d;
    const v = cross(_q[0]! - _p[0]!, _q[1]! - _p[1]!, rx, ry) / d;
    if (u >= 0 && u <= 1 && v >= 0 && v <= 1) hits.push(a0 + u * (a1 - a0), b0 + v * (b1 - b0));
  } else if (sa > sb) {
    crossings(a, a0, (a0 + a1) / 2, b, b0, b1, hits);
    crossings(a, (a0 + a1) / 2, a1, b, b0, b1, hits);
  } else {
    crossings(a, a0, a1, b, b0, (b0 + b1) / 2, hits);
    crossings(a, a0, a1, b, (b0 + b1) / 2, b1, hits);
  }
}

/** Parameter of point (x, y) projected onto line `a`. */
function project(a: number[], x: number, y: number): number {
  const dx = a[2]! - a[0]!;
  const dy = a[3]! - a[1]!;
  return ((x - a[0]!) * dx + (y - a[1]!) * dy) / (dx * dx + dy * dy);
}

/** Collinear lines meet along a stretch, not at points: split each at the other's ends. */
function collinear(a: number[], b: number[], hits: number[]): boolean {
  if (a.length !== 4 || b.length !== 4) return false;
  const dx = a[2]! - a[0]!;
  const dy = a[3]! - a[1]!;
  const tol = 1e-9 * Math.hypot(dx, dy);
  if (Math.abs(cross(dx, dy, b[0]! - a[0]!, b[1]! - a[1]!)) > tol) return false;
  if (Math.abs(cross(dx, dy, b[2]! - a[0]!, b[3]! - a[1]!)) > tol) return false;
  hits.push(project(a, b[0]!, b[1]!), 0, project(a, b[2]!, b[3]!), 1);
  hits.push(0, project(b, a[0]!, a[1]!), 1, project(b, a[2]!, a[3]!));
  return true;
}

/** Control points in reverse order (same curve, opposite direction). */
function reverse(p: number[]): number[] {
  const out: number[] = [];
  for (let i = p.length - 2; i >= 0; i -= 2) out.push(p[i]!, p[i + 1]!);
  return out;
}

/** True when control-point arrays `a` and `b` match within LINK. */
function same(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (!(Math.abs(a[i]! - b[i]!) < LINK)) return false;
  return true;
}

const _pt = [0, 0];
const _dir = [0, 0];
const _xs = [0, 0, 0];
const _dys = [0, 0, 0];

/**
 * Nonzero fill of `edges` at (x, y): the winding of their crossings with the
 * scanline at y, at or left of x. Same result as Scanline.filled after
 * computeShapeScanline, without building and sorting the whole scanline.
 * `bb` holds each edge's control-point bounds; an edge the scanline misses
 * by more than root-finding rounding can't cross it.
 */
function filled(edges: EdgeSegment[], bb: Float64Array, x: number, y: number): boolean {
  let w = 0;
  for (let i = 0; i < edges.length; i++) {
    if (y < bb[4 * i + 1]! - 1e-9 || y > bb[4 * i + 3]! + 1e-9) continue;
    const n = edges[i]!.scanlineIntersections(y, _xs, _dys);
    for (let k = 0; k < n; k++) if (_xs[k]! <= x) w += _dys[k]!;
  }
  return w !== 0;
}

/**
 * Replaces `shape`'s contours with the boundary of their union (nonzero
 * fill), in place. Leaves the shape untouched when it has no overlaps or
 * when they can't be resolved cleanly. Expects em-normalized geometry,
 * before `normalizeShape`.
 *
 * @param shape Shape to resolve (mutated in place).
 */
export function unionShape(shape: Shape): void {
  const flat = shape.contours.flat();
  const edges = flat.map(cps);
  const n = edges.length;
  // Per edge: control-point bounds [minX, minY, maxX, maxY], and the next
  // edge of its contour.
  const bb = new Float64Array(4 * n);
  const next = new Int32Array(n);
  let e = 0;
  for (const contour of shape.contours) {
    for (let k = 0; k < contour.length; k++) next[e + k] = e + ((k + 1) % contour.length);
    e += contour.length;
  }
  for (let i = 0; i < n; i++) {
    const p = edges[i]!;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (let k = 0; k < p.length; k += 2) {
      x0 = Math.min(x0, p[k]!);
      y0 = Math.min(y0, p[k + 1]!);
      x1 = Math.max(x1, p[k]!);
      y1 = Math.max(y1, p[k + 1]!);
    }
    bb[4 * i] = x0;
    bb[4 * i + 1] = y0;
    bb[4 * i + 2] = x1;
    bb[4 * i + 3] = y1;
  }

  // Sweep over edges sorted by left bound: only pairs whose bounds overlap
  // get searched. An edge whose bounds overlap any edge other than its own
  // contour neighbours is "contested".
  const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => bb[4 * i]! - bb[4 * j]!);
  const splits = edges.map((): number[] => []);
  const contested = new Uint8Array(n);
  _shapeBudget = SHAPE_BUDGET;
  for (let s = 0; s < n; s++) {
    const u = order[s]!;
    for (let r = s + 1; r < n; r++) {
      const v = order[r]!;
      if (bb[4 * v]! > bb[4 * u + 2]!) break;
      if (bb[4 * u + 1]! > bb[4 * v + 3]! || bb[4 * v + 1]! > bb[4 * u + 3]!) continue;
      const i = Math.min(u, v);
      const j = Math.max(u, v);
      if (next[i] !== j && next[j] !== i) contested[i] = contested[j] = 1;
      const hits: number[] = [];
      _budget = BUDGET;
      if (!collinear(edges[i]!, edges[j]!, hits)) {
        corner(edges[i]!, edges[j]!);
        crossings(edges[i]!, 0, 1, edges[j]!, 0, 1, hits);
      }
      if (_budget < 0 || _shapeBudget < 0) return; // coincident curves
      for (let k = 0; k < hits.length; k += 2) {
        splits[i]!.push(hits[k]!);
        splits[j]!.push(hits[k + 1]!);
      }
    }
  }
  const cuts = splits.map((ts0) => {
    const ts = [0];
    for (const t of ts0.sort((x, y) => x - y)) {
      if (t - ts[ts.length - 1]! > 1e-7 && t < 1 - 1e-7) ts.push(t);
    }
    ts.push(1);
    return ts;
  });

  // Keep each piece whose two sides differ, oriented like most of the outline.
  // A contour that is neither split nor contested meets no other edge, so
  // the fill on each side of it is the same all the way round: one side
  // test settles every one of its pieces.
  let changed = false;
  const pieces: number[][] = [];
  const right: boolean[] = [];
  let first = 0;
  for (const contour of shape.contours) {
    const end = first + contour.length;
    let solo = true;
    for (let i = first; i < end; i++) if (contested[i] || cuts[i]!.length > 2) solo = false;
    let tested = false;
    let r = false;
    let l = false;
    for (let i = first; i < end; i++) {
      const ts = cuts[i]!;
      for (let k = 1; k < ts.length; k++) {
        const q = sub(edges[i]!, ts[k - 1]!, ts[k]!);
        const e = seg(q);
        e.point(0.5, _pt);
        e.direction(0.5, _dir);
        const len = Math.hypot(_dir[0]!, _dir[1]!);
        const chord = Math.hypot(q[q.length - 2]! - q[0]!, q[q.length - 1]! - q[1]!);
        if (len === 0 || chord === 0) continue;
        if (!solo || !tested) {
          // Sample just off each side, closer than any near-tangent sliver (~chord²).
          const o = Math.min(1e-6, (chord * chord) / 64) / len;
          r = filled(flat, bb, _pt[0]! + _dir[1]! * o, _pt[1]! - _dir[0]! * o);
          l = filled(flat, bb, _pt[0]! - _dir[1]! * o, _pt[1]! + _dir[0]! * o);
          tested = true;
        }
        if (r === l) {
          changed = true;
        } else {
          pieces.push(q);
          right.push(r);
        }
      }
    }
    first = end;
  }
  const majority = 2 * right.filter(Boolean).length >= right.length;
  const kept: number[][] = [];
  for (let i = 0; i < pieces.length; i++) {
    let q = pieces[i]!;
    if (right[i] !== majority) {
      q = reverse(q);
      changed = true;
    }
    let dup = false;
    for (let k = 0; k < kept.length && !dup; k++) dup = same(kept[k]!, q);
    if (dup) changed = true;
    else kept.push(q);
  }
  if (!changed) return;

  // Relink pieces end-to-start into closed contours.
  const used = new Uint8Array(kept.length);
  const contours: EdgeSegment[][] = [];
  for (let s = 0; s < kept.length; s++) {
    if (used[s]) continue;
    used[s] = 1;
    const c = [kept[s]!];
    for (;;) {
      const last = c[c.length - 1]!;
      const ex = last[last.length - 2]!;
      const ey = last[last.length - 1]!;
      if (c.length > 1 && Math.hypot(ex - c[0]![0]!, ey - c[0]![1]!) < LINK) {
        c[0]![0] = ex;
        c[0]![1] = ey;
        break;
      }
      let nxt = -1;
      let best = LINK;
      for (let j = 0; j < kept.length; j++) {
        if (used[j]) continue;
        const d = Math.hypot(kept[j]![0]! - ex, kept[j]![1]! - ey);
        if (d < best) {
          nxt = j;
          best = d;
        }
      }
      if (nxt < 0) return; // a contour didn't close: leave the shape as it was
      used[nxt] = 1;
      kept[nxt]![0] = ex;
      kept[nxt]![1] = ey;
      c.push(kept[nxt]!);
    }
    contours.push(c.map(seg));
  }
  shape.contours = contours;
}
