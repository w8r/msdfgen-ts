/**
 * Shape normalization and em-normalization.
 *
 * This module owns the *single named boundary* at which font units are divided
 * by unitsPerEm (FONT_SCALING_EM_NORMALIZED in msdfgen terms).  No other
 * source file may divide by unitsPerEm — import `emNormalizeShape` here.
 *
 * Ported from core/Shape.cpp: Shape::normalize(), and
 * core/convergent-curve-ordering.cpp: convergentCurveOrdering().
 * msdfgen © Viktor Chlumský — MIT licence.
 */

import { type Contour } from "./contour";
import { EdgeSegment, QUADRATIC, CUBIC, LINEAR } from "./segments";
import { type Shape } from "./shape";
import { cross, dot, sign } from "../math/scalar";

// ── em-normalization ────────────────────────────────────────────────────────

/**
 * Divides all control-point coordinates by `unitsPerEm`, converting font
 * units to the normalised em-square coordinate system used by msdfgen.
 *
 * This is the **single named em-normalisation step** (FONT_SCALING_EM_NORMALIZED).
 * No other file may perform this division by unitsPerEm.
 *
 * @param shape Shape in raw font units (mutated in-place).
 * @param unitsPerEm Design units per em (from Font.metrics.unitsPerEm).
 */
export function emNormalizeShape(shape: Shape, unitsPerEm: number): void {
  const inv = 1 / unitsPerEm;
  for (const contour of shape.contours) {
    for (let i = 0; i < contour.length; i++) {
      const seg = contour[i]!;
      seg.p0x *= inv;
      seg.p0y *= inv;
      seg.p1x *= inv;
      seg.p1y *= inv;
      seg.p2x *= inv;
      seg.p2y *= inv;
      seg.p3x *= inv;
      seg.p3y *= inv;
      // Degenerate QUADRATIC: if the control point is collinear with the
      // endpoints, collapse to LINEAR.  Matches C++ EdgeSegment::create:
      //   if (!crossProduct(p1-p0, p2-p1)) return new LinearSegment(p0, p2)
      // The check is performed AFTER em-normalization.  Plain `a*b - c*d`
      // matches the reference since it is built with -ffp-contract=off
      // (tools/setup-reference.sh): a perfectly collinear control point scaled
      // by a non-power-of-two unitsPerEm rounds the cross product to exactly 0
      // on both sides, and the edge collapses.
      if (seg.type === QUADRATIC) {
        const d01x = seg.p1x - seg.p0x;
        const d01y = seg.p1y - seg.p0y;
        const d12x = seg.p2x - seg.p1x;
        const d12y = seg.p2y - seg.p1y;
        if (cross(d01x, d01y, d12x, d12y) === 0) {
          contour[i] = new EdgeSegment(LINEAR, seg.p0x, seg.p0y, seg.p2x, seg.p2y, 0, 0, 0, 0);
        }
      }
    }
  }
}

// ── Shape::normalize() constants ─────────────────────────────────────────────

/** Threshold of the dot product of adjacent edge directions to be considered convergent.
 *  port of core/Shape.h: MSDFGEN_CORNER_DOT_EPSILON */
const CORNER_DOT_EPSILON = 0.000001;

/** Moves control points slightly more than necessary to account for fp errors.
 *  port of core/Shape.cpp: DECONVERGE_OVERSHOOT */
// C++ writes 1.11111111111111111; this is the double that literal rounds to.
const DECONVERGE_OVERSHOOT = 1.1111111111111112;

// ── convergentCurveOrdering ───────────────────────────────────────────────

/**
 * Module-scope scratch flat array for control-point data.
 * Layout: indices [0..7]  = prevEdge cps (4 points × 2 coords)
 *         indices [8..15] = curEdge  cps (4 points × 2 coords)
 * Library is synchronous and single-threaded per worker — safe to share.
 */
const _ccoPts = new Float64Array(16);

/**
 * Fills a flat buffer with the control points of a segment.
 * Writes (order+1) × 2 numbers starting at `off`.
 * @param seg  Source segment.
 * @param buf  Destination flat array (2 numbers per point).
 * @param off  Start index in buf (in units of numbers, not points).
 * @returns    Curve order: 1=linear, 2=quadratic, 3=cubic.
 */
