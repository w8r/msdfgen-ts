/**
 * MSDF post-processing: scanline sign correction and error correction.
 *
 * Ports the two post-processing steps that the msdfgen CLI applies when
 * `-scanline` is used:
 *
 *  1. `distanceSignCorrection` (multiDistanceSignCorrection in rasterization.cpp):
 *     Flips all three channels of texels whose median is on the wrong side of 0.5
 *     relative to the scanline fill test.
 *
 *  2. `msdfErrorCorrection` / `MSDFErrorCorrection` (MSDFErrorCorrection.cpp):
 *     Detects interpolation artifacts and sets their channels to the median.
 *
 * With `-scanline`, the CLI uses:
 *   - errorCorrection.mode = EDGE_PRIORITY
 *   - errorCorrection.distanceCheckMode = DO_NOT_CHECK_DISTANCE
 * so the sequence is: protectCorners → protectEdges → findErrors → apply.
 *
 * msdfgen © Viktor Chlumský — MIT licence.
 */

import { type Shape } from "../shape/shape.js";
import { Scanline, computeShapeScanline, FILL_NONZERO } from "../shape/scanline.js";
import { RED, GREEN, BLUE } from "./edge-coloring.js";

// ── Constants ─────────────────────────────────────────────────────────────────

const PROTECTED = 2;
const ERROR = 1;
const PROTECTION_RADIUS_TOLERANCE = 1.001;
const DEFAULT_MIN_DEVIATION_RATIO = 1.11111111111111111;
const ARTIFACT_T_EPSILON = 0.01;

// ── Scanline sign correction ──────────────────────────────────────────────────

/**
 * Corrects the signs of MSDF channels via a scanline fill test.
 *
 * Texels whose median is on the wrong side of 0.5 relative to the scanline fill
 * have all three channels flipped: `ch = 1 - ch`.
 * Ambiguous texels (median exactly 0.5) are resolved by looking at neighbours.
 *
 * port of core/rasterization.cpp: multiDistanceSignCorrection (template N=3)
 *
 * @param msdf Float32Array of length width*height*3, mutated in place.
 * @param shape Normalized shape (y-up).
 * @param width Bitmap width.
 * @param height Bitmap height.
 * @param scale Projection scale.
 * @param tx Projection translate x.
 * @param ty Projection translate y.
 */
export function distanceSignCorrection(
  msdf: Float32Array,
  shape: Shape,
  width: number,
  height: number,
  scale: number,
  tx: number,
  ty: number,
): void {
  if (width === 0 || height === 0) return;

  const scanline = new Scanline();
  const matchMap = new Int8Array(width * height); // 0=ambiguous, +1=match, -1=inverted

  for (let y = 0; y < height; y++) {
    const sy = (y + 0.5) / scale - ty; // shape y at texel centre
    computeShapeScanline(shape, sy, scanline);
    for (let x = 0; x < width; x++) {
      const sx = (x + 0.5) / scale - tx;
      const fill = scanline.filled(sx, FILL_NONZERO);
      const base = (y * width + x) * 3;
      const r = msdf[base]!, g = msdf[base + 1]!, b = msdf[base + 2]!;
      const med = _median(r, g, b);
      const mapIdx = y * width + x;
      if (med === 0.5) {
        matchMap[mapIdx] = 0; // ambiguous
      } else if ((med > 0.5) !== fill) {
        // Wrong side — invert all channels.
        msdf[base]     = 1 - r;
        msdf[base + 1] = 1 - g;
        msdf[base + 2] = 1 - b;
        matchMap[mapIdx] = -1;
      } else {
        matchMap[mapIdx] = 1;
      }
    }
  }

  // Resolve ambiguous texels by neighbour voting (for fully-inverted shapes).
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const mapIdx = y * width + x;
      if (matchMap[mapIdx] !== 0) continue;
      let vote = 0;
      if (x > 0)           vote += matchMap[mapIdx - 1]!;
      if (x < width - 1)   vote += matchMap[mapIdx + 1]!;
      if (y > 0)           vote += matchMap[mapIdx - width]!;
      if (y < height - 1)  vote += matchMap[mapIdx + width]!;
      if (vote < 0) {
        const base = (y * width + x) * 3;
        msdf[base]     = 1 - msdf[base]!;
        msdf[base + 1] = 1 - msdf[base + 1]!;
        msdf[base + 2] = 1 - msdf[base + 2]!;
      }
    }
  }
}

