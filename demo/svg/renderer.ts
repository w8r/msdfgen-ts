/**
 * Small WebGL2 renderer for full-colour SVGs: one MSDF cell per `<path>`
 * (parseSvgLayers), drawn back to front with its fill colour or gradient.
 * Instanced: every icon × layer is one quad of a single draw call, with the
 * per-layer paint in a float texture. Demo code on purpose — the library
 * itself stays GPU- and DOM-free.
 *
 * Deep zoom: the MSDF stays in float32 (no 8-bit rounding of distances) and
 * the shader interpolates it itself with texelFetch, in full float precision.
 * Hardware bilinear filtering uses low-precision fixed-point weights (often
 * 1/256 texel), which turns edges into visible staircases once one texel
 * covers hundreds of screen pixels.
 */
import potpack from "potpack";
import { generateShapeMSDF, parseSvgLayers } from "../../src/index";

const MAX_STOPS = 8;
const TEXELS = 16; // per layer row: plane, cell, colour, info, 2 matrix rows, 8 stops, 2× offsets

/** Default placement: instance attribute `a` is (centre x, centre y, size, angle). */
const PLACE_STATIC = `vec4 place(vec4 a, vec4 b) { return a; }`;

const vert = (place: string): string => `#version 300 es
precision highp float;
uniform highp sampler2D uLayers;
uniform int uLayerCount;
uniform vec2 uViewport;   // device px
uniform float uWidth;     // viewBox width / height
uniform float uPxRangeEm;
uniform float uTime;
uniform vec3 uCamera;     // pan x, pan y (device px), zoom — around the viewport centre
in vec4 aA;               // per-instance data, interpreted by place()
in vec4 aB;
out vec2 vShape;
out float vPxRange;
flat out int vLayer;
// place() -> (centre x, centre y) in device px, size in px per viewBox height, angle in radians.
${place}
void main() {
  vLayer = gl_InstanceID % uLayerCount;
  vec4 plane = texelFetch(uLayers, ivec2(0, vLayer), 0);
  vShape = mix(plane.xy, plane.zw, vec2(gl_VertexID & 1, gl_VertexID >> 1)); // strip corner
  vec4 p = place(aA, aB);
  p.xy = (p.xy - uViewport * 0.5 - uCamera.xy) * uCamera.z + uViewport * 0.5;
  p.z *= uCamera.z;
  vPxRange = uPxRangeEm * p.z;
  vec2 d = mat2(cos(p.w), sin(p.w), -sin(p.w), cos(p.w)) * (vShape - vec2(uWidth, 1.0) * 0.5) * p.z;
  gl_Position = vec4((p.xy + d) / uViewport * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform highp sampler2D uMsdf; // float RGB, rows y-up like the cells; texelFetch only
uniform highp sampler2D uLayers;
uniform float uPxPerEm;
in vec2 vShape;
in float vPxRange;
flat in int vLayer;
out vec4 color;
vec4 L(int i) { return texelFetch(uLayers, ivec2(i, vLayer), 0); }
float offset(int i) { return L(14 + i / 4)[i % 4]; }
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }
// One MSDF texel of this layer's cell (x, y, w, h), clamped to the cell.
vec3 texel(vec4 cell, vec2 i) {
  return texelFetch(uMsdf, ivec2(clamp(i, vec2(0.0), cell.zw - 1.0) + cell.xy), 0).rgb;
}
// Bilinear MSDF sample at vShape, in full float precision (the reconstruction msdfgen
// assumes; higher-order filters overshoot at corners, where channels have kinks).
vec3 msdf() {
  vec4 cell = L(1);
  vec2 t = (vShape - L(0).xy) * uPxPerEm - 0.5; // texel centres at integers
  vec2 i = floor(t), f = t - i;
  return mix(mix(texel(cell, i), texel(cell, i + vec2(1, 0)), f.x),
             mix(texel(cell, i + vec2(0, 1)), texel(cell, i + vec2(1, 1)), f.x), f.y);
}
void main() {
  vec3 s = msdf();
  float coverage = clamp(vPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  if (coverage == 0.0) discard; // quad padding: skip the paint lookup and blending
  vec4 c = L(2);
  vec4 info = L(3); // gradient type (0 solid, 1 linear, 2 radial), stop count
  if (info.x > 0.0) {
    vec3 q = vec3(vShape, 1.0);
    vec2 g = vec2(dot(L(4).xyz, q), dot(L(5).xyz, q));
    float t = clamp(info.x == 1.0 ? g.x : length(g), 0.0, 1.0);
    c = L(6);
    for (int i = 1; i < ${MAX_STOPS}; i++) {
      if (float(i) >= info.y) break;
      float span = max(offset(i) - offset(i - 1), 1e-6);
      c = mix(c, L(6 + i), clamp((t - offset(i - 1)) / span, 0.0, 1.0));
    }
  }
  color = vec4(c.rgb, c.a * coverage);
}`;

