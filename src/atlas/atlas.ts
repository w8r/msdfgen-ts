/**
 * Runtime glyph atlas: parses glyphs from a `Font` on demand, generates
 * their MSDF, and packs them into a growing `Uint8Array` RGBA texture.
 *
 * Not a port of C++ msdfgen — msdfgen's CLI renders one glyph per
 * invocation and has no atlas concept. The per-glyph generation pipeline
 * (em-normalize → normalize → color → generate → sign-correct → error-
 * correct) mirrors what `-emnormalize -scanline` does in the CLI, using
 * the same fixed em-box scale/translate convention as the golden fixtures
 * (see tools/gen-golden.mjs getParams "text" branch) so a glyph's atlas
 * bitmap is directly comparable to its golden fixture.
 *
 * y-axis orientation is fixed in exactly one place, per CLAUDE.md: `_blit`
 * flips msdfgen's y-up bitmap rows (row 0 = bottom) into the atlas
 * texture's y-down rows (row 0 = top).
 *
 * msdfgen is MIT © Viktor Chlumský; this file is original.
 */

import { type Font } from "../font/font.js";
import { emNormalizeShape, normalizeShape } from "../shape/normalize.js";
import { edgeColoringSimple } from "../msdf/edge-coloring.js";
import { generateMSDF } from "../msdf/generate.js";
import { distanceSignCorrection, msdfErrorCorrection } from "../msdf/error-correction.js";
import { ShelfPacker, type PackRect } from "./packer.js";

/** Edge-coloring corner angle threshold (radians) — matches msdfgen CLI default. */
const ANGLE_THRESHOLD = 3.0;
/** Edge-coloring PRNG seed — matches msdfgen CLI default. */
const COLOR_SEED = 0n;
/** Bytes per atlas texel (RGBA8, even though MSDF only uses 3 channels — see CLAUDE.md Stack decisions). */
const CHANNELS = 4;

/**
 * Converts a msdfgen float channel value to a byte, matching C++ exactly.
 * port of core/pixel-conversion.hpp: pixelFloatToByte
 *
 * @param x Float channel value (typically near [0, 1], can exceed it).
 * @returns Byte in [0, 255].
 */
export function pixelFloatToByte(x: number): number {
  const c = x < 0 ? 0 : x > 1 ? 1 : x;
  return ~Math.trunc(255.5 - 255 * c) & 0xff;
}

/** Options for constructing an {@link Atlas}. */
export interface AtlasOptions {
  /** Cell size in pixels — every glyph is rendered into a `size`×`size` square. Default 48. */
  size?: number;
  /** Distance field range in pixels (msdfgen `-pxrange`). Default 4. */
  pxrange?: number;
  /** Initial atlas width in texels (should be a power of two). Default 512. */
  atlasWidth?: number;
  /** Initial atlas height in texels (should be a power of two). Default 512. */
  atlasHeight?: number;
}

/** Cached layout + metrics for one atlas-resident glyph. */
export interface GlyphInfo {
  /** Placement within the current atlas texture, in texels. */
  rect: PackRect;
  /** Advance width, in em units (font-unit advance ÷ unitsPerEm). */
  advance: number;
  /** Cell size in pixels (same for every glyph in this atlas). */
  size: number;
}

/**
 * Runtime MSDF glyph atlas backed by a single `Font`.
 *
 * Glyphs are generated and packed lazily on first `getGlyph` miss; the
 * atlas texture grows (power-of-two) as needed and never moves previously
 * packed glyphs, so cached {@link GlyphInfo.rect} values stay valid across
 * growth — only the overall texture dimensions change.
 */
export class Atlas {
  private readonly _font: Font;
  private readonly _size: number;
  private readonly _pxrange: number;
  private readonly _packer: ShelfPacker;
  private _pixels: Uint8Array;
  private readonly _cache = new Map<number, GlyphInfo>();
  private readonly _msdf: Float32Array;

  /**
   * @param font Parsed font to generate glyphs from.
   * @param options Cell size, pxrange, and initial atlas dimensions.
   */
  constructor(font: Font, options: AtlasOptions = {}) {
    this._font = font;
    this._size = options.size ?? 48;
    this._pxrange = options.pxrange ?? 4;
    const width = options.atlasWidth ?? 512;
    const height = options.atlasHeight ?? 512;
    this._packer = new ShelfPacker(width, height);
    this._pixels = new Uint8Array(width * height * CHANNELS);
    this._msdf = new Float32Array(this._size * this._size * 3);
  }