// ── Error correction ──────────────────────────────────────────────────────────

/** Scratch point array. */
const _ept: number[] = [0, 0];

/**
 * Marks corners as protected, detects MSDF artifacts and fixes them.
 *
 * Exactly matches the `-scanline` pipeline (mode=EDGE_PRIORITY,
 * distanceCheckMode=DO_NOT_CHECK_DISTANCE):
 *   1. protectCorners(shape)
 *   2. protectEdges(msdf)
 *   3. findErrors(msdf)  [base classifier only — no shape distance check]
 *   4. apply(msdf)       [errored texels → median]
 *
 * port of core/MSDFErrorCorrection.cpp: MSDFErrorCorrection + msdf-error-correction.cpp
 *
 * @param msdf Float32Array of length width*height*3, mutated in place.
 * @param shape Normalized, coloured shape.
 * @param width Bitmap width.
 * @param height Bitmap height.
 * @param scale Projection scale.
 * @param tx Projection translate x.
 * @param ty Projection translate y.
 * @param pxrange Distance range in pixels.
 */
export function msdfErrorCorrection(
  msdf: Float32Array,
  shape: Shape,
  width: number,
  height: number,
  scale: number,
  tx: number,
  ty: number,
  pxrange: number,
): void {
  // Allocate stencil (0 = clear, ERROR=1, PROTECTED=2).
  const stencil = new Uint8Array(width * height);

  // 1. protectCorners
  _protectCorners(stencil, shape, width, height, scale, tx, ty);

  // 2. protectEdges
  _protectEdges(stencil, msdf, width, height, scale, pxrange);

  // 3. findErrors (base classifier — DO_NOT_CHECK_DISTANCE path)
  _findErrors(stencil, msdf, width, height, pxrange, DEFAULT_MIN_DEVIATION_RATIO);

  // 4. apply
  _apply(stencil, msdf, width, height);
}

// ── Step 1: protectCorners ────────────────────────────────────────────────────

/**
 * port of MSDFErrorCorrection::protectCorners
 * Marks the 4 texels surrounding each corner as PROTECTED.
 * A corner is where adjacent edges share at most 1 common color bit.
 */
function _protectCorners(
  stencil: Uint8Array,
  shape: Shape,
  width: number,
  height: number,
  scale: number,
  tx: number,
  ty: number,
): void {
  for (const contour of shape.contours) {
    if (contour.length === 0) continue;
    let prevEdge = contour[contour.length - 1]!;
    for (const edge of contour) {
      const common = prevEdge.color & edge.color;
      // Corner: at most 1 common color bit (NOT (color & (color-1)) means only 0 or 1 bit set).
      if (!(common & (common - 1))) {
        // corner at edge.point(0)
        edge.point(0, _ept);
        // project: px_f = scale * (shapeX + tx), py_f = scale * (shapeY + ty)
        const pxf = scale * (_ept[0]! + tx);
        const pyf = scale * (_ept[1]! + ty);
        const l = Math.floor(pxf - 0.5) | 0;
        const b = Math.floor(pyf - 0.5) | 0;
        const r = l + 1;
        const t = b + 1;
        if (l < width && b < height && r >= 0 && t >= 0) {
          if (l >= 0 && b >= 0) stencil[b * width + l]! |= PROTECTED;
          if (r < width && b >= 0) stencil[b * width + r]! |= PROTECTED;
          if (l >= 0 && t < height) stencil[t * width + l]! |= PROTECTED;
          if (r < width && t < height) stencil[t * width + r]! |= PROTECTED;
        }
      }
      prevEdge = edge;
    }
  }
}

