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
import { Font, Atlas, type GlyphInfo } from "../../src/index";
import vertSource from "./msdf.vert.glsl?raw";
import fragSource from "./msdf.frag.glsl?raw";

// See demo/canvas/main.ts for why this isn't a hardcoded leading-slash path.
const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;
const ATLAS_SIZE = 64;
const ATLAS_PXRANGE = 8;
const OUTPUT_SIZES = [16, 32, 64, 128, 256]; // em-sizes to render the same atlas at
const TEXT = "Hello Привет 123 @#&";
const FG_COLOR: [number, number, number, number] = [0.08, 0.08, 0.08, 1];
const BG_COLOR: [number, number, number, number] = [1, 1, 1, 1];

interface LayoutGlyph {
  info: GlyphInfo;
  penX: number; // em units
}

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
  glyphs: LayoutGlyph[],
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
  // Adjacent atlas cells are packed with zero gap (see ShelfPacker) —
  // sampling exactly at a cell's edge with bilinear filtering would blend in
  // the next glyph's texels. Inset the sampled UV rect by half a texel on
  // each side so no sample ever reaches outside this glyph's own cell.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const halfTexelU = 0.5 / atlas.width;
  const halfTexelV = 0.5 / atlas.height;

  // ── Instance buffer: [posX, posY, sizeX, sizeY, uvMinX, uvMinY, uvSizeX, uvSizeY] ──
  const genScale = ATLAS_SIZE - 2 * ATLAS_PXRANGE;
  const originXInCellPx = ATLAS_PXRANGE;
  const baselineFromTopPx = ATLAS_SIZE - ATLAS_PXRANGE - 0.25 * genScale;
  const outputScale = targetSize / genScale;
  const screenPxRange = ATLAS_PXRANGE * outputScale;
  const padEm = 0.3;
  const baselineY = 0.75 * canvas.height;

  const FLOATS_PER_INSTANCE = 8;
  const instanceData = new Float32Array(glyphs.length * FLOATS_PER_INSTANCE);
  for (let i = 0; i < glyphs.length; i++) {
    const { info, penX } = glyphs[i]!;
    const originX = (penX + padEm) * targetSize;
    const cellLeft = originX - originXInCellPx * outputScale;
    const cellTop = baselineY - baselineFromTopPx * outputScale;
    const cellSizePx = info.size * outputScale;

    const base = i * FLOATS_PER_INSTANCE;
    instanceData[base + 0] = cellLeft;
    instanceData[base + 1] = cellTop;
    instanceData[base + 2] = cellSizePx;
    instanceData[base + 3] = cellSizePx;
    instanceData[base + 4] = info.rect.x / atlas.width + halfTexelU;
    instanceData[base + 5] = info.rect.y / atlas.height + halfTexelV;
    instanceData[base + 6] = info.rect.w / atlas.width - 2 * halfTexelU;
    instanceData[base + 7] = info.rect.h / atlas.height - 2 * halfTexelV;
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
  const atlas = new Atlas(font, { size: ATLAS_SIZE, pxrange: ATLAS_PXRANGE });
  const { glyphs, widthEm } = layout(font, atlas, TEXT);

  root.textContent = "";
  const info = document.createElement("p");
  info.textContent = `One ${ATLAS_SIZE}px atlas (pxrange ${ATLAS_PXRANGE}) via WebGL2, rendered at: ${OUTPUT_SIZES.join(", ")}px — same source texels every time.`;
  root.appendChild(info);

  for (const size of OUTPUT_SIZES) {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = `${size}px`;
    root.appendChild(label);
    root.appendChild(renderAtSize(atlas, glyphs, widthEm, size, dpr));
  }

  root.dataset.ready = "true"; // signal for tools/screenshot.mjs
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  root.dataset.ready = "true";
  throw err;
});