function fillCps(seg: EdgeSegment, buf: Float64Array, off: number): number {
  buf[off] = seg.p0x;
  buf[off + 1] = seg.p0y;
  buf[off + 2] = seg.p1x;
  buf[off + 3] = seg.p1y;
  switch (seg.type) {
    case LINEAR:
      return 1;
    case QUADRATIC:
      buf[off + 4] = seg.p2x;
      buf[off + 5] = seg.p2y;
      return 2;
    default: // CUBIC
      buf[off + 4] = seg.p2x;
      buf[off + 5] = seg.p2y;
      buf[off + 6] = seg.p3x;
      buf[off + 7] = seg.p3y;
      return 3;
  }
}

/**
 * Simplifies degenerate curves in a flat control-point array.
 * port of core/convergent-curve-ordering.cpp: simplifyDegenerateCurve (static)
 *
 * @param buf   Flat control-point buffer (2 numbers per point).
 * @param off   Start index in buf.
 * @param order Curve order (1/2/3).
 * @returns     Simplified order (may decrease to 0 for zero-length curve).
 */
function simplifyDeg(buf: Float64Array, off: number, order: number): number {
  if (order === 3) {
    const p0x = buf[off]!;
    const p0y = buf[off + 1]!;
    const p1x = buf[off + 2]!;
    const p1y = buf[off + 3]!;
    const p2x = buf[off + 4]!;
    const p2y = buf[off + 5]!;
    const p3x = buf[off + 6]!;
    const p3y = buf[off + 7]!;
    // C++ condition: (p[1]==p[0]||p[1]==p[3]) && (p[2]==p[0]||p[2]==p[3])
    if (
      ((p1x === p0x && p1y === p0y) || (p1x === p3x && p1y === p3y)) &&
      ((p2x === p0x && p2y === p0y) || (p2x === p3x && p2y === p3y))
    ) {
      buf[off + 2] = p3x;
      buf[off + 3] = p3y; // collapse to linear p0→p3
      order = 1;
    }
  }
  if (order === 2) {
    const p0x = buf[off]!;
    const p0y = buf[off + 1]!;
    const p1x = buf[off + 2]!;
    const p1y = buf[off + 3]!;
    const p2x = buf[off + 4]!;
    const p2y = buf[off + 5]!;
    if ((p1x === p0x && p1y === p0y) || (p1x === p2x && p1y === p2y)) {
      buf[off + 2] = p2x;
      buf[off + 3] = p2y;
      order = 1;
    }
  }
  if (order === 1) {
    if (buf[off]! === buf[off + 2]! && buf[off + 1]! === buf[off + 3]!) order = 0;
  }
  return order;
}

/**
 * Determines the ordering of two convergent edge segments at a shared corner.
 * port of core/convergent-curve-ordering.cpp: convergentCurveOrdering(EdgeSegment*,EdgeSegment*)
 *   + convergentCurveOrdering(Point2*, int, int) inner body.
 *
 * @param prevEdge Edge ending at the shared corner.
 * @param curEdge  Edge starting at the shared corner.
 * @returns +1, -1, or 0.
 */