// ── Step 2: protectEdges ──────────────────────────────────────────────────────

/**
 * Returns which channels (R/G/B bitmask) form an edge between two texels.
 * port of MSDFErrorCorrection.cpp: edgeBetweenTexels
 */
function _edgeBetweenTexels(msdf: Float32Array, aBase: number, bBase: number): number {
  let mask = 0;
  for (let ch = 0; ch < 3; ch++) {
    const a = msdf[aBase + ch]!, b = msdf[bBase + ch]!;
    // t where mix(a,b,t) == 0.5
    const ab = a - b;
    if (ab === 0) continue;
    const t = (a - 0.5) / ab;
    if (t > 0 && t < 1) {
      // Interpolate at t using (1-t)*a + t*b (matches C++ mix() — not a+t*(b-a), which differs for ±Inf).
      const t1 = 1 - t;
      const r = t1 * msdf[aBase]! + t * msdf[bBase]!;
      const g = t1 * msdf[aBase + 1]! + t * msdf[bBase + 1]!;
      const b3 = t1 * msdf[aBase + 2]! + t * msdf[bBase + 2]!;
      const interp = ch === 0 ? r : ch === 1 ? g : b3;
      if (_median(r, g, b3) === interp) {
        mask |= ch === 0 ? RED : ch === 1 ? GREEN : BLUE;
      }
    }
  }
  return mask;
}

/**
 * Marks a texel as PROTECTED if one of its non-median channels is in the mask.
 * port of MSDFErrorCorrection.cpp: protectExtremeChannels
 */
function _protectExtremeChannels(
  stencil: Uint8Array,
  idx: number,
  msdf: Float32Array,
  base: number,
  m: number,
  mask: number,
): void {
  if (
    ((mask & RED) && msdf[base]! !== m) ||
    ((mask & GREEN) && msdf[base + 1]! !== m) ||
    ((mask & BLUE) && msdf[base + 2]! !== m)
  ) {
    stencil[idx]! |= PROTECTED;
  }
}

/**
 * port of MSDFErrorCorrection::protectEdges (N=3)
 * Protection radius = PROTECTION_RADIUS_TOLERANCE / pxrange (horizontal/vertical)
 *                   = PROTECTION_RADIUS_TOLERANCE * sqrt(2) / pxrange (diagonal)
 */
