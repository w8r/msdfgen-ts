/**
 * glyf.ts — TrueType glyph outline parser.
 *
 * Parses the `glyf` table to produce Shape objects (raw font units, y-up).
 * Both simple and composite glyphs are supported.
 *
 * Canonical contour representation:
 *  - Implied on-curve midpoints between consecutive off-curve points are
 *    inserted explicitly.
 *  - Contours starting on an off-curve point are handled per spec:
 *    if the last point is also off-curve, start at their midpoint;
 *    otherwise rotate to start at the first on-curve point.
 *  - The resulting EdgeSegment sequence closes back to p0 of the first segment.
 *
 * Composite transforms supported:
 *  ARG_1_AND_2_ARE_WORDS, ARGS_ARE_XY_VALUES,
 *  WE_HAVE_A_SCALE, WE_HAVE_AN_X_AND_Y_SCALE, WE_HAVE_A_TWO_BY_TWO,
 *  MORE_COMPONENTS.
 *
 * Not supported (silently ignored / treated as identity):
 *  USE_MY_METRICS — advance widths come from `hmtx`, which already holds the
 *  composite's own metrics.
 *  ARGS_ARE_XY_VALUES not set (anchor point alignment) — returns origin offset
 *  of 0 for that component.
 */

import { BinaryReader } from "../reader";
import { EdgeSegment, LINEAR, QUADRATIC } from "../../shape/segments";
import { type Contour } from "../../shape/contour";
import { type Shape } from "../../shape/shape";

/**
 * A single raw outline point in font units, before implied on-curve midpoints
 * are inserted.  Composite transforms operate on these raw points so that
 * midpoint expansion happens on the final merged integer outline — exactly as
 * FreeType's FT_Outline_Decompose does after assembling all components.
 * @internal
 */
interface RawPoint {
  x: number;
  y: number;
  onCurve: boolean;
}

/**
 * A glyph as a list of raw contours (arrays of RawPoint), in font units, with
 * no implied midpoints inserted yet.  This is the intermediate representation
 * shared by simple and composite glyph parsing and by the composite recursion.
 */
export type RawGlyph = RawPoint[][];

// ── Simple glyph flags ────────────────────────────────────────────────────────
const ON_CURVE_POINT = 0x01;
const X_SHORT_VECTOR = 0x02;
const Y_SHORT_VECTOR = 0x04;
const REPEAT_FLAG = 0x08;
const X_IS_SAME_OR_POSITIVE = 0x10;
const Y_IS_SAME_OR_POSITIVE = 0x20;
// 0x40 = OVERLAP_SIMPLE (v1.1, ignored)
// 0x80 = reserved

// ── Composite glyph flags ─────────────────────────────────────────────────────
const ARG_1_AND_2_ARE_WORDS = 0x0001;
const ARGS_ARE_XY_VALUES = 0x0002;
// 0x0004 = ROUND_XY_TO_GRID (ignored)
const WE_HAVE_A_SCALE = 0x0008;
const MORE_COMPONENTS = 0x0020;
const WE_HAVE_AN_X_AND_Y_SCALE = 0x0040;
const WE_HAVE_A_TWO_BY_TWO = 0x0080;
// 0x0100 = WE_HAVE_INSTRUCTIONS (ignored)
// 0x0200 = USE_MY_METRICS (ignored, see header)
// 0x0400 = OVERLAP_COMPOUND (ignored)
// 0x0800 = SCALED_COMPONENT_OFFSET (ignored)

/**
 * Parses a single glyph from the `glyf` table.
 *
 * @param buffer Full font buffer.
 * @param glyfTableOffset Byte offset of the `glyf` table within buffer.
 * @param glyphOffset Byte offset of this glyph within the `glyf` table
 *   (from the `loca` table).
 * @param glyphSize Size in bytes of this glyph entry (loca[i+1] - loca[i]).
 *   If 0, the glyph has no outline (space, empty glyph).
 * @param getGlyphRaw Callback returning the raw (pre-midpoint) outline of a
 *   component glyph, used when assembling composite glyphs.
 * @returns {Shape} Parsed outline in font units (y-up). Empty shape if no outline.
 */
