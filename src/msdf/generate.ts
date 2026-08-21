/**
 * Multi-channel SDF (MSDF) generation.
 *
 * Ports OverlappingContourCombiner<MultiDistanceSelector> from:
 *   core/edge-selectors.cpp — MultiDistanceSelector, PerpendicularDistanceSelectorBase
 *   core/contour-combiners.cpp — OverlappingContourCombiner
 *   core/msdfgen.cpp — generateDistanceField, DistancePixelConversion<MultiDistance>
 *
 * Output is a flat Float32Array, 3 channels per pixel, y-up (row 0 = bottom).
 * The caller must apply distanceSignCorrection and msdfErrorCorrection afterwards
 * (see pipeline in msdf-error-correction.cpp when -scanline is used).
 *
 * Performance rules (CLAUDE.md): hot loop uses only local number variables,
 * no new/closures/object literals. Module-scope scratch arrays for direction/
 * point queries.
 *
 * msdfgen © Viktor Chlumský — MIT licence.
 */

import { type Shape } from "../shape/shape";
import { type Contour } from "../shape/contour";
import { RED, GREEN, BLUE } from "./edge-coloring";

// ── Constants ─────────────────────────────────────────────────────────────────

const DBL_MAX = Number.MAX_VALUE;

// ── Module-scope scratch (single-threaded) ────────────────────────────────────

/** Scratch for direction queries. */
const _dir: number[] = [0, 0];
/** Scratch for point queries. */
const _pt: number[] = [0, 0];

// ── Per-contour state arrays (resized on demand) ──────────────────────────────
// Layout: [ci * 3 + ch] where ch: 0=R, 1=G, 2=B
// Tracks PerpendicularDistanceSelectorBase state per contour per channel.

let _cNC = 0; // last allocated size (number of contours)
let _cTD: Float64Array = new Float64Array(0); // true signed distance
let _cDot: Float64Array = new Float64Array(0); // dot tiebreaker
let _cNeg: Float64Array = new Float64Array(0); // minNegativePerpendicularDistance
let _cPos: Float64Array = new Float64Array(0); // minPositivePerpendicularDistance
let _cNEI: Int32Array = new Int32Array(0); // nearEdge index in contour (-1 = none)
let _cNPar: Float64Array = new Float64Array(0); // nearEdge param

// Pre-computed per-contour perpendicular distances (computeDistance results for combiner).
let _cdR: Float64Array = new Float64Array(0);
let _cdG: Float64Array = new Float64Array(0);
let _cdB: Float64Array = new Float64Array(0);

// ── Winding (reused across pixels) ───────────────────────────────────────────

let _windings: Int32Array = new Int32Array(0);
const _wPt: number[] = [0, 0];

// ── Per-edge precomputed perpendicular-selector geometry (reused across
// pixels — see the precompute pass at the top of generateMSDF) ────────────
// Everything here is a pure function of the edge's own control points (and
// its neighbours', for the prev/next tangent blend) — none of it depends on
// the query pixel, so it's wasteful to recompute per pixel per edge (it
// was, before this cache: ~14ms of an ~18ms glyph for '@', 85 edges ×
// 2491 pixels — see docs/m6-perf-investigation.md). Computed once per
// generateMSDF call in the precompute pass below, indexed by a flat
// "global edge index" via `_eOffset`.
// Layout: index gi = _eOffset[ci] + ei.
let _eCap = 0; // last allocated size (total edges across all contours)
let _eP0x: Float64Array = new Float64Array(0); // edge.point(0)
let _eP0y: Float64Array = new Float64Array(0);
let _eP1x: Float64Array = new Float64Array(0); // edge.point(1)
let _eP1y: Float64Array = new Float64Array(0);
let _eADx: Float64Array = new Float64Array(0); // edge.direction(0), normalized
let _eADy: Float64Array = new Float64Array(0);
let _eBDx: Float64Array = new Float64Array(0); // edge.direction(1), normalized
let _eBDy: Float64Array = new Float64Array(0);
// unit(prevEdge.direction(1) + edge.direction(0)) — used for the `add` dot product.
let _eAddUx: Float64Array = new Float64Array(0);
let _eAddUy: Float64Array = new Float64Array(0);
// -unit(edge.direction(1) + nextEdge.direction(0)) — the negation is folded
// in here since `bdd` is always used negated (see the original formula).
let _eNegBddUx: Float64Array = new Float64Array(0);
let _eNegBddUy: Float64Array = new Float64Array(0);

let _eOffCap = 0; // last allocated size (number of contours + 1)
let _eOffset: Int32Array = new Int32Array(0); // _eOffset[ci] = first global edge index of contour ci

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * Contour winding with msdfgen's sign convention:
 * +1 for CW (hole), -1 for CCW (outer fill), 0 for empty.
 * port of core/Contour.cpp: Contour::winding() with C++ shoelace sign.
 */
