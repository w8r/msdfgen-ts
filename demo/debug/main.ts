/**
 * MSDF debug view. For each glyph in a user-provided string, renders six
 * side-by-side 200×200 panels sourced from the shared `Atlas`:
 *
 *   1. vector  — the em-normalised shape, filled via Canvas 2D
 *   2. rgb     — the raw MSDF texels (nearest-neighbour zoom)
 *   3. R       — red channel only
 *   4. G       — green channel only
 *   5. B       — blue channel only
 *   6. median  — bilinearly-sampled median(r,g,b) − 0.5 reconstruction,
 *                matching the shipping WebGL/WebGPU shaders
 *
 * All panels use the exact same texels the `Atlas` produced — this page
 * is a magnifying glass on `src/atlas-gen.ts`, not an alternative
 * generator. Bugs in edge colouring, error correction, or channel
 * alignment show up as mis-registration between the vector overlay and
 * the RGB / median panels.
 *
 * Not shipped as library code — DOM-only debug tooling, so it reaches
 * into `src/shape/normalize` for the vector overlay (not part of the
 * public API surface).
 */
import { Font, Atlas, type AtlasGlyph, type Shape, LINEAR, QUADRATIC, CUBIC } from "../../src/index";
import { emNormalizeShape } from "../../src/shape/normalize";

const PANEL = 200; // px per debug panel
const DEFAULT_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * naive  — sy = dy/outputScale  (texel 0 centre at panel-pixel 0)
 * gpu    — sy = (dy + 0.5)*cellSize/PANEL − 0.5  (texel i centre at coord i;
 *          the mathematically correct match for `generateMSDF`'s texel
 *          placement, and what a real GPU linear sampler does)
 */
type SamplingMode = "naive" | "gpu";

interface Config {
  fontUrl: string;
  pixelsPerEm: number;
  pxrange: number;
  glyphs: string;
  sampling: SamplingMode;
}

function readConfig(): Config {
  const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
  const mode = $<HTMLSelectElement>("sampling").value;
  // The <option value>s are root-relative ("/test/fonts/...") for readability
  // in the HTML; rewrite to import.meta.env.BASE_URL here so this still
  // resolves once deployed under a non-root base (see demo/canvas/main.ts).
  const rawFontUrl = $<HTMLSelectElement>("font").value;
  return {
    fontUrl: import.meta.env.BASE_URL + rawFontUrl.replace(/^\//, ""),
    pixelsPerEm: Number($<HTMLInputElement>("size").value) || 16,
    pxrange: Number($<HTMLInputElement>("pxrange").value) || 2,
    glyphs: $<HTMLInputElement>("glyphs").value || DEFAULT_STRING,
    sampling: mode === "gpu" ? "gpu" : "naive",
  };
}

async function loadFont(url: string): Promise<Font> {
  const buf = await fetch(url).then((r) => {
    if (!r.ok) throw new Error(`fetch ${url}: ${r.status}`);
    return r.arrayBuffer();
  });
  return new Font(buf);
}

// ── Sampling helpers over the shared atlas texture ───────────────────────────

/**
 * RGB values ([0,1]) at a single texel of `glyph`'s cell in the atlas.
 * `(sx, sy)` are cell-local, y-down (row 0 = top of the glyph rect).
 */
function texelRgb(
  atlas: Atlas,
  glyph: AtlasGlyph,
  sx: number,
  sy: number,
): [number, number, number] {
  if (sx < 0 || sy < 0 || sx >= glyph.w || sy >= glyph.h) return [0, 0, 0];
  const tex = atlas.texture;
  const base = ((glyph.y + sy) * atlas.width + (glyph.x + sx)) * 4;
  return [tex[base]! / 255, tex[base + 1]! / 255, tex[base + 2]! / 255];
}

/**
 * Bilinear RGB sample of `glyph`'s cell at fractional `(sx, sy)`.
 * Off-cell taps read as 0 (a conceptual 1-texel black border) which
 * keeps corner samples anchored to "fully outside" instead of dragging
 * clamp-to-edge transition-band values across the boundary.
 */
function sampleCell(
  atlas: Atlas,
  glyph: AtlasGlyph,
  sx: number,
  sy: number,
): [number, number, number] {
  const x0 = Math.floor(sx);
  const y0 = Math.floor(sy);
  const fx = sx - x0;
  const fy = sy - y0;
  const c00 = texelRgb(atlas, glyph, x0, y0);
  const c10 = texelRgb(atlas, glyph, x0 + 1, y0);
  const c01 = texelRgb(atlas, glyph, x0, y0 + 1);
  const c11 = texelRgb(atlas, glyph, x0 + 1, y0 + 1);
  const out: [number, number, number] = [0, 0, 0];
  for (let ch = 0; ch < 3; ch++) {
    const top = c00[ch]! + fx * (c10[ch]! - c00[ch]!);
    const bot = c01[ch]! + fx * (c11[ch]! - c01[ch]!);
    out[ch] = top + fy * (bot - top);
  }
  return out;
}

const median3 = (a: number, b: number, c: number): number =>
  Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));

