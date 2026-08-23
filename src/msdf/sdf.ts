/**
 * Single-channel (true) signed distance field generation.
 *
 * Ported from core/msdfgen.cpp: generateSDF / generateDistanceField
 * (OverlappingContourCombiner<TrueDistanceSelector>) plus the CLI's scanline
 * sign correction (core/rasterization.cpp: distanceSignCorrection).
 *
 * The binary is built without Skia (NO_PREPROCESS), so overlapSupport=true and
 * the OverlappingContourCombiner is always used.  It tracks per-contour nearest
 * distances and applies winding-aware combination to handle overlapping contours
 * correctly.
 *
 * The shape must already be em-normalized and normalized (see
 * shape/normalize.ts).  Output is a flat Float32Array of length width*height,
 * stored y-up (row 0 = bottom) to match msdfgen's FL32 files.
 *
 * msdfgen © Viktor Chlumský — MIT licence.
 */

import { type Shape } from "../shape/shape";
import { type Contour } from "../shape/contour";
import { type SignedDistanceResult, signedDistanceLess } from "../shape/segments";
import { Scanline, computeShapeScanline, type FillRule, FILL_NONZERO } from "../shape/scanline";

/**
 * Parameters for {@link generateSDF}.  Mirror msdfgen's projection + range:
 * a pixel `(x,y)` maps to shape space via
 * `((x+0.5)/scale - tx, (y+0.5)/scale - ty)`, and a signed distance `d`
 * (shape units) maps to the stored value `d/rangeWidth + 0.5`, where
 * `rangeWidth = pxrange/scale`.
 */
export interface SdfParams {
  /** Output width in texels. */
  width: number;
  /** Output height in texels. */
  height: number;
  /** Uniform projection scale (msdfgen `-scale`). */
  scale: number;
  /** Projection translation x (msdfgen `-translate` x). */
  tx: number;
  /** Projection translation y (msdfgen `-translate` y). */
  ty: number;
  /** Distance range in pixels (msdfgen `-pxrange`). */
  pxrange: number;
  /** Fill rule for the scanline sign-correction pass. Default FILL_NONZERO. */
  fillRule?: FillRule;
  /** Whether to run the scanline sign-correction pass. Default true. */
  scanline?: boolean;
}

/** Reusable per-edge signed-distance result (module-scope, single-threaded). */
const _sd: SignedDistanceResult = { distance: 0, dot: 0, param: 0 };

/** Scratch point output for _contourWinding (module-scope, single-threaded). */
const _pt: number[] = [0, 0];

/**
 * Computes the winding of a contour.
 * port of core/Contour.cpp: Contour::winding()
 *
 * Returns +1 for CCW (outer, filled area), -1 for CW (inner/hole), 0 for empty.
 */
function _contourWinding(contour: Contour): number {
  const n = contour.length;
  if (n === 0) return 0;
  let total = 0;

  if (n === 1) {
    const e = contour[0]!;
    e.point(0, _pt);
    const ax = _pt[0]!,
      ay = _pt[1]!;
    e.point(1 / 3, _pt);
    const bx = _pt[0]!,
      by = _pt[1]!;
    e.point(2 / 3, _pt);
    const cx = _pt[0]!,
      cy = _pt[1]!;
    total += ax * by - ay * bx;
    total += bx * cy - by * cx;
    total += cx * ay - cy * ax;
  } else if (n === 2) {
    const e0 = contour[0]!,
      e1 = contour[1]!;
    e0.point(0, _pt);
    const ax = _pt[0]!,
      ay = _pt[1]!;
    e0.point(0.5, _pt);
    const bx = _pt[0]!,
      by = _pt[1]!;
    e1.point(0, _pt);
    const cx = _pt[0]!,
      cy = _pt[1]!;
    e1.point(0.5, _pt);
    const dx = _pt[0]!,
      dy = _pt[1]!;
    total += ax * by - ay * bx;
    total += bx * cy - by * cx;
    total += cx * dy - cy * dx;
    total += dx * ay - dy * ax;
  } else {
    // General case: shoelace over start points of each edge.
    // Start from the last edge's start point (wraps around).
    const last = contour[n - 1]!;
    let prevX = last.p0x,
      prevY = last.p0y;
    for (let i = 0; i < n; i++) {
      const curX = contour[i]!.p0x,
        curY = contour[i]!.p0y;
      total += prevX * curY - prevY * curX;
      prevX = curX;
      prevY = curY;
    }
  }

  // NOTE: C++ Contour::winding() uses shoelace(a,b)=(b.x-a.x)*(a.y+b.y) which
  // gives the NEGATED sum compared to cross-product style. So CCW outer contours
  // have total > 0 here but yield winding=-1 in C++ (and +1 for CW holes).
  return total > 0 ? -1 : total < 0 ? 1 : 0;
}

