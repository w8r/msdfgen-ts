/**
 * MSDF glyph atlas — single source of truth for generation AND consumption.
 *
 * Every glyph is generated at the SAME uniform em-to-texel scale
 * (`pixelsPerEm`), but each glyph's cell is CROPPED to its own tight
 * bounding box (plus `pxrange` texels of SDF safe-region padding on each
 * side). This gives:
 *   - No wasted atlas texels — a `.` doesn't get the same S×S slot as `M`.
 *   - A uniform `pxrangeEm` across all glyphs — the shader keeps a single
 *     `screenPxRange = atlas.pxrangeEm × pixelPerEm` uniform, no per-instance
 *     range varying and no per-glyph reasoning about crispness.
 *
 * The MSDF pipeline (normalize → colour → generate → sign-correct →
 * error-correct → byte-quantise → y-flip) is byte-for-byte identical to
 * the C++ msdfgen reference — see test/msdf/msdf.test.ts for the direct
 * pipeline golden. The atlas layout on top (crop + shelf-pack) is our own.
 *
 * msdfgen is MIT © Viktor Chlumský; this file is original.
 */

import { type Font } from "./font/font";
import { emNormalizeShape } from "./shape/normalize";
import { generateShapeMSDF } from "./msdf/shape-msdf";
import { type Shape } from "./shape/shape";
import potpack from "potpack";

/** Bytes per atlas texel (RGBA8; MSDF only uses 3 channels — alpha = 255). */
const CHANNELS = 4;

/** One cached atlas entry: layout + retained float MSDF (for repacking). */
type Entry = { glyph: AtlasGlyph; msdf: Float32Array | null };

/** Converts a msdfgen float channel value to a byte, matching C++
 *  `pixelFloatToByte` exactly. */
export function pixelFloatToByte(x: number): number {
  const c = x < 0 ? 0 : x > 1 ? 1 : x;
  return ~Math.trunc(255.5 - 255 * c) & 0xff;
}

/** Options for constructing an {@link Atlas}. */
export interface AtlasOptions {
  /** Uniform texel-per-em generation scale. Default 40. */
  pixelsPerEm?: number;
  /** MSDF distance range in texels (msdfgen `-pxrange`). Default 4. */
  pxrange?: number;
}

/** Cached layout + metrics for one atlas-resident glyph. */
export interface AtlasGlyph {
  /** Atlas texel rect (x, y, w, h). w=h=0 for glyphs with no outline. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Advance width, in em units. */
  advance: number;
  /** Cell rect in em units, relative to the pen origin (y-up, baseline y=0). */
  planeLeft: number;
  planeBottom: number;
  planeRight: number;
  planeTop: number;
}

/** One glyph positioned in a text run. */
export interface LaidOutGlyph {
  glyph: AtlasGlyph;
  /** Pen position (em, world-space X, relative to the glyph's own line). */
  penX: number;
  /** Baseline Y (em, world-space, y-up) — 0 for {@link Atlas.layout}'s
   *  single line; successive lines from {@link Atlas.layoutMultiline} get
   *  more negative, y-up matching the rest of this codebase's convention. */
  penY: number;
}

/**
 * Runtime MSDF glyph atlas backed by a single `Font` (or none, for an atlas
 * of arbitrary shapes such as SVG icons — see {@link Atlas.shapes}).
 *
 * Prefer {@link Atlas.glyphs} (batched — one potpack for the whole set) over
 * calling {@link Atlas.glyph} in a loop (one potpack per insert).
 * {@link Atlas.layout} already uses the batched path internally.
 *
 * `AtlasGlyph` objects are mutated in place across repacks, so keeping
 * a reference and re-reading `x`/`y` is safe; caching them in locals
 * before a subsequent insert is not.
 */
