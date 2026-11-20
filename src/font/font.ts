import { type CmapLookup, parseCmap } from "./tables/cmap";
import { type HeadTable, parseHead } from "./tables/head";
import { type HheaTable, parseHhea } from "./tables/hhea";
import { type HMetric, parseHmtx } from "./tables/hmtx";
import { parseLoca } from "./tables/loca";
import { parseMaxp } from "./tables/maxp";
import { parseGlyph, parseGlyphRaw, type RawGlyph } from "./tables/glyf";
import { KernTable } from "./tables/kern";
import { Gdef } from "./tables/gdef";
import { Gpos } from "./tables/gpos";
import { pairKerning } from "./shaper";
import { type TableMap, parseSfnt } from "./sfnt";
import { type Shape } from "../shape/shape";

/** Codepoints below this get their cmap lookup cached (Latin, Greek, Cyrillic, …). */
const CMAP_CACHE = 0x800;

/** Entries {@link Font.kerning} memoizes before starting over. */
const PAIR_CACHE = 1 << 16;

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
  /** Glyph ids of codepoints below {@link CMAP_CACHE}, +1 (0 = not looked up yet). */
  private _cmapCache: Uint16Array | null;
  /** Layout tables (GDEF, GPOS, kern), parsed on first use: see {@link Font._loadLayout}. */
  private _layoutLoaded: boolean;
  private _gdef: Gdef | null;
  private _gpos: Gpos | null;
  private _kern: KernTable | null;
  /** See {@link Font._advances}. */
  private _advanceTable: Uint16Array | null;
  /** Memoized {@link Font.kerning} results, keyed by glyph pair. */
  private _pairCache: Map<number, number>;

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

    this._cmapCache = null;
    this._layoutLoaded = false;
    this._gdef = null;
    this._gpos = null;
    this._kern = null;
    this._advanceTable = null;
    this._pairCache = new Map();

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
    if (codepoint >= CMAP_CACHE || codepoint < 0) return this._cmap(codepoint);
    let cache = this._cmapCache;
    if (!cache) cache = this._cmapCache = new Uint16Array(CMAP_CACHE);
    let g = cache[codepoint]!;
    if (!g) cache[codepoint] = g = this._cmap(codepoint) + 1;
    return g - 1;
  }

  /**
   * Total glyph count (`maxp.numGlyphs`), including `.notdef` at index 0.
   * Valid glyph IDs for {@link Font.shape}/{@link Font.advance} are
   * `0..numGlyphs-1`. Icon fonts (e.g. Lucide) often have far more glyphs
   * than reachable Unicode codepoints — this is how a consumer enumerates
   * "every glyph" rather than "every mapped character"; derived from
   * `loca` (always `numGlyphs + 1` entries), no extra stored state.
   */
  get numGlyphs(): number {
    return this._loca.length - 1;
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
   * Kerning between two glyphs in font units: how much positioning the pair
   * on its own changes its total advance (GPOS `kern` and other default
   * positioning features, else the legacy `kern` table, as Chrome applies
   * them). Pairwise only — {@link Atlas.layout} kerns whole runs, which also
   * accounts for script runs and contextual kerning.
   *
   * @param leftGlyphId Left glyph index.
   * @param rightGlyphId Right glyph index.
   * @returns Advance adjustment in font units, 0 for an unkerned pair.
   */
  kerning(leftGlyphId: number, rightGlyphId: number): number {
    // A small-integer key (fast Map lookups) for ids below 2^15, the usual case.
    const key =
      leftGlyphId < 0x8000 && rightGlyphId < 0x8000
        ? (leftGlyphId << 15) | rightGlyphId
        : -1 - (leftGlyphId * 0x10000 + rightGlyphId);
    const k = this._pairCache.get(key);
    return k !== undefined ? k : this._kerningMiss(key, leftGlyphId, rightGlyphId);
  }

  /** {@link Font.kerning}'s cache miss, kept out of line so the hit path stays small. */
  private _kerningMiss(key: number, left: number, right: number): number {
    const k = pairKerning(this, left, right);
    if (this._pairCache.size >= PAIR_CACHE) this._pairCache.clear();
    this._pairCache.set(key, k);
    return k;
  }

  /** Parses GDEF, GPOS and kern on first use (keeps `new Font` cheap). */
  private _loadLayout(): void {
    if (this._layoutLoaded) return;
    this._layoutLoaded = true;
    const buffer = this._buffer;
    const gdef = this._tables.get("GDEF");
    const gpos = this._tables.get("GPOS");
    const kern = this._tables.get("kern");
    if (gdef) this._gdef = new Gdef(buffer, gdef.offset, this.numGlyphs);
    if (gpos) this._gpos = new Gpos(buffer, gpos.offset, this._gdef);
    if (kern) this._kern = new KernTable(buffer, kern.offset);
  }

  /** @internal Advance widths by glyph id (dense copy of `hmtx` for layout). */
  _advances(): Uint16Array {
    let a = this._advanceTable;
    if (!a) {
      const n = this._hmtx.length;
      a = new Uint16Array(n);
      for (let g = 0; g < n; g++) a[g] = this._hmtx[g]!.advanceWidth;
      this._advanceTable = a;
    }
    return a;
  }

  /** @internal GDEF glyph props per glyph, or null (classes are then synthesized). */
  _glyphProps(): Uint16Array | null {
    this._loadLayout();
    return this._gdef ? this._gdef._props : null;
  }

  /** @internal The GPOS table, or null. */
  _gposTable(): Gpos | null {
    this._loadLayout();
    return this._gpos;
  }

  /** @internal The legacy kern table, or null. */
  _kernTable(): KernTable | null {
    this._loadLayout();
    return this._kern;
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
