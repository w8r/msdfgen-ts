/**
 * Every glyph in Lucide.ttf, rendered via `Atlas.glyphsByIndex()` — the
 * codepoint-free twin of `Atlas.glyphs()`. Lucide's `cmap` only maps a
 * handful of ASCII characters (see `test/parser/corpus.ts`'s comment on
 * why the corpus addresses icon fonts by raw glyph index); the ~1745 real
 * icon glyphs sit at indices no Unicode codepoint reaches. This demo
 * proves the glyph-index API end to end: enumerate `1..font.numGlyphs-1`
 * (skip `.notdef`), generate + pack them into one shared atlas, reconstruct
 * each into a grid cell with the same bilinear MSDF math as demo/canvas.
 *
 * Generation runs in chunks (not one big synchronous call) — the full set
 * takes several seconds even at a modest resolution, and freezing the tab
 * for that long would be a bad demo of a library that's supposed to run
 * at interactive speed. Each chunk's icons are blitted into the canvas as
 * soon as they're ready, so the grid fills in progressively instead of
 * appearing all at once at the end.
 */
import { Font, Atlas, type AtlasGlyph } from "../../src/index";

// See demo/canvas/main.ts for why this isn't a hardcoded leading-slash path.
const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/Lucide.ttf`;
const PIXELS_PER_EM = 24; // generation resolution — kept modest, ~1745 icons add up
const PXRANGE = 3;
const CHUNK_SIZE = 60; // icons generated per tick
const CELL_SIZE = 48; // px, grid cell (icon + padding)
const ICON_PAD = 6; // px, inside each cell — icons scale-to-fit the remainder
const FG_COLOR: [number, number, number] = [20, 20, 20];
const BG_COLOR: [number, number, number] = [255, 255, 255];

/** Same reconstruction formula as demo/canvas/main.ts — see its doc comment. */
function median3(a: number, b: number, c: number): number {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
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
  const px = (x: number, y: number, ch: number): number => tex[(y * w + x) * 4 + ch]! / 255;
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

/** Yields one tick so the browser can repaint and stay responsive between
 *  generation chunks — see this file's doc comment on why generation is
 *  chunked in the first place. */
function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function main(): Promise<void> {
  const root = document.getElementById("root")!;
  const status = document.getElementById("status")!;

  status.textContent = "Loading font…";
  await tick();
  const buf = await fetch(FONT_URL).then((r) => r.arrayBuffer());
  const font = new Font(buf);
  const atlas = new Atlas(font, { pixelsPerEm: PIXELS_PER_EM, pxrange: PXRANGE });

  const gids: number[] = [];
  for (let gid = 1; gid < font.numGlyphs; gid++) gids.push(gid); // skip .notdef

  const cols = Math.max(1, Math.floor((document.documentElement.clientWidth - 48) / CELL_SIZE));
  const rows = Math.ceil(gids.length / cols);
  const canvas = document.createElement("canvas");
  canvas.width = cols * CELL_SIZE;
  canvas.height = rows * CELL_SIZE;
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  root.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  const image = ctx.createImageData(canvas.width, canvas.height);
  const out = image.data;
  for (let i = 0; i < out.length; i += 4) {
    out[i] = BG_COLOR[0];
    out[i + 1] = BG_COLOR[1];
    out[i + 2] = BG_COLOR[2];
    out[i + 3] = 255;
  }

  // pxrangeEm is uniform across all glyphs (crop, not scale — see
  // atlas-gen.ts); this is that range back in atlas texels, before the
  // per-icon scale-to-fit factor is applied below.
  const pxrangeTexels = atlas.pxrangeEm * PIXELS_PER_EM;
  const boxSize = CELL_SIZE - 2 * ICON_PAD;

  function blitIcon(glyph: AtlasGlyph, cellIndex: number): void {
    if (glyph.w === 0 || glyph.h === 0) return; // empty outline
    const col = cellIndex % cols;
    const row = Math.floor(cellIndex / cols);
    const scale = Math.min(boxSize / glyph.w, boxSize / glyph.h);
    const dispW = glyph.w * scale;
    const dispH = glyph.h * scale;
    const cellLeft = col * CELL_SIZE + (CELL_SIZE - dispW) / 2;
    const cellTop = row * CELL_SIZE + (CELL_SIZE - dispH) / 2;
    const screenPxRange = pxrangeTexels * scale;

    const dstX0 = Math.max(0, Math.floor(cellLeft));
    const dstY0 = Math.max(0, Math.floor(cellTop));
    const dstX1 = Math.min(canvas.width, Math.ceil(cellLeft + dispW));
    const dstY1 = Math.min(canvas.height, Math.ceil(cellTop + dispH));

    for (let dy = dstY0; dy < dstY1; dy++) {
      const cellFracY = (dy - cellTop) / dispH;
      const srcY = glyph.y + cellFracY * glyph.h;
      for (let dx = dstX0; dx < dstX1; dx++) {
        const cellFracX = (dx - cellLeft) / dispW;
        const srcX = glyph.x + cellFracX * glyph.w;

        const [r, g, b] = sampleAtlas(atlas, srcX, srcY);
        const sd = median3(r, g, b) - 0.5;
        const screenPxDistance = screenPxRange * sd;
        const opacity = Math.max(0, Math.min(1, screenPxDistance + 0.5));

        const idx = (dy * canvas.width + dx) * 4;
        out[idx] = out[idx]! + (FG_COLOR[0] - out[idx]!) * opacity;
        out[idx + 1] = out[idx + 1]! + (FG_COLOR[1] - out[idx + 1]!) * opacity;
        out[idx + 2] = out[idx + 2]! + (FG_COLOR[2] - out[idx + 2]!) * opacity;
      }
    }
  }

  let generated = 0;
  for (let i = 0; i < gids.length; i += CHUNK_SIZE) {
    const chunk = gids.slice(i, i + CHUNK_SIZE);
    const chunkGlyphs = atlas.glyphsByIndex(chunk); // one potpack for the whole chunk
    for (let k = 0; k < chunk.length; k++) blitIcon(chunkGlyphs[k]!, i + k);
    ctx.putImageData(image, 0, 0);
    generated += chunk.length;
    status.textContent = `Generating… ${generated}/${gids.length} icons`;
    await tick();
  }

  status.textContent =
    `Done — ${gids.length} icons (of ${font.numGlyphs} total glyphs, including .notdef), ` +
    `packed into a ${atlas.width}×${atlas.height} atlas.`;
  root.dataset.ready = "true"; // signal for tools/screenshot.mjs
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  root.dataset.ready = "true";
  throw err;
});
