/**
 * Interactive pan/zoom WebGL2 demo — drag to pan, wheel/pinch to zoom toward
 * the cursor, over a single fixed-resolution atlas tier (no re-tiering yet;
 * see CLAUDE.md's M5 plan for the later regenerate-on-threshold step).
 *
 * Camera state (world position under the viewport centre + zoom factor) is
 * kept in plain JS numbers (f64) and only ever narrowed to f32 at the very
 * last step — writing each glyph's already-small SCREEN-SPACE pixel rect
 * into the instance Float32Array. The vertex shader never sees the camera or
 * large world coordinates, only per-instance screen pixels + a screenPxRange
 * uniform, so there's no "huge NDC coordinate loses precision in f32" failure
 * mode even at deep zoom: the translate (world -> screen, f64) always happens
 * before the scale-sensitive part reaches GPU-precision numbers.
 *
 * Shares its shaders with demo/webgl/ (same reconstruction, same instance
 * layout) — only the per-frame camera transform is new.
 */
import { Font, Atlas, type GlyphInfo } from "../../src/index";
import vertSource from "../webgl/msdf.vert.glsl?raw";
import fragSource from "../webgl/msdf.frag.glsl?raw";

const FONT_URL = "/test/fonts/PTSerif-Regular.ttf";
const ATLAS_SIZE = 64;
const ATLAS_PXRANGE = 8;
const BASE_PX_PER_EM = 48; // pixel-per-em at zoom = 1
const MIN_ZOOM = 0.05;
const MAX_ZOOM = 4096; // well past this tier's crisp range (softens, doesn't break) — no tiering yet
const ZOOM_SPEED = 0.0018; // wheel deltaY -> exponential zoom factor
const CANVAS_CSS_WIDTH = 1100;
const CANVAS_CSS_HEIGHT = 480;
const TEXT = "Hello Привет 123 @#&";
const FG_COLOR: [number, number, number, number] = [0.08, 0.08, 0.08, 1];
const BG_COLOR: [number, number, number, number] = [1, 1, 1, 1];

interface LayoutGlyph {
  info: GlyphInfo;
  penX: number; // em units, world-space (baseline y = 0)
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

/** World-space camera focus point (em units) + zoom factor. All f64. */
interface Camera {
  x: number;
  y: number;
  zoom: number;
}

async function main(): Promise<void> {
  const root = document.getElementById("root")!;

  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(CANVAS_CSS_WIDTH * dpr);
  canvas.height = Math.round(CANVAS_CSS_HEIGHT * dpr);
  canvas.style.width = `${CANVAS_CSS_WIDTH}px`;
  canvas.style.height = `${CANVAS_CSS_HEIGHT}px`;
  canvas.className = "zoom-canvas";

  const glOrNull = canvas.getContext("webgl2");
  if (!glOrNull) {
    root.textContent = "WebGL2 is not available in this browser.";
    root.dataset.ready = "true"; // signal for tools/screenshot.mjs
    return;
  }
  const gl: WebGL2RenderingContext = glOrNull; // narrowed once, used inside closures below

  root.textContent = "";
  root.appendChild(canvas);
  const readout = document.createElement("div");
  readout.className = "readout";
  root.appendChild(readout);


  const buf = await fetch(FONT_URL).then((r) => r.arrayBuffer());
  console.time('Font + Atlas build');
  const font = new Font(buf);
  const atlas = new Atlas(font, { size: ATLAS_SIZE, pxrange: ATLAS_PXRANGE });
  console.timeEnd('Font + Atlas build');
  const { glyphs, widthEm } = layout(font, atlas, TEXT);

  // ── Atlas texture (built once — single fixed tier) ──────────────────────
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
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const halfTexelU = 0.5 / atlas.width;
  const halfTexelV = 0.5 / atlas.height;

  const genScale = ATLAS_SIZE - 2 * ATLAS_PXRANGE;
  const originXInCellPx = ATLAS_PXRANGE;
  const baselineFromTopPx = ATLAS_SIZE - ATLAS_PXRANGE - 0.25 * genScale;

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

  const FLOATS_PER_INSTANCE = 8;
  const instanceData = new Float32Array(glyphs.length * FLOATS_PER_INSTANCE);
  const instanceBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, instanceData, gl.DYNAMIC_DRAW); // rewritten every frame
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

  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const uViewportSize = gl.getUniformLocation(program, "viewportSize");
  const uScreenPxRange = gl.getUniformLocation(program, "screenPxRange");
  const uFgColor = gl.getUniformLocation(program, "fgColor");
  const uBgColor = gl.getUniformLocation(program, "bgColor");
  const uAtlasTexture = gl.getUniformLocation(program, "atlasTexture");