function _protectEdges(
  stencil: Uint8Array,
  msdf: Float32Array,
  width: number,
  height: number,
  scale: number,
  pxrange: number,
): void {
  // invRange = scale/pxrange; unprojectVector({invRange,0}) = {invRange/scale,0} = {1/pxrange,0}
  const hRadius = PROTECTION_RADIUS_TOLERANCE / pxrange;
  const vRadius = PROTECTION_RADIUS_TOLERANCE / pxrange;
  const dRadius = PROTECTION_RADIUS_TOLERANCE * Math.SQRT2 / pxrange;

  // Horizontal pairs.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width - 1; x++) {
      const lBase = (y * width + x) * 3;
      const rBase = lBase + 3;
      const lm = _median(msdf[lBase]!, msdf[lBase + 1]!, msdf[lBase + 2]!);
      const rm = _median(msdf[rBase]!, msdf[rBase + 1]!, msdf[rBase + 2]!);
      if (Math.abs(lm - 0.5) + Math.abs(rm - 0.5) < hRadius) {
        const mask = _edgeBetweenTexels(msdf, lBase, rBase);
        _protectExtremeChannels(stencil, y * width + x, msdf, lBase, lm, mask);
        _protectExtremeChannels(stencil, y * width + x + 1, msdf, rBase, rm, mask);
      }
    }
  }

  // Vertical pairs.
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width; x++) {
      const bBase = (y * width + x) * 3;
      const tBase = ((y + 1) * width + x) * 3;
      const bm = _median(msdf[bBase]!, msdf[bBase + 1]!, msdf[bBase + 2]!);
      const tm = _median(msdf[tBase]!, msdf[tBase + 1]!, msdf[tBase + 2]!);
      if (Math.abs(bm - 0.5) + Math.abs(tm - 0.5) < vRadius) {
        const mask = _edgeBetweenTexels(msdf, bBase, tBase);
        _protectExtremeChannels(stencil, y * width + x, msdf, bBase, bm, mask);
        _protectExtremeChannels(stencil, (y + 1) * width + x, msdf, tBase, tm, mask);
      }
    }
  }

  // Diagonal pairs.
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const lbBase = (y * width + x) * 3;
      const rbBase = (y * width + x + 1) * 3;
      const ltBase = ((y + 1) * width + x) * 3;
      const rtBase = ((y + 1) * width + x + 1) * 3;
      const mlb = _median(msdf[lbBase]!, msdf[lbBase + 1]!, msdf[lbBase + 2]!);
      const mrb = _median(msdf[rbBase]!, msdf[rbBase + 1]!, msdf[rbBase + 2]!);
      const mlt = _median(msdf[ltBase]!, msdf[ltBase + 1]!, msdf[ltBase + 2]!);
      const mrt = _median(msdf[rtBase]!, msdf[rtBase + 1]!, msdf[rtBase + 2]!);

      // lb ↔ rt diagonal
      if (Math.abs(mlb - 0.5) + Math.abs(mrt - 0.5) < dRadius) {
        const mask = _edgeBetweenTexels(msdf, lbBase, rtBase);
        _protectExtremeChannels(stencil, y * width + x, msdf, lbBase, mlb, mask);
        _protectExtremeChannels(stencil, (y + 1) * width + x + 1, msdf, rtBase, mrt, mask);
      }

      // rb ↔ lt diagonal
      if (Math.abs(mrb - 0.5) + Math.abs(mlt - 0.5) < dRadius) {
        const mask = _edgeBetweenTexels(msdf, rbBase, ltBase);
        _protectExtremeChannels(stencil, y * width + x + 1, msdf, rbBase, mrb, mask);
        _protectExtremeChannels(stencil, (y + 1) * width + x, msdf, ltBase, mlt, mask);
      }
    }
  }
}

// ── Step 3: findErrors ────────────────────────────────────────────────────────

/**
 * Median matching C++ msdfgen custom min/max:
 *   min(a, b) = b < a ? b : a
 *   max(a, b) = a < b ? b : a
 * NaN semantics (NaN comparisons always return false):
 *   min(NaN, x) = NaN  (propagates when NaN is first arg)
 *   min(x, NaN) = x   (does not propagate when NaN is second arg)
 *   max(NaN, x) = NaN  (propagates when NaN is first arg)
 *   max(x, NaN) = x   (does not propagate when NaN is second arg)
 * Result: median(NaN, b, c) = NaN; median(a, NaN, c) = a; median(a, b, NaN) = max(a,b)
 */
function _medianCpp(a: number, b: number, c: number): number {
  const minAB = (b < a) ? b : a;           // msdfgen min(a,b)
  const maxAB = (a < b) ? b : a;           // msdfgen max(a,b)
  const minMaxABc = (c < maxAB) ? c : maxAB;  // msdfgen min(maxAB, c)
  return (minAB < minMaxABc) ? minMaxABc : minAB;  // msdfgen max(minAB, minMaxABc)
}

/**
 * Median of the linear interpolation of two RGB texels at t.
 * port of MSDFErrorCorrection.cpp: interpolatedMedian(a, b, t)
 */
function _interpMedian(msdf: Float32Array, aBase: number, bBase: number, t: number): number {
  return _median(
    msdf[aBase]! + t * (msdf[bBase]! - msdf[aBase]!),
    msdf[aBase + 1]! + t * (msdf[bBase + 1]! - msdf[aBase + 1]!),
    msdf[aBase + 2]! + t * (msdf[bBase + 2]! - msdf[aBase + 2]!),
  );
}

/**
 * Median of a+l*t+q*t^2 for the three channels.
 * port of MSDFErrorCorrection.cpp: interpolatedMedian(a,l,q,t)
 * Uses C++ float32 cast per channel and C++ NaN-order median semantics.
 */
