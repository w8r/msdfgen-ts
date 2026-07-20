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
 *  USE_MY_METRICS, MORE_COMPONENTS.
 *
 * Not supported (silently ignored / treated as identity):
 *  ARGS_ARE_XY_VALUES not set (anchor point alignment) — returns origin offset
 *  of 0 for that component.
 */

import { BinaryReader } from "../reader.js";
import { EdgeSegment, LINEAR, QUADRATIC } from "../../shape/segments.js";
import { type Contour } from "../../shape/contour.js";
import { type Shape } from "../../shape/shape.js";

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
const USE_MY_METRICS = 0x0200;
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
 * @param getGlyphShape Callback to parse a component glyph (for composites).
 * @returns {Shape} Parsed outline in font units (y-up). Empty shape if no outline.
 */
export function parseGlyph(
  buffer: ArrayBuffer,
  glyfTableOffset: number,
  glyphOffset: number,
  glyphSize: number,
  getGlyphShape: (glyphId: number) => Shape,
): Shape {
  if (glyphSize === 0) {
    return { contours: [], inverseYAxis: false };
  }

  const absOffset = glyfTableOffset + glyphOffset;
  const r = new BinaryReader(buffer, absOffset);
  const numberOfContours = r.i16();

  // Skip bounding box (xMin, yMin, xMax, yMax)
  r.skip(8);

  if (numberOfContours >= 0) {
    return _parseSimpleGlyph(r, numberOfContours);
  } else {
    return _parseCompositeGlyph(buffer, r, glyfTableOffset, getGlyphShape);
  }
}

// ── Simple glyph ─────────────────────────────────────────────────────────────

/** @internal */
function _parseSimpleGlyph(r: BinaryReader, numberOfContours: number): Shape {
  if (numberOfContours === 0) return { contours: [], inverseYAxis: false };

  // endPtsOfContours: last point index (inclusive) for each contour
  const endPts = new Array<number>(numberOfContours);
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

  // ── build contours ───────────────────────────────────────────────────────
  const contours: Contour[] = [];
  let ptStart = 0;
  for (let ci = 0; ci < numberOfContours; ci++) {
    const ptEnd = endPts[ci] ?? 0;
    const contour = _buildContour(flags, xs, ys, ptStart, ptEnd);
    if (contour.length > 0) contours.push(contour);
    ptStart = ptEnd + 1;
  }

  return { contours, inverseYAxis: false };
}

/**
 * Builds a closed Contour from raw TrueType point data.
 *
 * Resolves implied on-curve midpoints and handles contours that start on an
 * off-curve point. The result is a cyclic sequence of EdgeSegments where every
 * off-curve control point is surrounded by on-curve endpoints.
 *
 * @internal
 */
function _buildContour(
  flags: Uint8Array,
  xs: Float64Array,
  ys: Float64Array,
  startIdx: number,
  endIdx: number,
): Contour {
  const n = endIdx - startIdx + 1;
  if (n <= 0) return [];

  // ── Step 1: expand implied on-curve midpoints ────────────────────────────
  // A point is on-curve iff (flags[i] & ON_CURVE_POINT) !== 0.
  // Between two consecutive off-curve points, insert an implicit on-curve at
  // the midpoint. The wrap-around (last ↔ first) is also checked.

  interface RawPt {
    x: number;
    y: number;
    onCurve: boolean;
  }
  const raw: RawPt[] = [];

  for (let i = 0; i < n; i++) {
    const fi = flags[startIdx + i] ?? 0;
    const xi = xs[startIdx + i] ?? 0;
    const yi = ys[startIdx + i] ?? 0;
    raw.push({ x: xi, y: yi, onCurve: (fi & ON_CURVE_POINT) !== 0 });
  }

  // Expand midpoints
  const expanded: RawPt[] = [];
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
function _parseCompositeGlyph(
  buffer: ArrayBuffer,
  r: BinaryReader,
  glyfTableOffset: number,
  getGlyphShape: (glyphId: number) => Shape,
): Shape {
  const allContours: Contour[] = [];

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

    // ── fetch and transform component outlines ────────────────────────────
    const componentShape = getGlyphShape(componentGlyphId);
    const transformed = _transformShape(componentShape, xx, yx, xy, yy, tx, ty);
    for (const c of transformed.contours) allContours.push(c);
  } while (flags & MORE_COMPONENTS);

  return { contours: allContours, inverseYAxis: false };
}

/**
 * Applies a 2×2 matrix + translation to all points in a Shape.
 * | xx yx |   | x |   | tx |
 * | xy yy | × | y | + | ty |
 * @internal
 */
function _transformShape(
  shape: Shape,
  xx: number,
  yx: number,
  xy: number,
  yy: number,
  tx: number,
  ty: number,
): Shape {
  const isIdentity = xx === 1 && yx === 0 && xy === 0 && yy === 1 && tx === 0 && ty === 0;
  if (isIdentity) return shape;

  const transformed: Contour[] = shape.contours.map((contour) =>
    contour.map((seg) => _transformSegment(seg, xx, yx, xy, yy, tx, ty)),
  );
  return { contours: transformed, inverseYAxis: shape.inverseYAxis };
}

/** @internal */
function _transformPt(
  x: number,
  y: number,
  xx: number,
  yx: number,
  xy: number,
  yy: number,
  tx: number,
  ty: number,
): [number, number] {
  return [xx * x + yx * y + tx, xy * x + yy * y + ty];
}

/** @internal */
function _transformSegment(
  seg: EdgeSegment,
  xx: number,
  yx: number,
  xy: number,
  yy: number,
  tx: number,
  ty: number,
): EdgeSegment {
  // All segment points (start, control, end) are transformed with the full
  // affine matrix + translation. For zero-valued unused fields (e.g. p2 for
  // LINEAR = 0), the transform produces (tx, ty) — harmless since those fields
  // are ignored during rendering.
  const [p0x, p0y] = _transformPt(seg.p0x, seg.p0y, xx, yx, xy, yy, tx, ty);
  const [p1x, p1y] = _transformPt(seg.p1x, seg.p1y, xx, yx, xy, yy, tx, ty);
  const [p2x, p2y] = _transformPt(seg.p2x, seg.p2y, xx, yx, xy, yy, tx, ty);
  const [p3x, p3y] = _transformPt(seg.p3x, seg.p3y, xx, yx, xy, yy, tx, ty);
  return new EdgeSegment(seg.type, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
}
