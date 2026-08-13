import { describe, expect, it } from "vitest";
import { loadCorpusFonts } from "./corpus";

/**
 * M1 metrics gate.
 *
 * For every font × glyph-index pair, asserts that our parser produces
 * advance width and LSB that exactly match opentype.js.
 * Font-level metrics (unitsPerEm, ascender, descender) are also compared.
 *
 * These checks run before glyf is implemented to confirm reader/sfnt/head/
 * maxp/hhea/hmtx/loca/cmap are correct.
 */
describe("font metrics vs opentype.js oracle", () => {
  const corpus = loadCorpusFonts();

  for (const { name, font, otFont, glyphIds } of corpus) {
    describe(name, () => {
      it("unitsPerEm matches", () => {
        expect(font.metrics.unitsPerEm).toBe(otFont.unitsPerEm);
      });

      it("ascender matches", () => {
        expect(font.metrics.ascender).toBe(otFont.tables.hhea?.ascender);
      });

      it("descender matches", () => {
        expect(font.metrics.descender).toBe(otFont.tables.hhea?.descender);
      });

      it("lineGap matches", () => {
        expect(font.metrics.lineGap).toBe(otFont.tables.hhea?.lineGap);
      });

      it("advance widths match for sampled glyphs", () => {
        for (const id of glyphIds) {
          const ours = font.advance(id);
          const otGlyph = otFont.glyphs.get(id);
          const oracle = otGlyph?.advanceWidth ?? 0;
          expect(ours, `glyph ${id} advanceWidth`).toBe(oracle);
        }
      });

      it("LSBs match for sampled glyphs in the full hMetric range", () => {
        // opentype.js has a known quirk for the lsb-only section of hmtx (glyphs
        // at index >= numberOfHMetrics): it may return leftSideBearing from a
        // different source (e.g. glyf xMin) that disagrees with the raw hmtx byte.
        // We only assert for glyphs that have their own full hMetric record.
        const numHM = otFont.tables.hhea?.numberOfHMetrics ?? otFont.glyphs.length;
        for (const id of glyphIds) {
          if (id >= numHM) continue; // skip lsb-only entries
          const ours = font.lsb(id);
          const otGlyph = otFont.glyphs.get(id);
          const oracle = (otGlyph as { leftSideBearing?: number }).leftSideBearing ?? 0;
          expect(ours, `glyph ${id} LSB`).toBe(oracle);
        }
      });

      it("glyphId() for sampled codepoints matches charToGlyphIndex()", () => {
        // Sample a handful of codepoints from the ASCII+Latin range
        const testCodepoints = [
          0x20, // space
          0x41, // A
          0x61, // a
          0x30, // 0
          0x2e, // .
          0xc0, // À (composite glyph in many fonts)
          0x400, // Cyrillic Є
        ];
        for (const cp of testCodepoints) {
          const ours = font.glyphId(cp);
          const oracle = otFont.charToGlyphIndex(String.fromCodePoint(cp));
          expect(ours, `codepoint U+${cp.toString(16).toUpperCase()} glyphId`).toBe(oracle);
        }
      });
    });
  }
});
