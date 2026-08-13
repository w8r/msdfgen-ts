/**
 * Static CPU fallback: renders text from an `Atlas` onto 2D canvases at
 * several output sizes, all sourced from a single (small) atlas. Proves the
 * atlas/layout/kerning pipeline and the MSDF reconstruction math work
 * correctly, independent of the WebGPU pipeline — dev/debug tooling, not a
 * public library API (msdfgen-ts stays DOM-free; this file lives in demo/
 * only, per CLAUDE.md's non-goals).
 *
 * Reconstruction formula matches msdfgen's reference shader exactly:
 *   sd = median(r,g,b) - 0.5
 *   screenPxDistance = screenPxRange * sd
 *   opacity = clamp(screenPxDistance + 0.5, 0, 1)
 * where screenPxRange scales with how much bigger/smaller the glyph is
 * drawn versus the atlas's generation resolution — this is exactly what
 * lets one small atlas stay crisp at any output size.
 */
import { Font, Atlas, type GlyphInfo } from "../../src/index";

const FONT_URL = "/test/fonts/PTSerif-Regular.ttf";
const ATLAS_SIZE = 32; // generation resolution: px per em cell
const ATLAS_PXRANGE = 4;
const OUTPUT_SIZES = [16, 32, 64, 128, 256]; // em-sizes to render the same atlas at
const TEXT = "Hello Привет 123 @#&";

interface LayoutGlyph {
  info: GlyphInfo;
  penX: number; // in em units, left edge of the glyph's advance box
}

/** Lays out `text` left-to-right, applying kerning; returns glyphs + total advance (em). */
function layout(
  font: Font,
  atlas: Atlas,
  text: string,
): { glyphs: LayoutGlyph[]; widthEm: number } {
  const glyphs: LayoutGlyph[] = [];
  let penX = 0;
  let prevGlyphId = -1;
  for (const ch of text) {
    const codepoint = ch.codePointAt(0)!;
    const glyphId = font.glyphId(codepoint);
    if (prevGlyphId >= 0) {
      penX += font.kerning(prevGlyphId, glyphId) / font.metrics.unitsPerEm;
    }
    const info = atlas.getGlyph(codepoint);
    glyphs.push({ info, penX });
    penX += info.advance;
    prevGlyphId = glyphId;
  }
  return { glyphs, widthEm: penX };
}