/** CSS colour → RGBA in 0..1, parsed by the browser (named colours, rgb(), …). */
const swatch = new OffscreenCanvas(1, 1).getContext("2d", { willReadFrequently: true })!;
function rgba(css: string, opacity: number): number[] {
  swatch.clearRect(0, 0, 1, 1);
  swatch.fillStyle = "#000"; // fallback for anything the canvas rejects (e.g. currentColor)
  swatch.fillStyle = css;
  swatch.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0, a = 0] = swatch.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255, (a / 255) * opacity];
}

/** Draws many instances of one SVG (all its layers) with WebGL2. */
export class SvgRenderer {
  /** All layers' float MSDF cells, packed (RGB, rows y-up); set by {@link SvgRenderer.load}. */
  msdf = { width: 0, height: 0, data: new Float32Array(0) };
  /** viewBox width / height of the loaded SVG. */
  width = 1;
  /** Number of drawn layers (paths) of the loaded SVG. */
  layers = 0;
  private readonly _gl: WebGL2RenderingContext;
  private readonly _program: WebGLProgram;
  private readonly _msdfTex: WebGLTexture;
  private readonly _layerTex: WebGLTexture;
  private readonly _instances: WebGLBuffer;
  private _uploaded: Float32Array | null = null;
  private _pxPerEm = 1;

  /**
   * @param gl Target context.
   * @param place GLSL `vec4 place(vec4 a, vec4 b)` positioning each instance from its two
   *   per-instance vec4s (may use `uTime`, `uViewport`, `uWidth`). Default: `a` is
   *   (centre x, centre y, size, angle).
   */
  constructor(gl: WebGL2RenderingContext, place = PLACE_STATIC) {
    this._gl = gl;
    const program = (this._program = gl.createProgram()!);
    for (const [type, src] of [
      [gl.VERTEX_SHADER, vert(place)],
      [gl.FRAGMENT_SHADER, FRAG],
    ] as const) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.uniform1i(gl.getUniformLocation(program, "uMsdf"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "uLayers"), 1);
    this._msdfTex = this._texture();
    this._layerTex = this._texture();
    this._instances = gl.createBuffer()!;
  }

  /** A float data texture, read with texelFetch only (NEAREST keeps it complete). */
  private _texture(): WebGLTexture {
    const gl = this._gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return tex;
  }