export class Atlas {
  private readonly _font: Font | null;
  private readonly _pxPerEm: number;
  private readonly _pxrange: number;
  private _width = 0;
  private _height = 0;
  private _pixels = new Uint8Array(0);
  /** Cached glyph + retained float MSDF (for repacking on new inserts).
   *  Keyed by Unicode codepoint — see {@link Atlas.glyphs}. */
  private readonly _cache = new Map<number, Entry>();
  /** Same shape as {@link Atlas._cache}, keyed by raw glyph index instead —
   *  see {@link Atlas.glyphsByIndex}. Separate map: a codepoint and a glyph
   *  index are different numbers in the same integer space. */
  private readonly _cacheByGid = new Map<number, Entry>();
  /** Same again, keyed by caller-chosen string — see {@link Atlas.shapes}. */
  private readonly _cacheByKey = new Map<string, Entry>();
  /** SDF distance range in em — UNIFORM across all glyphs (that's the point). */
  readonly pxrangeEm: number;

  /**
   * @param font Font for the glyph/layout methods; `null` for a shapes-only atlas.
   * @param opts Generation scale and distance range.
   */
  constructor(font: Font | null, opts: AtlasOptions = {}) {
    this._font = font;
    this._pxPerEm = opts.pixelsPerEm ?? 40;
    this._pxrange = opts.pxrange ?? 4;
    this.pxrangeEm = this._pxrange / this._pxPerEm;
  }

  /** Packed atlas texture width in texels (chosen by potpack). */
  get width(): number {
    return this._width;
  }
  /** Packed atlas texture height in texels (chosen by potpack). */
  get height(): number {
    return this._height;
  }
  /** Packed atlas texture, flat RGBA8 bytes, row-major, y-down. */
  get texture(): Uint8Array {
    return this._pixels;
  }

  /**
   * Batched generate + pack. Generates MSDFs for any codepoints not
   * already cached, then runs potpack **once** over the whole cache.
   * Returns the `AtlasGlyph` for each requested codepoint, in order.
   */
  glyphs(codepoints: Iterable<number>): AtlasGlyph[] {
    const result: AtlasGlyph[] = [];
    let added = 0;
    for (const cp of codepoints) {
      const cached = this._cache.get(cp);
      if (cached) {
        result.push(cached.glyph);
        continue;
      }
      const entry = this._generateForGlyphId(this._requireFont().glyphId(cp));
      this._cache.set(cp, entry);
      result.push(entry.glyph);
      added++;
    }
    if (added > 0) this._repack();
    return result;
  }

  /**
   * Single-glyph convenience: generates + packs if missing. Repacks the
   * whole atlas on every new insert — for more than one glyph, use
   * {@link Atlas.glyphs} instead.
   */
  glyph(codepoint: number): AtlasGlyph {
    return this.glyphs([codepoint])[0]!;
  }

  /**
   * Batched generate + pack, addressed by raw glyph index instead of
   * Unicode codepoint — the {@link Atlas.glyphs} twin for glyphs with no
   * reachable cmap entry. Icon fonts (e.g. Lucide) commonly have far more
   * glyphs than mapped codepoints; this is how the rest of the set gets
   * generated. Shares one packed atlas texture with the codepoint-addressed
   * cache — {@link Atlas.texture} always reflects everything requested
   * through either method. Cached separately from {@link Atlas.glyphs} (a
   * codepoint and a glyph index are different numbers in the same integer
   * space — sharing one cache would collide them).
   */
  glyphsByIndex(glyphIds: Iterable<number>): AtlasGlyph[] {
    const result: AtlasGlyph[] = [];
    let added = 0;
    for (const gid of glyphIds) {
      const cached = this._cacheByGid.get(gid);
      if (cached) {
        result.push(cached.glyph);
        continue;
      }
      const entry = this._generateForGlyphId(gid);
      this._cacheByGid.set(gid, entry);
      result.push(entry.glyph);
      added++;
    }
    if (added > 0) this._repack();
    return result;
  }

