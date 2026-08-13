import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import opentype from "opentype.js";
import { Font } from "../../src/font/font";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = resolve(__dirname, "../fonts");

/**
 * A font loaded with both our parser and opentype.js for comparison.
 * The glyph set uses glyph indices (not codepoints) so it is independent
 * of cmap and works uniformly for text fonts and icon fonts.
 */
export interface LoadedFont {
  name: string;
  /** Our parser */
  font: Font;
  /** opentype.js oracle */
  otFont: opentype.Font;
  /** Glyph indices to exercise — a representative subset */
  glyphIds: number[];
}

/** Glyph indices to test for each font (subset keeps the test suite fast). */
function glyphSubset(numGlyphs: number): number[] {
  // .notdef + a spread across the glyph space
  const ids = new Set<number>([0]);
  const step = Math.max(1, Math.floor(numGlyphs / 80));
  for (let i = 1; i < numGlyphs; i += step) ids.add(i);
  // Always include the last glyph
  if (numGlyphs > 1) ids.add(numGlyphs - 1);
  return [...ids].sort((a, b) => a - b);
}

/** All fonts available for M1 parser tests. */
export function loadCorpusFonts(): LoadedFont[] {
  const fontFiles = [
    "Roboto.ttf",
    "NotoSans.ttf",
    "PTSerif-Regular.ttf",
    "PTSerif-Bold.ttf",
    "Arvo-Regular.ttf",
    "Lucide.ttf",
  ];

  return fontFiles.map((file) => {
    const path = resolve(FONTS_DIR, file);
    const buf = readFileSync(path);
    const arrayBuf = buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength,
    ) as ArrayBuffer;
    const font = new Font(arrayBuf);
    const otFont = opentype.parse(arrayBuf);
    const glyphIds = glyphSubset(otFont.glyphs.length);
    return { name: file.replace(".ttf", ""), font, otFont, glyphIds };
  });
}