  // ── Camera: start centred on the text, zoomed to fit ────────────────────
  const camera: Camera = { x: widthEm / 2, y: -0.15, zoom: 1 };

  /**
   * Writes this frame's instance data (translate world->screen in f64, then
   * narrow to f32 only in the typed array) and draws one frame.
   */
  function render(): void {
    const pixelPerEm = BASE_PX_PER_EM * camera.zoom;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outputScale = pixelPerEm / genScale;
    const screenPxRange = ATLAS_PXRANGE * outputScale;

    for (let i = 0; i < glyphs.length; i++) {
      const { info, penX } = glyphs[i]!;
      // World -> screen (f64) happens here, before anything narrows to f32.
      const originXScreen = centerX + (penX - camera.x) * pixelPerEm;
      const originYScreen = centerY - (0 - camera.y) * pixelPerEm;
      const cellLeft = originXScreen - originXInCellPx * outputScale;
      const cellTop = originYScreen - baselineFromTopPx * outputScale;
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
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, instanceData);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(...BG_COLOR);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniform2f(uViewportSize, canvas.width, canvas.height);
    gl.uniform1f(uScreenPxRange, screenPxRange);
    gl.uniform4fv(uFgColor, FG_COLOR);
    gl.uniform4fv(uBgColor, BG_COLOR);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, atlasTexture);
    gl.uniform1i(uAtlasTexture, 0);

    gl.bindVertexArray(vao);
    gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, glyphs.length);

    readout.textContent = `zoom ${camera.zoom.toExponential(2)}x · effective screenPxRange ${screenPxRange.toFixed(1)}px · atlas ${ATLAS_SIZE}px/pxrange${ATLAS_PXRANGE} (fixed tier)`;
  }

  // ── Pointer pan (drag to move content under the cursor 1:1) ─────────────
  let dragging = false;
  let lastScreenX = 0;
  let lastScreenY = 0;

  canvas.addEventListener("pointerdown", (ev) => {
    dragging = true;
    lastScreenX = ev.clientX;
    lastScreenY = ev.clientY;
    canvas.setPointerCapture(ev.pointerId);
  });
  canvas.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    const dxCss = ev.clientX - lastScreenX;
    const dyCss = ev.clientY - lastScreenY;
    lastScreenX = ev.clientX;
    lastScreenY = ev.clientY;
    const pixelPerEm = BASE_PX_PER_EM * camera.zoom;
    // render()'s screen-space formula has opposite signs for the two axes
    // (screenX = centerX + (worldX-camera.x)*pixelPerEm, but
    //  screenY = centerY - (worldY-camera.y)*pixelPerEm — the Y flip that
    // makes camera.y increase "look up" like world-space, not screen-space),
    // so dragging content to follow the cursor needs opposite signs too.
    camera.x -= (dxCss * dpr) / pixelPerEm;
    camera.y += (dyCss * dpr) / pixelPerEm;
    render();
  });
  const stopDrag = (): void => {
    dragging = false;
  };
  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);

  // ── Wheel zoom, anchored to the cursor ───────────────────────────────────
  canvas.addEventListener(
    "wheel",
    (ev) => {
      ev.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const cursorScreenX = (ev.clientX - rect.left) * dpr;
      const cursorScreenY = (ev.clientY - rect.top) * dpr;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const pixelPerEmOld = BASE_PX_PER_EM * camera.zoom;
      const worldX = camera.x + (cursorScreenX - centerX) / pixelPerEmOld;
      const worldY = camera.y + (centerY - cursorScreenY) / pixelPerEmOld;

      const factor = Math.exp(-ev.deltaY * ZOOM_SPEED);
      camera.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, camera.zoom * factor));

      const pixelPerEmNew = BASE_PX_PER_EM * camera.zoom;
      camera.x = worldX - (cursorScreenX - centerX) / pixelPerEmNew;
      camera.y = worldY - (centerY - cursorScreenY) / pixelPerEmNew;

      render();
    },
    { passive: false },
  );

  render();
  root.dataset.ready = "true"; // signal for tools/screenshot.mjs
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  root.dataset.ready = "true";
  throw err;
});