function _contourWinding(c: Contour): number {
  const n = c.length;
  if (n === 0) return 0;
  let total = 0;
  if (n === 1) {
    c[0]!.point(0, _wPt);
    const ax = _wPt[0]!,
      ay = _wPt[1]!;
    c[0]!.point(1 / 3, _wPt);
    const bx = _wPt[0]!,
      by = _wPt[1]!;
    c[0]!.point(2 / 3, _wPt);
    const cx = _wPt[0]!,
      cy = _wPt[1]!;
    total += ax * by - ay * bx;
    total += bx * cy - by * cx;
    total += cx * ay - cy * ax;
  } else if (n === 2) {
    c[0]!.point(0, _wPt);
    const ax = _wPt[0]!,
      ay = _wPt[1]!;
    c[0]!.point(0.5, _wPt);
    const bx = _wPt[0]!,
      by = _wPt[1]!;
    c[1]!.point(0, _wPt);
    const cx = _wPt[0]!,
      cy = _wPt[1]!;
    c[1]!.point(0.5, _wPt);
    const dx = _wPt[0]!,
      dy = _wPt[1]!;
    total += ax * by - ay * bx;
    total += bx * cy - by * cx;
    total += cx * dy - cy * dx;
    total += dx * ay - dy * ax;
  } else {
    const last = c[n - 1]!;
    let prevX = last.p0x,
      prevY = last.p0y;
    for (let i = 0; i < n; i++) {
      const curX = c[i]!.p0x,
        curY = c[i]!.p0y;
      total += prevX * curY - prevY * curX;
      prevX = curX;
      prevY = curY;
    }
  }
  // C++ sign convention: CCW outer → winding = -1.
  return total > 0 ? -1 : total < 0 ? 1 : 0;
}

/**
 * Tries to refine a signed distance scalar into a perpendicular distance.
 * port of core/edge-segments.cpp: EdgeSegment::distanceToPerpendicularDistance
 *
 * @param ci Contour index.
 * @param ei Edge index within contour ci.
 * @param origDist Starting signed distance scalar.
 * @param px Query x in shape space.
 * @param py Query y in shape space.
 * @param param Nearest parameter from signedDistance.
 * @param contours All contours.
 * @returns Possibly updated distance scalar.
 */
function _distToPerp(
  ci: number,
  ei: number,
  origDist: number,
  px: number,
  py: number,
  param: number,
  contours: readonly Contour[],
): number {
  const seg = contours[ci]![ei]!;
  let d = origDist;
  if (param < 0) {
    seg.direction(0, _dir);
    const dlen = Math.sqrt(_dir[0]! * _dir[0]! + _dir[1]! * _dir[1]!);
    if (dlen > 0) {
      const ndx = _dir[0]! / dlen,
        ndy = _dir[1]! / dlen;
      seg.point(0, _pt);
      const aqx = px - _pt[0]!,
        aqy = py - _pt[1]!;
      const ts = aqx * ndx + aqy * ndy;
      if (ts < 0) {
        const perp = aqx * ndy - aqy * ndx; // crossProduct(aq, dir)
        if (Math.abs(perp) <= Math.abs(d)) d = perp;
      }
    }
  }
  if (param > 1) {
    seg.direction(1, _dir);
    const dlen = Math.sqrt(_dir[0]! * _dir[0]! + _dir[1]! * _dir[1]!);
    if (dlen > 0) {
      const ndx = _dir[0]! / dlen,
        ndy = _dir[1]! / dlen;
      seg.point(1, _pt);
      const bqx = px - _pt[0]!,
        bqy = py - _pt[1]!;
      const ts = bqx * ndx + bqy * ndy;
      if (ts > 0) {
        const perp = bqx * ndy - bqy * ndx;
        if (Math.abs(perp) <= Math.abs(d)) d = perp;
      }
    }
  }
  return d;
}

/**
 * Computes the final perpendicular distance from selector state.
 * port of core/edge-selectors.cpp: PerpendicularDistanceSelectorBase::computeDistance
 */
function _computeFromState(
  td: number,
  neg: number,
  pos: number,
  nearCI: number,
  nearEI: number,
  nearParam: number,
  px: number,
  py: number,
  contours: readonly Contour[],
): number {
  let minDist = td < 0 ? neg : pos;
  if (nearEI >= 0) {
    const d = _distToPerp(nearCI, nearEI, td, px, py, nearParam, contours);
    if (Math.abs(d) < Math.abs(minDist)) minDist = d;
  }
  return minDist;
}