/** Bilinear-samples one RGB texel (as [0,1] floats) from the atlas texture. */
function sampleAtlas(atlas: Atlas, sx: number, sy: number): [number, number, number] {
  const w = atlas.width;
  const h = atlas.height;
  const x0 = Math.floor(sx),
    y0 = Math.floor(sy);
  const fx = sx - x0,
    fy = sy - y0;
  const x1 = Math.min(x0 + 1, w - 1),
    y1 = Math.min(y0 + 1, h - 1);
  const cx0 = Math.max(0, Math.min(x0, w - 1)),
    cy0 = Math.max(0, Math.min(y0, h - 1));
  const tex = atlas.texture;
  const px = (x: number, y: number, ch: number) => tex[(y * w + x) * 4 + ch]! / 255;
  let r = 0,
    g = 0,
    b = 0;
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

/**
 * Renders `text` at `targetSize` px-per-em onto a fresh canvas, sampling
 * from `atlas` (generated at `ATLAS_SIZE`px). Returns the canvas.
 */
function renderAtSize(
  font: Font,
  atlas: Atlas,
  text: string,
  targetSize: number,
  fg: [number, number, number],
  bg: [number, number, number],
): HTMLCanvasElement {
  const { glyphs, widthEm } = layout(font, atlas, text);

  const padEm = 0.3;
  const cssWidth = Math.ceil((widthEm + 2 * padEm) * targetSize);
  const cssHeight = Math.ceil(1.6 * targetSize);
  const canvas = document.createElement("canvas");
  canvas.width = cssWidth;
  canvas.height = cssHeight;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(cssWidth, cssHeight);
  const out = image.data;
  out.fill(0);
  for (let i = 0; i < out.length; i += 4) {
    out[i] = bg[0];
    out[i + 1] = bg[1];
    out[i + 2] = bg[2];
    out[i + 3] = 255;
  }

  // Generation-resolution layout constants for this atlas (see Atlas.getGlyph).
  const genScale = ATLAS_SIZE - 2 * ATLAS_PXRANGE;
  const originXInCellPx = ATLAS_PXRANGE; // glyph pen-origin, px from cell's left edge
  const baselineFromTopPx = ATLAS_SIZE - ATLAS_PXRANGE - 0.25 * genScale; // px from cell's top edge
  const outputScale = targetSize / genScale;
  const screenPxRange = ATLAS_PXRANGE * outputScale;

  const baselineY = 1.2 * targetSize;

  for (const { info, penX } of glyphs) {
    const originX = (penX + padEm) * targetSize;
    const cellLeft = originX - originXInCellPx * outputScale;
    const cellTop = baselineY - baselineFromTopPx * outputScale;
    const cellSizePx = info.size * outputScale;

    const dstX0 = Math.max(0, Math.floor(cellLeft));
    const dstY0 = Math.max(0, Math.floor(cellTop));
    const dstX1 = Math.min(cssWidth, Math.ceil(cellLeft + cellSizePx));
    const dstY1 = Math.min(cssHeight, Math.ceil(cellTop + cellSizePx));

    for (let dy = dstY0; dy < dstY1; dy++) {
      const cellY = (dy - cellTop) / outputScale; // [0, info.size)
      const srcY = info.rect.y + cellY;
      for (let dx = dstX0; dx < dstX1; dx++) {
        const cellX = (dx - cellLeft) / outputScale;
        const srcX = info.rect.x + cellX;

        const [r, g, b] = sampleAtlas(atlas, srcX, srcY);
        const sd = median3(r, g, b) - 0.5;
        const screenPxDistance = screenPxRange * sd;
        const opacity = Math.max(0, Math.min(1, screenPxDistance + 0.5));

        const idx = (dy * cssWidth + dx) * 4;
        out[idx] = out[idx]! + (fg[0] - out[idx]!) * opacity;
        out[idx + 1] = out[idx + 1]! + (fg[1] - out[idx + 1]!) * opacity;
        out[idx + 2] = out[idx + 2]! + (fg[2] - out[idx + 2]!) * opacity;
      }
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas;
}

async function main(): Promise<void> {
  const root = document.getElementById("root")!;
  root.textContent = "Loading font…";

  const buf = await fetch(FONT_URL).then((r) => r.arrayBuffer());
  const font = new Font(buf);
  const atlas = new Atlas(font, { size: ATLAS_SIZE, pxrange: ATLAS_PXRANGE });

  root.textContent = "";
  const info = document.createElement("p");
  info.textContent = `One ${ATLAS_SIZE}px atlas (pxrange ${ATLAS_PXRANGE}), rendered at: ${OUTPUT_SIZES.join(", ")}px — same source texels every time.`;
  root.appendChild(info);

  for (const size of OUTPUT_SIZES) {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = `${size}px`;
    root.appendChild(label);

    const canvas = renderAtSize(font, atlas, TEXT, size, [20, 20, 20], [255, 255, 255]);
    canvas.className = "glyph-canvas";
    root.appendChild(canvas);
  }

  const atlasLabel = document.createElement("div");
  atlasLabel.className = "label";
  atlasLabel.textContent = `underlying atlas texture (${atlas.width}×${atlas.height}, raw MSDF channels)`;
  root.appendChild(atlasLabel);
  const atlasCanvas = document.createElement("canvas");
  atlasCanvas.width = atlas.width;
  atlasCanvas.height = atlas.height;
  atlasCanvas.className = "glyph-canvas";
  const actx = atlasCanvas.getContext("2d")!;
  const atlasImage = actx.createImageData(atlas.width, atlas.height);
  atlasImage.data.set(atlas.texture);
  actx.putImageData(atlasImage, 0, 0);
  root.appendChild(atlasCanvas);
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  throw err;
});