/**
 * OverlappingContourCombiner::distance() logic for TrueDistanceSelector.
 * port of core/contour-combiners.cpp: OverlappingContourCombiner::distance()
 *
 * Given per-contour nearest signed distances (with dot tiebreakers) and
 * per-contour windings, returns the combined signed distance for the pixel.
 *
 * @param windings  Per-contour winding (+1 outer / -1 inner / 0 empty).
 * @param cDist     Per-contour nearest signed distance (scalar).
 * @param cDot      Per-contour nearest dot tiebreaker (for equal-abs merges).
 * @param nc        Number of contours.
 */
function _overlapCombine(
  windings: Int32Array,
  cDist: Float64Array,
  cDot: Float64Array,
  nc: number,
): number {
  // shapeEdgeSelector: min-abs over ALL contours.
  let shapeDist = -Infinity,
    shapeDot = 0;
  // innerEdgeSelector: min-abs from positive-winding contours with dist >= 0.
  let innerDist = -Infinity,
    innerDot = 0;
  // outerEdgeSelector: min-abs from negative-winding contours with dist <= 0.
  let outerDist = -Infinity,
    outerDot = 0;

  for (let i = 0; i < nc; i++) {
    const d = cDist[i]!,
      dot = cDot[i]!;
    if (signedDistanceLess(d, dot, shapeDist, shapeDot)) {
      shapeDist = d;
      shapeDot = dot;
    }
    const w = windings[i]!;
    if (w > 0 && d >= 0 && signedDistanceLess(d, dot, innerDist, innerDot)) {
      innerDist = d;
      innerDot = dot;
    }
    if (w < 0 && d <= 0 && signedDistanceLess(d, dot, outerDist, outerDot)) {
      outerDist = d;
      outerDot = dot;
    }
  }

  // Unused after merge — kept only to silence unused-variable lint.
  void shapeDot;
  void innerDot;
  void outerDot;

  let distance = -Infinity;
  let winding = 0;

  if (innerDist >= 0 && Math.abs(innerDist) <= Math.abs(outerDist)) {
    // Point is inside (or on boundary of) a positive-winding contour and that
    // is closer than any hole.  Find the most-positive dist among positive
    // contours that is still closer (in absolute value) than the nearest hole.
    distance = innerDist;
    winding = 1;
    for (let i = 0; i < nc; i++) {
      if (windings[i]! > 0) {
        const d = cDist[i]!;
        if (Math.abs(d) < Math.abs(outerDist) && d > distance) distance = d;
      }
    }
  } else if (outerDist <= 0 && Math.abs(outerDist) < Math.abs(innerDist)) {
    // Point is inside a hole.  Find the most-negative dist among negative
    // contours that is still closer than any positive fill region.
    distance = outerDist;
    winding = -1;
    for (let i = 0; i < nc; i++) {
      if (windings[i]! < 0) {
        const d = cDist[i]!;
        if (Math.abs(d) < Math.abs(innerDist) && d < distance) distance = d;
      }
    }
  } else {
    // Neither clearly inside a fill nor a hole — return the global nearest.
    return shapeDist;
  }

  // Blend in contours of opposite winding if they are closer and same-signed.
  for (let i = 0; i < nc; i++) {
    if (windings[i]! !== winding) {
      const d = cDist[i]!;
      if (d * distance >= 0 && Math.abs(d) < Math.abs(distance)) distance = d;
    }
  }

  // If the result equals the global shape distance, prefer shapeDist (which
  // carries the correct dot tiebreaker from the globally nearest edge).
  if (distance === shapeDist) return shapeDist;
  return distance;
}