  /** Parses `svg` and generates its MSDF cells (`pixelsPerEm` texels per viewBox height). */
  load(svg: string, pixelsPerEm: number): void {
    const { layers, width } = parseSvgLayers(svg);
    // One float MSDF cell per path, packed into one texture without quantization.
    const cells = layers.flatMap((layer) => {
      const m = generateShapeMSDF(layer.shape, pixelsPerEm, pixelsPerEm / 8);
      return m ? [{ layer, m, w: m.w, h: m.h, x: 0, y: 0 }] : [];
    });
    const { w: W, h: H } = potpack([...cells]); // a copy: potpack sorts in place, cells keep paint order
    const texels = new Float32Array(W * H * 3);
    for (const { m, x, y, w, h } of cells) {
      for (let row = 0; row < h; row++) {
        texels.set(m.msdf.subarray(row * w * 3, (row + 1) * w * 3), ((y + row) * W + x) * 3);
      }
    }
    // One texture row per drawn layer, TEXELS × RGBA floats.
    const rows = cells.map(({ layer: l, m, x, y, w, h }) => {
      const grad = l.gradient;
      const stops = (grad?.stops ?? []).slice(0, MAX_STOPS);
      const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] = grad?.matrix ?? [];
      const row = new Float32Array(TEXELS * 4);
      row.set([m.planeLeft, m.planeBottom, m.planeRight, m.planeTop], 0);
      row.set([x, y, w, h], 4);
      row.set(rgba(l.color, l.opacity), 8);
      row.set([grad ? (grad.radial ? 2 : 1) : 0, stops.length], 12);
      row.set([a, c, e, 0, b, d, f, 0], 16);
      row.set(
        stops.flatMap((s) => rgba(s.color, s.opacity * l.opacity)),
        24,
      );
      row.set(
        stops.map((s) => s.offset),
        56,
      );
      return row;
    });
    const gl = this._gl;
    gl.bindTexture(gl.TEXTURE_2D, this._msdfTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB32F, W, H, 0, gl.RGB, gl.FLOAT, texels);
    const data = new Float32Array(rows.length * TEXELS * 4);
    rows.forEach((row, i) => data.set(row, i * row.length));
    gl.bindTexture(gl.TEXTURE_2D, this._layerTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, TEXELS, rows.length, 0, gl.RGBA, gl.FLOAT, data);
    this.msdf = { width: W, height: H, data: texels };
    [this._pxPerEm, this.width, this.layers] = [pixelsPerEm, width, rows.length];
  }

  /** Draws the loaded float MSDF into `canvas`, one texel per canvas pixel. */
  showMsdf(canvas: HTMLCanvasElement): void {
    const { width: w, height: h, data } = this.msdf;
    [canvas.width, canvas.height] = [w, h];
    if (w === 0) return;
    const pixels = new ImageData(w, h);
    for (let i = 0; i < w * h; i++) {
      const src = ((h - 1 - Math.floor(i / w)) * w + (i % w)) * 3; // rows are y-up
      pixels.data.set([data[src]! * 255, data[src + 1]! * 255, data[src + 2]! * 255, 255], i * 4);
    }
    canvas.getContext("2d")!.putImageData(pixels, 0, 0);
  }

  /**
   * Draws one instance per 8 floats of `instances` (two vec4s for `place()`), in one
   * draw call. Re-uploads `instances` only when given a different array. `camera` is
   * (pan x, pan y, zoom) in device px, y-up, applied after `place()`.
   */
  draw(instances: Float32Array, time = 0, camera = [0, 0, 1]): void {
    const gl = this._gl;
    const count = instances.length / 8;
    if (this.layers === 0 || count === 0) return;
    const u = (name: string): WebGLUniformLocation | null =>
      gl.getUniformLocation(this._program, name);
    gl.useProgram(this._program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._instances);
    if (instances !== this._uploaded) {
      gl.bufferData(gl.ARRAY_BUFFER, instances, gl.STATIC_DRAW);
      this._uploaded = instances;
    }
    for (const [name, offset] of [
      ["aA", 0],
      ["aB", 16],
    ] as const) {
      const loc = gl.getAttribLocation(this._program, name);
      if (loc < 0) continue; // unused by place()
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 32, offset);
      gl.vertexAttribDivisor(loc, this.layers); // one icon = `layers` consecutive instances
    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._layerTex);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._msdfTex);
    gl.enable(gl.BLEND); // premultiplied output, overlapping layers
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1i(u("uLayerCount"), this.layers);
    gl.uniform2f(u("uViewport"), gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(u("uWidth"), this.width);
    gl.uniform1f(u("uPxRangeEm"), 1 / 8); // pxrange = pixelsPerEm / 8 (see load)
    gl.uniform1f(u("uPxPerEm"), this._pxPerEm);
    gl.uniform1f(u("uTime"), time);
    gl.uniform3fv(u("uCamera"), camera);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count * this.layers);
  }
}
