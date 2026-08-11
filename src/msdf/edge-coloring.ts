/**
 * Edge coloring for multi-channel SDF.
 *
 * Assigns a color bitmask to each edge segment so that adjacent segments share
 * at most one channel. This is the prerequisite for MSDF generation.
 *
 * Only `edgeColoringSimple` is ported (the algorithm used by the CLI by
 * default). The ink-trap and distance-based variants are out of scope.
 *
 * port of core/edge-coloring.cpp: edgeColoringSimple (and helpers)
 *
 * msdfgen © Viktor Chlumský — MIT licence.
 */

import { type Shape } from "../shape/shape.js";
import { LINEAR, QUADRATIC, EdgeSegment } from "../shape/segments.js";

// ── Color constants ──────────────────────────────────────────────────────────

/** port of core/EdgeColor.h: EdgeColor enum */
export const BLACK = 0 as const;
export const RED = 1 as const;
export const GREEN = 2 as const;
export const YELLOW = 3 as const;
export const BLUE = 4 as const;
export const MAGENTA = 5 as const;
export const CYAN = 6 as const;
export const WHITE = 7 as const;

// ── Scratch arrays (module-scope; non-hot, single-threaded) ──────────────────

const _dir0: number[] = [0, 0];
const _dir1: number[] = [0, 0];
const _pt: number[] = [0, 0];

// ── Private helpers ──────────────────────────────────────────────────────────

/**
 * For each position < n, returns -1, 0, or 1 depending on whether the position
 * is closer to the beginning, middle, or end. Balanced over [0, n-1].
 * port of core/edge-coloring.cpp: symmetricalTrichotomy
 */
function _symmetricalTrichotomy(position: number, n: number): number {
  return Math.trunc(3 + (2.875 * position) / (n - 1) - 1.4375 + 0.5) - 3;
}

/**
 * True if the junction between two consecutive edge directions is a corner.
 * port of core/edge-coloring.cpp: isCorner
 */
function _isCorner(
  adx: number,
  ady: number,
  bdx: number,
  bdy: number,
  crossThreshold: number,
): boolean {
  // dot(aDir, bDir) <= 0  OR  |cross(aDir, bDir)| > crossThreshold
  return adx * bdx + ady * bdy <= 0 || Math.abs(adx * bdy - ady * bdx) > crossThreshold;
}

/** port of core/edge-coloring.cpp: seedExtract2 — pops 1 bit from seed */
function _seedExtract2(seedRef: { v: bigint }): number {
  const bit = Number(seedRef.v & 1n);
  seedRef.v >>= 1n;
  return bit;
}

/** port of core/edge-coloring.cpp: seedExtract3 — pops 1 trit from seed */
function _seedExtract3(seedRef: { v: bigint }): number {
  const trit = Number(seedRef.v % 3n);
  seedRef.v /= 3n;
  return trit;
}

/** port of core/edge-coloring.cpp: initColor — picks initial color from seed */
function _initColor(seedRef: { v: bigint }): number {
  // static const EdgeColor colors[3] = { CYAN, MAGENTA, YELLOW };
  return [CYAN, MAGENTA, YELLOW][_seedExtract3(seedRef)]!;
}

/** port of core/edge-coloring.cpp: switchColor (no banned) */
function _switchColor(colorRef: { v: number }, seedRef: { v: bigint }): void {
  const shifted = colorRef.v << (1 + _seedExtract2(seedRef));
  colorRef.v = (shifted | (shifted >> 3)) & WHITE;
}

/** port of core/edge-coloring.cpp: switchColor (with banned) */
function _switchColorBanned(colorRef: { v: number }, seedRef: { v: bigint }, banned: number): void {
  const combined = colorRef.v & banned;
  if (combined === RED || combined === GREEN || combined === BLUE) {
    colorRef.v = combined ^ WHITE;
  } else {
    _switchColor(colorRef, seedRef);
  }
}

/**
 * Estimates arc length of an edge by sampling MSDFGEN_EDGE_LENGTH_PRECISION=4
 * equal-parameter steps.
 * port of core/edge-coloring.cpp: estimateEdgeLength
 */
