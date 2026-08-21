/**
 * WebGL2 test-only twin of the M5 WebGPU checkpoint-1 renderer.
 *
 * NOT part of the M5 deliverable (CLAUDE.md's mission names WebGPU as the
 * shipped interactive demo) — this page exists purely so the same
 * instanced-quad MSDF rendering can be verified pixel-for-pixel via
 * tools/screenshot.mjs in environments without a WebGPU adapter. Headless
 * Chromium's SwiftShader gives WebGL2 a real (software) GPU adapter even
 * where navigator.gpu.requestAdapter() fails, so this is the practical way
 * to catch layout/UV/reconstruction bugs before real WebGPU hardware is
 * available. Same layout constants, same text, same colors as
 * demo/webgpu/main.ts so screenshots from both are directly comparable.
 *
 * Renders the same atlas at several output sizes (like demo/canvas/main.ts's
 * OUTPUT_SIZES showcase) — one small atlas, several on-screen scales, same
 * source texels every time.
 */
import { Font, Atlas, type LaidOutGlyph } from "../../src/index";
import vertSource from "./msdf.vert.glsl?raw";
import fragSource from "./msdf.frag.glsl?raw";

// See demo/canvas/main.ts for why this isn't a hardcoded leading-slash path.
const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;
const PIXELS_PER_EM = 40; // atlas generation resolution (single-atlas row)
const PXRANGE = 8;
const OUTPUT_SIZES = [16, 32, 64, 128, 256];
const TEXT = "Hello Привет 123 @#&";
const FG_COLOR: [number, number, number, number] = [0.08, 0.08, 0.08, 1];
const BG_COLOR: [number, number, number, number] = [1, 1, 1, 1];

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

/** Appends a label + small canvas showing `atlas.texture` as-is (raw RGBA) —
 *  debug view of what the reconstruction shader is actually sampling. */
function appendAtlasPreview(root: HTMLElement, tag: string, atlas: Atlas): void {
  const label = document.createElement("div");
  label.className = "label";
  label.textContent = `underlying atlas texture — ${tag} (${atlas.width}×${atlas.height}, raw MSDF channels)`;
  root.appendChild(label);
  const canvas = document.createElement("canvas");
  canvas.width = atlas.width;
  canvas.height = atlas.height;
  canvas.className = "atlas-preview";
  canvas.style.display = "block";
  canvas.style.border = "1px solid #ddd";
  canvas.style.background = "white";
  canvas.style.imageRendering = "pixelated";
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(atlas.width, atlas.height);
  image.data.set(atlas.texture);
  ctx.putImageData(image, 0, 0);
  root.appendChild(canvas);
}