  /** Current atlas texture width in texels. */
  get width(): number {
    return this._packer.width;
  }

  /** Current atlas texture height in texels. */
  get height(): number {
    return this._packer.height;
  }

  /** Current atlas texture, flat RGBA8 bytes, row-major, y-down (row 0 = top). */
  get texture(): Uint8Array {
    return this._pixels;
  }

  /**
   * Returns layout + metrics for `codepoint`, generating and packing its
   * glyph into the atlas texture on first access.
   *
   * @param codepoint Unicode scalar value.
   */
  getGlyph(codepoint: number): GlyphInfo {
    const cached = this._cache.get(codepoint);
    if (cached) return cached;

    const glyphId = this._font.glyphId(codepoint);
    const unitsPerEm = this._font.metrics.unitsPerEm;
    const shape = this._font.shape(glyphId);
    emNormalizeShape(shape, unitsPerEm);
    normalizeShape(shape);
    edgeColoringSimple(shape, ANGLE_THRESHOLD, COLOR_SEED);

    // Fixed em-box cell: whole em square maps to a size×size canvas.
    // port of tools/gen-golden.mjs: getParams (text branch)
    const scale = this._size - 2 * this._pxrange;
    const tx = this._pxrange / scale;
    const ty = this._pxrange / scale + 0.25;

    generateMSDF(shape, this._size, this._size, scale, tx, ty, this._pxrange, this._msdf);
    distanceSignCorrection(this._msdf, shape, this._size, this._size, scale, tx, ty);
    msdfErrorCorrection(
      this._msdf,
      shape,
      this._size,
      this._size,
      scale,
      tx,
      ty,
      this._pxrange,
    );

    const prevWidth = this._packer.width;
    const prevHeight = this._packer.height;
    const rect = this._packer.pack(this._size, this._size);
    if (this._packer.width !== prevWidth || this._packer.height !== prevHeight) {
      this._reflow(prevWidth, prevHeight);
    }
    this._blit(rect);

    const info: GlyphInfo = {
      rect,
      advance: this._font.advance(glyphId) / unitsPerEm,
      size: this._size,
    };
    this._cache.set(codepoint, info);
    return info;
  }

  /**
   * Reallocates the pixel buffer to the packer's current (grown) dimensions,
   * copying existing rows across — needed whenever growth changes the row
   * stride (width growth) and harmless when it doesn't (height growth).
   *
   * @param oldWidth Previous atlas width in texels.
   * @param oldHeight Previous atlas height in texels.
   */
  private _reflow(oldWidth: number, oldHeight: number): void {
    const newWidth = this._packer.width;
    const newHeight = this._packer.height;
    const next = new Uint8Array(newWidth * newHeight * CHANNELS);
    for (let y = 0; y < oldHeight; y++) {
      const srcOff = y * oldWidth * CHANNELS;
      const dstOff = y * newWidth * CHANNELS;
      next.set(this._pixels.subarray(srcOff, srcOff + oldWidth * CHANNELS), dstOff);
    }
    this._pixels = next;
  }

  /**
   * Quantizes `_msdf` (float, y-up, row 0 = bottom) into the atlas texture
   * at `rect` (byte, y-down, row 0 = top) — the single y-flip point.
   *
   * @param rect Destination placement in atlas texel space.
   */
  private _blit(rect: PackRect): void {
    const { x, y, w, h } = rect;
    const atlasWidth = this._packer.width;
    const src = this._msdf;
    const dst = this._pixels;
    for (let sy = 0; sy < h; sy++) {
      const dstRow = y + (h - 1 - sy); // y-up bitmap row -> y-down texture row
      for (let sx = 0; sx < w; sx++) {
        const srcBase = (sy * w + sx) * 3;
        const dstBase = (dstRow * atlasWidth + (x + sx)) * CHANNELS;
        dst[dstBase] = pixelFloatToByte(src[srcBase]!);
        dst[dstBase + 1] = pixelFloatToByte(src[srcBase + 1]!);
        dst[dstBase + 2] = pixelFloatToByte(src[srcBase + 2]!);
        dst[dstBase + 3] = 255;
      }
    }
  }
}
