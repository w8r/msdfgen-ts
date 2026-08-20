/**
 * Static CPU fallback: renders text from an `Atlas` onto 2D canvases at
 * several output sizes. Two rows:
 *   1. A single small fixed atlas serving every output size — shows how far
 *      MSDF reconstruction holds up before the source texels are visibly
 *      magnified (the softening past ~4-8x is expected, not a bug).
 *   2. The same sizes with `pickTierForSize` choosing the nearest atlas
 *      tier per size (same selection logic as demo/webgpu-zoom and
 *      demo/webgl-zoom's auto-tier mode, just resolved once per fixed size
 *      instead of continuously against a zoom level) — crisp across the
 *      whole range because each size gets appropriately-resolved texels.
 * Proves the atlas/layout/kerning pipeline and the MSDF reconstruction math
 * work correctly, independent of the WebGPU/WebGL2 pipelines — dev/debug
 * tooling, not a public library API (msdfgen-ts stays DOM-free; this file
 * lives in demo/ only, per CLAUDE.md's non-goals).
 *
 * Reconstruction formula matches msdfgen's reference shader exactly:
 *   sd = median(r,g,b) - 0.5
 *   screenPxDistance = screenPxRange * sd
 *   opacity = clamp(screenPxDistance + 0.5, 0, 1)
 * where screenPxRange scales with how much bigger/smaller the glyph is
 * drawn versus the atlas's generation resolution — this is exactly what
 * lets one small atlas stay crisp at any output size.
 */
import { Font, Atlas } from "../../src/index";

// import.meta.env.BASE_URL is "/" in dev; under vite.demo.config.ts's build
// (deployed to GH Pages under /msdfgen-ts/) it's "/msdfgen-ts/" — a hardcoded
// leading-slash path would 404 there since fetch() URLs aren't base-rewritten
// by Vite like import/HTML asset references are.
const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;
const PIXELS_PER_EM = 40; // atlas generation resolution (single-atlas row)
const PXRANGE = 2;
const OUTPUT_SIZES = [16, 32, 64, 128, 256]; // em-sizes to render the same atlas at
const TEXT = "Hello Привет 123 @#&";

// ── Auto-tier row ────────────────────────────────────────────────────────
const ATLAS_SIZES = [16, 24, 32, 48, 64] as const; // pixelsPerEm tiers available for auto-selection
const TIER_PXRANGE_RATIO = 8; // pxrange = pixelsPerEm / TIER_PXRANGE_RATIO, matches the zoom demos' convention

