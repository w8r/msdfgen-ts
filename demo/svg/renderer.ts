/**
 * Small WebGL2 renderer for full-colour SVGs: one MSDF cell per `<path>`
 * (parseSvgLayers), drawn back to front with its fill colour or gradient.
 * Instanced: every icon × layer is one quad of a single draw call, with the
 * per-layer paint in a float texture. Demo code on purpose — the library
 * itself stays GPU- and DOM-free.
 */
import { Atlas, parseSvgLayers } from "../../src/index";

const MAX_STOPS = 8;
const TEXELS = 16; // per layer row: plane, uv, colour, info, 2 matrix rows, 8 stops, 2× offsets

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
out vec2 vUv;
out vec2 vShape;
out float vPxRange;
flat out int vLayer;
// place() -> (centre x, centre y) in device px, size in px per viewBox height, angle in radians.
${place}
void main() {
  vLayer = gl_InstanceID % uLayerCount;
  vec4 plane = texelFetch(uLayers, ivec2(0, vLayer), 0);
  vec4 uv = texelFetch(uLayers, ivec2(1, vLayer), 0);
  vec2 c = vec2(gl_VertexID & 1, gl_VertexID >> 1); // triangle-strip corner
  vShape = mix(plane.xy, plane.zw, c);
  vUv = mix(uv.xy, uv.zw, c);
  vec4 p = place(aA, aB);
  p.xy = (p.xy - uViewport * 0.5 - uCamera.xy) * uCamera.z + uViewport * 0.5;
  p.z *= uCamera.z;
  vPxRange = uPxRangeEm * p.z;
  vec2 d = mat2(cos(p.w), sin(p.w), -sin(p.w), cos(p.w)) * (vShape - vec2(uWidth, 1.0) * 0.5) * p.z;
  gl_Position = vec4((p.xy + d) / uViewport * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uAtlas;
uniform highp sampler2D uLayers;
in vec2 vUv;
in vec2 vShape;
in float vPxRange;
flat in int vLayer;
out vec4 color;
vec4 L(int i) { return texelFetch(uLayers, ivec2(i, vLayer), 0); }
float offset(int i) { return L(14 + i / 4)[i % 4]; }
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }
void main() {
  vec3 s = texture(uAtlas, vUv).rgb;
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
  /** Atlas holding every layer's MSDF cell; set by {@link SvgRenderer.load}. */
  atlas: Atlas | null = null;
  /** viewBox width / height of the loaded SVG. */
  width = 1;
  /** Number of drawn layers (paths) of the loaded SVG. */
  layers = 0;
  private readonly _gl: WebGL2RenderingContext;
  private readonly _program: WebGLProgram;
  private readonly _atlasTex: WebGLTexture;
  private readonly _layerTex: WebGLTexture;
  private readonly _instances: WebGLBuffer;
  private _uploaded: Float32Array | null = null;

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
    gl.uniform1i(gl.getUniformLocation(program, "uAtlas"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "uLayers"), 1);
    this._atlasTex = this._texture(gl.LINEAR);
    this._layerTex = this._texture(gl.NEAREST); // float data, fetched exactly
    this._instances = gl.createBuffer()!;
  }

  private _texture(filter: number): WebGLTexture {
    const gl = this._gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  /** Parses `svg` and generates one atlas (`pixelsPerEm` texels per viewBox height). */
  load(svg: string, pixelsPerEm: number): Atlas {
    const { layers, width } = parseSvgLayers(svg);
    const atlas = new Atlas(null, { pixelsPerEm, pxrange: pixelsPerEm / 8 });
    const glyphs = atlas.shapes(layers.map((l, i) => [String(i), l.shape] as const));
    const [W, H] = [atlas.width, atlas.height];
    // One texture row per drawn layer, TEXELS × RGBA floats.
    const rows = layers.flatMap((l, i) => {
      const g = glyphs[i]!;
      if (g.w === 0) return [];
      const grad = l.gradient;
      const stops = (grad?.stops ?? []).slice(0, MAX_STOPS);
      const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] = grad?.matrix ?? [];
      const row = new Float32Array(TEXELS * 4);
      // Quad and uv both stop at the outer texel centres (half a texel in), so linear
      // filtering never blends in the neighbouring cell. Texture is y-down.
      const half = 0.5 / pixelsPerEm;
      row.set(
        [g.planeLeft + half, g.planeBottom + half, g.planeRight - half, g.planeTop - half],
        0,
      );
      row.set([(g.x + 0.5) / W, (g.y + g.h - 0.5) / H, (g.x + g.w - 0.5) / W, (g.y + 0.5) / H], 4);
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
      return [row];
    });
    const gl = this._gl;
    gl.bindTexture(gl.TEXTURE_2D, this._atlasTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, atlas.texture);
    const data = new Float32Array(rows.length * TEXELS * 4);
    rows.forEach((row, i) => data.set(row, i * row.length));
    gl.bindTexture(gl.TEXTURE_2D, this._layerTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, TEXELS, rows.length, 0, gl.RGBA, gl.FLOAT, data);
    [this.atlas, this.width, this.layers] = [atlas, width, rows.length];
    return atlas;
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
    gl.bindTexture(gl.TEXTURE_2D, this._atlasTex);
    gl.enable(gl.BLEND); // premultiplied output, overlapping layers
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1i(u("uLayerCount"), this.layers);
    gl.uniform2f(u("uViewport"), gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(u("uWidth"), this.width);
    gl.uniform1f(u("uPxRangeEm"), this.atlas?.pxrangeEm ?? 0);
    gl.uniform1f(u("uTime"), time);
    gl.uniform3fv(u("uCamera"), camera);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count * this.layers);
  }
}