function _bilinearMedian(a: number[], l: number[], q: number[], t: number): number {
  return _medianCpp(
    Math.fround(t * (t * q[0]! + l[0]!) + a[0]!),
    Math.fround(t * (t * q[1]! + l[1]!) + a[1]!),
    Math.fround(t * (t * q[2]! + l[2]!) + a[2]!),
  );
}

/** Scratch arrays for diagonal artifact checking. */
const _lArr: number[] = [0, 0, 0];
const _qArr: number[] = [0, 0, 0];
const _abcArr: number[] = [0, 0, 0];
const _aArr: number[] = [0, 0, 0];

/**
 * Base artifact classifier: checks if an interpolated median deviates too far
 * from what linear interpolation suggests.
 * port of MSDFErrorCorrection.cpp: BaseArtifactClassifier
 */

/** rangeTest result flags. */
const FLAG_CANDIDATE = 0x01;
const FLAG_ARTIFACT = 0x02;

function _rangeTest(
  at: number, bt: number, xt: number,
  am: number, bm: number, xm: number,
  span: number,
  protectedFlag: boolean,
): number {
  if (
    (am > 0.5 && bm > 0.5 && xm <= 0.5) ||
    (am < 0.5 && bm < 0.5 && xm >= 0.5) ||
    (!protectedFlag && _median3f(am, bm, xm) !== xm)
  ) {
    const axSpan = (xt - at) * span;
    const bxSpan = (bt - xt) * span;
    if (!(xm >= am - axSpan && xm <= am + axSpan && xm >= bm - bxSpan && xm <= bm + bxSpan)) {
      return FLAG_CANDIDATE | FLAG_ARTIFACT;
    }
    return FLAG_CANDIDATE;
  }
  return 0;
}

function _evaluateBase(flags: number): boolean {
  return (flags & FLAG_ARTIFACT) !== 0;
}

/** median of three floats (alias for readability). */
function _median3f(a: number, b: number, c: number): number {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
}

/**
 * Returns true if a linear artifact exists between adjacent texels a, b.
 * port of MSDFErrorCorrection.cpp: hasLinearArtifact
 */
function _hasLinearArtifact(
  msdf: Float32Array,
  aBase: number, bBase: number,
  am: number,
  span: number,
  protectedFlag: boolean,
): boolean {
  const bm = _median(msdf[bBase]!, msdf[bBase + 1]!, msdf[bBase + 2]!);
  if (Math.abs(am - 0.5) < Math.abs(bm - 0.5)) return false; // only flag the farther texel

  // Check 3 channel pairs: (r,g), (g,b), (b,r).
  for (let i = 0; i < 3; i++) {
    const dA = msdf[aBase + i]! - msdf[aBase + (i + 1) % 3]!;
    const dB = msdf[bBase + i]! - msdf[bBase + (i + 1) % 3]!;
    const denom = dA - dB;
    if (denom === 0) continue;
    const t = dA / denom;
    if (t > ARTIFACT_T_EPSILON && t < 1 - ARTIFACT_T_EPSILON) {
      const xm = _interpMedian(msdf, aBase, bBase, t);
      const flags = _rangeTest(0, 1, t, am, bm, xm, span, protectedFlag);
      if (_evaluateBase(flags)) return true;
    }
  }
  return false;
}

/**
 * Returns true if a diagonal artifact exists between texels a, d (with b, c as the other two corners).
 * port of MSDFErrorCorrection.cpp: hasDiagonalArtifact
 */
