/**
 * MSDF debug view. For each glyph in a user-provided string, renders six
 * side-by-side 200×200 panels that all share the same cell-space transform:
 *
 *   1. vector     — the em-normalised shape, filled via Canvas 2D
 *   2. rgb        — the raw MSDF texels (nearest-neighbour zoom)
 *   3. R          — red channel only
 *   4. G          — green channel only
 *   5. B          — blue channel only
 *   6. median     — bilinearly-sampled median(r,g,b) − 0.5 reconstruction,
 *                   matching the shader in demo/canvas/main.ts
 *
 * Unlike the shipping `Atlas` (which uses a fixed em-box transform so every
 * glyph sits in the same baseline-anchored slot — wasting most of the cell on
 * blank whitespace for small glyphs like `.` or lowercase `x`), the debug view
 * fits each glyph's *actual* bounding box into the cell, leaving only
 * `pxrange` texels of MSDF safe-region padding on every side.  This gives
 * every glyph maximum resolution in its cell so channel / coloring /
 * correction bugs are visible even at 16 px.
 *
 * All six views share the atlas cell's y-down coordinate frame (row 0 = top),
 * so bugs in edge colouring, error correction, or channel alignment show up as
 * visible mis-registration between the vector outline and the rgb / median
 * panels.
 *
 * Not shipped as library code — DOM-only debug tooling, so it reaches into
 * `src/msdf/*` internals (not part of the public API surface).
 */
import { Font, type Shape, LINEAR, QUADRATIC, CUBIC, pixelFloatToByte } from "../../src/index.js";
import { emNormalizeShape, normalizeShape } from "../../src/shape/normalize.js";
import { edgeColoringSimple } from "../../src/msdf/edge-coloring.js";
import { generateMSDF } from "../../src/msdf/generate.js";
import { distanceSignCorrection, msdfErrorCorrection } from "../../src/msdf/error-correction.js";

const PANEL = 200; // px per debug panel
const ANGLE_THRESHOLD = 3.0; // matches Atlas / msdfgen CLI default
const COLOR_SEED = 0n; // matches Atlas / msdfgen CLI default
const DEFAULT_STRING =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface Config {
  fontUrl: string;
  size: number;
  pxrange: number;
  glyphs: string;
}

function readConfig(): Config {
  const $ = <T extends HTMLElement>(id: string): T =>
    document.getElementById(id) as T;
  return {
    fontUrl: $<HTMLSelectElement>("font").value,
    size: Number($<HTMLInputElement>("size").value) || 16,
    pxrange: Number($<HTMLInputElement>("pxrange").value) || 4,
    glyphs: $<HTMLInputElement>("glyphs").value || DEFAULT_STRING,
  };
}

async function loadFont(url: string): Promise<Font> {
  const buf = await fetch(url).then((r) => {
    if (!r.ok) throw new Error(`fetch ${url}: ${r.status}`);
    return r.arrayBuffer();
  });
  return new Font(buf);
}

// ── Shape bounds (tight enough) ──────────────────────────────────────────────

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const _pt: number[] = [0, 0];

/**
 * Bounding box of `shape` by sampling each segment at 16 t-values.  Not tight
 * to the mathematical minimum but well within a texel for typical font curves
 * — good enough to fit-to-cell without visible slop.
 */
function shapeBounds(shape: Shape): Bounds {
  const b: Bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
  const N = 16;
  for (const contour of shape.contours) {
    for (const seg of contour) {
      for (let i = 0; i <= N; i++) {
        seg.point(i / N, _pt);
        const x = _pt[0]!;
        const y = _pt[1]!;
        if (x < b.minX) b.minX = x;
        if (y < b.minY) b.minY = y;
        if (x > b.maxX) b.maxX = x;
        if (y > b.maxY) b.maxY = y;
      }
    }
  }
  if (!isFinite(b.minX)) {
    b.minX = 0;
    b.minY = 0;
    b.maxX = 1;
    b.maxY = 1;
  }
  return b;
}

// ── Per-glyph generation ─────────────────────────────────────────────────────