/** Median of three numbers. */
function _med(a: number, b: number, c: number): number {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generates a 3-channel MSDF into `out`.
 *
 * The shape must have edge colors assigned (call `edgeColoringSimple` first)
 * and be em-normalized + normalized.
 *
 * After calling this function, apply `distanceSignCorrection` then
 * `msdfErrorCorrection` to match the reference binary's `-scanline` output.
 *
 * @param shape Coloured, normalized shape (y-up font coordinates).
 * @param width Output width in texels.
 * @param height Output height in texels.
 * @param scale Uniform projection scale (msdfgen `-scale`).
 * @param tx Projection translation x (msdfgen `-translate` x).
 * @param ty Projection translation y (msdfgen `-translate` y).
 * @param pxrange Distance range in pixels (msdfgen `-pxrange`).
 * @param out Float32Array of length `width * height * 3`.
 *   Layout: (y * width + x) * 3 + ch, y-up (row 0 = bottom).
 *
 * port of core/msdfgen.cpp: generateMSDF via
 *   generateDistanceField<OverlappingContourCombiner<MultiDistanceSelector>>
 */
export function generateMSDF(
  shape: Shape,
  width: number,
  height: number,
  scale: number,
  tx: number,
  ty: number,
  pxrange: number,
  out: Float32Array,
): void {
  if (out.length !== width * height * 3) {
    throw new Error(`generateMSDF: out.length ${out.length} !== ${width * height * 3}`);
  }

  const contours = shape.contours;
  const nc = contours.length;
  if (nc === 0) {
    out.fill(0);
    return;
  }

  // invRange = scale/pxrange = 1/rangeWidth; matches DistanceMapping::operator()(Delta(1))
  const invRange = scale / pxrange;

  // Pre-compute windings once per shape.
  if (_windings.length < nc) _windings = new Int32Array(nc);
  for (let ci = 0; ci < nc; ci++) _windings[ci] = _contourWinding(contours[ci]!);

  // Pre-compute per-edge perpendicular-selector geometry once per shape
  // (see the module-scope arrays' doc comment above) — this used to run
  // once per (pixel, edge) pair; the values never depended on the pixel.
  if (_eOffCap < nc + 1) {
    _eOffset = new Int32Array(nc + 1);
    _eOffCap = nc + 1;
  }
  let totalEdges = 0;
  for (let ci = 0; ci < nc; ci++) {
    _eOffset[ci] = totalEdges;
    totalEdges += contours[ci]!.length;
  }
  _eOffset[nc] = totalEdges;

  if (_eCap < totalEdges) {
    _eP0x = new Float64Array(totalEdges);
    _eP0y = new Float64Array(totalEdges);
    _eP1x = new Float64Array(totalEdges);
    _eP1y = new Float64Array(totalEdges);
    _eADx = new Float64Array(totalEdges);
    _eADy = new Float64Array(totalEdges);
    _eBDx = new Float64Array(totalEdges);
    _eBDy = new Float64Array(totalEdges);
    _eAddUx = new Float64Array(totalEdges);
    _eAddUy = new Float64Array(totalEdges);
    _eNegBddUx = new Float64Array(totalEdges);
    _eNegBddUy = new Float64Array(totalEdges);
    _eCap = totalEdges;
  }

  for (let ci = 0; ci < nc; ci++) {
    const contour = contours[ci]!;
    const n = contour.length;
    const off = _eOffset[ci]!;
    for (let ei = 0; ei < n; ei++) {
      const edge = contour[ei]!;
      const prevEdge = contour[(ei + n - 1) % n]!;
      const nextEdge = contour[(ei + 1) % n]!;
      const gi = off + ei;

      edge.point(0, _pt);
      _eP0x[gi] = _pt[0]!;
      _eP0y[gi] = _pt[1]!;
      edge.point(1, _pt);
      _eP1x[gi] = _pt[0]!;
      _eP1y[gi] = _pt[1]!;

      edge.direction(0, _dir);
      let dlen = Math.sqrt(_dir[0]! * _dir[0]! + _dir[1]! * _dir[1]!);
      const aDx = dlen > 0 ? _dir[0]! / dlen : 0;
      const aDy = dlen > 0 ? _dir[1]! / dlen : 0;
      _eADx[gi] = aDx;
      _eADy[gi] = aDy;

      edge.direction(1, _dir);
      dlen = Math.sqrt(_dir[0]! * _dir[0]! + _dir[1]! * _dir[1]!);
      const bDx = dlen > 0 ? _dir[0]! / dlen : 0;
      const bDy = dlen > 0 ? _dir[1]! / dlen : 0;
      _eBDx[gi] = bDx;
      _eBDy[gi] = bDy;

      prevEdge.direction(1, _dir);
      dlen = Math.sqrt(_dir[0]! * _dir[0]! + _dir[1]! * _dir[1]!);
      const pDx = dlen > 0 ? _dir[0]! / dlen : 0;
      const pDy = dlen > 0 ? _dir[1]! / dlen : 0;

      nextEdge.direction(0, _dir);
      dlen = Math.sqrt(_dir[0]! * _dir[0]! + _dir[1]! * _dir[1]!);
      const nDx = dlen > 0 ? _dir[0]! / dlen : 0;
      const nDy = dlen > 0 ? _dir[1]! / dlen : 0;

      const addSx = pDx + aDx,
        addSy = pDy + aDy;
      const addSl = Math.sqrt(addSx * addSx + addSy * addSy);
      _eAddUx[gi] = addSl > 0 ? addSx / addSl : 0;
      _eAddUy[gi] = addSl > 0 ? addSy / addSl : 0;

      const bddSx = bDx + nDx,
        bddSy = bDy + nDy;
      const bddSl = Math.sqrt(bddSx * bddSx + bddSy * bddSy);
      _eNegBddUx[gi] = bddSl > 0 ? -(bddSx / bddSl) : 0;
      _eNegBddUy[gi] = bddSl > 0 ? -(bddSy / bddSl) : 0;
    }
  }

  // Ensure per-contour state arrays are large enough.
  if (_cNC < nc) {
    const n3 = nc * 3;
    _cTD = new Float64Array(n3);
    _cDot = new Float64Array(n3);
    _cNeg = new Float64Array(n3);
    _cPos = new Float64Array(n3);
    _cNEI = new Int32Array(n3);
    _cNPar = new Float64Array(n3);
    _cdR = new Float64Array(nc);
    _cdG = new Float64Array(nc);
    _cdB = new Float64Array(nc);
    _cNC = nc;
  }

  // Scratch for signedDistance output.
  const _sd = { distance: 0, dot: 0, param: 0 };

  // ── Pixel loop ──────────────────────────────────────────────────────────────
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Shape-space position of texel centre.
      // port of: p = transformation.unproject(Point2(x+.5, y+.5))
      //        = (x+.5)/scale - tx,  (y+.5)/scale - ty
      const px = (x + 0.5) / scale - tx;
      const py = (y + 0.5) / scale - ty;

      // ── Phase 1: Per-contour MultiDistanceSelector ────────────────────────
      // Iterate each contour's edges to build per-contour perpendicular distance state.
      // port of ShapeDistanceFinder::distance(p) → distanceFinder per contour
      for (let ci = 0; ci < nc; ci++) {
        const contour = contours[ci]!;
        const n = contour.length;
        const ci3 = ci * 3;
        const ciOff = _eOffset[ci]!; // base index into the _e* per-edge arrays

        // Reset per-contour state.
        // Matches PerpendicularDistanceSelectorBase default ctor:
        //   minTrueDistance = {-DBL_MAX, 0},
        //   minNeg = -|trueDist| = -DBL_MAX,
        //   minPos = |trueDist| = DBL_MAX,
        //   nearEdge = null.
        _cTD[ci3] = _cTD[ci3 + 1] = _cTD[ci3 + 2] = -DBL_MAX;
        _cDot[ci3] = _cDot[ci3 + 1] = _cDot[ci3 + 2] = 0;
        _cNeg[ci3] = _cNeg[ci3 + 1] = _cNeg[ci3 + 2] = -DBL_MAX;
        _cPos[ci3] = _cPos[ci3 + 1] = _cPos[ci3 + 2] = DBL_MAX;
        _cNEI[ci3] = _cNEI[ci3 + 1] = _cNEI[ci3 + 2] = -1;
        _cNPar[ci3] = _cNPar[ci3 + 1] = _cNPar[ci3 + 2] = 0;

        // port of MultiDistanceSelector::addEdge() (per edge)
        for (let ei = 0; ei < n; ei++) {
          const edge = contour[ei]!;

          const col = edge.color;
          const doR = (col & RED) !== 0;
          const doG = (col & GREEN) !== 0;
          const doB = (col & BLUE) !== 0;

          // Signed distance for this edge.
          edge.signedDistance(px, py, _sd);
          const dist = _sd.distance,
            dot = _sd.dot,
            param = _sd.param;
          const absDist = Math.abs(dist);

          // Update per-channel true distances (addEdgeTrueDistance).
          if (doR) {
            const cAbs = Math.abs(_cTD[ci3]!);
            if (absDist < cAbs || (absDist === cAbs && dot < _cDot[ci3]!)) {
              _cTD[ci3] = dist;
              _cDot[ci3] = dot;
              _cNEI[ci3] = ei;
              _cNPar[ci3] = param;
            }
          }
          if (doG) {
            const cAbs = Math.abs(_cTD[ci3 + 1]!);
            if (absDist < cAbs || (absDist === cAbs && dot < _cDot[ci3 + 1]!)) {
              _cTD[ci3 + 1] = dist;
              _cDot[ci3 + 1] = dot;
              _cNEI[ci3 + 1] = ei;
              _cNPar[ci3 + 1] = param;
            }
          }
          if (doB) {
            const cAbs = Math.abs(_cTD[ci3 + 2]!);
            if (absDist < cAbs || (absDist === cAbs && dot < _cDot[ci3 + 2]!)) {
              _cTD[ci3 + 2] = dist;
              _cDot[ci3 + 2] = dot;
              _cNEI[ci3 + 2] = ei;
              _cNPar[ci3 + 2] = param;
            }
          }

          // Perpendicular distances at edge endpoints — geometry (points,
          // tangent directions, the add/bdd blend directions) is looked up
          // from the precompute pass above, not recomputed per pixel; only
          // the ap/bp subtraction and the add/bdd dot products are actually
          // pixel-dependent. See the module-scope _e* arrays' doc comment.
          const gei = ciOff + ei; // global edge index into the _e* arrays
          const apx = px - _eP0x[gei]!,
            apy = py - _eP0y[gei]!;
          const bpx = px - _eP1x[gei]!,
            bpy = py - _eP1y[gei]!;

          const aDx = _eADx[gei]!,
            aDy = _eADy[gei]!;
          const bDx = _eBDx[gei]!,
            bDy = _eBDy[gei]!;

          // add = dotProduct(ap, (prevDir + aDir).normalize(true))
          const add = apx * _eAddUx[gei]! + apy * _eAddUy[gei]!;
          // bdd = -dotProduct(bp, (bDir + nextDir).normalize(true)) — the
          // negation is already folded into _eNegBddU{x,y}.
          const bdd = bpx * _eNegBddUx[gei]! + bpy * _eNegBddUy[gei]!;

          // add > 0: perpendicular at edge START.
          // getPerpendicularDistance(pd, ap, -aDir): ts=dot(ap,-aDir) > 0 → pd=cross(ap,aDir)
          if (add > 0) {
            const ts_a = -(apx * aDx + apy * aDy); // dot(ap, -aDir)
            if (ts_a > 0) {
              const perp = apx * aDy - apy * aDx; // cross(ap, aDir) = -cross(ap,-aDir)
              if (Math.abs(perp) < absDist) {
                // pd = -cross(ap,-aDir) = cross(ap,aDir) = perp
                if (doR) {
                  if (perp <= 0 && perp > _cNeg[ci3]!) _cNeg[ci3] = perp;
                  else if (perp > 0 && perp < _cPos[ci3]!) _cPos[ci3] = perp;
                }
                if (doG) {
                  if (perp <= 0 && perp > _cNeg[ci3 + 1]!) _cNeg[ci3 + 1] = perp;
                  else if (perp > 0 && perp < _cPos[ci3 + 1]!) _cPos[ci3 + 1] = perp;
                }
                if (doB) {
                  if (perp <= 0 && perp > _cNeg[ci3 + 2]!) _cNeg[ci3 + 2] = perp;
                  else if (perp > 0 && perp < _cPos[ci3 + 2]!) _cPos[ci3 + 2] = perp;
                }
              }
            }
          }

          // bdd > 0: perpendicular at edge END.
          // getPerpendicularDistance(pd, bp, bDir): ts=dot(bp,bDir) > 0 → perp=cross(bp,bDir)
          if (bdd > 0) {
            const ts_b = bpx * bDx + bpy * bDy; // dot(bp, bDir)
            if (ts_b > 0) {
              const perp = bpx * bDy - bpy * bDx; // cross(bp, bDir)
              if (Math.abs(perp) < absDist) {
                if (doR) {
                  if (perp <= 0 && perp > _cNeg[ci3]!) _cNeg[ci3] = perp;
                  else if (perp > 0 && perp < _cPos[ci3]!) _cPos[ci3] = perp;
                }
                if (doG) {
                  if (perp <= 0 && perp > _cNeg[ci3 + 1]!) _cNeg[ci3 + 1] = perp;
                  else if (perp > 0 && perp < _cPos[ci3 + 1]!) _cPos[ci3 + 1] = perp;
                }
                if (doB) {
                  if (perp <= 0 && perp > _cNeg[ci3 + 2]!) _cNeg[ci3 + 2] = perp;
                  else if (perp > 0 && perp < _cPos[ci3 + 2]!) _cPos[ci3 + 2] = perp;
                }
              }
            }
          }
        } // end edge loop

        // Compute per-contour perpendicular distances.
        // port of MultiDistanceSelector::distance() → r.computeDistance(p) etc.
        _cdR[ci] = _computeFromState(
          _cTD[ci3]!,
          _cNeg[ci3]!,
          _cPos[ci3]!,
          ci,
          _cNEI[ci3]!,
          _cNPar[ci3]!,
          px,
          py,
          contours,
        );
        _cdG[ci] = _computeFromState(
          _cTD[ci3 + 1]!,
          _cNeg[ci3 + 1]!,
          _cPos[ci3 + 1]!,
          ci,
          _cNEI[ci3 + 1]!,
          _cNPar[ci3 + 1]!,
          px,
          py,
          contours,
        );
        _cdB[ci] = _computeFromState(
          _cTD[ci3 + 2]!,
          _cNeg[ci3 + 2]!,
          _cPos[ci3 + 2]!,
          ci,
          _cNEI[ci3 + 2]!,
          _cNPar[ci3 + 2]!,
          px,
          py,
          contours,
        );
      } // end contour loop

      // ── Phase 2: OverlappingContourCombiner::distance() ──────────────────
      // port of core/contour-combiners.cpp: OverlappingContourCombiner::distance()
      // with DistanceType = MultiDistance.
      //
      // Creates fresh shape/inner/outer selectors (initial trueDist = -DBL_MAX).
      // Then merges per-contour selectors into them based on winding+edgeDistance.
      //
      // All 63 variables below are stack scalars (no allocation).

      // Shape selector.
      let s_r_td = -DBL_MAX,
        s_r_dot = 0,
        s_r_neg = -DBL_MAX,
        s_r_pos = DBL_MAX,
        s_r_ci = -1,
        s_r_ei = -1,
        s_r_par = 0;
      let s_g_td = -DBL_MAX,
        s_g_dot = 0,
        s_g_neg = -DBL_MAX,
        s_g_pos = DBL_MAX,
        s_g_ci = -1,
        s_g_ei = -1,
        s_g_par = 0;
      let s_b_td = -DBL_MAX,
        s_b_dot = 0,
        s_b_neg = -DBL_MAX,
        s_b_pos = DBL_MAX,
        s_b_ci = -1,
        s_b_ei = -1,
        s_b_par = 0;
      // Inner selector (merged from winding > 0 contours with edgeMedian >= 0).
      let i_r_td = -DBL_MAX,
        i_r_dot = 0,
        i_r_neg = -DBL_MAX,
        i_r_pos = DBL_MAX,
        i_r_ci = -1,
        i_r_ei = -1,
        i_r_par = 0;
      let i_g_td = -DBL_MAX,
        i_g_dot = 0,
        i_g_neg = -DBL_MAX,
        i_g_pos = DBL_MAX,
        i_g_ci = -1,
        i_g_ei = -1,
        i_g_par = 0;
      let i_b_td = -DBL_MAX,
        i_b_dot = 0,
        i_b_neg = -DBL_MAX,
        i_b_pos = DBL_MAX,
        i_b_ci = -1,
        i_b_ei = -1,
        i_b_par = 0;
      // Outer selector (merged from winding < 0 contours with edgeMedian <= 0).
      let o_r_td = -DBL_MAX,
        o_r_dot = 0,
        o_r_neg = -DBL_MAX,
        o_r_pos = DBL_MAX,
        o_r_ci = -1,
        o_r_ei = -1,
        o_r_par = 0;
      let o_g_td = -DBL_MAX,
        o_g_dot = 0,
        o_g_neg = -DBL_MAX,
        o_g_pos = DBL_MAX,
        o_g_ci = -1,
        o_g_ei = -1,
        o_g_par = 0;
      let o_b_td = -DBL_MAX,
        o_b_dot = 0,
        o_b_neg = -DBL_MAX,
        o_b_pos = DBL_MAX,
        o_b_ci = -1,
        o_b_ei = -1,
        o_b_par = 0;

      for (let ci = 0; ci < nc; ci++) {
        const ci3 = ci * 3;
        const w = _windings[ci]!;

        // edgeDistance = edgeSelectors[ci].distance() = {_cdR[ci], _cdG[ci], _cdB[ci]}
        // resolveDistance(edgeDistance) = median(r,g,b)
        const edM = _med(_cdR[ci]!, _cdG[ci]!, _cdB[ci]!);

        // shapeEdgeSelector.merge(edgeSelectors[ci])
        // port of MultiDistanceSelector::merge → PerpendicularDistanceSelectorBase::merge
        {
          const aTD = _cTD[ci3]!,
            aDot = _cDot[ci3]!;
          const aAbs = Math.abs(aTD);
          if (aAbs < Math.abs(s_r_td) || (aAbs === Math.abs(s_r_td) && aDot < s_r_dot)) {
            s_r_td = aTD;
            s_r_dot = aDot;
            s_r_ci = ci;
            s_r_ei = _cNEI[ci3]!;
            s_r_par = _cNPar[ci3]!;
          }
          if (_cNeg[ci3]! > s_r_neg) s_r_neg = _cNeg[ci3]!;
          if (_cPos[ci3]! < s_r_pos) s_r_pos = _cPos[ci3]!;
        }
        {
          const aTD = _cTD[ci3 + 1]!,
            aDot = _cDot[ci3 + 1]!;
          const aAbs = Math.abs(aTD);
          if (aAbs < Math.abs(s_g_td) || (aAbs === Math.abs(s_g_td) && aDot < s_g_dot)) {
            s_g_td = aTD;
            s_g_dot = aDot;
            s_g_ci = ci;
            s_g_ei = _cNEI[ci3 + 1]!;
            s_g_par = _cNPar[ci3 + 1]!;
          }
          if (_cNeg[ci3 + 1]! > s_g_neg) s_g_neg = _cNeg[ci3 + 1]!;
          if (_cPos[ci3 + 1]! < s_g_pos) s_g_pos = _cPos[ci3 + 1]!;
        }
        {
          const aTD = _cTD[ci3 + 2]!,
            aDot = _cDot[ci3 + 2]!;
          const aAbs = Math.abs(aTD);
          if (aAbs < Math.abs(s_b_td) || (aAbs === Math.abs(s_b_td) && aDot < s_b_dot)) {
            s_b_td = aTD;
            s_b_dot = aDot;
            s_b_ci = ci;
            s_b_ei = _cNEI[ci3 + 2]!;
            s_b_par = _cNPar[ci3 + 2]!;
          }
          if (_cNeg[ci3 + 2]! > s_b_neg) s_b_neg = _cNeg[ci3 + 2]!;
          if (_cPos[ci3 + 2]! < s_b_pos) s_b_pos = _cPos[ci3 + 2]!;
        }

        // innerEdgeSelector.merge if winding > 0 && edgeMedian >= 0
        if (w > 0 && edM >= 0) {
          {
            const aTD = _cTD[ci3]!,
              aDot = _cDot[ci3]!;
            const aAbs = Math.abs(aTD);
            if (aAbs < Math.abs(i_r_td) || (aAbs === Math.abs(i_r_td) && aDot < i_r_dot)) {
              i_r_td = aTD;
              i_r_dot = aDot;
              i_r_ci = ci;
              i_r_ei = _cNEI[ci3]!;
              i_r_par = _cNPar[ci3]!;
            }
            if (_cNeg[ci3]! > i_r_neg) i_r_neg = _cNeg[ci3]!;
            if (_cPos[ci3]! < i_r_pos) i_r_pos = _cPos[ci3]!;
          }
          {
            const aTD = _cTD[ci3 + 1]!,
              aDot = _cDot[ci3 + 1]!;
            const aAbs = Math.abs(aTD);
            if (aAbs < Math.abs(i_g_td) || (aAbs === Math.abs(i_g_td) && aDot < i_g_dot)) {
              i_g_td = aTD;
              i_g_dot = aDot;
              i_g_ci = ci;
              i_g_ei = _cNEI[ci3 + 1]!;
              i_g_par = _cNPar[ci3 + 1]!;
            }
            if (_cNeg[ci3 + 1]! > i_g_neg) i_g_neg = _cNeg[ci3 + 1]!;
            if (_cPos[ci3 + 1]! < i_g_pos) i_g_pos = _cPos[ci3 + 1]!;
          }
          {
            const aTD = _cTD[ci3 + 2]!,
              aDot = _cDot[ci3 + 2]!;
            const aAbs = Math.abs(aTD);
            if (aAbs < Math.abs(i_b_td) || (aAbs === Math.abs(i_b_td) && aDot < i_b_dot)) {
              i_b_td = aTD;
              i_b_dot = aDot;
              i_b_ci = ci;
              i_b_ei = _cNEI[ci3 + 2]!;
              i_b_par = _cNPar[ci3 + 2]!;
            }
            if (_cNeg[ci3 + 2]! > i_b_neg) i_b_neg = _cNeg[ci3 + 2]!;
            if (_cPos[ci3 + 2]! < i_b_pos) i_b_pos = _cPos[ci3 + 2]!;
          }
        }

        // outerEdgeSelector.merge if winding < 0 && edgeMedian <= 0
        if (w < 0 && edM <= 0) {
          {
            const aTD = _cTD[ci3]!,
              aDot = _cDot[ci3]!;
            const aAbs = Math.abs(aTD);
            if (aAbs < Math.abs(o_r_td) || (aAbs === Math.abs(o_r_td) && aDot < o_r_dot)) {
              o_r_td = aTD;
              o_r_dot = aDot;
              o_r_ci = ci;
              o_r_ei = _cNEI[ci3]!;
              o_r_par = _cNPar[ci3]!;
            }
            if (_cNeg[ci3]! > o_r_neg) o_r_neg = _cNeg[ci3]!;
            if (_cPos[ci3]! < o_r_pos) o_r_pos = _cPos[ci3]!;
          }
          {
            const aTD = _cTD[ci3 + 1]!,
              aDot = _cDot[ci3 + 1]!;
            const aAbs = Math.abs(aTD);
            if (aAbs < Math.abs(o_g_td) || (aAbs === Math.abs(o_g_td) && aDot < o_g_dot)) {
              o_g_td = aTD;
              o_g_dot = aDot;
              o_g_ci = ci;
              o_g_ei = _cNEI[ci3 + 1]!;
              o_g_par = _cNPar[ci3 + 1]!;
            }
            if (_cNeg[ci3 + 1]! > o_g_neg) o_g_neg = _cNeg[ci3 + 1]!;
            if (_cPos[ci3 + 1]! < o_g_pos) o_g_pos = _cPos[ci3 + 1]!;
          }
          {
            const aTD = _cTD[ci3 + 2]!,
              aDot = _cDot[ci3 + 2]!;
            const aAbs = Math.abs(aTD);
            if (aAbs < Math.abs(o_b_td) || (aAbs === Math.abs(o_b_td) && aDot < o_b_dot)) {
              o_b_td = aTD;
              o_b_dot = aDot;
              o_b_ci = ci;
              o_b_ei = _cNEI[ci3 + 2]!;
              o_b_par = _cNPar[ci3 + 2]!;
            }
            if (_cNeg[ci3 + 2]! > o_b_neg) o_b_neg = _cNeg[ci3 + 2]!;
            if (_cPos[ci3 + 2]! < o_b_pos) o_b_pos = _cPos[ci3 + 2]!;
          }
        }
      } // end combiner merge loop

      // Compute distances from merged selectors.
      const sDistR = _computeFromState(
        s_r_td,
        s_r_neg,
        s_r_pos,
        s_r_ci,
        s_r_ei,
        s_r_par,
        px,
        py,
        contours,
      );
      const sDistG = _computeFromState(
        s_g_td,
        s_g_neg,
        s_g_pos,
        s_g_ci,
        s_g_ei,
        s_g_par,
        px,
        py,
        contours,
      );
      const sDistB = _computeFromState(
        s_b_td,
        s_b_neg,
        s_b_pos,
        s_b_ci,
        s_b_ei,
        s_b_par,
        px,
        py,
        contours,
      );
      const shapeMedian = _med(sDistR, sDistG, sDistB);

      const iDistR = _computeFromState(
        i_r_td,
        i_r_neg,
        i_r_pos,
        i_r_ci,
        i_r_ei,
        i_r_par,
        px,
        py,
        contours,
      );
      const iDistG = _computeFromState(
        i_g_td,
        i_g_neg,
        i_g_pos,
        i_g_ci,
        i_g_ei,
        i_g_par,
        px,
        py,
        contours,
      );
      const iDistB = _computeFromState(
        i_b_td,
        i_b_neg,
        i_b_pos,
        i_b_ci,
        i_b_ei,
        i_b_par,
        px,
        py,
        contours,
      );
      const innerMedian = _med(iDistR, iDistG, iDistB);

      const oDistR = _computeFromState(
        o_r_td,
        o_r_neg,
        o_r_pos,
        o_r_ci,
        o_r_ei,
        o_r_par,
        px,
        py,
        contours,
      );
      const oDistG = _computeFromState(
        o_g_td,
        o_g_neg,
        o_g_pos,
        o_g_ci,
        o_g_ei,
        o_g_par,
        px,
        py,
        contours,
      );
      const oDistB = _computeFromState(
        o_b_td,
        o_b_neg,
        o_b_pos,
        o_b_ci,
        o_b_ei,
        o_b_par,
        px,
        py,
        contours,
      );
      const outerMedian = _med(oDistR, oDistG, oDistB);

      // Selection logic.
      // port of OverlappingContourCombiner::distance() selection+refinement.
      let finalR: number, finalG: number, finalB: number;
      let winding = 0;

      if (innerMedian >= 0 && Math.abs(innerMedian) <= Math.abs(outerMedian)) {
        finalR = iDistR;
        finalG = iDistG;
        finalB = iDistB;
        winding = 1;
        for (let ci = 0; ci < nc; ci++) {
          if (_windings[ci]! > 0) {
            const cdR = _cdR[ci]!,
              cdG = _cdG[ci]!,
              cdB = _cdB[ci]!;
            const cdM = _med(cdR, cdG, cdB);
            if (Math.abs(cdM) < Math.abs(outerMedian) && cdM > _med(finalR, finalG, finalB)) {
              finalR = cdR;
              finalG = cdG;
              finalB = cdB;
            }
          }
        }
      } else if (outerMedian <= 0 && Math.abs(outerMedian) < Math.abs(innerMedian)) {
        finalR = oDistR;
        finalG = oDistG;
        finalB = oDistB;
        winding = -1;
        for (let ci = 0; ci < nc; ci++) {
          if (_windings[ci]! < 0) {
            const cdR = _cdR[ci]!,
              cdG = _cdG[ci]!,
              cdB = _cdB[ci]!;
            const cdM = _med(cdR, cdG, cdB);
            if (Math.abs(cdM) < Math.abs(innerMedian) && cdM < _med(finalR, finalG, finalB)) {
              finalR = cdR;
              finalG = cdG;
              finalB = cdB;
            }
          }
        }
      } else {
        // return shapeDistance (no winding-based refinement or blending)
        const base = (y * width + x) * 3;
        out[base + 0] = sDistR * invRange + 0.5;
        out[base + 1] = sDistG * invRange + 0.5;
        out[base + 2] = sDistB * invRange + 0.5;
        continue;
      }

      // Blend with opposite-winding contours if same sign and closer.
      for (let ci = 0; ci < nc; ci++) {
        if (_windings[ci]! !== winding) {
          const cdR = _cdR[ci]!,
            cdG = _cdG[ci]!,
            cdB = _cdB[ci]!;
          const cdM = _med(cdR, cdG, cdB);
          const finalM = _med(finalR, finalG, finalB);
          if (cdM * finalM >= 0 && Math.abs(cdM) < Math.abs(finalM)) {
            finalR = cdR;
            finalG = cdG;
            finalB = cdB;
          }
        }
      }

      // If result median == shapeMedian, prefer shapeDistance.
      if (_med(finalR, finalG, finalB) === shapeMedian) {
        finalR = sDistR;
        finalG = sDistG;
        finalB = sDistB;
      }

      const base = (y * width + x) * 3;
      out[base + 0] = finalR * invRange + 0.5;
      out[base + 1] = finalG * invRange + 0.5;
      out[base + 2] = finalB * invRange + 0.5;
    } // end x loop
  } // end y loop
}
