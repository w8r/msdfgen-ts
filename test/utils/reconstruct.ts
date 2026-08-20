/**
 * Pure (DOM-free) MSDF reconstruction — the same per-pixel math as
 * demo/canvas/main.ts's `renderAtSize`, factored out for test reuse.
 * Writes straight into a `Uint8ClampedArray`, no `<canvas>`/`ImageData`
 * needed, so this runs under plain Node (used by test/e2e.test.ts).
 *
 * Reconstruction formula matches msdfgen's reference shader exactly:
 *   sd = median(r,g,b) - 0.5
 *   screenPxDistance = screenPxRange * sd
 *   opacity = clamp(screenPxDistance + 0.5, 0, 1)
 */
import { type Atlas, type LaidOutGlyph } from "../../src/index";

/** Bilinear-samples one RGB texel (as [0,1] floats) from the atlas texture. */
function sampleAtlas(atlas: Atlas, sx: number, sy: number): [number, number, number] {
  const w = atlas.width;
  const h = atlas.height;
  const x0 = Math.floor(sx);
  const y0 = Math.floor(sy);
  const fx = sx - x0;
  const fy = sy - y0;
  const x1 = Math.min(x0 + 1, w - 1);
  const y1 = Math.min(y0 + 1, h - 1);
  const cx0 = Math.max(0, Math.min(x0, w - 1));
  const cy0 = Math.max(0, Math.min(y0, h - 1));
  const tex = atlas.texture;
  const px = (x: number, y: number, ch: number): number => tex[(y * w + x) * 4 + ch]! / 255;
  let r = 0;
  let g = 0;
  let b = 0;
  for (const ch of [0, 1, 2] as const) {
    const c00 = px(cx0, cy0, ch);
    const c10 = px(x1, cy0, ch);
    const c01 = px(cx0, y1, ch);
    const c11 = px(x1, y1, ch);
    const top = c00 + fx * (c10 - c00);
    const bottom = c01 + fx * (c11 - c01);
    const v = top + fy * (bottom - top);
    if (ch === 0) r = v;
    else if (ch === 1) g = v;
    else b = v;
  }
  return [r, g, b];
}

function median3(a: number, b: number, c: number): number {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
}

/** Flat RGBA8 image buffer, row-major, alpha always 255. */
export interface ReconstructedImage {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/**
 * Reconstructs `glyphs` (already laid out in em units by `Atlas.layout`)
 * onto a fresh `width`x`height` RGBA buffer, at `targetSize` px-per-em,
 * anchored so glyph `i`'s pen position lands at `originXPx + penX*targetSize`
 * horizontally and `baselineYPx` vertically — same anchor the caller uses
 * for the reference (native-rasterizer) render, so the two are pixel-
 * comparable without re-deriving layout twice.
 */
export function reconstructText(
  atlas: Atlas,
  glyphs: LaidOutGlyph[],
  targetSize: number,
  fg: [number, number, number],
  bg: [number, number, number],
  width: number,
  height: number,
  originXPx: number,
  baselineYPx: number,
): ReconstructedImage {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = bg[0];
    data[i + 1] = bg[1];
    data[i + 2] = bg[2];
    data[i + 3] = 255;
  }

  const screenPxRange = atlas.pxrangeEm * targetSize;

  for (const { glyph, penX } of glyphs) {
    if (glyph.w === 0) continue; // empty outline (space, .notdef)
    const originX = originXPx + penX * targetSize;
    const cellLeft = originX + glyph.planeLeft * targetSize;
    const cellTop = baselineYPx - glyph.planeTop * targetSize;
    const cellWidthPx = (glyph.planeRight - glyph.planeLeft) * targetSize;
    const cellHeightPx = (glyph.planeTop - glyph.planeBottom) * targetSize;

    const dstX0 = Math.max(0, Math.floor(cellLeft));
    const dstY0 = Math.max(0, Math.floor(cellTop));
    const dstX1 = Math.min(width, Math.ceil(cellLeft + cellWidthPx));
    const dstY1 = Math.min(height, Math.ceil(cellTop + cellHeightPx));

    for (let dy = dstY0; dy < dstY1; dy++) {
      const cellFracY = (dy - cellTop) / cellHeightPx;
      const srcY = glyph.y + cellFracY * glyph.h;
      for (let dx = dstX0; dx < dstX1; dx++) {
        const cellFracX = (dx - cellLeft) / cellWidthPx;
        const srcX = glyph.x + cellFracX * glyph.w;

        const [r, g, b] = sampleAtlas(atlas, srcX, srcY);
        const sd = median3(r, g, b) - 0.5;
        const screenPxDistance = screenPxRange * sd;
        const opacity = Math.max(0, Math.min(1, screenPxDistance + 0.5));

        const idx = (dy * width + dx) * 4;
        data[idx] = data[idx]! + (fg[0] - data[idx]!) * opacity;
        data[idx + 1] = data[idx + 1]! + (fg[1] - data[idx + 1]!) * opacity;
        data[idx + 2] = data[idx + 2]! + (fg[2] - data[idx + 2]!) * opacity;
      }
    }
  }

  return { data, width, height };
}