interface GlyphCell {
  /** MSDF float bitmap, y-up (row 0 = bottom), (y*size+x)*3+ch. */
  msdf: Float32Array;
  /** Quantised bytes, y-down (row 0 = top), (y*size+x)*3+ch. */
  bytes: Uint8Array;
  /** Cell size in texels. */
  size: number;
  /** msdfgen projection: pixel = scale * (shape + t) − 0.5. */
  scale: number;
  tx: number;
  ty: number;
  /** Em-normalised, non-normalised outline for the vector overlay. */
  rawShape: Shape;
}

/**
 * Generates a single glyph MSDF into a fresh Float32Array, sized `cellSize²`,
 * with per-glyph scale/tx/ty that fits the glyph's actual bbox into the cell
 * (leaving `pxrange` texels of padding on every side).
 */
function generateGlyphCell(
  font: Font,
  codepoint: number,
  cellSize: number,
  pxrange: number,
): GlyphCell | null {
  const glyphId = font.glyphId(codepoint);
  const unitsPerEm = font.metrics.unitsPerEm;

  // Two independent shape instances: one for MSDF generation (mutated by the
  // full pipeline), one for the vector overlay (raw em-normalised outline only).
  const shapeGen = font.shape(glyphId);
  const shapeVec = font.shape(glyphId);
  emNormalizeShape(shapeGen, unitsPerEm);
  emNormalizeShape(shapeVec, unitsPerEm);

  if (shapeGen.contours.length === 0) return null;

  const b = shapeBounds(shapeGen);
  const w = Math.max(1e-6, b.maxX - b.minX);
  const h = Math.max(1e-6, b.maxY - b.minY);
  const usable = cellSize - 2 * pxrange;
  if (usable <= 0) throw new Error(`pxrange ${pxrange} too large for cell ${cellSize}`);
  const scale = usable / Math.max(w, h);
  // Centre the bbox inside the usable region.  msdfgen's projection is
  //   pixel = scale * (shape + t) − 0.5
  // so we want   pixel(minX) = pxrange + padX   and   pixel(minY) = pxrange + padY.
  const padX = (usable - scale * w) / 2;
  const padY = (usable - scale * h) / 2;
  const tx = (pxrange + padX + 0.5) / scale - b.minX;
  const ty = (pxrange + padY + 0.5) / scale - b.minY;

  normalizeShape(shapeGen);
  edgeColoringSimple(shapeGen, ANGLE_THRESHOLD, COLOR_SEED);

  const msdf = new Float32Array(cellSize * cellSize * 3);
  generateMSDF(shapeGen, cellSize, cellSize, scale, tx, ty, pxrange, msdf);
  distanceSignCorrection(msdf, shapeGen, cellSize, cellSize, scale, tx, ty);
  msdfErrorCorrection(msdf, shapeGen, cellSize, cellSize, scale, tx, ty, pxrange);

  // Quantise + y-flip into a y-down byte cell (matches Atlas._blit).
  const bytes = new Uint8Array(cellSize * cellSize * 3);
  for (let sy = 0; sy < cellSize; sy++) {
    const dstRow = cellSize - 1 - sy;
    for (let sx = 0; sx < cellSize; sx++) {
      const srcBase = (sy * cellSize + sx) * 3;
      const dstBase = (dstRow * cellSize + sx) * 3;
      bytes[dstBase] = pixelFloatToByte(msdf[srcBase]!);
      bytes[dstBase + 1] = pixelFloatToByte(msdf[srcBase + 1]!);
      bytes[dstBase + 2] = pixelFloatToByte(msdf[srcBase + 2]!);
    }
  }

  return { msdf, bytes, size: cellSize, scale, tx, ty, rawShape: shapeVec };
}

// ── Panel renderers ──────────────────────────────────────────────────────────

/**
 * Vector overlay, using the *same* per-glyph scale/tx/ty as the MSDF pass.
 *
 * Cell-space mapping (see src/msdf/generate.ts sample formula):
 *   pixel_x_yup = scale * (shape_x + tx) − 0.5
 *   pixel_y_yup = scale * (shape_y + ty) − 0.5
 *   target_x    = pixel_x_yup * (PANEL / cellSize)
 *   target_y    = PANEL − pixel_y_yup * (PANEL / cellSize)   (y-flip)
 */
