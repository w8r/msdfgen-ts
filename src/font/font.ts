import { type CmapLookup, parseCmap } from "./tables/cmap";
import { type HeadTable, parseHead } from "./tables/head";
import { type HheaTable, parseHhea } from "./tables/hhea";
import { type HMetric, parseHmtx } from "./tables/hmtx";
import { parseLoca } from "./tables/loca";
import { parseMaxp } from "./tables/maxp";
import { parseGlyph, parseGlyphRaw, type RawGlyph } from "./tables/glyf";
import { type KernMap, parseKern } from "./tables/kern";
import { type TableMap, parseSfnt } from "./sfnt";
import { type Shape } from "../shape/shape";

/** Font-level metrics exposed from `head` and `hhea`. */
export interface FontMetrics {
  /** Design units per em-square. */
  unitsPerEm: number;
  /** Typographic ascender in font units. */
  ascender: number;
  /** Typographic descender in font units (typically negative). */
  descender: number;
  /** Recommended additional line spacing in font units. */
  lineGap: number;
}

/**
 * Public Font class — wraps a parsed TrueType font buffer.
 *
 * Raw font units are returned throughout M1.
 * Em-normalisation (÷ unitsPerEm) is applied at a single named boundary in M3
 * to match the `FONT_SCALING_EM_NORMALIZED` convention used in the goldens.
 */
export class Font {
  /** @type {ArrayBuffer} */
  private _buffer: ArrayBuffer;
  /** @type {TableMap} */
  private _tables: TableMap;
  /** @type {HeadTable} */
  private _head: HeadTable;
  /** @type {HheaTable} */
  private _hhea: HheaTable;
  /** @type {HMetric[]} */
  private _hmtx: HMetric[];
  /** @type {number[]} */
  private _loca: number[];
  /** @type {CmapLookup} */
  private _cmap: CmapLookup;
  /** @type {KernMap} */
  private _kern: KernMap;

  /** Font-level metrics (unitsPerEm, ascender, descender, lineGap). */
  readonly metrics: FontMetrics;

  /**
   * Parses a TrueType font from an ArrayBuffer.
   *
   * Supports single TTF files and TTC collections (first font only).
   * Variable fonts (gvar/fvar) are accepted; variation deltas are ignored —
   * the default-instance glyf outlines are used as-is.
   *
   * @param buffer Raw font file bytes.
   */
  constructor(buffer: ArrayBuffer) {
    this._buffer = buffer;
    this._tables = parseSfnt(buffer);

    const headRec = this._tables.get("head");
    const maxpRec = this._tables.get("maxp");
    const hheaRec = this._tables.get("hhea");
    const hmtxRec = this._tables.get("hmtx");
    const locaRec = this._tables.get("loca");
    const cmapRec = this._tables.get("cmap");

    if (!headRec) throw new Error("Font missing required `head` table");
    if (!maxpRec) throw new Error("Font missing required `maxp` table");
    if (!hheaRec) throw new Error("Font missing required `hhea` table");
    if (!hmtxRec) throw new Error("Font missing required `hmtx` table");
    if (!locaRec) throw new Error("Font missing required `loca` table");
    if (!cmapRec) throw new Error("Font missing required `cmap` table");

    this._head = parseHead(buffer, headRec.offset);
    const maxp = parseMaxp(buffer, maxpRec.offset);
    this._hhea = parseHhea(buffer, hheaRec.offset);
    this._hmtx = parseHmtx(buffer, hmtxRec.offset, maxp.numGlyphs, this._hhea.numberOfHMetrics);
    this._loca = parseLoca(buffer, locaRec.offset, maxp.numGlyphs, this._head.indexToLocFormat);
    this._cmap = parseCmap(buffer, cmapRec.offset);

    // kern is optional
    const kernRec = this._tables.get("kern");
    this._kern = kernRec ? parseKern(buffer, kernRec.offset) : () => 0;

    this.metrics = {
      unitsPerEm: this._head.unitsPerEm,
      ascender: this._hhea.ascender,
      descender: this._hhea.descender,
      lineGap: this._hhea.lineGap,
    };
  }

  /**
   * Maps a Unicode codepoint to its glyph ID.
   * Returns 0 (.notdef) if the codepoint is not in the font.
   *
   * @param codepoint Unicode scalar value.
   */
  glyphId(codepoint: number): number {
    return this._cmap(codepoint);
  }

  /**
   * Advance width of a glyph in font units.
   *
   * @param glyphId Glyph index.
   */
  advance(glyphId: number): number {
    return (this._hmtx[glyphId] ?? this._hmtx[this._hmtx.length - 1] ?? { advanceWidth: 0 })
      .advanceWidth;
  }

  /**
   * Left side bearing of a glyph in font units.
   *
   * @param glyphId Glyph index.
   */
  lsb(glyphId: number): number {
    return (this._hmtx[glyphId] ?? this._hmtx[this._hmtx.length - 1] ?? { lsb: 0 }).lsb;
  }

  /**
   * Kerning adjustment between two glyphs in font units.
   * Returns 0 if the font has no kern table or the pair is not listed.
   *
   * @param leftGlyphId Left glyph index.
   * @param rightGlyphId Right glyph index.
   */
  kerning(leftGlyphId: number, rightGlyphId: number): number {
    return this._kern(leftGlyphId, rightGlyphId);
  }

  /**
   * Parses and returns the outline of a glyph as a Shape (raw font units, y-up).
   *
   * Composite glyphs are recursively resolved. The returned Shape has all
   * contours in absolute coordinates of the root glyph's coordinate space.
   *
   * Returns an empty Shape for glyphs with no outline (space, .notdef with no
   * outline, etc.).
   *
   * @param glyphId Glyph index.
   * @returns Shape with contours in font units, inverseYAxis=false.
   */
  shape(glyphId: number): Shape {
    const glyfRec = this._tables.get("glyf");
    if (!glyfRec) return { contours: [], inverseYAxis: false };

    const locaOffsets = this._loca;
    const glyfOffset = locaOffsets[glyphId] ?? 0;
    const glyfEnd = locaOffsets[glyphId + 1] ?? glyfOffset;
    const glyfSize = glyfEnd - glyfOffset;

    return parseGlyph(this._buffer, glyfRec.offset, glyfOffset, glyfSize, (componentId) =>
      this._glyphRaw(componentId),
    );
  }

  /**
   * Parses a glyph to its raw (pre-midpoint) outline, used as the composite
   * recursion primitive so implied midpoints are expanded only on the final
   * merged outline (matching FreeType).
   * @internal
   */
  private _glyphRaw(glyphId: number): RawGlyph {
    const glyfRec = this._tables.get("glyf");
    if (!glyfRec) return [];

    const locaOffsets = this._loca;
    const glyfOffset = locaOffsets[glyphId] ?? 0;
    const glyfEnd = locaOffsets[glyphId + 1] ?? glyfOffset;
    const glyfSize = glyfEnd - glyfOffset;

    return parseGlyphRaw(this._buffer, glyfRec.offset, glyfOffset, glyfSize, (componentId) =>
      this._glyphRaw(componentId),
    );
  }
}