// ── Panel renderers ──────────────────────────────────────────────────────────

/** Vector overlay in the same coordinate frame as the MSDF panels, using
 *  the glyph's plane bounds to map em → panel pixels. */
function drawVector(
  ctx: CanvasRenderingContext2D,
  glyph: AtlasGlyph,
  rawShape: Shape,
  pxrangeEm: number,
): void {
  ctx.clearRect(0, 0, PANEL, PANEL);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PANEL, PANEL);

  const cellW = glyph.planeRight - glyph.planeLeft;
  const cellH = glyph.planeTop - glyph.planeBottom;

  // pxrange safe-region border (glyph outline itself sits just inside it).
  const inset = (pxrangeEm / cellW) * PANEL;
  const insetY = (pxrangeEm / cellH) * PANEL;
  ctx.strokeStyle = "rgba(235, 108, 54, 0.35)";
  ctx.setLineDash([4, 3]);
  ctx.lineWidth = 1;
  ctx.strokeRect(inset, insetY, PANEL - 2 * inset, PANEL - 2 * insetY);
  ctx.setLineDash([]);

  const mapX = (x: number): number => ((x - glyph.planeLeft) / cellW) * PANEL;
  // planeTop is upper y in em (y-up); PANEL is y-down.
  const mapY = (y: number): number => ((glyph.planeTop - y) / cellH) * PANEL;

  ctx.beginPath();
  for (const contour of rawShape.contours) {
    if (contour.length === 0) continue;
    const first = contour[0]!;
    ctx.moveTo(mapX(first.p0x), mapY(first.p0y));
    for (const seg of contour) {
      switch (seg.type) {
        case LINEAR:
          ctx.lineTo(mapX(seg.p1x), mapY(seg.p1y));
          break;
        case QUADRATIC:
          ctx.quadraticCurveTo(mapX(seg.p1x), mapY(seg.p1y), mapX(seg.p2x), mapY(seg.p2y));
          break;
        case CUBIC:
          ctx.bezierCurveTo(
            mapX(seg.p1x), mapY(seg.p1y),
            mapX(seg.p2x), mapY(seg.p2y),
            mapX(seg.p3x), mapY(seg.p3y),
          );
          break;
      }
    }
    ctx.closePath();
  }
  ctx.fillStyle = "rgba(45, 49, 66, 0.15)";
  ctx.fill("evenodd");
  ctx.strokeStyle = "#2d3142";
  ctx.lineWidth = 1;
  ctx.stroke();
}

/** Nearest-neighbour blit of the atlas cell into a PANEL×PANEL panel,
 *  masking to the requested channels. Cell may be non-square. */
function drawCell(
  ctx: CanvasRenderingContext2D,
  atlas: Atlas,
  glyph: AtlasGlyph,
  channelMask: number, // 7=RGB, 1=R, 2=G, 4=B
): void {
  const { w, h } = glyph;
  if (w === 0 || h === 0) {
    ctx.clearRect(0, 0, PANEL, PANEL);
    return;
  }
  const small = document.createElement("canvas");
  small.width = w;
  small.height = h;
  const sctx = small.getContext("2d")!;
  const image = sctx.createImageData(w, h);
  const out = image.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const src = ((glyph.y + y) * atlas.width + (glyph.x + x)) * 4;
      const dst = (y * w + x) * 4;
      out[dst] = channelMask & 1 ? atlas.texture[src]! : 0;
      out[dst + 1] = channelMask & 2 ? atlas.texture[src + 1]! : 0;
      out[dst + 2] = channelMask & 4 ? atlas.texture[src + 2]! : 0;
      out[dst + 3] = 255;
    }
  }
  sctx.putImageData(image, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, PANEL, PANEL);
  ctx.drawImage(small, 0, 0, w, h, 0, 0, PANEL, PANEL);
}

/** Bilinearly reconstructs the glyph at PANEL×PANEL using the median
 *  shader math. Uses the atlas's uniform pxrangeEm — the whole point of
 *  cropping instead of scaling. */