function _hasDiagonalArtifact(
  msdf: Float32Array,
  aBase: number, bBase: number, cBase: number, dBase: number,
  am: number,
  span: number,
  protectedFlag: boolean,
): boolean {
  const dm = _median(msdf[dBase]!, msdf[dBase + 1]!, msdf[dBase + 2]!);
  if (Math.abs(am - 0.5) < Math.abs(dm - 0.5)) return false;

  // Compute bilinear coefficients in float32 (matching C++ float arithmetic).
  for (let ch = 0; ch < 3; ch++) {
    _abcArr[ch] = Math.fround(Math.fround(msdf[aBase + ch]! - msdf[bBase + ch]!) - msdf[cBase + ch]!);
    _lArr[ch]   = Math.fround(-msdf[aBase + ch]! - _abcArr[ch]!);
    _qArr[ch]   = Math.fround(msdf[dBase + ch]! + _abcArr[ch]!);
  }

  // Local extremes tEx[i] = -0.5 * l[i] / q[i]
  const tEx0 = _qArr[0]! !== 0 ? -0.5 * _lArr[0]! / _qArr[0]! : -1;
  const tEx1 = _qArr[1]! !== 0 ? -0.5 * _lArr[1]! / _qArr[1]! : -1;
  const tEx2 = _qArr[2]! !== 0 ? -0.5 * _lArr[2]! / _qArr[2]! : -1;

  // Check 3 channel-pair intersections.
  // Pair (ch0, ch1): solve (d-bc+a)*t^2 + (bc-a-a)*t + a == 0 where a=dA, bc=dBC, d=dD
  const channelPairs = [[0, 1, tEx0, tEx1], [1, 2, tEx1, tEx2], [2, 0, tEx2, tEx0]] as const;
  for (const [ch0, ch1, tex0, tex1] of channelPairs) {
    // Compute dA, dBC, dD in float32 (matching C++ float arithmetic).
    const dA  = Math.fround(msdf[aBase + ch0]! - msdf[aBase + ch1]!);
    const dBC = Math.fround(Math.fround(msdf[bBase + ch0]! - msdf[bBase + ch1]!) + Math.fround(msdf[cBase + ch0]! - msdf[cBase + ch1]!));
    const dD  = Math.fround(msdf[dBase + ch0]! - msdf[dBase + ch1]!);
    // Compute quadratic coefficients in float32, then as float64 (matching C++ solveQuadratic call).
    const qCoeff = Math.fround(Math.fround(dD - dBC) + dA);
    const lCoeff = Math.fround(Math.fround(dBC - dA) - dA);
    const aCoeff = dA;

    // Solve quadratic: qCoeff*t^2 + lCoeff*t + aCoeff = 0
    // Threshold matches C++ solveQuadratic: a==0 || fabs(b)>1e12*fabs(a)
    const solutions: number[] = [];
    if (qCoeff === 0 || Math.abs(lCoeff) > 1e12 * Math.abs(qCoeff)) {
      if (lCoeff !== 0) solutions.push(-aCoeff / lCoeff);
    } else {
      const disc = lCoeff * lCoeff - 4 * qCoeff * aCoeff;
      if (disc > 0) {
        const sq = Math.sqrt(disc);
        solutions.push((-lCoeff + sq) / (2 * qCoeff));
        solutions.push((-lCoeff - sq) / (2 * qCoeff));
      } else if (disc === 0) {
        solutions.push(-lCoeff / (2 * qCoeff));
      }
    }

  for (const t of solutions) {
      if (!(t > ARTIFACT_T_EPSILON && t < 1 - ARTIFACT_T_EPSILON)) continue;
      _aArr[0] = msdf[aBase]!; _aArr[1] = msdf[aBase + 1]!; _aArr[2] = msdf[aBase + 2]!;
      const xm = _bilinearMedian(_aArr, _lArr, _qArr, t);
      let flags = _rangeTest(0, 1, t, am, dm, xm, span, protectedFlag);

      // Check against local extremes.
      for (const tEx of [tex0, tex1]) {
        if (tEx > 0 && tEx < 1) {
          const tEnd0 = tEx > t ? 0 : tEx;
          const tEnd1 = tEx > t ? tEx : 1;
          _aArr[0] = msdf[aBase]!; _aArr[1] = msdf[aBase + 1]!; _aArr[2] = msdf[aBase + 2]!;
          const em0 = tEx > t ? am : _bilinearMedian(_aArr, _lArr, _qArr, tEx);
          _aArr[0] = msdf[aBase]!; _aArr[1] = msdf[aBase + 1]!; _aArr[2] = msdf[aBase + 2]!;
          const em1 = tEx > t ? _bilinearMedian(_aArr, _lArr, _qArr, tEx) : dm;
          flags |= _rangeTest(tEnd0, tEnd1, t, em0, em1, xm, span, protectedFlag);
        }
      }

      if (_evaluateBase(flags)) return true;
    }
  }
  return false;
}