function drawVector(
  ctx: CanvasRenderingContext2D,
  cell: GlyphCell,
  pxrange: number,
): void {
  ctx.clearRect(0, 0, PANEL, PANEL);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PANEL, PANEL);

  const { rawShape, scale, tx, ty, size } = cell;
  const k = PANEL / size; // px-per-atlas-texel

  // pxrange safe-region border.
  const inset = pxrange * k;
  ctx.strokeStyle = "rgba(235, 108, 54, 0.35)";
  ctx.setLineDash([4, 3]);
  ctx.lineWidth = 1;
  ctx.strokeRect(inset, inset, PANEL - 2 * inset, PANEL - 2 * inset);
  ctx.setLineDash([]);

  const applyXform = (): void => {
    // translate(-0.5*k, PANEL + 0.5*k)  ← −0.5 texel-centre offset, then y-flip origin
    // scale(k, -k)                      ← atlas-texel → target-px, flip y
    // scale(scale, scale)               ← em → atlas-texel
    // translate(tx, ty)                 ← msdfgen translate
    ctx.translate(-0.5 * k, PANEL + 0.5 * k);
    ctx.scale(k, -k);
    ctx.scale(scale, scale);
    ctx.translate(tx, ty);
  };

  const tracePath = (): void => {
    ctx.beginPath();
    for (const contour of rawShape.contours) {
      if (contour.length === 0) continue;
      const first = contour[0]!;
      ctx.moveTo(first.p0x, first.p0y);
      for (const seg of contour) {
        switch (seg.type) {
          case LINEAR:
            ctx.lineTo(seg.p1x, seg.p1y);
            break;
          case QUADRATIC:
            ctx.quadraticCurveTo(seg.p1x, seg.p1y, seg.p2x, seg.p2y);
            break;
          case CUBIC:
            ctx.bezierCurveTo(seg.p1x, seg.p1y, seg.p2x, seg.p2y, seg.p3x, seg.p3y);
            break;
        }
      }
      ctx.closePath();
    }
  };

  ctx.save();
  applyXform();
  tracePath();
  ctx.fillStyle = "rgba(45, 49, 66, 0.15)";
  ctx.fill("evenodd");
  ctx.restore();

  ctx.save();
  applyXform();
  ctx.lineWidth = 1 / (k * scale);
  ctx.strokeStyle = "#2d3142";
  tracePath();
  ctx.stroke();
  ctx.restore();
}

/**
 * Blits the per-glyph byte cell (y-down) into `ctx` at PANEL×PANEL with
 * nearest-neighbour scaling, masking to the requested channels.
 */
function drawCell(
  ctx: CanvasRenderingContext2D,
  cell: GlyphCell,
  channelMask: number, // 7=RGB, 1=R, 2=G, 4=B
): void {
  const { bytes, size } = cell;
  const small = document.createElement("canvas");
  small.width = size;
  small.height = size;
  const sctx = small.getContext("2d")!;
  const image = sctx.createImageData(size, size);
  const out = image.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 3;
      const dst = (y * size + x) * 4;
      out[dst] = channelMask & 1 ? bytes[src]! : 0;
      out[dst + 1] = channelMask & 2 ? bytes[src + 1]! : 0;
      out[dst + 2] = channelMask & 4 ? bytes[src + 2]! : 0;
      out[dst + 3] = 255;
    }
  }
  sctx.putImageData(image, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, PANEL, PANEL);
  ctx.drawImage(small, 0, 0, size, size, 0, 0, PANEL, PANEL);
}

/**
 * Bilinear RGB sample from the per-glyph byte cell (y-down, [0,1] floats).
 * Clamps to the cell edges — no atlas boundary to worry about here.
 */