  /** Single-glyph convenience for {@link Atlas.glyphsByIndex} — see its
   *  doc. For more than one glyph, prefer {@link Atlas.glyphsByIndex}
   *  (one potpack for the whole batch instead of one per insert). */
  glyphByIndex(glyphId: number): AtlasGlyph {
    return this.glyphsByIndex([glyphId])[0]!;
  }

  /**
   * Batched generate + pack for arbitrary shapes (e.g. from `parseSvg`),
   * keyed by a caller-chosen string — the {@link Atlas.glyphs} twin for
   * non-font input. Shapes must be y-up, in the units `pixelsPerEm` scales
   * (`parseSvg` makes 1 unit = the viewBox height). A new shape is mutated
   * (normalized + coloured); a cached key ignores the shape passed. `advance`
   * is 0. Shares the one packed texture with the glyph caches.
   */
  shapes(entries: Iterable<readonly [key: string, shape: Shape]>): AtlasGlyph[] {
    const result: AtlasGlyph[] = [];
    let added = 0;
    for (const [key, shape] of entries) {
      let entry = this._cacheByKey.get(key);
      if (!entry) {
        entry = this._generate(shape, 0);
        this._cacheByKey.set(key, entry);
        added++;
      }
      result.push(entry.glyph);
    }
    if (added > 0) this._repack();
    return result;
  }

  /** The font, or a clear error for glyph/layout calls on a shapes-only atlas. */
  private _requireFont(): Font {
    if (!this._font) throw new Error("Atlas: no font — this atlas only supports shapes()");
    return this._font;
  }

  /**
   * Generates the MSDF for `glyphId`. Does not cache and does not pack —
   * callers own the cache key (a codepoint for {@link Atlas.glyphs}, the
   * glyph ID itself for {@link Atlas.glyphsByIndex}) and the repack.
   */
  private _generateForGlyphId(glyphId: number): Entry {
    const font = this._requireFont();
    const unitsPerEm = font.metrics.unitsPerEm;
    const shape = font.shape(glyphId);
    emNormalizeShape(shape, unitsPerEm);
    return this._generate(shape, font.advance(glyphId) / unitsPerEm);
  }

  /** Generates one entry from an em-unit shape. Does not cache or pack. */
  private _generate(shape: Shape, advance: number): Entry {
    const r = generateShapeMSDF(shape, this._pxPerEm, this._pxrange);
    // Empty outline (space, .notdef with no glyf): no atlas slot needed.
    const glyph: AtlasGlyph = {
      x: 0,
      y: 0,
      w: r ? r.w : 0,
      h: r ? r.h : 0,
      advance,
      planeLeft: r ? r.planeLeft : 0,
      planeBottom: r ? r.planeBottom : 0,
      planeRight: r ? r.planeRight : 0,
      planeTop: r ? r.planeTop : 0,
    };
    return { glyph, msdf: r ? r.msdf : null };
  }

  /**
   * Lays out `text` left-to-right on a single line, applying kerning.
   * Generates any missing glyphs and packs the atlas **once** for the
   * whole run. Baseline is y=0 (`penY` on every result is 0); each `penX`
   * is the pen position in em. `text` must not contain `\n` — use
   * {@link Atlas.layoutMultiline} for multi-line input.
   */
  layout(text: string): { glyphs: LaidOutGlyph[]; widthEm: number } {
    const codepoints: number[] = [];
    for (const ch of text) codepoints.push(ch.codePointAt(0)!);
    this.glyphs(codepoints); // one potpack for the whole string

    const laid: LaidOutGlyph[] = [];
    const font = this._requireFont();
    const upe = font.metrics.unitsPerEm;
    let penX = 0;
    let prevGid = -1;
    for (const cp of codepoints) {
      const gid = font.glyphId(cp);
      if (prevGid >= 0) penX += font.kerning(prevGid, gid) / upe;
      const glyph = this._cache.get(cp)!.glyph;
      laid.push({ glyph, penX, penY: 0 });
      penX += glyph.advance;
      prevGid = gid;
    }
    return { glyphs: laid, widthEm: penX };
  }