/**
 * port of MSDFErrorCorrection::findErrors (N=3, base classifier only)
 * Marks texels with linear/diagonal artifacts as ERROR.
 */
function _findErrors(
  stencil: Uint8Array,
  msdf: Float32Array,
  width: number,
  height: number,
  pxrange: number,
  minDeviationRatio: number,
): void {
  // Spans: hSpan = vSpan = minDeviationRatio / pxrange, dSpan = minDeviationRatio * sqrt(2) / pxrange
  const hSpan = minDeviationRatio / pxrange;
  const vSpan = minDeviationRatio / pxrange;
  const dSpan = minDeviationRatio * Math.SQRT2 / pxrange;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const cBase = idx * 3;
      const cm = _median(msdf[cBase]!, msdf[cBase + 1]!, msdf[cBase + 2]!);
      const prot = (stencil[idx]! & PROTECTED) !== 0;

      const hasL = x > 0;
      const hasR = x < width - 1;
      const hasB = y > 0;
      const hasT = y < height - 1;

      const lBase = hasL ? (idx - 1) * 3 : -1;
      const rBase = hasR ? (idx + 1) * 3 : -1;
      const bBase = hasB ? (idx - width) * 3 : -1;
      const tBase = hasT ? (idx + width) * 3 : -1;

      let artifact = false;
      if (hasL && _hasLinearArtifact(msdf, cBase, lBase, cm, hSpan, prot)) artifact = true;
      if (!artifact && hasB && _hasLinearArtifact(msdf, cBase, bBase, cm, vSpan, prot)) artifact = true;
      if (!artifact && hasR && _hasLinearArtifact(msdf, cBase, rBase, cm, hSpan, prot)) artifact = true;
      if (!artifact && hasT && _hasLinearArtifact(msdf, cBase, tBase, cm, vSpan, prot)) artifact = true;
      if (!artifact && hasL && hasB) {
        const lbBase = (idx - width - 1) * 3;
        if (_hasDiagonalArtifact(msdf, cBase, lBase, bBase, lbBase, cm, dSpan, prot)) artifact = true;
      }
      if (!artifact && hasR && hasB) {
        const rbBase = (idx - width + 1) * 3;
        if (_hasDiagonalArtifact(msdf, cBase, rBase, bBase, rbBase, cm, dSpan, prot)) artifact = true;
      }
      if (!artifact && hasL && hasT) {
        const ltBase = (idx + width - 1) * 3;
        if (_hasDiagonalArtifact(msdf, cBase, lBase, tBase, ltBase, cm, dSpan, prot)) artifact = true;
      }
      if (!artifact && hasR && hasT) {
        const rtBase = (idx + width + 1) * 3;
        if (_hasDiagonalArtifact(msdf, cBase, rBase, tBase, rtBase, cm, dSpan, prot)) artifact = true;
      }

      if (artifact) stencil[idx]! |= ERROR;
    }
  }
}

// ── Step 4: apply ─────────────────────────────────────────────────────────────

/**
 * port of MSDFErrorCorrection::apply (N=3)
 * Sets all channels of ERROR-flagged texels to their median.
 */
function _apply(stencil: Uint8Array, msdf: Float32Array, width: number, height: number): void {
  const n = width * height;
  for (let i = 0; i < n; i++) {
    if (stencil[i]! & ERROR) {
      const base = i * 3;
      const m = _median(msdf[base]!, msdf[base + 1]!, msdf[base + 2]!);
      msdf[base] = m; msdf[base + 1] = m; msdf[base + 2] = m;
    }
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function _median(a: number, b: number, c: number): number {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
}