function convergentCurveOrdering(prevEdge: EdgeSegment, curEdge: EdgeSegment): number {
  const pts = _ccoPts;
  // Fill: prevEdge at [0..7], curEdge at [8..15]
  let aOrd = fillCps(prevEdge, pts, 0);
  let bOrd = fillCps(curEdge, pts, 8);

  if (!(aOrd >= 1 && aOrd <= 3 && bOrd >= 1 && bOrd <= 3)) return 0;

  // Corner sanity: prevEdge's last cp must equal curEdge's first cp.
  if (pts[aOrd * 2]! !== pts[8]! || pts[aOrd * 2 + 1]! !== pts[9]!) return 0;

  aOrd = simplifyDeg(pts, 0, aOrd);
  bOrd = simplifyDeg(pts, 8, bOrd);

  // After simplification, re-read the corner (it's still at prevEdge.end = pts[aOrd*2..]).
  const cx = pts[aOrd * 2]!;
  const cy = pts[aOrd * 2 + 1]!;

  // ── Derivative vector computation ──────────────────────────────────────
  // Helper accessors into the flat buffer:
  //   a's cp[k] = pts[k*2], pts[k*2+1]       (prevEdge, ending at corner)
  //   b's cp[k] = pts[8+k*2], pts[8+k*2+1]   (curEdge, starting at corner)
  //
  // Finite differences matching C++ convergentCurveOrdering(Point2*,int,int):
  //   corner in C++ == a.cp[aOrd] == b.cp[0]
  //   *(corner-1) = a.cp[aOrd-1]       *(corner+1) = b.cp[1]
  //   *(corner-2) = a.cp[aOrd-2]       *(corner+2) = b.cp[2]
  //   *(corner-3) = a.cp[aOrd-3]       *(corner+3) = b.cp[3]
  //
  // a1 = a.cp[aOrd-1] - corner
  // a2 = a.cp[aOrd-2] - a.cp[aOrd-1] - a1          (if aOrd>=2)
  // a3 = a.cp[0] - a.cp[1] - (a.cp[1]-a.cp[2]) - a2  (if aOrd=3, before a2*=3)
  // a2 *= 3                                             (if aOrd=3)
  // a1 *= aOrd
  // b1..b3 symmetrically for curEdge
  // ─────────────────────────────────────────────────────────────────────

  let a1x = 0,
    a1y = 0,
    a2x = 0,
    a2y = 0,
    a3x = 0,
    a3y = 0;
  let b1x = 0,
    b1y = 0,
    b2x = 0,
    b2y = 0,
    b3x = 0,
    b3y = 0;

  if (aOrd >= 1) {
    a1x = pts[(aOrd - 1) * 2]! - cx;
    a1y = pts[(aOrd - 1) * 2 + 1]! - cy;
  }
  if (aOrd >= 2) {
    const d01x = pts[(aOrd - 2) * 2]! - pts[(aOrd - 1) * 2]!;
    const d01y = pts[(aOrd - 2) * 2 + 1]! - pts[(aOrd - 1) * 2 + 1]!;
    a2x = d01x - a1x;
    a2y = d01y - a1y;
  }
  if (aOrd >= 3) {
    const d12x = pts[(aOrd - 3) * 2]! - pts[(aOrd - 2) * 2]!;
    const d12y = pts[(aOrd - 3) * 2 + 1]! - pts[(aOrd - 2) * 2 + 1]!;
    const d01x = pts[(aOrd - 2) * 2]! - pts[(aOrd - 1) * 2]!;
    const d01y = pts[(aOrd - 2) * 2 + 1]! - pts[(aOrd - 1) * 2 + 1]!;
    // a3 uses the a2 value BEFORE a2 *= 3
    a3x = d12x - d01x - a2x;
    a3y = d12y - d01y - a2y;
    a2x *= 3;
    a2y *= 3;
  }

  if (bOrd >= 1) {
    b1x = pts[8 + 2]! - cx;
    b1y = pts[8 + 3]! - cy;
  }
  if (bOrd >= 2) {
    const d12x = pts[8 + 4]! - pts[8 + 2]!;
    const d12y = pts[8 + 5]! - pts[8 + 3]!;
    b2x = d12x - b1x;
    b2y = d12y - b1y;
  }
  if (bOrd >= 3) {
    const d23x = pts[8 + 6]! - pts[8 + 4]!;
    const d23y = pts[8 + 7]! - pts[8 + 5]!;
    const d12x = pts[8 + 4]! - pts[8 + 2]!;
    const d12y = pts[8 + 5]! - pts[8 + 3]!;
    // b3 uses b2 BEFORE b2 *= 3
    b3x = d23x - d12x - b2x;
    b3y = d23y - d12y - b2y;
    b2x *= 3;
    b2y *= 3;
  }

  a1x *= aOrd;
  a1y *= aOrd;
  b1x *= bOrd;
  b1y *= bOrd;

  // ── ordering decision ──────────────────────────────────────────────────
  const a1nz = a1x !== 0 || a1y !== 0;
  const b1nz = b1x !== 0 || b1y !== 0;

  if (a1nz && b1nz) {
    const as_ = Math.sqrt(a1x * a1x + a1y * a1y);
    const bs_ = Math.sqrt(b1x * b1x + b1y * b1y);
    // Third derivative
    const d3 = as_ * cross(a1x, a1y, b2x, b2y) + bs_ * cross(a2x, a2y, b1x, b1y);
    if (d3) return sign(d3);
    // Fourth derivative
    const d4 =
      as_ * as_ * cross(a1x, a1y, b3x, b3y) +
      as_ * bs_ * cross(a2x, a2y, b2x, b2y) +
      bs_ * bs_ * cross(a3x, a3y, b1x, b1y);
    if (d4) return sign(d4);
    // Fifth derivative
    const d5 = as_ * cross(a2x, a2y, b3x, b3y) + bs_ * cross(a3x, a3y, b2x, b2y);
    if (d5) return sign(d5);
    // Sixth derivative
    return sign(cross(a3x, a3y, b3x, b3y));
  }

  // At least one first derivative is zero (degenerate curve at corner).
  // If prevEdge is non-degenerate but curEdge is, swap and negate result.
  let s = 1;
  // a1 isn't copied: after the swap below, `a` is the degenerate edge, whose
  // first derivative is zero and never read (same as the C++).
  let la2x = a2x,
    la2y = a2y,
    la3x = a3x,
    la3y = a3y;
  let lb1x = b1x,
    lb1y = b1y,
    lb2x = b2x,
    lb2y = b2y,
    lb3x = b3x,
    lb3y = b3y;

  if (a1nz) {
    // prevEdge non-degenerate, curEdge degenerate — swap
    la2x = b2x;
    la2y = b2y;
    la3x = b3x;
    la3y = b3y;
    lb1x = a1x;
    lb1y = a1y;
    lb2x = a2x;
    lb2y = a2y;
    lb3x = a3x;
    lb3y = a3y;
    s = -1;
  }

  if (lb1x !== 0 || lb1y !== 0) {
    // Degenerate "before" corner, non-degenerate "after".
    const d25 = cross(la3x, la3y, lb1x, lb1y);
    if (d25) return s * sign(d25);
    const d3 = cross(la2x, la2y, lb2x, lb2y);
    if (d3) return s * sign(d3);
    const d35 = cross(la3x, la3y, lb2x, lb2y);
    if (d35) return s * sign(d35);
    const d4 = cross(la2x, la2y, lb3x, lb3y);
    if (d4) return s * sign(d4);
    return s * sign(cross(la3x, la3y, lb3x, lb3y));
  }

  // Both degenerate.
  const lenA = Math.sqrt(la2x * la2x + la2y * la2y);
  const lenB = Math.sqrt(lb2x * lb2x + lb2y * lb2y);
  const d25 =
    Math.sqrt(lenA) * cross(la2x, la2y, lb3x, lb3y) +
    Math.sqrt(lenB) * cross(la3x, la3y, lb2x, lb2y);
  if (d25) return sign(d25);
  return sign(cross(la3x, la3y, lb3x, lb3y));
}