export function parseGlyph(
  buffer: ArrayBuffer,
  glyfTableOffset: number,
  glyphOffset: number,
  glyphSize: number,
  getGlyphRaw: (glyphId: number) => RawGlyph,
): Shape {
  const rawContours = parseGlyphRaw(buffer, glyfTableOffset, glyphOffset, glyphSize, getGlyphRaw);

  // Expand implied midpoints and build EdgeSegments — now on the final merged
  // (and, for composites, transformed) integer outline, matching FreeType.
  const contours: Contour[] = [];
  for (const raw of rawContours) {
    const contour = _buildContourFromRaw(raw);
    if (contour.length > 0) contours.push(contour);
  }
  return { contours, inverseYAxis: false };
}

/**
 * Parses a glyph to its raw outline (contours of RawPoint, no implied midpoints).
 * Recurses through composite components, applying each component's transform to
 * the raw points before merging.
 *
 * @param buffer Full font buffer.
 * @param glyfTableOffset Byte offset of the `glyf` table within buffer.
 * @param glyphOffset Byte offset of this glyph within the `glyf` table.
 * @param glyphSize Size in bytes of this glyph entry; 0 = no outline.
 * @param getGlyphRaw Callback returning the raw outline of a component glyph.
 * @returns {RawGlyph} Raw contours in font units.
 */
export function parseGlyphRaw(
  buffer: ArrayBuffer,
  glyfTableOffset: number,
  glyphOffset: number,
  glyphSize: number,
  getGlyphRaw: (glyphId: number) => RawGlyph,
): RawGlyph {
  if (glyphSize === 0) return [];

  const absOffset = glyfTableOffset + glyphOffset;
  const r = new BinaryReader(buffer, absOffset);
  const numberOfContours = r.i16();

  // Skip bounding box (xMin, yMin, xMax, yMax)
  r.skip(8);

  if (numberOfContours >= 0) {
    return _parseSimpleGlyphRaw(r, numberOfContours);
  } else {
    return _parseCompositeGlyphRaw(buffer, r, glyfTableOffset, getGlyphRaw);
  }
}

// ── Simple glyph ─────────────────────────────────────────────────────────────

/** @internal */
function _parseSimpleGlyphRaw(r: BinaryReader, numberOfContours: number): RawGlyph {
  if (numberOfContours === 0) return [];

  // endPtsOfContours: last point index (inclusive) for each contour
  const endPts: number[] = [];
  for (let i = 0; i < numberOfContours; i++) endPts[i] = r.u16();

  const numPoints = (endPts[numberOfContours - 1] ?? 0) + 1;

  // Skip instruction bytes
  const instructionLength = r.u16();
  r.skip(instructionLength);

  // ── flags (with REPEAT_FLAG expansion) ──────────────────────────────────
  const flags = new Uint8Array(numPoints);
  for (let i = 0; i < numPoints;) {
    const flag = r.u8();
    flags[i++] = flag;
    if (flag & REPEAT_FLAG) {
      let repeatCount = r.u8();
      while (repeatCount-- > 0) flags[i++] = flag;
    }
  }

  // ── x-coordinates (delta-encoded) ───────────────────────────────────────
  const xs = new Float64Array(numPoints);
  let cur = 0;
  for (let i = 0; i < numPoints; i++) {
    const flag = flags[i] ?? 0;
    if (flag & X_SHORT_VECTOR) {
      const dx = r.u8();
      cur += flag & X_IS_SAME_OR_POSITIVE ? dx : -dx;
    } else if (!(flag & X_IS_SAME_OR_POSITIVE)) {
      cur += r.i16();
      // else: same as previous — cur unchanged
    }
    xs[i] = cur;
  }

  // ── y-coordinates (delta-encoded) ───────────────────────────────────────
  const ys = new Float64Array(numPoints);
  cur = 0;
  for (let i = 0; i < numPoints; i++) {
    const flag = flags[i] ?? 0;
    if (flag & Y_SHORT_VECTOR) {
      const dy = r.u8();
      cur += flag & Y_IS_SAME_OR_POSITIVE ? dy : -dy;
    } else if (!(flag & Y_IS_SAME_OR_POSITIVE)) {
      cur += r.i16();
    }
    ys[i] = cur;
  }

  // ── build raw contours (no midpoint expansion yet) ───────────────────────
  const contours: RawGlyph = [];
  let ptStart = 0;
  for (let ci = 0; ci < numberOfContours; ci++) {
    const ptEnd = endPts[ci] ?? 0;
    const contour = _extractRawContour(flags, xs, ys, ptStart, ptEnd);
    if (contour.length > 0) contours.push(contour);
    ptStart = ptEnd + 1;
  }

  return contours;
}

