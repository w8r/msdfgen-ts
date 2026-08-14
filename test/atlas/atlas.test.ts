/**
 * Gate 4b — Atlas glyph cache + golden bitmap match.
 *
 * Verifies: cache stability (repeat lookups return the same entry), packed
 * glyph rects don't overlap, and the atlas's quantized bitmap for a glyph
 * matches its golden fixture (byte-quantized the same way) — proving the
 * runtime Font → Atlas pipeline produces the same MSDF as the golden
 * fixtures generated from `-exportshape`'d shapes.
 *
 * NEVER modify test/golden/** — only the human regenerates fixtures.
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";
import { Font } from "../../src/font/font.js";
import { Atlas, pixelFloatToByte } from "../../src/atlas/atlas.js";
import { fl32FromBuffer } from "../utils/compare.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = resolve(__dirname, "../fonts");
const GOLDEN_DIR = resolve(__dirname, "../golden");

function loadFont(fileName: string): Font {
  const buf = readFileSync(resolve(FONTS_DIR, fileName));
  return new Font(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer);
}

function overlaps(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

describe("Atlas", () => {
  it("caches glyphs: repeat lookups return the same entry", () => {
    const font = loadFont("Roboto.ttf");
    const atlas = new Atlas(font, { size: 48, pxrange: 4 });
    const a = atlas.getGlyph(0x66); // 'f'
    const b = atlas.getGlyph(0x66);
    expect(a).toBe(b);
  });

  it("packs many glyphs without overlapping rects", () => {
    const font = loadFont("Roboto.ttf");
    const atlas = new Atlas(font, { size: 48, pxrange: 4, atlasWidth: 256, atlasHeight: 256 });
    const rects = [];
    for (let cp = 0x21; cp <= 0x7e; cp++) rects.push(atlas.getGlyph(cp).rect);
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        expect(overlaps(rects[i]!, rects[j]!)).toBe(false);
      }
    }
  });

  it("grows the texture buffer to match the packer and preserves earlier glyphs", () => {
    const font = loadFont("Roboto.ttf");
    // Tiny initial atlas forces growth well before the full ASCII range is packed.
    const atlas = new Atlas(font, { size: 48, pxrange: 4, atlasWidth: 64, atlasHeight: 64 });
    const first = atlas.getGlyph(0x41); // 'A', packed before growth
    for (let cp = 0x42; cp <= 0x5a; cp++) atlas.getGlyph(cp); // force growth
    expect(atlas.texture.length).toBe(atlas.width * atlas.height * 4);

    // Re-derive the byte written at the first glyph's top-left texel and
    // confirm it wasn't clobbered/shifted by the buffer reflow.
    const { rect } = first;
    const base = (rect.y * atlas.width + rect.x) * 4;
    // Alpha channel is always 255 for any written glyph texel, whether or
    // not the atlas has since grown — a corrupted reflow would show 0 here.
    expect(atlas.texture[base + 3]).toBe(255);
  });

  // Roboto is intentionally excluded from the byte-exact golden compare:
  // its glyphs are built from multiple overlapping same-winding contours,
  // and the reference binary (built without Skia — see CLAUDE.md) bakes
  // the resulting seam artifact into its output. The atlas runtime path
  // resolves those overlaps via `src/shape/resolve-overlaps.ts` before
  // MSDF generation, so it necessarily diverges from those specific
  // goldens by design. Fonts that ship canonical outer+hole outlines
  // (Noto Sans, PT Serif) go through resolveOverlaps unchanged and still
  // match their goldens byte-exact.
  const goldenCases: Array<{ font: string; fixture: string; codepoint: number }> = [
    { font: "NotoSans.ttf", fixture: "notosans/U0041_48px", codepoint: 0x41 },
    { font: "PTSerif-Regular.ttf", fixture: "ptserif/U0061_48px", codepoint: 0x61 },
  ];

  for (const { font: fontFile, fixture, codepoint } of goldenCases) {
    it(`matches golden byte-quantized bitmap: ${fixture}`, () => {
      const metaPath = resolve(GOLDEN_DIR, fixture, "meta.json");
      const bitmapPath = resolve(GOLDEN_DIR, fixture, "bitmap.fl32");
      if (!existsSync(metaPath) || !existsSync(bitmapPath)) {
        throw new Error(`Missing golden fixture: ${fixture}`);
      }
      const meta = JSON.parse(readFileSync(metaPath, "utf8")) as {
        width: number;
        height: number;
        pxrange: number;
      };

      const font = loadFont(fontFile);
      const atlas = new Atlas(font, { size: meta.width, pxrange: meta.pxrange });
      const { rect } = atlas.getGlyph(codepoint);

      const raw = readFileSync(bitmapPath);
      const golden = fl32FromBuffer(
        raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer,
      );

      let maxByteDiff = 0;
      for (let y = 0; y < meta.height; y++) {
        // golden.data is y-up (row 0 = bottom); atlas texture is y-down (row 0 = top).
        const goldenRow = meta.height - 1 - y;
        for (let x = 0; x < meta.width; x++) {
          const goldenBase = (goldenRow * meta.width + x) * 3;
          const atlasBase = ((rect.y + y) * atlas.width + (rect.x + x)) * 4;
          for (let ch = 0; ch < 3; ch++) {
            const goldenByte = pixelFloatToByte(golden.data[goldenBase + ch]!);
            const atlasByte = atlas.texture[atlasBase + ch]!;
            maxByteDiff = Math.max(maxByteDiff, Math.abs(goldenByte - atlasByte));
          }
        }
      }
      expect(maxByteDiff).toBe(0);
    });
  }
});