/**
 * Generates a single-channel true SDF into `out`.
 *
 * @param shape Em-normalized, normalized shape (y-up font coordinates).
 * @param params Projection + range parameters.
 * @param out Destination Float32Array of length width*height (mutated).
 */
export function generateSDF(shape: Shape, params: SdfParams, out: Float32Array): void {
  const { width, height, scale, tx, ty, pxrange } = params;
  const fillRule = params.fillRule ?? FILL_NONZERO;
  const doScanline = params.scanline ?? true;

  if (out.length !== width * height) {
    throw new Error(`generateSDF: out length ${out.length} != ${width}*${height}`);
  }

  // DistanceMapping for a symmetric range [-w/2, w/2] in shape units.
  const rangeWidth = pxrange / scale;
  const invRange = 1 / rangeWidth;

  // Pre-compute contour windings (constant for the whole image).
  const contours = shape.contours;
  const nc = contours.length;
  const _windings = new Int32Array(nc);
  for (let ci = 0; ci < nc; ci++) _windings[ci] = _contourWinding(contours[ci]!);

  // Per-pixel work arrays (reused across pixels).
  const _cDist = new Float64Array(nc);
  const _cDot = new Float64Array(nc);

  for (let y = 0; y < height; y++) {
    const py = (y + 0.5) / scale - ty;
    for (let x = 0; x < width; x++) {
      const px = (x + 0.5) / scale - tx;

      // Per-contour nearest signed distance (TrueDistanceSelector per contour).
      for (let ci = 0; ci < nc; ci++) {
        const contour = contours[ci]!;
        let minDist = -Infinity,
          minDot = 0;
        for (let ei = 0; ei < contour.length; ei++) {
          contour[ei]!.signedDistance(px, py, _sd);
          if (signedDistanceLess(_sd.distance, _sd.dot, minDist, minDot)) {
            minDist = _sd.distance;
            minDot = _sd.dot;
          }
        }
        _cDist[ci] = minDist;
        _cDot[ci] = minDot;
      }

      // Combine per-contour distances using OverlappingContourCombiner logic.
      out[y * width + x] = _overlapCombine(_windings, _cDist, _cDot, nc) * invRange + 0.5;
    }
  }

  if (doScanline) _signCorrection(shape, params, out, fillRule);
}

/**
 * Corrects distance-field signs using a scanline fill test.
 * port of core/rasterization.cpp: distanceSignCorrection (1-channel)
 *
 * sdfZeroValue is 0.5 for the symmetric range; a texel whose sign disagrees
 * with the scanline fill test is reflected about 0.5.
 *
 * @param shape Shape being rasterized (y-up).
 * @param params Projection + range parameters.
 * @param out SDF buffer (mutated in place).
 * @param fillRule Fill rule for the scanline test.
 */
function _signCorrection(
  shape: Shape,
  params: SdfParams,
  out: Float32Array,
  fillRule: FillRule,
): void {
  const { width, height, scale, tx, ty } = params;
  const scanline = new Scanline();
  for (let y = 0; y < height; y++) {
    const py = (y + 0.5) / scale - ty;
    computeShapeScanline(shape, py, scanline);
    for (let x = 0; x < width; x++) {
      const px = (x + 0.5) / scale - tx;
      const fill = scanline.filled(px, fillRule);
      const i = y * width + x;
      const sd = out[i]!;
      if (sd > 0.5 !== fill) out[i] = 1 - sd;
    }
  }
}