/**
 * Extracts the raw points (with on/off-curve flags) of one contour from the
 * decoded flag/coordinate arrays.  No implied midpoints are inserted here.
 * @internal
 */
function _extractRawContour(
  flags: Uint8Array,
  xs: Float64Array,
  ys: Float64Array,
  startIdx: number,
  endIdx: number,
): RawPoint[] {
  const n = endIdx - startIdx + 1;
  if (n <= 0) return [];
  const raw: RawPoint[] = [];
  for (let i = 0; i < n; i++) {
    const fi = flags[startIdx + i] ?? 0;
    const xi = xs[startIdx + i] ?? 0;
    const yi = ys[startIdx + i] ?? 0;
    raw.push({ x: xi, y: yi, onCurve: (fi & ON_CURVE_POINT) !== 0 });
  }
  return raw;
}

/**
 * Builds a closed Contour from a raw (pre-midpoint) contour.
 *
 * Resolves implied on-curve midpoints and handles contours that start on an
 * off-curve point. The result is a cyclic sequence of EdgeSegments where every
 * off-curve control point is surrounded by on-curve endpoints.
 *
 * For composite glyphs, `raw` must already be in the final merged, transformed
 * coordinate space so that midpoint truncation matches FreeType, which expands
 * midpoints only after assembling all components.
 *
 * @internal
 */
function _buildContourFromRaw(raw: RawPoint[]): Contour {
  const n = raw.length;
  if (n <= 0) return [];

  // ── Step 1: expand implied on-curve midpoints ────────────────────────────
  // A point is on-curve iff onCurve is true.
  // Between two consecutive off-curve points, insert an implicit on-curve at
  // the midpoint. The wrap-around (last ↔ first) is also checked.

  // Expand midpoints
  const expanded: RawPoint[] = [];
  for (let i = 0; i < n; i++) {
    const curr = raw[i]!;
    const next = raw[(i + 1) % n]!;
    expanded.push(curr);
    if (!curr.onCurve && !next.onCurve) {
      // Implied on-curve midpoint. Use integer truncation to match FreeType's
      // integer arithmetic:  mid = (a + b) / 2  (C integer division = trunc).
      expanded.push({
        x: Math.trunc((curr.x + next.x) / 2),
        y: Math.trunc((curr.y + next.y) / 2),
        onCurve: true,
      });
    }
  }

  const m = expanded.length;

  // ── Step 2: find a starting on-curve point ───────────────────────────────
  // TrueType spec: if the first point is off-curve and the last is on-curve,
  // rotate so that we start at the last on-curve point.
  // If both first and last are off-curve (after expansion the midpoint was
  // inserted, so the first element after expansion might be off-curve only if
  // the original raw[0] was off-curve and raw[n-1] was also off-curve).
  // After expansion, we always have at least one on-curve point in a valid
  // TrueType contour.

  let rotateBy = 0;
  if (!expanded[0]!.onCurve) {
    // Find first on-curve point scanning forward
    for (let i = 1; i < m; i++) {
      if (expanded[i]!.onCurve) {
        rotateBy = i;
        break;
      }
    }
  }

  // ── Step 3: build EdgeSegments from the (rotated) expanded point list ────
  const segs: Contour = [];
  // We walk the m points in cyclic order starting at rotateBy.
  // Every on-curve point starts a new segment; if the next is off-curve we
  // consume the off-curve + following on-curve as a QUADRATIC; otherwise LINEAR.
  let i = 0;
  while (i < m) {
    const p0 = expanded[(rotateBy + i) % m]!;
    const p1 = expanded[(rotateBy + i + 1) % m]!;

    if (p1.onCurve) {
      segs.push(new EdgeSegment(LINEAR, p0.x, p0.y, p1.x, p1.y, 0, 0, 0, 0));
      i += 1;
    } else {
      // Quadratic: p0(on) p1(off) p2(on)
      const p2 = expanded[(rotateBy + i + 2) % m]!;
      segs.push(new EdgeSegment(QUADRATIC, p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, 0, 0));
      i += 2;
    }
  }

  return segs;
}