function sampleCell(cell: GlyphCell, sx: number, sy: number): [number, number, number] {
  const n = cell.size;
  const ix = Math.floor(sx);
  const iy = Math.floor(sy);
  const fx = Math.max(0, Math.min(1, sx - ix));
  const fy = Math.max(0, Math.min(1, sy - iy));
  const x0 = Math.max(0, Math.min(n - 1, ix));
  const y0 = Math.max(0, Math.min(n - 1, iy));
  const x1 = Math.min(n - 1, x0 + 1);
  const y1 = Math.min(n - 1, y0 + 1);
  const bytes = cell.bytes;
  const get = (x: number, y: number, ch: number): number =>
    bytes[(y * n + x) * 3 + ch]! / 255;
  const out: [number, number, number] = [0, 0, 0];
  for (let ch = 0; ch < 3; ch++) {
    const c00 = get(x0, y0, ch);
    const c10 = get(x1, y0, ch);
    const c01 = get(x0, y1, ch);
    const c11 = get(x1, y1, ch);
    const top = c00 + fx * (c10 - c00);
    const bottom = c01 + fx * (c11 - c01);
    out[ch] = top + fy * (bottom - top);
  }
  return out;
}

const median3 = (a: number, b: number, c: number): number =>
  Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));

/**
 * Bilinearly reconstructs the glyph at PANEL×PANEL from the per-glyph
 * cellSize×cellSize MSDF byte cell.
 *
 * Sampling convention (standard GPU linear filter):
 *   sampleCoord = (panelPx + 0.5) * cellSize / PANEL − 0.5
 * so texel i's centre sits at sampleCoord = i (integer), matching what
 * `generateMSDF` writes (`(x + 0.5)/scale − tx`) and what a GPU sampler with
 * linear filtering produces.  A naïve `panelPx/outputScale` (no ±0.5 shift)
 * puts texel 0 at panel pixel 0 instead of at ~outputScale/2 and introduces
 * a half-texel beat between the atlas grid and the panel grid — that shows
 * up as visible waves on straight edges, especially at high zooms.
 */
function drawMedian(
  ctx: CanvasRenderingContext2D,
  cell: GlyphCell,
  pxrange: number,
): void {
  const image = ctx.createImageData(PANEL, PANEL);
  const out = image.data;
  const outputScale = PANEL / cell.size;
  const screenPxRange = pxrange * outputScale;
  const fg: [number, number, number] = [45, 49, 66];
  const bg: [number, number, number] = [255, 255, 255];
  const k = cell.size / PANEL;
  for (let dy = 0; dy < PANEL; dy++) {
    const sy = (dy + 0.5) * k - 0.5;
    for (let dx = 0; dx < PANEL; dx++) {
      const sx = (dx + 0.5) * k - 0.5;
      const [r, g, b] = sampleCell(cell, sx, sy);
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
  const cols = ["", "vector", "rgb", "R", "G", "B", "median"];
  for (const c of cols) {
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
  ch: string,
  cellSize: number,
  pxrange: number,
): void {
  const codepoint = ch.codePointAt(0);
  if (codepoint === undefined) return;

  let cell: GlyphCell | null;
  try {
    cell = generateGlyphCell(font, codepoint, cellSize, pxrange);
  } catch (e) {
    console.warn(`glyph "${ch}" (U+${codepoint.toString(16)}) failed:`, e);
    return;
  }
  if (!cell) return;

  const row = document.createElement("div");
  row.className = "row";

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = ch;
  row.appendChild(label);

  const vec = makePanel("vector");
  drawVector(vec.getContext("2d")!, cell, pxrange);
  row.appendChild(vec);

  const rgb = makePanel();
  drawCell(rgb.getContext("2d")!, cell, 7);
  row.appendChild(rgb);

  const rOnly = makePanel();
  drawCell(rOnly.getContext("2d")!, cell, 1);
  row.appendChild(rOnly);

  const gOnly = makePanel();
  drawCell(gOnly.getContext("2d")!, cell, 2);
  row.appendChild(gOnly);

  const bOnly = makePanel();
  drawCell(bOnly.getContext("2d")!, cell, 4);
  row.appendChild(bOnly);

  const med = makePanel("median");
  drawMedian(med.getContext("2d")!, cell, pxrange);
  row.appendChild(med);

  root.appendChild(row);
}

async function render(): Promise<void> {
  const cfg = readConfig();
  const root = document.getElementById("root")!;
  root.textContent = "Loading font…";

  const font = await loadFont(cfg.fontUrl);

  root.textContent = "";
  buildHeader(root);
  const glyphs = [...cfg.glyphs];
  for (let i = 0; i < glyphs.length; i++) {
    renderGlyphRow(root, font, glyphs[i]!, cfg.size, cfg.pxrange);
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
