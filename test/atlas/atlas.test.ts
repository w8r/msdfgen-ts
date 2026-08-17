/**
 * Gate 4 — Atlas invariants.
 *
 * The C++-byte-exact MSDF pipeline is covered end-to-end by
 * test/msdf/msdf.test.ts (gate:m3) directly against the goldens. This
 * file only exercises the atlas-level invariants that sit on top:
 * caching, non-overlapping packing, buffer growth, and plane-bound
 * sanity.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";
import { Font } from "../../src/font/font";
import { Atlas, type AtlasGlyph } from "../../src/atlas-gen";

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
    const atlas = new Atlas(font, {
      pixelsPerEm: 32, pxrange: 4, atlasWidth: 256, atlasHeight: 256,
    });
    const rects: AtlasGlyph[] = [];
    for (let cp = 0x21; cp <= 0x7e; cp++) rects.push(atlas.glyph(cp));
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

  it("grows the texture buffer and preserves previously packed glyphs", () => {
    const font = loadFont("Roboto.ttf");
    const atlas = new Atlas(font, {
      pixelsPerEm: 32, pxrange: 4, atlasWidth: 64, atlasHeight: 64,
    });
    const first = atlas.glyph(0x41); // 'A' packed before growth
    for (let cp = 0x42; cp <= 0x5a; cp++) atlas.glyph(cp); // force growth
    expect(atlas.texture.length).toBe(atlas.width * atlas.height * 4);
    // Alpha channel is always 255 for any written texel; corrupted reflow → 0.
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
});
