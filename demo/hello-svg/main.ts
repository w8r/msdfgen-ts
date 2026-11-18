/**
 * Minimal SVG -> MSDF atlas example with WebGL2: a few colour SVG icons,
 * one atlas, one draw call. Each filled path is its own MSDF cell, drawn
 * back to front in its SVG fill colour. The row breathes between small and
 * full-width size to show that one 64 px atlas stays crisp at every scale.
 * The library part is step 1; the rest is the same WebGL2 setup as
 * hello-webgl. In your app, import from "msdfgen-ts" instead of the source
 * path below. Solid fills only here; for gradients, see demo/svg. For a
 * single-colour icon, `parseSvg` gives one merged shape instead of layers.
 */
import { Atlas, parseSvgLayers } from "../../src/index";

const ICONS = {
  heart: `<svg viewBox="0 0 24 24">
    <path fill="#e5484d" d="M12 21 3.5 12.5A5 5 0 0 1 12 6a5 5 0 0 1 8.5 6.5Z"/>
    <ellipse fill="white" opacity="0.5" cx="7.5" cy="10" rx="2" ry="1.4"/></svg>`,
  star: `<svg viewBox="0 0 24 24">
    <polygon fill="hsl(40 92% 52%)" points="12 2 15 9 22 9.5 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.5 9 9"/></svg>`,
  ring: `<svg viewBox="0 0 24 24">
    <path fill="#12a594" fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zm0 5a5 5 0 1 1 0 10a5 5 0 1 1 0-10z"/>
    <circle fill="#f4ecdb" cx="12" cy="12" r="2.5"/></svg>`,
  arrow: `<svg viewBox="0 0 36 24">
    <path fill="#3e63dd" d="M2 10h20V4l12 8-12 8v-6H2z"/>
    <rect fill="rgb(141 164 239)" x="2" y="10" width="20" height="2"/></svg>`,
};
const GAP = 0.25; // between icons, in icon heights

/** Any CSS colour (the library returns fills as raw CSS strings) -> [r, g, b, a] in 0..1,
 *  parsed by the browser: paint it onto a 1x1 canvas and read the pixel back. */
const swatch = new OffscreenCanvas(1, 1).getContext("2d", { willReadFrequently: true })!;
function rgba(css: string, opacity: number): number[] {
  swatch.clearRect(0, 0, 1, 1);
  swatch.fillStyle = "#000"; // fallback for anything the canvas rejects (e.g. currentColor)
  swatch.fillStyle = css;
  swatch.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0, a = 0] = swatch.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255, (a / 255) * opacity];
}

const VERT = `#version 300 es
in vec4 aVertex;     // xy: position in icon heights, zw: atlas uv
in vec4 aColor;      // the layer's fill colour and opacity
uniform vec2 uScale; // icon heights -> clip space
out vec2 vUv;
out vec4 vColor;
void main() {
  vUv = aVertex.zw;
  vColor = aColor;
  gl_Position = vec4(aVertex.xy * uScale, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uAtlas;
uniform float uScreenPxRange;
in vec2 vUv;
in vec4 vColor;
out vec4 color;
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }
void main() {
  vec3 s = texture(uAtlas, vUv).rgb;
  float opacity = clamp(uScreenPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  color = vec4(vColor.rgb, vColor.a * opacity);
}`;

// 1. SVG -> one shape per filled path -> one atlas. No font: `null`. Shape
//    units are viewBox heights, so `pixelsPerEm: 64` means 64 texels per icon
//    height. Each layer gets its own key; the layers come back to front.
const icons = Object.entries(ICONS).map(([name, svg]) => ({ name, ...parseSvgLayers(svg) }));
const atlas = new Atlas(null, { pixelsPerEm: 64, pxrange: 8 });
const rowWidth = icons.reduce((sum, icon) => sum + icon.width, 0) + GAP * (icons.length - 1);
let penX = -rowWidth / 2;
const layers = icons.flatMap((icon) => {
  const x = penX; // where this icon's viewBox starts
  penX += icon.width + GAP;
  return icon.layers.map((layer, i) => ({ key: `${icon.name}:${i}`, layer, x }));
});
const cells = atlas.shapes(layers.map((l) => [l.key, l.layer.shape] as const)); // one batch

// 2. Two triangles per layer, in paint order (later layers draw on top).
//    Plane bounds are relative to the icon's viewBox (origin bottom-left,
//    height 1), and `width` is the viewBox width, so icons sit on a row
//    exactly as their viewBoxes would.
const vertices = new Float32Array(cells.length * 48);
cells.forEach((g, i) => {
  const { layer, x } = layers[i]!;
  const color = rgba(layer.color, layer.opacity);
  const x0 = x + g.planeLeft;
  const x1 = x + g.planeRight;
  const y0 = g.planeBottom - 0.5;
  const y1 = g.planeTop - 0.5;
  const u0 = g.x / atlas.width;
  const u1 = (g.x + g.w) / atlas.width;
  const vTop = g.y / atlas.height; // the texture is y-down
  const vBottom = (g.y + g.h) / atlas.height;
  // prettier-ignore
  const corners = [
    x0, y0, u0, vBottom,  x1, y0, u1, vBottom,  x0, y1, u0, vTop,
    x0, y1, u0, vTop,     x1, y0, u1, vBottom,  x1, y1, u1, vTop,
  ];
  for (let k = 0; k < 6; k++)
    vertices.set([...corners.slice(k * 4, k * 4 + 4), ...color], (i * 6 + k) * 8);
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
gl.vertexAttribPointer(aVertex, 4, gl.FLOAT, false, 32, 0);
const aColor = gl.getAttribLocation(program, "aColor");
gl.enableVertexAttribArray(aColor);
gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 32, 16);

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

gl.enable(gl.BLEND);
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

const uScale = gl.getUniformLocation(program, "uScale");
const uScreenPxRange = gl.getUniformLocation(program, "uScreenPxRange");

// 4. Render loop. All sizes are in device pixels, so icons stay sharp on HiDPI screens.
function frame(timeMs: number): void {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
  gl!.viewport(0, 0, canvas.width, canvas.height);

  // Breathe between full width and 1/16 of it (log scale, so the motion feels even).
  const fullWidthPx = Math.min((canvas.width * 0.9) / rowWidth, canvas.height * 0.8);
  const iconPx = fullWidthPx * 2 ** (-2 * (1 - Math.cos(timeMs / 2500)));

  gl!.uniform2f(uScale, (2 * iconPx) / canvas.width, (2 * iconPx) / canvas.height);
  gl!.uniform1f(uScreenPxRange, atlas.pxrangeEm * iconPx);
  gl!.clearColor(0.06, 0.07, 0.09, 1);
  gl!.clear(gl!.COLOR_BUFFER_BIT);
  gl!.drawArrays(gl!.TRIANGLES, 0, cells.length * 6);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