/** Compiles one shader stage; throws with the driver's info log on failure. */
function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shader compile failed: ${log}`);
  }
  return shader;
}

function linkProgram(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string): WebGLProgram {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = gl.createProgram()!;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    throw new Error(`program link failed: ${log}`);
  }
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  return program;
}

/**
 * Renders `glyphs` (laid out in em units) at `targetSizeCss` px-per-em onto a
 * fresh canvas via its own WebGL2 context, sampling from `atlas`. Each canvas
 * gets its own context (WebGL2 contexts aren't shareable across canvases),
 * but all of them read the same atlas texel data — only the output scale
 * (and thus screenPxRange) differs.
 */
function renderAtSize(
  atlas: Atlas,
  glyphs: LaidOutGlyph[],
  widthEm: number,
  targetSizeCss: number,
  dpr: number,
): HTMLCanvasElement {
  const cssWidth = Math.ceil((widthEm + 0.6) * targetSizeCss);
  const cssHeight = Math.ceil(1.6 * targetSizeCss);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  canvas.className = "gl-canvas";

  const gl = canvas.getContext("webgl2")!;
  const targetSize = targetSizeCss * dpr;

  // ── Atlas texture ────────────────────────────────────────────────────────
  const atlasTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); // atlas data is already y-down (see Atlas._blit)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    atlas.width,
    atlas.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    atlas.texture,
  );
  // Adjacent atlas cells are packed with zero gap — sampling exactly at a
  // cell's edge with bilinear filtering would blend in the next glyph's texels.
  // Inset the sampled UV rect by half a texel on each side so no sample ever
  // reaches outside this glyph's own cell.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const halfTexelU = 0.5 / atlas.width;
  const halfTexelV = 0.5 / atlas.height;

  // ── Instance buffer: [posX, posY, sizeX, sizeY, uvMinX, uvMinY, uvSizeX, uvSizeY] ──
  // pxrangeEm is uniform across all glyphs (crop, not scale — see atlas-gen.ts),
  // so screenPxRange stays a single frame-wide uniform.
  const screenPxRange = atlas.pxrangeEm * targetSize;
  const padEm = 0.3;
  const baselineY = 0.75 * canvas.height;

  const FLOATS_PER_INSTANCE = 8;
  const instanceData = new Float32Array(glyphs.length * FLOATS_PER_INSTANCE);
  for (let i = 0; i < glyphs.length; i++) {
    const { glyph, penX } = glyphs[i]!;
    const originX = (penX + padEm) * targetSize;
    const cellLeft = originX + glyph.planeLeft * targetSize;
    const cellTop = baselineY - glyph.planeTop * targetSize;
    const cellWidthPx = (glyph.planeRight - glyph.planeLeft) * targetSize;
    const cellHeightPx = (glyph.planeTop - glyph.planeBottom) * targetSize;

    const base = i * FLOATS_PER_INSTANCE;
    instanceData[base + 0] = cellLeft;
    instanceData[base + 1] = cellTop;
    instanceData[base + 2] = cellWidthPx;
    instanceData[base + 3] = cellHeightPx;
    instanceData[base + 4] = glyph.x / atlas.width + halfTexelU;
    instanceData[base + 5] = glyph.y / atlas.height + halfTexelV;
    instanceData[base + 6] = glyph.w / atlas.width - 2 * halfTexelU;
    instanceData[base + 7] = glyph.h / atlas.height - 2 * halfTexelV;
  }

  // ── Program + buffers ────────────────────────────────────────────────────
  const program = linkProgram(gl, vertSource, fragSource);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // prettier-ignore
  const quadCorners = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, quadCorners, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const instanceBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, instanceData, gl.STATIC_DRAW);
  const stride = FLOATS_PER_INSTANCE * 4;
  for (let loc = 1; loc <= 4; loc++) {
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, stride, (loc - 1) * 8);
    gl.vertexAttribDivisor(loc, 1);
  }

  const quadIndices = new Uint16Array([0, 1, 2, 2, 1, 3]);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, quadIndices, gl.STATIC_DRAW);

  // ── Render (static — one frame is enough for now) ───────────────────────
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(...BG_COLOR);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.uniform2f(gl.getUniformLocation(program, "viewportSize"), canvas.width, canvas.height);
  gl.uniform1f(gl.getUniformLocation(program, "screenPxRange"), screenPxRange);
  gl.uniform4fv(gl.getUniformLocation(program, "fgColor"), FG_COLOR);
  gl.uniform4fv(gl.getUniformLocation(program, "bgColor"), BG_COLOR);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
  gl.uniform1i(gl.getUniformLocation(program, "atlasTexture"), 0);

  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  gl.bindVertexArray(vao);
  gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, glyphs.length);

  return canvas;
}

async function main(): Promise<void> {
  const root = document.getElementById("root")!;

  const probe = document.createElement("canvas").getContext("webgl2");
  if (!probe) {
    root.textContent = "WebGL2 is not available in this browser.";
    root.dataset.ready = "true"; // signal for tools/screenshot.mjs
    return;
  }

  root.textContent = "Loading font…";
  const dpr = window.devicePixelRatio || 1;

  const buf = await fetch(FONT_URL).then((r) => r.arrayBuffer());
  const font = new Font(buf);
  const atlas = new Atlas(font, { pixelsPerEm: PIXELS_PER_EM, pxrange: PXRANGE });
  const genStart = performance.now();
  const { glyphs, widthEm } = atlas.layout(TEXT);
  const genMs = performance.now() - genStart;

  root.textContent = "";
  const info = document.createElement("p");
  info.textContent = `One ${PIXELS_PER_EM}px/em atlas (pxrange ${PXRANGE}) via WebGL2, rendered at: ${OUTPUT_SIZES.join(", ")}px — same source texels every time. Atlas gen: ${genMs.toFixed(2)}ms.`;
  root.appendChild(info);

  for (const size of OUTPUT_SIZES) {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = `${size}px`;
    root.appendChild(label);
    root.appendChild(renderAtSize(atlas, glyphs, widthEm, size, dpr));
  }

  // ── Auto-tier row: one atlas per distinct tier picked, built on demand
  // and cached — same pickTier selection the zoom demos use continuously,
  // resolved once per fixed OUTPUT_SIZES entry here. ────────────────────
  const tierInfo = document.createElement("p");
  tierInfo.textContent = `Auto-tiered: each size below uses the smallest of [${ATLAS_SIZES.join(", ")}]px/em whose atlas covers it — compare against the single-atlas row above.`;
  root.appendChild(tierInfo);

  interface TierEntry {
    atlas: Atlas;
    glyphs: LaidOutGlyph[];
    widthEm: number;
    genMs: number;
  }
  const tierAtlases = new Map<number, TierEntry>();
  function tierAtlas(pixelsPerEm: number): TierEntry {
    let entry = tierAtlases.get(pixelsPerEm);
    if (!entry) {
      const a = new Atlas(font, { pixelsPerEm, pxrange: pixelsPerEm / TIER_PXRANGE_RATIO });
      const t0 = performance.now();
      const laid = a.layout(TEXT);
      entry = { atlas: a, glyphs: laid.glyphs, widthEm: laid.widthEm, genMs: performance.now() - t0 };
      tierAtlases.set(pixelsPerEm, entry);
    }
    return entry;
  }

  for (const size of OUTPUT_SIZES) {
    const tierSize = pickTierForSize(size);
    const entry = tierAtlas(tierSize);
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = `${size}px (atlas ${tierSize}px/em)`;
    root.appendChild(label);
    root.appendChild(renderAtSize(entry.atlas, entry.glyphs, entry.widthEm, size, dpr));
  }

  const tierGenSummary = document.createElement("p");
  const tierGenParts = [...tierAtlases.entries()]
    .sort(([a], [b]) => a - b)
    .map(([px, e]) => `${px}px/em ${e.genMs.toFixed(2)}ms`);
  const tierGenTotal = [...tierAtlases.values()].reduce((a, e) => a + e.genMs, 0);
  tierGenSummary.textContent = `Atlas gen (tiers actually built): ${tierGenParts.join(" · ")} — total ${tierGenTotal.toFixed(2)}ms.`;
  root.appendChild(tierGenSummary);

  // ── Underlying atlas texture previews — the single-atlas row's atlas,
  // then one per tier actually built. Debug view of what the shader samples.
  appendAtlasPreview(root, "single-atlas row", atlas);
  const builtSizes = [...tierAtlases.keys()].sort((a, b) => a - b);
  for (const px of builtSizes) {
    appendAtlasPreview(root, `auto-tier ${px}px/em`, tierAtlases.get(px)!.atlas);
  }

  root.dataset.ready = "true"; // signal for tools/screenshot.mjs
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  root.dataset.ready = "true";
  throw err;
});
