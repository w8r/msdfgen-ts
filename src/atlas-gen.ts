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
import { emNormalizeShape, normalizeShape } from "./shape/normalize";
import { edgeColoringSimple } from "./msdf/edge-coloring";
import { generateMSDF } from "./msdf/generate";
import { distanceSignCorrection, msdfErrorCorrection } from "./msdf/error-correction";
import { type Shape } from "./shape/shape";
import potpack from "potpack";

/** Edge-coloring corner angle threshold (radians) — matches msdfgen CLI default. */
const ANGLE_THRESHOLD = 3.0;
/** Edge-coloring PRNG seed — matches msdfgen CLI default. */
const COLOR_SEED = 0n;
/** Bytes per atlas texel (RGBA8; MSDF only uses 3 channels — alpha = 255). */
const CHANNELS = 4;
/** Segment t-samples per axis for shape bounds (control-hull would be tighter
 *  in theory but is looser in practice for outward-curving Béziers; 16 is
 *  well under a texel of slop at any realistic pixelsPerEm). */
const BOUNDS_SAMPLES = 16;

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
  /** Pen position (em, world-space X, baseline y=0). */
  penX: number;
}

/**
 * Runtime MSDF glyph atlas backed by a single `Font`.
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
  private readonly _font: Font;
  private readonly _pxPerEm: number;
  private readonly _pxrange: number;
  private _width = 0;
  private _height = 0;
  private _pixels = new Uint8Array(0);
  /** Cached glyph + retained float MSDF (for repacking on new inserts). */
  private readonly _cache = new Map<number, { glyph: AtlasGlyph; msdf: Float32Array | null }>();
  /** SDF distance range in em — UNIFORM across all glyphs (that's the point). */
  readonly pxrangeEm: number;

  constructor(font: Font, opts: AtlasOptions = {}) {
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
      if (cached) { result.push(cached.glyph); continue; }
      result.push(this._generate(cp));
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

  /** Generates + caches the MSDF for `codepoint`. Does NOT pack. */
  private _generate(codepoint: number): AtlasGlyph {
    const font = this._font;
    const glyphId = font.glyphId(codepoint);
    const unitsPerEm = font.metrics.unitsPerEm;
    const advance = font.advance(glyphId) / unitsPerEm;
    const shape = font.shape(glyphId);
    emNormalizeShape(shape, unitsPerEm);

    // Empty outline (space, .notdef with no glyf): no atlas slot needed.
    if (shape.contours.length === 0) {
      const glyph: AtlasGlyph = {
        x: 0, y: 0, w: 0, h: 0,
        advance,
        planeLeft: 0, planeBottom: 0, planeRight: 0, planeTop: 0,
      };
      this._cache.set(codepoint, { glyph, msdf: null });
      return glyph;
    }

    const bounds = _shapeBounds(shape);
    const s = this._pxPerEm;
    const pxr = this._pxrange;
    // Cell size in texels = ceil(bbox in texels) + 2*pxr on each side.
    const w = Math.max(1, Math.ceil((bounds.maxX - bounds.minX) * s)) + 2 * pxr;
    const h = Math.max(1, Math.ceil((bounds.maxY - bounds.minY) * s)) + 2 * pxr;
    // Place the glyph so its bbox min sits at cell texel (pxr, pxr).
    // msdfgen projection convention: pixel = s*(shape + t) (ignoring the
    // −0.5 texel-centre offset, as elsewhere in this codebase's plane bounds).
    const tx = pxr / s - bounds.minX;
    const ty = pxr / s - bounds.minY;

    normalizeShape(shape);
    edgeColoringSimple(shape, ANGLE_THRESHOLD, COLOR_SEED);

    const msdf = new Float32Array(w * h * 3);
    generateMSDF(shape, w, h, s, tx, ty, pxr, msdf);
    distanceSignCorrection(msdf, shape, w, h, s, tx, ty);
    msdfErrorCorrection(msdf, shape, w, h, s, tx, ty, pxr);

    const glyph: AtlasGlyph = {
      x: 0, y: 0, w, h,
      advance,
      planeLeft: -tx,
      planeBottom: -ty,
      planeRight: w / s - tx,
      planeTop: h / s - ty,
    };
    this._cache.set(codepoint, { glyph, msdf });
    return glyph;
  }

  /**
   * Lays out `text` left-to-right, applying kerning. Generates any missing
   * glyphs and packs the atlas **once** for the whole run.
   * Baseline is y=0; each `penX` is the pen position in em.
   */
  layout(text: string): { glyphs: LaidOutGlyph[]; widthEm: number } {
    const codepoints: number[] = [];
    for (const ch of text) codepoints.push(ch.codePointAt(0)!);
    this.glyphs(codepoints); // one potpack for the whole string

    const laid: LaidOutGlyph[] = [];
    const font = this._font;
    const upe = font.metrics.unitsPerEm;
    let penX = 0;
    let prevGid = -1;
    for (const cp of codepoints) {
      const gid = font.glyphId(cp);
      if (prevGid >= 0) penX += font.kerning(prevGid, gid) / upe;
      const glyph = this._cache.get(cp)!.glyph;
      laid.push({ glyph, penX });
      penX += glyph.advance;
      prevGid = gid;
    }
    return { glyphs: laid, widthEm: penX };
  }

  /** Repacks every cached glyph with potpack, reallocates the texture,
   *  and re-blits each MSDF at its assigned rect. Called by `glyphs()`
   *  after any batch of new inserts — once per batch. */
  private _repack(): void {
    const boxes: { w: number; h: number; x: number; y: number; entry: { glyph: AtlasGlyph; msdf: Float32Array | null } }[] = [];
    for (const entry of this._cache.values()) {
      if (entry.msdf === null) continue; // empty outline
      boxes.push({ w: entry.glyph.w, h: entry.glyph.h, x: 0, y: 0, entry });
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

/** Reusable point sample buffer for `_shapeBounds`. */
const _pt: number[] = [0, 0];

/**
 * Axis-aligned bounds of a shape (em units), sampled at `BOUNDS_SAMPLES`
 * t-values per segment. Not mathematically tight, but well under a texel
 * of slop at any realistic `pixelsPerEm` — good enough for cropping.
 */
function _shapeBounds(shape: Shape): {
  minX: number; minY: number; maxX: number; maxY: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const contour of shape.contours) {
    for (const seg of contour) {
      for (let i = 0; i <= BOUNDS_SAMPLES; i++) {
        seg.point(i / BOUNDS_SAMPLES, _pt);
        const x = _pt[0]!;
        const y = _pt[1]!;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY };
}