function _estimateEdgeLength(seg: EdgeSegment): number {
  const N = 4; // MSDFGEN_EDGE_LENGTH_PRECISION
  let len = 0;
  seg.point(0, _pt);
  let px = _pt[0]!,
    py = _pt[1]!;
  for (let i = 1; i <= N; i++) {
    seg.point(i / N, _pt);
    const cx = _pt[0]!,
      cy = _pt[1]!;
    const dx = cx - px,
      dy = cy - py;
    len += Math.sqrt(dx * dx + dy * dy);
    px = cx;
    py = cy;
  }
  return len;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Assigns edge colors to all segments of the shape using the "simple" strategy.
 *
 * @param shape Em-normalized, normalized shape (mutated in place).
 * @param angleThreshold Maximum angle (radians) to be considered a corner
 *   (e.g. 3 ≈ 172°). Values below π/2 are treated as the external angle.
 * @param seed PRNG seed for color selection (default 0).
 *
 * port of core/edge-coloring.cpp: edgeColoringSimple
 */
export function edgeColoringSimple(shape: Shape, angleThreshold: number, seed: bigint = 0n): void {
  const crossThreshold = Math.sin(angleThreshold);
  const colorRef = { v: _initColor({ v: seed }) };
  const seedRef = { v: seed };
  // Re-initialise seedRef from the original seed value (initColor already
  // consumed some bits, so we shadow it to match C++ which passes seed by ref).
  seedRef.v = seed;
  colorRef.v = _initColor(seedRef);

  const corners: number[] = [];

  for (const contour of shape.contours) {
    if (contour.length === 0) continue;

    // ── Identify corners ───────────────────────────────────────────────────
    corners.length = 0;
    const last = contour[contour.length - 1]!;
    last.direction(1, _dir0);
    const prevLen = Math.sqrt(_dir0[0]! * _dir0[0]! + _dir0[1]! * _dir0[1]!);
    let prevDx = prevLen > 0 ? _dir0[0]! / prevLen : 0;
    let prevDy = prevLen > 0 ? _dir0[1]! / prevLen : 0;

    for (let idx = 0; idx < contour.length; idx++) {
      const edge = contour[idx]!;
      edge.direction(0, _dir1);
      const curLen = Math.sqrt(_dir1[0]! * _dir1[0]! + _dir1[1]! * _dir1[1]!);
      const curDx = curLen > 0 ? _dir1[0]! / curLen : 0;
      const curDy = curLen > 0 ? _dir1[1]! / curLen : 0;
      if (_isCorner(prevDx, prevDy, curDx, curDy, crossThreshold)) corners.push(idx);
      edge.direction(1, _dir0);
      const endLen = Math.sqrt(_dir0[0]! * _dir0[0]! + _dir0[1]! * _dir0[1]!);
      prevDx = endLen > 0 ? _dir0[0]! / endLen : 0;
      prevDy = endLen > 0 ? _dir0[1]! / endLen : 0;
    }

    // ── Smooth contour ─────────────────────────────────────────────────────
    if (corners.length === 0) {
      _switchColor(colorRef, seedRef);
      for (const edge of contour) edge.color = colorRef.v;

      // ── "Teardrop" case (single corner) ───────────────────────────────────
    } else if (corners.length === 1) {
      const colors: [number, number, number] = [0, WHITE, 0];
      _switchColor(colorRef, seedRef);
      colors[0] = colorRef.v;
      _switchColor(colorRef, seedRef);
      colors[2] = colorRef.v;

      const corner = corners[0]!;
      const m = contour.length;

      if (m >= 3) {
        for (let i = 0; i < m; i++) {
          const ci = _symmetricalTrichotomy(i, m);
          contour[(corner + i) % m]!.color = colors[1 + ci]!;
        }
      } else if (m >= 1) {
        // < 3 edges → must split into thirds
        const parts: (EdgeSegment | null)[] = [null, null, null, null, null, null, null];
        const thirds = contour[0]!.splitInThirds();
        parts[0 + 3 * corner] = thirds[0];
        parts[1 + 3 * corner] = thirds[1];
        parts[2 + 3 * corner] = thirds[2];

        if (m >= 2) {
          const thirds2 = contour[1]!.splitInThirds();
          parts[3 - 3 * corner] = thirds2[0];
          parts[4 - 3 * corner] = thirds2[1];
          parts[5 - 3 * corner] = thirds2[2];
          parts[0]!.color = parts[1]!.color = colors[0]!;
          parts[2]!.color = parts[3]!.color = colors[1]!;
          parts[4]!.color = parts[5]!.color = colors[2]!;
        } else {
          parts[0]!.color = colors[0]!;
          parts[1]!.color = colors[1]!;
          parts[2]!.color = colors[2]!;
        }

        contour.length = 0;
        for (const p of parts) if (p !== null) contour.push(p);
      }

      // ── Multiple corners ───────────────────────────────────────────────────
    } else {
      const cornerCount = corners.length;
      let spline = 0;
      const start = corners[0]!;
      const m = contour.length;
      _switchColor(colorRef, seedRef);
      const initialColor = colorRef.v;

      for (let i = 0; i < m; i++) {
        const index = (start + i) % m;
        if (spline + 1 < cornerCount && corners[spline + 1] === index) {
          ++spline;
          _switchColorBanned(colorRef, seedRef, spline === cornerCount - 1 ? initialColor : 0);
        }
        contour[index]!.color = colorRef.v;
      }
    }
  }
}

// Re-export color constants for consumers.
export { LINEAR, QUADRATIC };
