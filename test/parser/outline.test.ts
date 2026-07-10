import { describe, expect, it } from "vitest";
import opentype from "opentype.js";
import { loadCorpusFonts } from "./corpus.js";
import { type Shape } from "../../src/shape/shape.js";
import { LINEAR, QUADRATIC } from "../../src/shape/segments.js";

/**
 * M1 outline gate.
 *
 * For every corpus glyph (iterated by glyph index, not codepoint):
 *  - contour count matches opentype.js
 *  - every contour matches when compared as a cyclic canonical sequence
 *
 * Canonical form:
 *  { x, y, onCurve } per implied-midpoint-resolved point.
 *  Derived from opentype.js path.commands: M→on-curve, L→on-curve,
 *  Q→off-curve+on-curve. Z is ignored (implicit close).
 *  Derived from our Shape: for each EdgeSegment, emit p0(on) and if QUADRATIC
 *  also p1(control, off). The closing endpoint of the last segment is p0 of
 *  the first segment (cyclic — not re-emitted).
 *
 * Comparison: contours must match as cyclic sequences. Tolerance: 0.5 font
 * units (absorbs integer rounding of implied midpoints and f2dot14 composite
 * transforms).
 */

const TOLERANCE = 0.5; // font units

interface CanonPt {
  x: number;
  y: number;
  onCurve: boolean;
}
type CanonContour = CanonPt[];

// ── Canonical form from opentype.js path.commands ────────────────────────────

function canonFromOT(glyph: opentype.Glyph): CanonContour[] {
  const contours: CanonContour[] = [];
  let current: CanonContour | null = null;

  for (const cmd of glyph.path.commands) {
    if (cmd.type === "M") {
      current = [{ x: cmd.x, y: cmd.y, onCurve: true }];
      contours.push(current);
    } else if (cmd.type === "L") {
      current?.push({ x: cmd.x, y: cmd.y, onCurve: true });
    } else if (cmd.type === "Q") {
      current?.push({ x: cmd.x1, y: cmd.y1, onCurve: false });
      current?.push({ x: cmd.x, y: cmd.y, onCurve: true });
    } else if (cmd.type === "C") {
      // CFF (cubic) — should not appear in TrueType fonts but tolerate it
      current?.push({ x: cmd.x1, y: cmd.y1, onCurve: false });
      current?.push({ x: cmd.x2, y: cmd.y2, onCurve: false });
      current?.push({ x: cmd.x, y: cmd.y, onCurve: true });
    }
    // 'Z': close contour — no new point (the close is implicit/cyclic)
  }

  return contours
    .map((c) => {
      // 1. Strip the explicit closing L if it duplicates the M start.
      //    opentype.js emits L(x0,y0) before Z when the last drawn point ≠ start,
      //    but the path renderer closes implicitly — we strip it so the sequence
      //    is purely cyclic (the closing segment is implicit).
      if (c.length >= 2) {
        const first = c[0]!;
        const last = c[c.length - 1]!;
        if (
          last.onCurve &&
          Math.abs(last.x - first.x) <= TOLERANCE &&
          Math.abs(last.y - first.y) <= TOLERANCE
        ) {
          c = c.slice(0, -1);
        }
      }

      // 2. Strip consecutive duplicate on-curve points (same normalisation applied
      //    to both oracle and our output via _dedup).
      return _dedup(c);
    })
    .filter((c) => c.length > 0);
}

// ── Canonical form from our Shape ────────────────────────────────────────────

function canonFromShape(shape: Shape): CanonContour[] {
  return shape.contours
    .map((contour) => {
      const pts: CanonPt[] = [];
      for (const seg of contour) {
        pts.push({ x: seg.p0x, y: seg.p0y, onCurve: true });
        if (seg.type === QUADRATIC) {
          pts.push({ x: seg.p1x, y: seg.p1y, onCurve: false });
        }
      }
      // Dedup consecutive duplicate on-curve points (zero-length segments are
      // geometrically meaningless; both sides apply the same normalisation).
      return _dedup(pts);
    })
    .filter((c) => c.length > 0);
}

// ── Cyclic comparison ─────────────────────────────────────────────────────────

/** Strip consecutive duplicate on-curve points (zero-length segments). */
function _dedup(pts: CanonContour): CanonContour {
  const out: CanonContour = [];
  for (const pt of pts) {
    const prev = out[out.length - 1];
    if (
      pt.onCurve &&
      prev?.onCurve &&
      Math.abs(pt.x - prev.x) <= TOLERANCE &&
      Math.abs(pt.y - prev.y) <= TOLERANCE
    )
      continue;
    out.push(pt);
  }
  // Also check cyclic seam (last == first after linear dedup)
  if (out.length >= 2) {
    const first = out[0]!,
      last = out[out.length - 1]!;
    if (
      last.onCurve &&
      first.onCurve &&
      Math.abs(last.x - first.x) <= TOLERANCE &&
      Math.abs(last.y - first.y) <= TOLERANCE
    ) {
      out.pop();
    }
  }
  return out;
}

function ptClose(a: CanonPt, b: CanonPt): boolean {
  return (
    a.onCurve === b.onCurve && Math.abs(a.x - b.x) <= TOLERANCE && Math.abs(a.y - b.y) <= TOLERANCE
  );
}

function cyclicMatch(a: CanonContour, b: CanonContour): boolean {
  if (a.length !== b.length) return false;
  const n = a.length;
  if (n === 0) return true;
  // Try each starting offset of b
  outer: for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (!ptClose(a[i]!, b[(i + k) % n]!)) continue outer;
    }
    return true;
  }
  return false;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("glyph outlines vs opentype.js oracle", () => {
  const corpus = loadCorpusFonts();

  for (const { name, font, otFont, glyphIds } of corpus) {
    describe(name, () => {
      it("contour counts match for all sampled glyphs", () => {
        for (const id of glyphIds) {
          const ourShape = font.shape(id);
          const otGlyph = otFont.glyphs.get(id);
          // opentype.js: count 'M' commands in path to get contour count
          const otContourCount = otGlyph.path.commands.filter((c) => c.type === "M").length;
          expect(ourShape.contours.length, `glyph ${id} contour count`).toBe(otContourCount);
        }
      });

      it("all sampled glyph outlines match cyclically", () => {
        for (const id of glyphIds) {
          const ourShape = font.shape(id);
          const otGlyph = otFont.glyphs.get(id);
          const ourContours = canonFromShape(ourShape);
          const otContours = canonFromOT(otGlyph);

          if (ourContours.length !== otContours.length) {
            expect.fail(`glyph ${id}: contour count ${ourContours.length} ≠ ${otContours.length}`);
          }

          for (let ci = 0; ci < ourContours.length; ci++) {
            const ours = ourContours[ci]!;
            const theirs = otContours[ci]!;
            if (!cyclicMatch(ours, theirs)) {
              expect.fail(
                `glyph ${id} contour ${ci}: ` +
                  `our length=${ours.length}, oracle length=${theirs.length}. ` +
                  `First 3 ours: ${JSON.stringify(ours.slice(0, 3))}. ` +
                  `First 3 oracle: ${JSON.stringify(theirs.slice(0, 3))}.`,
              );
            }
          }
        }
      });
    });
  }
});
