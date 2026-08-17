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
  /** Uniform texel-per-em generation scale. Default 32. */
  pixelsPerEm?: number;
  /** MSDF distance range in texels (msdfgen `-pxrange`). Default 4. */
  pxrange?: number;
  /** Initial atlas texture width in texels (power of two). Default 512. */
  atlasWidth?: number;
  /** Initial atlas texture height in texels (power of two). Default 512. */
  atlasHeight?: number;
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
 * Glyphs are generated and packed lazily on first `glyph()` miss; the atlas
 * texture grows (power-of-two) as needed and never moves previously packed
 * glyphs, so cached rects stay valid across growth.
 */
export class Atlas {
  private readonly _font: Font;
  private readonly _pxPerEm: number;
  private readonly _pxrange: number;
  private _width: number;
  private _height: number;
  private _pixels: Uint8Array;
  /** Open shelves for the shelf packer (y, height, usedWidth). */
  private readonly _shelves: { y: number; h: number; used: number }[] = [];
  /** Next un-used y row for a fresh shelf. */
  private _nextY = 0;
  private readonly _cache = new Map<number, AtlasGlyph>();
  /** SDF distance range in em — UNIFORM across all glyphs (that's the point). */
  readonly pxrangeEm: number;

  constructor(font: Font, opts: AtlasOptions = {}) {
    this._font = font;
    this._pxPerEm = opts.pixelsPerEm ?? 32;
    this._pxrange = opts.pxrange ?? 4;
    this._width = opts.atlasWidth ?? 512;
    this._height = opts.atlasHeight ?? 512;
    this._pixels = new Uint8Array(this._width * this._height * CHANNELS);
    this.pxrangeEm = this._pxrange / this._pxPerEm;
  }

  /** Current atlas texture width in texels. */
  get width(): number {
    return this._width;
  }
  /** Current atlas texture height in texels. */
  get height(): number {
    return this._height;
  }
  /** Current atlas texture, flat RGBA8 bytes, row-major, y-down. */
  get texture(): Uint8Array {
    return this._pixels;
  }

  /**
   * Returns layout + metrics for `codepoint`, generating and packing its
   * glyph into the atlas texture on first access.
   */
  glyph(codepoint: number): AtlasGlyph {
    const cached = this._cache.get(codepoint);
    if (cached) return cached;

    const font = this._font;
    const glyphId = font.glyphId(codepoint);
    const unitsPerEm = font.metrics.unitsPerEm;
    const advance = font.advance(glyphId) / unitsPerEm;
    const shape = font.shape(glyphId);
    emNormalizeShape(shape, unitsPerEm);

    // Empty outline (space, .notdef with no glyf): no atlas slot needed.
    if (shape.contours.length === 0) {
      const info: AtlasGlyph = {
        x: 0, y: 0, w: 0, h: 0,
        advance,
        planeLeft: 0, planeBottom: 0, planeRight: 0, planeTop: 0,
      };
      this._cache.set(codepoint, info);
      return info;
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

    const rect = this._pack(w, h);
    this._blit(msdf, rect.x, rect.y, w, h);

    const info: AtlasGlyph = {
      x: rect.x, y: rect.y, w, h,
      advance,
      planeLeft: -tx,
      planeBottom: -ty,
      planeRight: w / s - tx,
      planeTop: h / s - ty,
    };
    this._cache.set(codepoint, info);
    return info;
  }

  /**
   * Lays out `text` left-to-right, applying kerning, generating glyphs on
   * first use. Baseline is y=0; each `penX` is the pen position in em.
   */
  layout(text: string): { glyphs: LaidOutGlyph[]; widthEm: number } {
    const glyphs: LaidOutGlyph[] = [];
    const font = this._font;
    const upe = font.metrics.unitsPerEm;
    let penX = 0;
    let prevGid = -1;
    for (const ch of text) {
      const cp = ch.codePointAt(0)!;
      const gid = font.glyphId(cp);
      if (prevGid >= 0) penX += font.kerning(prevGid, gid) / upe;
      const glyph = this.glyph(cp);
      glyphs.push({ glyph, penX });
      penX += glyph.advance;
      prevGid = gid;
    }
    return { glyphs, widthEm: penX };
  }

  /**
   * Shelf pack one rect, best-height-fit; grow the atlas (doubling) as
   * needed. Previously packed rects never move.
   */
  private _pack(w: number, h: number): { x: number; y: number } {
    while (w > this._width) this._grow(this._width * 2, this._height);

    let bestIdx = -1;
    let bestH = Infinity;
    const shelves = this._shelves;
    for (let i = 0; i < shelves.length; i++) {
      const s = shelves[i]!;
      if (h <= s.h && s.used + w <= this._width && s.h < bestH) {
        bestIdx = i;
        bestH = s.h;
      }
    }
    if (bestIdx >= 0) {
      const s = shelves[bestIdx]!;
      const x = s.used;
      s.used += w;
      return { x, y: s.y };
    }

    while (this._nextY + h > this._height) this._grow(this._width, this._height * 2);
    const shelf = { y: this._nextY, h, used: w };
    shelves.push(shelf);
    this._nextY += h;
    return { x: 0, y: shelf.y };
  }

  /** Reallocate `_pixels` to (newW × newH), copying old rows into place. */
  private _grow(newW: number, newH: number): void {
    const oldW = this._width;
    const oldH = this._height;
    if (newW === oldW && newH === oldH) return;
    const next = new Uint8Array(newW * newH * CHANNELS);
    for (let y = 0; y < oldH; y++) {
      const src = y * oldW * CHANNELS;
      const dst = y * newW * CHANNELS;
      next.set(this._pixels.subarray(src, src + oldW * CHANNELS), dst);
    }
    this._pixels = next;
    this._width = newW;
    this._height = newH;
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