/** Smallest tier whose native resolution covers `targetSize`, or the top tier past that. */
function pickTierForSize(targetSize: number): (typeof ATLAS_SIZES)[number] {
  for (const size of ATLAS_SIZES) {
    if (size >= targetSize) return size;
  }
  return ATLAS_SIZES[ATLAS_SIZES.length - 1]!;
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
  atlas: Atlas,
  text: string,
  targetSize: number,
  fg: [number, number, number],
  bg: [number, number, number],
): HTMLCanvasElement {
  const { glyphs, widthEm } = atlas.layout(text);

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

  // pxrangeEm is uniform across all glyphs (crop, not scale — see atlas-gen.ts),
  // so screenPxRange stays a single frame-wide number.
  const screenPxRange = atlas.pxrangeEm * targetSize;

  const baselineY = 1.2 * targetSize;

  for (const { glyph, penX } of glyphs) {
    if (glyph.w === 0) continue; // empty outline (space, .notdef)
    const originX = (penX + padEm) * targetSize;
    const cellLeft = originX + glyph.planeLeft * targetSize;
    const cellTop = baselineY - glyph.planeTop * targetSize;
    const cellWidthPx = (glyph.planeRight - glyph.planeLeft) * targetSize;
    const cellHeightPx = (glyph.planeTop - glyph.planeBottom) * targetSize;

    const dstX0 = Math.max(0, Math.floor(cellLeft));
    const dstY0 = Math.max(0, Math.floor(cellTop));
    const dstX1 = Math.min(cssWidth, Math.ceil(cellLeft + cellWidthPx));
    const dstY1 = Math.min(cssHeight, Math.ceil(cellTop + cellHeightPx));

    for (let dy = dstY0; dy < dstY1; dy++) {
      const cellFracY = (dy - cellTop) / cellHeightPx; // [0, 1)
      const srcY = glyph.y + cellFracY * glyph.h;
      for (let dx = dstX0; dx < dstX1; dx++) {
        const cellFracX = (dx - cellLeft) / cellWidthPx;
        const srcX = glyph.x + cellFracX * glyph.w;

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
  const atlas = new Atlas(font, { pixelsPerEm: PIXELS_PER_EM, pxrange: PXRANGE });
  // First .layout() call generates + packs every glyph; later calls in the
  // render loop below hit Atlas's internal per-codepoint cache, so timing
  // this one call is timing the actual atlas generation cost.
  const genStart = performance.now();
  atlas.layout(TEXT);
  const genMs = performance.now() - genStart;

  root.textContent = "";
  const info = document.createElement("p");
  info.textContent = `One ${PIXELS_PER_EM}px/em atlas (pxrange ${PXRANGE}), rendered at: ${OUTPUT_SIZES.join(", ")}px — same source texels every time. Atlas gen: ${genMs.toFixed(2)}ms.`;
  root.appendChild(info);

  for (const size of OUTPUT_SIZES) {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = `${size}px`;
    root.appendChild(label);

    const canvas = renderAtSize(atlas, TEXT, size, [20, 20, 20], [255, 255, 255]);
    canvas.className = "glyph-canvas";
    root.appendChild(canvas);
  }

  // ── Auto-tier row: one atlas per distinct tier picked, built on demand
  // and cached — same pickTier selection the zoom demos use continuously,
  // resolved once per fixed OUTPUT_SIZES entry here. ────────────────────
  const tierInfo = document.createElement("p");
  tierInfo.textContent = `Auto-tiered: each size below uses the smallest of [${ATLAS_SIZES.join(", ")}]px/em whose atlas covers it — compare against the single-atlas row above.`;
  root.appendChild(tierInfo);

  const tierAtlases = new Map<number, Atlas>();
  const tierGenMs = new Map<number, number>();
  function tierAtlas(pixelsPerEm: number): Atlas {
    let a = tierAtlases.get(pixelsPerEm);
    if (!a) {
      a = new Atlas(font, { pixelsPerEm, pxrange: pixelsPerEm / TIER_PXRANGE_RATIO });
      const t0 = performance.now();
      a.layout(TEXT); // generates + packs this tier's atlas once, same as above
      tierGenMs.set(pixelsPerEm, performance.now() - t0);
      tierAtlases.set(pixelsPerEm, a);
    }
    return a;
  }

  for (const size of OUTPUT_SIZES) {
    const tierSize = pickTierForSize(size);
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = `${size}px (atlas ${tierSize}px/em)`;
    root.appendChild(label);

    const canvas = renderAtSize(tierAtlas(tierSize), TEXT, size, [20, 20, 20], [255, 255, 255]);
    canvas.className = "glyph-canvas";
    root.appendChild(canvas);
  }

  const tierGenSummary = document.createElement("p");
  const tierGenParts = [...tierGenMs.entries()].map(([px, ms]) => `${px}px/em ${ms.toFixed(2)}ms`);
  const tierGenTotal = [...tierGenMs.values()].reduce((a, b) => a + b, 0);
  tierGenSummary.textContent = `Atlas gen (tiers actually built): ${tierGenParts.join(" · ")} — total ${tierGenTotal.toFixed(2)}ms.`;
  root.appendChild(tierGenSummary);

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
  root.dataset.ready = "true"; // signal for tools/screenshot.mjs
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  root.dataset.ready = "true";
  throw err;
});