  /**
   * Lays out `text` as one or more `\n`-separated lines, each run through
   * {@link Atlas.layout} independently (so kerning never crosses a line
   * break) and stacked with `penY` decreasing by one line height per line
   * (y-up, matching this codebase's convention — line 0's baseline stays
   * at y=0). Line height is the font's own metrics:
   * `(ascender − descender + lineGap) / unitsPerEm`, matching typical
   * single-spaced typesetting — not a msdfgen concept, original to this
   * file (msdfgen has no text layout at all).
   *
   * `widthEm` is the widest line's; `heightEm` spans from line 0's top to
   * the last line's bottom, both approximate (ascender/descender-based,
   * not per-glyph ink bounds) — fine for camera framing, not for tight
   * cropping.
   */
  layoutMultiline(text: string): { glyphs: LaidOutGlyph[]; widthEm: number; heightEm: number } {
    const font = this._requireFont();
    const upe = font.metrics.unitsPerEm;
    const lineHeightEm =
      (font.metrics.ascender - font.metrics.descender + font.metrics.lineGap) / upe;
    const lines = text.split("\n");
    const glyphs: LaidOutGlyph[] = [];
    let widthEm = 0;
    for (let i = 0; i < lines.length; i++) {
      const { glyphs: lineGlyphs, widthEm: lineWidthEm } = this.layout(lines[i]!);
      const penY = -i * lineHeightEm;
      for (const g of lineGlyphs) glyphs.push({ glyph: g.glyph, penX: g.penX, penY });
      if (lineWidthEm > widthEm) widthEm = lineWidthEm;
    }
    return { glyphs, widthEm, heightEm: lines.length * lineHeightEm };
  }

  /** Repacks every cached entry (codepoint-, glyph-index- and string-keyed
   *  caches — one shared texture) with potpack, reallocates the texture,
   *  and re-blits each MSDF at its assigned rect. Called by `glyphs()`/
   *  `glyphsByIndex()` after any batch of new inserts — once per batch. */
  private _repack(): void {
    const boxes: {
      w: number;
      h: number;
      x: number;
      y: number;
      entry: Entry;
    }[] = [];
    for (const cache of [this._cache, this._cacheByGid, this._cacheByKey]) {
      for (const entry of cache.values()) {
        if (entry.msdf === null) continue; // empty outline
        boxes.push({ w: entry.glyph.w, h: entry.glyph.h, x: 0, y: 0, entry });
      }
    }
    const { w: W, h: H } = potpack(boxes);
    this._width = W;
    this._height = H;
    this._pixels = new Uint8Array(W * H * CHANNELS);
    for (const box of boxes) {
      box.entry.glyph.x = box.x;
      box.entry.glyph.y = box.y;
      this._blit(box.entry.msdf!, box.x, box.y, box.w, box.h);
    }
  }

  /**
   * Quantise `msdf` (float, y-up, row 0 = bottom, w×h×3) into `_pixels` at
   * atlas rect (`ax`, `ay`, `w`, `h`) — the single y-flip point.
   */
  private _blit(msdf: Float32Array, ax: number, ay: number, w: number, h: number): void {
    const W = this._width;
    const dst = this._pixels;
    for (let sy = 0; sy < h; sy++) {
      const dstRow = ay + (h - 1 - sy); // y-up bitmap row -> y-down atlas row
      for (let sx = 0; sx < w; sx++) {
        const s = (sy * w + sx) * 3;
        const d = (dstRow * W + (ax + sx)) * CHANNELS;
        dst[d] = pixelFloatToByte(msdf[s]!);
        dst[d + 1] = pixelFloatToByte(msdf[s + 1]!);
        dst[d + 2] = pixelFloatToByte(msdf[s + 2]!);
        dst[d + 3] = 255;
      }
    }
  }
}