// ── Composite glyph ───────────────────────────────────────────────────────────

/** @internal */
function _parseCompositeGlyphRaw(
  buffer: ArrayBuffer,
  r: BinaryReader,
  glyfTableOffset: number,
  getGlyphRaw: (glyphId: number) => RawGlyph,
): RawGlyph {
  const allContours: RawGlyph = [];

  let flags = 0;
  do {
    flags = r.u16();
    const componentGlyphId = r.u16();

    // ── read arguments (translate or point indices) ──────────────────────
    let arg1: number, arg2: number;
    if (flags & ARG_1_AND_2_ARE_WORDS) {
      arg1 = r.i16();
      arg2 = r.i16();
    } else {
      arg1 = r.u8(); // treat as unsigned first; sign depends on ARGS_ARE_XY_VALUES
      arg2 = r.u8();
      // Sign-extend the 8-bit values if they are xy-values
      if (flags & ARGS_ARE_XY_VALUES) {
        if (arg1 > 127) arg1 -= 256;
        if (arg2 > 127) arg2 -= 256;
      }
    }

    // Translation
    let tx = 0,
      ty = 0;
    if (flags & ARGS_ARE_XY_VALUES) {
      tx = arg1;
      ty = arg2;
    }
    // else: args are point indices — anchor alignment; we skip (treat as 0 offset)

    // ── read transform ────────────────────────────────────────────────────
    let xx = 1.0,
      yx = 0.0,
      xy = 0.0,
      yy = 1.0;
    if (flags & WE_HAVE_A_SCALE) {
      xx = yy = r.f2dot14();
    } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
      xx = r.f2dot14();
      yy = r.f2dot14();
    } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
      xx = r.f2dot14();
      yx = r.f2dot14();
      xy = r.f2dot14();
      yy = r.f2dot14();
    }

    // ── fetch and transform component raw outlines ────────────────────────
    // Transform is applied to RAW points (before midpoint expansion) so the
    // merged integer outline matches what FreeType decomposes.
    const componentRaw = getGlyphRaw(componentGlyphId);
    const transformed = _transformRawGlyph(componentRaw, xx, yx, xy, yy, tx, ty);
    for (const c of transformed) allContours.push(c);
  } while (flags & MORE_COMPONENTS);

  return allContours;
}

/**
 * Rounds a transformed coordinate to the nearest integer, ties away from zero,
 * matching FreeType's FT_MulFix-based FT_Outline_Transform (which produces
 * integer FT_Pos coordinates for NO_SCALE outlines).
 * @internal
 */
function _roundCoord(v: number): number {
  return v >= 0 ? Math.floor(v + 0.5) : Math.ceil(v - 0.5);
}

/**
 * Applies a 2×2 matrix + translation to all raw points of a glyph, rounding to
 * integer font units (as FreeType does for composite components).
 * | xx yx |   | x |   | tx |
 * | xy yy | × | y | + | ty |
 * @internal
 */
function _transformRawGlyph(
  glyph: RawGlyph,
  xx: number,
  yx: number,
  xy: number,
  yy: number,
  tx: number,
  ty: number,
): RawGlyph {
  const isIdentity = xx === 1 && yx === 0 && xy === 0 && yy === 1 && tx === 0 && ty === 0;
  if (isIdentity) return glyph;

  const isTranslation = xx === 1 && yx === 0 && xy === 0 && yy === 1;
  return glyph.map((contour) =>
    contour.map((p) => {
      if (isTranslation) {
        // Pure integer translation — no rounding needed, keeps values exact.
        return { x: p.x + tx, y: p.y + ty, onCurve: p.onCurve };
      }
      return {
        x: _roundCoord(xx * p.x + yx * p.y + tx),
        y: _roundCoord(xy * p.x + yy * p.y + ty),
        onCurve: p.onCurve,
      };
    }),
  );
}