function drawMedian(
  ctx: CanvasRenderingContext2D,
  atlas: Atlas,
  glyph: AtlasGlyph,
  mode: SamplingMode,
): void {
  const { w, h } = glyph;
  const image = ctx.createImageData(PANEL, PANEL);
  const out = image.data;
  const fg: [number, number, number] = [45, 49, 66];
  const bg: [number, number, number] = [255, 255, 255];
  if (w === 0 || h === 0) {
    for (let i = 0; i < out.length; i += 4) {
      out[i] = bg[0]; out[i + 1] = bg[1]; out[i + 2] = bg[2]; out[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    return;
  }
  // screenPxRange = pxrangeEm × pixels-per-em-at-panel; equivalent to
  // pxrangeTexels × (panelDim/cellDim) — same math, phrased in em.
  const cellEmH = glyph.planeTop - glyph.planeBottom;
  const screenPxRange = (atlas.pxrangeEm / cellEmH) * PANEL;
  const kx = w / PANEL;
  const ky = h / PANEL;
  const shift = mode === "gpu" ? 0.5 : 0.0;
  const offset = mode === "gpu" ? -0.5 : 0.0;
  for (let dy = 0; dy < PANEL; dy++) {
    const sy = (dy + shift) * ky + offset;
    for (let dx = 0; dx < PANEL; dx++) {
      const sx = (dx + shift) * kx + offset;
      const [r, g, b] = sampleCell(atlas, glyph, sx, sy);
      const sd = median3(r, g, b) - 0.5;
      const opacity = Math.max(0, Math.min(1, screenPxRange * sd + 0.5));
      const idx = (dy * PANEL + dx) * 4;
      out[idx] = bg[0] + (fg[0] - bg[0]) * opacity;
      out[idx + 1] = bg[1] + (fg[1] - bg[1]) * opacity;
      out[idx + 2] = bg[2] + (fg[2] - bg[2]) * opacity;
      out[idx + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
}

// ── Layout ───────────────────────────────────────────────────────────────────

function buildHeader(root: HTMLElement): void {
  const header = document.createElement("div");
  header.className = "header";
  for (const c of ["", "vector", "rgb", "R", "G", "B", "median"]) {
    const el = document.createElement("div");
    el.textContent = c;
    header.appendChild(el);
  }
  root.appendChild(header);
}

function makePanel(className = ""): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = PANEL;
  c.height = PANEL;
  if (className) c.className = className;
  return c;
}

function renderGlyphRow(
  root: HTMLElement,
  font: Font,
  atlas: Atlas,
  ch: string,
  sampling: SamplingMode,
): void {
  const codepoint = ch.codePointAt(0);
  if (codepoint === undefined) return;
  const glyph = atlas.glyph(codepoint);
  if (glyph.w === 0) return; // empty outline (space, etc.)

  // Raw shape for the vector overlay (em-normalised, un-normalised outline).
  const rawShape = font.shape(font.glyphId(codepoint));
  emNormalizeShape(rawShape, font.metrics.unitsPerEm);

  const row = document.createElement("div");
  row.className = "row";

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = ch;
  row.appendChild(label);

  const vec = makePanel("vector");
  drawVector(vec.getContext("2d")!, glyph, rawShape, atlas.pxrangeEm);
  row.appendChild(vec);

  for (const mask of [7, 1, 2, 4]) {
    const p = makePanel();
    drawCell(p.getContext("2d")!, atlas, glyph, mask);
    row.appendChild(p);
  }

  const med = makePanel("median");
  drawMedian(med.getContext("2d")!, atlas, glyph, sampling);
  row.appendChild(med);

  root.appendChild(row);
}

async function render(): Promise<void> {
  const cfg = readConfig();
  const root = document.getElementById("root")!;
  root.textContent = "Loading font…";

  const font = await loadFont(cfg.fontUrl);
  const atlas = new Atlas(font, { pixelsPerEm: cfg.pixelsPerEm, pxrange: cfg.pxrange });

  root.textContent = "";
  buildHeader(root);
  const glyphs = [...cfg.glyphs];
  for (let i = 0; i < glyphs.length; i++) {
    renderGlyphRow(root, font, atlas, glyphs[i]!, cfg.sampling);
    if ((i & 7) === 7) await new Promise((r) => setTimeout(r, 0));
  }
}

function wireControls(): void {
  document.getElementById("regen")!.addEventListener("click", () => {
    render().catch((err) => {
      const root = document.getElementById("root")!;
      root.textContent = `Error: ${String(err)}`;
      console.error(err);
    });
  });
}

wireControls();
render().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  console.error(err);
});
