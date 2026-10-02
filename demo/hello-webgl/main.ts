/**
 * Minimal msdfgen-ts + WebGL2 example: one font, one atlas, one draw call.
 * The text breathes between small and full-width size to show that a single
 * 48 px/em atlas stays crisp at every scale. In your app, import from
 * "msdfgen-ts" instead of the source path below.
 */
import { Atlas, Font } from "../../src/index";

const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;
const TEXT = "Crisp at any size";
const COLOR = [0.96, 0.93, 0.86, 1];

const VERT = `#version 300 es
in vec4 aVertex;     // xy: position in em, zw: atlas uv
uniform vec2 uScale; // em -> clip space
out vec2 vUv;
void main() {
  vUv = aVertex.zw;
  gl_Position = vec4(aVertex.xy * uScale, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uAtlas;
uniform float uScreenPxRange;
uniform vec4 uColor;
in vec2 vUv;
out vec4 color;
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }
void main() {
  vec3 s = texture(uAtlas, vUv).rgb;
  float opacity = clamp(uScreenPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  color = vec4(uColor.rgb, uColor.a * opacity);
}`;

// 1. Font -> atlas -> laid-out glyphs.
const font = new Font(await (await fetch(FONT_URL)).arrayBuffer());
const atlas = new Atlas(font, { pixelsPerEm: 48, pxrange: 4 });
const { glyphs, widthEm } = atlas.layout(TEXT);

// 2. Two triangles per glyph: position in em (text centred on the origin), uv in the atlas.
const CAP_HEIGHT_EM = 0.7;
const quads = glyphs.filter(({ glyph }) => glyph.w > 0);
const vertices = new Float32Array(quads.length * 24);
quads.forEach(({ glyph: g, penX, penY }, i) => {
  const x0 = penX + g.planeLeft - widthEm / 2;
  const x1 = penX + g.planeRight - widthEm / 2;
  const y0 = penY + g.planeBottom - CAP_HEIGHT_EM / 2;
  const y1 = penY + g.planeTop - CAP_HEIGHT_EM / 2;
  const u0 = (g.x + 0.5) / atlas.width;
  const u1 = (g.x + g.w - 0.5) / atlas.width;
  const vTop = (g.y + 0.5) / atlas.height; // the texture is y-down
  const vBottom = (g.y + g.h - 0.5) / atlas.height;
  // prettier-ignore
  vertices.set([
    x0, y0, u0, vBottom,  x1, y0, u1, vBottom,  x0, y1, u0, vTop,
    x0, y1, u0, vTop,     x1, y0, u1, vBottom,  x1, y1, u1, vTop,
  ], i * 24);
});

// 3. WebGL2 setup.
const canvas = document.querySelector("canvas")!;
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("WebGL2 is not available in this browser");

const program = gl.createProgram()!;
for (const [type, source] of [
  [gl.VERTEX_SHADER, VERT],
  [gl.FRAGMENT_SHADER, FRAG],
] as const) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  gl.attachShader(program, shader);
}
gl.linkProgram(program);
gl.useProgram(program);

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
const aVertex = gl.getAttribLocation(program, "aVertex");
gl.enableVertexAttribArray(aVertex);
gl.vertexAttribPointer(aVertex, 4, gl.FLOAT, false, 0, 0);

// Linear filtering is what keeps MSDF edges smooth.
gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA8,
  atlas.width,
  atlas.height,
  0,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  atlas.texture,
);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// Glyph quads overlap their neighbours, so blending is required.
gl.enable(gl.BLEND);
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

const uScale = gl.getUniformLocation(program, "uScale");
const uScreenPxRange = gl.getUniformLocation(program, "uScreenPxRange");
gl.uniform4fv(gl.getUniformLocation(program, "uColor"), COLOR);

// 4. Render loop. All sizes are in device pixels, so text stays sharp on HiDPI screens.
function frame(timeMs: number): void {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
  gl!.viewport(0, 0, canvas.width, canvas.height);

  // Breathe between full width and 1/16 of it (log scale, so the motion feels even).
  const fullWidthPxPerEm = (canvas.width * 0.9) / widthEm;
  const fontSizePx = fullWidthPxPerEm * 2 ** (-2 * (1 - Math.cos(timeMs / 2500)));

  gl!.uniform2f(uScale, (2 * fontSizePx) / canvas.width, (2 * fontSizePx) / canvas.height);
  gl!.uniform1f(uScreenPxRange, atlas.pxrangeEm * fontSizePx);
  gl!.clearColor(0.06, 0.07, 0.09, 1);
  gl!.clear(gl!.COLOR_BUFFER_BIT);
  gl!.drawArrays(gl!.TRIANGLES, 0, quads.length * 6);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