// ── deconvergeEdge ────────────────────────────────────────────────────────

/**
 * Nudges a control point of a cubic (converting quadratic first if needed) to
 * deconverge a near-anti-parallel junction.
 * port of core/Shape.cpp: deconvergeEdge (static)
 *
 * @param contour The contour owning the edge (mutated).
 * @param idx     Index of the edge in the contour.
 * @param param   0 = adjust near-start control point, 1 = adjust near-end.
 * @param vx      Adjustment direction x.
 * @param vy      Adjustment direction y.
 */
function deconvergeEdge(
  contour: Contour,
  idx: number,
  param: number,
  vx: number,
  vy: number,
): void {
  let seg = contour[idx]!;
  if (seg.type === QUADRATIC) {
    const cubic = seg.convertToCubic();
    contour[idx] = cubic;
    seg = cubic;
  }
  if (seg.type === CUBIC) {
    if (param === 0) {
      const len = Math.sqrt((seg.p1x - seg.p0x) ** 2 + (seg.p1y - seg.p0y) ** 2);
      seg.p1x += len * vx;
      seg.p1y += len * vy;
    } else {
      const len = Math.sqrt((seg.p2x - seg.p3x) ** 2 + (seg.p2y - seg.p3y) ** 2);
      seg.p2x += len * vx;
      seg.p2y += len * vy;
    }
  }
  // LINEAR: no inner control points — leave unchanged.
}

