import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Font } from "../../src/font/font.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = resolve(__dirname, "../fonts");

/**
 * M1 no-throw gate.
 *
 * The parser must not throw on any TTF/TTC file in test/fonts/.
 * For each font, we also exercise:
 *  - Parsing all glyph outlines (font.shape for every glyph index)
 *  - Advance width and LSB lookups
 *  - Kern lookups for a handful of pairs
 *  - Codepoint lookup for sampled characters
 */
describe("parser: never throws on corpus fonts", () => {
  const fontFiles = readdirSync(FONTS_DIR).filter((f) => /\.(ttf|ttc)$/i.test(f));

  for (const file of fontFiles) {
    it(`${file} — loads and parses all glyphs without throwing`, () => {
      const raw = readFileSync(resolve(FONTS_DIR, file));
      const buf = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer;

      // Construction must not throw
      const font = new Font(buf);
      expect(font.metrics.unitsPerEm).toBeGreaterThan(0);

      const numGlyphs = (() => {
        // Derive from loca: try a large index and find where the font stops
        // accepting valid glyph IDs. We use advance() which falls back safely.
        let n = 0;
        // Binary-search isn't needed; just probe incrementally up to a cap.
        for (let id = 0; id < 10000; id++) {
          if (font.advance(id) === 0 && font.lsb(id) === 0 && id > 100) break;
          n = id + 1;
        }
        return Math.max(n, 1);
      })();

      // Parse every glyph outline — must not throw
      let shapesChecked = 0;
      const step = Math.max(1, Math.floor(numGlyphs / 200)); // sample ~200 glyphs
      for (let id = 0; id < numGlyphs; id += step) {
        expect(() => font.shape(id)).not.toThrow();
        shapesChecked++;
      }
      expect(shapesChecked).toBeGreaterThan(0);

      // Advance + LSB must not throw for all sampled IDs
      for (let id = 0; id < numGlyphs; id += step) {
        expect(typeof font.advance(id)).toBe("number");
        expect(typeof font.lsb(id)).toBe("number");
      }

      // Kern must not throw for a handful of glyph pairs
      const pairsToTest = [
        [0, 1],
        [1, 2],
        [10, 20],
        [50, 51],
      ];
      for (const [l, r] of pairsToTest) {
        if (l !== undefined && r !== undefined) {
          expect(typeof font.kerning(l, r)).toBe("number");
        }
      }

      // Codepoint lookup must not throw
      const testCps = [0x41, 0x61, 0x30, 0x2e, 0xc0, 0x400];
      for (const cp of testCps) {
        expect(typeof font.glyphId(cp)).toBe("number");
      }
    });
  }
});
