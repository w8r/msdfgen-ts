/**
 * Gate 4 — Atlas invariants.
 *
 * The C++-byte-exact MSDF pipeline is covered end-to-end by
 * test/msdf/msdf.test.ts (gate:m3) directly against the goldens. This
 * file exercises the atlas-level invariants that sit on top (caching,
 * non-overlapping packing, buffer growth, plane-bound sanity) plus a
 * round-trip byte-match test that closes the loop back to the goldens:
 * atlas.texture bytes at each glyph's rect must equal
 * `pixelFloatToByte(directPipeline(atlas.projection))` byte-for-byte
 * (post y-flip). Chained with msdf.test.ts's TS-pipeline≡C++-reference
 * proof, this transitively verifies each atlas cell equals the C++
 * reference's cropped region at the atlas's own projection.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";
import { Font } from "../../src/font/font";
import { Atlas, pixelFloatToByte, type AtlasGlyph } from "../../src/atlas-gen";
import { emNormalizeShape, normalizeShape } from "../../src/shape/normalize";
import { edgeColoringSimple } from "../../src/msdf/edge-coloring";
import { generateMSDF } from "../../src/msdf/generate";
import { distanceSignCorrection, msdfErrorCorrection } from "../../src/msdf/error-correction";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = resolve(__dirname, "../fonts");

function loadFont(fileName: string): Font {
  const buf = readFileSync(resolve(FONTS_DIR, fileName));
  return new Font(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer);
}

function overlaps(a: AtlasGlyph, b: AtlasGlyph): boolean {
  if (a.w === 0 || a.h === 0 || b.w === 0 || b.h === 0) return false;
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

describe("Atlas", () => {
  it("caches glyphs: repeat lookups return the same entry", () => {
    const font = loadFont("Roboto.ttf");
    const atlas = new Atlas(font, { pixelsPerEm: 32, pxrange: 4 });
    expect(atlas.glyph(0x66)).toBe(atlas.glyph(0x66));
  });

  it("packs the printable ASCII range with no overlapping rects", () => {
    const font = loadFont("Roboto.ttf");
    const atlas = new Atlas(font, { pixelsPerEm: 32, pxrange: 4 });
    const rects: AtlasGlyph[] = [];
    for (let cp = 0x21; cp <= 0x7e; cp++) rects.push(atlas.glyph(cp));
    // Force pack via a texture read.
    void atlas.texture;
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        expect(overlaps(rects[i]!, rects[j]!)).toBe(false);
      }
    }
    for (const r of rects) {
      expect(r.x + r.w).toBeLessThanOrEqual(atlas.width);
      expect(r.y + r.h).toBeLessThanOrEqual(atlas.height);
    }
  });

  it("repacks on insert and preserves all cells (alpha=255 everywhere written)", () => {
    const font = loadFont("Roboto.ttf");
    const atlas = new Atlas(font, { pixelsPerEm: 32, pxrange: 4 });
    const first = atlas.glyph(0x41); // 'A' — packed once
    void atlas.texture; // force first pack
    for (let cp = 0x42; cp <= 0x5a; cp++) atlas.glyph(cp); // repack on next read
    // After a repack, `first`'s x/y may have moved — mutation on the same object.
    expect(atlas.texture.length).toBe(atlas.width * atlas.height * 4);
    const base = (first.y * atlas.width + first.x) * 4;
    expect(atlas.texture[base + 3]).toBe(255);
  });

  it("emits uniform pxrangeEm across glyphs (crop, not scale)", () => {
    const font = loadFont("Roboto.ttf");
    const atlas = new Atlas(font, { pixelsPerEm: 32, pxrange: 4 });
    // Uniform pxrangeEm is the whole point of cropping (vs. per-glyph scaling).
    expect(atlas.pxrangeEm).toBeCloseTo(4 / 32, 12);
    // Sanity: a narrow '.' cell should be visibly smaller than a wide 'M' cell.
    const dot = atlas.glyph(0x2e);
    const m = atlas.glyph(0x4d);
    expect(dot.w).toBeLessThan(m.w);
    expect(dot.h).toBeLessThan(m.h);
  });

  it("plane bounds match the atlas rect via the uniform pixelsPerEm scale", () => {
    const font = loadFont("PTSerif-Regular.ttf");
    const atlas = new Atlas(font, { pixelsPerEm: 48, pxrange: 4 });
    for (const cp of [0x41, 0x67, 0x4d, 0x69, 0x2e]) {
      const g = atlas.glyph(cp);
      if (g.w === 0) continue;
      expect((g.planeRight - g.planeLeft) * 48).toBeCloseTo(g.w, 6);
      expect((g.planeTop - g.planeBottom) * 48).toBeCloseTo(g.h, 6);
    }
  });

  it("layout returns em-space widths + running pen positions", () => {
    const font = loadFont("Roboto.ttf");
    const atlas = new Atlas(font, { pixelsPerEm: 32, pxrange: 4 });
    const { glyphs, widthEm } = atlas.layout("AV");
    expect(glyphs).toHaveLength(2);
    expect(glyphs[0]!.penX).toBe(0);
    // Absent kerning (Roboto uses GPOS, not `kern`), widthEm should equal
    // the sum of advances exactly.
    const sumAdvances = glyphs[0]!.glyph.advance + glyphs[1]!.glyph.advance;
    expect(widthEm).toBeCloseTo(sumAdvances, 10);
    expect(glyphs[1]!.penX).toBeCloseTo(glyphs[0]!.glyph.advance, 10);
  });

  // Round-trip byte match: for a corpus of glyphs across fonts and sizes,
  // the atlas texture bytes at each glyph's rect must equal
  //   y-flip(pixelFloatToByte(TS-pipeline MSDF at the atlas's projection)).
  // The TS pipeline is proved byte-exact against C++ msdfgen by
  // test/msdf/msdf.test.ts, so passing this test transitively proves the
  // atlas cell equals the C++ reference's cropped region at the atlas's
  // own projection (which is what the "golden" would look like if we
  // regenerated one at those exact params).
  it("atlas.texture bytes match a direct-pipeline reference at the atlas's projection", () => {
    interface Case { font: string; pxPerEm: number; pxrange: number; codepoints: number[] }
    const cases: Case[] = [
      { font: "Roboto.ttf", pxPerEm: 32, pxrange: 4, codepoints: [0x41, 0x4d, 0x67, 0x2e, 0x40] },
      { font: "NotoSans.ttf", pxPerEm: 48, pxrange: 4, codepoints: [0x42, 0x69, 0x51, 0x25, 0x0416 /* Ж */] },
      { font: "PTSerif-Regular.ttf", pxPerEm: 40, pxrange: 2, codepoints: [0x67, 0x51, 0x26, 0x2e] },
    ];

    for (const c of cases) {
      const font = loadFont(c.font);
      const atlas = new Atlas(font, {
        pixelsPerEm: c.pxPerEm, pxrange: c.pxrange,
      });

      for (const cp of c.codepoints) {
        const g = atlas.glyph(cp);
        if (g.w === 0) continue; // empty outline

        // Reproduce the atlas's internal MSDF (float, y-up) using the same
        // shape and same projection it used. `tx = -planeLeft`, `ty = -planeBottom`
        // (see Atlas.glyph()).
        const shape = font.shape(font.glyphId(cp));
        emNormalizeShape(shape, font.metrics.unitsPerEm);
        normalizeShape(shape);
        edgeColoringSimple(shape, 3.0, 0n);
        const tx = -g.planeLeft;
        const ty = -g.planeBottom;
        const ref = new Float32Array(g.w * g.h * 3);
        generateMSDF(shape, g.w, g.h, c.pxPerEm, tx, ty, c.pxrange, ref);
        distanceSignCorrection(ref, shape, g.w, g.h, c.pxPerEm, tx, ty);
        msdfErrorCorrection(ref, shape, g.w, g.h, c.pxPerEm, tx, ty, c.pxrange);

        // Byte-exact match, including the atlas's y-flip. If this ever
        // fails, the failure message pinpoints the first divergent texel.
        for (let sy = 0; sy < g.h; sy++) {
          const yUpRow = g.h - 1 - sy; // atlas is y-down; ref float MSDF is y-up
          for (let sx = 0; sx < g.w; sx++) {
            const atlasIdx = ((g.y + sy) * atlas.width + (g.x + sx)) * 4;
            const refIdx = (yUpRow * g.w + sx) * 3;
            for (let ch = 0; ch < 3; ch++) {
              const expected = pixelFloatToByte(ref[refIdx + ch]!);
              const actual = atlas.texture[atlasIdx + ch]!;
              if (actual !== expected) {
                expect.fail(
                  `[${c.font} U+${cp.toString(16).toUpperCase().padStart(4, "0")}] ` +
                  `byte mismatch at (${sx},${sy}) ch${ch}: got ${actual}, expected ${expected}`,
                );
              }
            }
            // Alpha channel is a constant 255 (see Atlas._blit).
            expect(atlas.texture[atlasIdx + 3]).toBe(255);
          }
        }
      }
    }
  });
});