// ── normalizeShape ────────────────────────────────────────────────────────

/** Scratch direction vectors for normalizeShape — module-scope to avoid allocation. */
const _nsPrevDir: number[] = [0, 0];
const _nsCurDir: number[] = [0, 0];

/**
 * Normalizes the shape geometry for distance field generation (mutates in-place).
 *
 * Steps (in order):
 * 1. Remove zero-length segments (start == end) — these would produce NaN in
 *    distance code and are an artefact of some TrueType outlines.
 * 2. Split single-edge contours into three sub-segments (splitInThirds).
 * 3. Deconverge convergent junctions (near-anti-parallel adjacent edges).
 *
 * Must be called AFTER `emNormalizeShape`.
 * port of core/Shape.cpp: Shape::normalize()
 *
 * @param shape Shape to normalize (mutated in-place).
 */
export function normalizeShape(shape: Shape): void {
  // Step 1: remove zero-length segments.
  for (let ci = 0; ci < shape.contours.length; ci++) {
    const contour = shape.contours[ci]!;
    let out = 0;
    for (let i = 0; i < contour.length; i++) {
      const seg = contour[i]!;
      if (seg.p0x !== seg.endX() || seg.p0y !== seg.endY()) {
        contour[out++] = seg;
      }
    }
    contour.length = out;
  }

  for (const contour of shape.contours) {
    if (contour.length === 1) {
      // Single-edge contour: split into thirds so multi-channel generation works.
      const [p0, p1, p2] = contour[0]!.splitInThirds();
      contour.length = 0;
      contour.push(p0, p1, p2);
    } else if (contour.length > 0) {
      const n = contour.length;
      for (let i = 0; i < n; i++) {
        const prevIdx = (i + n - 1) % n;
        const prevEdge = contour[prevIdx]!;
        const curEdge = contour[i]!;

        prevEdge.direction(1, _nsPrevDir);
        curEdge.direction(0, _nsCurDir);

        const pLen = Math.sqrt(_nsPrevDir[0]! ** 2 + _nsPrevDir[1]! ** 2);
        const cLen = Math.sqrt(_nsCurDir[0]! ** 2 + _nsCurDir[1]! ** 2);
        if (pLen === 0 || cLen === 0) continue;

        const pdx = _nsPrevDir[0]! / pLen;
        const pdy = _nsPrevDir[1]! / pLen;
        const cdx = _nsCurDir[0]! / cLen;
        const cdy = _nsCurDir[1]! / cLen;

        // Convergent when dot(prevDir, curDir) < CORNER_DOT_EPSILON - 1 ≈ -0.999999
        if (dot(pdx, pdy, cdx, cdy) < CORNER_DOT_EPSILON - 1) {
          // factor = OVERSHOOT * sqrt(1 - (EPS-1)^2) / (EPS-1)
          const eps1 = CORNER_DOT_EPSILON - 1;
          const factor = (DECONVERGE_OVERSHOOT * Math.sqrt(1 - eps1 * eps1)) / eps1;
          // axis = factor * normalize(curDir - prevDir)
          let axisX = cdx - pdx;
          let axisY = cdy - pdy;
          const axisLen = Math.sqrt(axisX * axisX + axisY * axisY);
          if (axisLen === 0) continue;
          axisX = (factor * axisX) / axisLen;
          axisY = (factor * axisY) / axisLen;

          if (convergentCurveOrdering(prevEdge, curEdge) < 0) {
            axisX = -axisX;
            axisY = -axisY;
          }

          // prevEdge: near-end adjustment — orthogonal(true) = (-axisY, axisX)
          deconvergeEdge(contour, prevIdx, 1, -axisY, axisX);
          // curEdge: near-start adjustment — orthogonal(false) = (axisY, -axisX)
          deconvergeEdge(contour, i, 0, axisY, -axisX);
        }
      }
    }
  }
}
