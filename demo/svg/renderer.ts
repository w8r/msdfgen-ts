/**
 * Small WebGL2 renderer for full-colour SVGs: one MSDF cell per `<path>`
 * (parseSvgLayers), drawn back to front with its fill colour or gradient. Demo
 * code on purpose — the library itself stays GPU- and DOM-free.
 *
 * Each SVG is a template mesh: one quad per layer, its paint in vertex attributes
 * (flat or exactly interpolated varyings), so a fragment reads nothing but its MSDF.
 * Every icon is one instance of its SVG's mesh (see SvgRenderer.draw).
 *
 * The MSDF is sampled with the GPU's bilinear filter from a float16 copy. Its
 * fixed-point weights (~1/256 texel) make staircases at deep zoom, and float16
 * moves edges by up to size / 32768 px, so past either limit (see draw) a quad
 * filters the float32 MSDF itself: four texelFetches, full float precision.
 */
import potpack from "potpack";
import { generateShapeMSDF, parseSvgLayers } from "../../src/index";

const MAX_STOPS = 8;
const MAX_DRAWS = 128; // draw calls per frame with several SVGs, see SvgRenderer.draw
const HARDWARE_FILTER_MAX_TEXEL_PX = 16; // see SvgRenderer.hardwareFilterMaxTexelPx
const HALF_FLOAT_MAX_PX = 1024; // px per viewBox height: float16 edges within 1/32 px
const STRIDE = 104; // template vertex bytes, see VERTEX

/** Template vertex layout: attribute (4 components), type, byte offset. */
const { FLOAT, UNSIGNED_SHORT, UNSIGNED_INT } = WebGL2RenderingContext;
const VERTEX = [
  ["aCorner", FLOAT, 0], // shape x, y; MSDF texel coordinate x, y
  ["aGrad", FLOAT, 16], // gradient coordinates x, y; gradient type; stop count
  ["aCell", UNSIGNED_SHORT, 32], // MSDF cell x, y, w, h (texels)
  ["aStops0", UNSIGNED_INT, 40], // stop colours 0-3, RGBA8 (stop 0 = the solid colour)
  ["aStops1", UNSIGNED_INT, 56], // stop colours 4-7
  ["aOffsets0", FLOAT, 72], // stop offsets 0-3
  ["aOffsets1", FLOAT, 88], // stop offsets 4-7
] as const;

/** Default placement: instance attribute `a` is (centre x, centre y, size, angle). */
const PLACE_STATIC = `vec4 place(vec4 a, vec4 b) { return a; }`;

const vert = (place: string): string => `#version 300 es
precision highp float;
uniform vec2 uViewport;   // device px
uniform float uPxRangeEm;
uniform float uHardwareMax; // px per viewBox height up to which the GPU filter is used
uniform float uTime;
uniform vec3 uCamera;     // pan x, pan y (device px), zoom — around the viewport centre
uniform float svgWidth;   // this draw's viewBox width / height (readable by place())
in vec4 aA, aB;           // per-instance data, interpreted by place()
in vec4 aCorner, aGrad, aCell, aOffsets0, aOffsets1; // per-vertex template data, see VERTEX
in uvec4 aStops0, aStops1;
out vec4 vT;              // MSDF texel coordinate (centres at integers), gradient coordinates
flat out vec4 vCell;      // x, y, w - 1, h - 1
flat out vec4 vInfo;      // screen px range, gradient type (0 solid, 1 linear, 2 radial),
                          // stop count, 1 to filter the MSDF in the shader (deep zoom)
flat out uvec4 vStops0, vStops1;
flat out vec4 vOffsets0, vOffsets1;
// place() -> (centre x, centre y) in device px, size in px per viewBox height, angle in radians.
${place}
void main() {
  vec4 p = place(aA, aB);
  p.xy = (p.xy - uViewport * 0.5 - uCamera.xy) * uCamera.z + uViewport * 0.5;
  p.z *= uCamera.z;
  vec2 d = mat2(cos(p.w), sin(p.w), -sin(p.w), cos(p.w)) * (aCorner.xy - vec2(svgWidth, 1.0) * 0.5) * p.z;
  gl_Position = vec4((p.xy + d) / uViewport * 2.0 - 1.0, 0.0, 1.0);
  vT = vec4(aCorner.zw, aGrad.xy);
  vCell = vec4(aCell.xy, aCell.zw - 1.0);
  vInfo = vec4(uPxRangeEm * p.z, aGrad.zw, p.z > uHardwareMax ? 1.0 : 0.0);
  vStops0 = aStops0; vStops1 = aStops1;
  vOffsets0 = aOffsets0; vOffsets1 = aOffsets1;
}`;

const FRAG = `#version 300 es
precision highp float;
uniform highp sampler2D uMsdf; // float32 RGB, rows y-up like the cells; texelFetch only
uniform highp sampler2D uMsdfHalf; // the same in float16, bilinear
uniform vec2 uMsdfInv;         // 1 / their size
in vec4 vT;
flat in vec4 vCell, vInfo, vOffsets0, vOffsets1;
flat in uvec4 vStops0, vStops1;
out vec4 color;
vec4 stop(int i) {
  uint c = (i < 4 ? vStops0 : vStops1)[i & 3];
  return vec4(uvec4(c, c >> 8, c >> 16, c >> 24) & 0xFFu) / 255.0;
}
float offset(int i) { return (i < 4 ? vOffsets0 : vOffsets1)[i & 3]; }
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }
// One MSDF texel of this layer's cell, clamped to the cell.
vec3 texel(vec2 i) {
  return texelFetch(uMsdf, ivec2(clamp(i, vec2(0.0), vCell.zw) + vCell.xy), 0).rgb;
}
// Bilinear MSDF sample (the reconstruction msdfgen assumes; higher-order filters
// overshoot at corners, where channels have kinks), clamped to this layer's cell.
vec3 msdf() {
  if (vInfo.w == 0.0) { // GPU filter, between the cell's texel centres
    return textureLod(uMsdfHalf, (clamp(vT.xy, vec2(0.0), vCell.zw) + vCell.xy + 0.5) * uMsdfInv, 0.0).rgb;
  }
  vec2 i = floor(vT.xy), f = vT.xy - i; // deep zoom: in full float precision
  return mix(mix(texel(i), texel(i + vec2(1, 0)), f.x),
             mix(texel(i + vec2(0, 1)), texel(i + vec2(1, 1)), f.x), f.y);
}
void main() {
  vec3 s = msdf();
  float coverage = clamp(vInfo.x * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  if (coverage == 0.0) discard; // quad padding: skip the paint and blending
  vec4 c = stop(0);
  if (vInfo.y > 0.0) {
    float t = clamp(vInfo.y == 1.0 ? vT.z : length(vT.zw), 0.0, 1.0);
    for (int i = 1; i < ${MAX_STOPS}; i++) {
      if (float(i) >= vInfo.z) break;
      float span = max(offset(i) - offset(i - 1), 1e-6);
      c = mix(c, stop(i), clamp((t - offset(i - 1)) / span, 0.0, 1.0));
    }
  }
  color = vec4(c.rgb, c.a * coverage);
}`;

/** CSS colour → RGBA8 packed little-endian (r in the low byte), parsed by the browser. */
const swatch = new OffscreenCanvas(1, 1).getContext("2d", { willReadFrequently: true })!;
function rgba(css: string, opacity: number): number {
  swatch.clearRect(0, 0, 1, 1);
  swatch.fillStyle = "#000"; // fallback for anything the canvas rejects (e.g. currentColor)
  swatch.fillStyle = css;
  swatch.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0, a = 0] = swatch.getImageData(0, 0, 1, 1).data;
  return (r | (g << 8) | (b << 16) | (Math.round(a * opacity) << 24)) >>> 0;
}

/** Draws many instances of one or more SVGs (all their layers) with WebGL2. */
export class SvgRenderer {
  /** All layers' float MSDF cells, packed (RGB, rows y-up); set by {@link SvgRenderer.load}. */
  msdf = { width: 0, height: 0, data: new Float32Array(0) };
  /** viewBox width / height of each loaded SVG. */
  widths: number[] = [];
  /** Number of drawn layers (paths), all SVGs together. */
  layers = 0;
  /** Draw calls issued by the last {@link SvgRenderer.draw}. */
  drawCalls = 0;
  /**
   * Screen px per MSDF texel up to which the GPU's bilinear filter samples the MSDF;
   * bigger quads filter in the shader, in full precision. 0 = always in the shader.
   */
  hardwareFilterMaxTexelPx = HARDWARE_FILTER_MAX_TEXEL_PX;
  private readonly _gl: WebGL2RenderingContext;
  private readonly _program: WebGLProgram;
  private readonly _vao: WebGLVertexArrayObject;
  private readonly _msdfTex: WebGLTexture;
  private readonly _halfTex: WebGLTexture;
  private readonly _template: WebGLBuffer;
  private readonly _indices: WebGLBuffer;
  private readonly _instances: WebGLBuffer;
  private readonly _u = new Map<string, WebGLUniformLocation | null>(); // looked up once
  private readonly _aA: number;
  private readonly _aB: number;
  private _uploaded: Float32Array | null = null;
  private _pxPerEm = 1;
  private _counts: number[] = []; // quads per SVG (its drawn layers)
  private _firstQuad: number[] = []; // per SVG: its first quad in the template mesh
  private _ranges: number[] = []; // per draw: SVG, first instance, instance count (uploaded order)

  /**
   * @param gl Target context.
   * @param place GLSL `vec4 place(vec4 a, vec4 b)` positioning each instance from its two
   *   per-instance vec4s (may use `uTime`, `uViewport`, `svgWidth`). Default: `a` is
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
    gl.uniform1i(gl.getUniformLocation(program, "uMsdfHalf"), 1);
    this._msdfTex = this._texture(gl.NEAREST); // texelFetch only; NEAREST keeps it complete
    this._halfTex = this._texture(gl.LINEAR);

    // Template attributes are fixed in the VAO; the instance ones are re-pointed per draw.
    this._vao = gl.createVertexArray()!;
    gl.bindVertexArray(this._vao);
    this._template = gl.createBuffer()!;
    this._indices = gl.createBuffer()!;
    this._instances = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indices);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._template);
    for (const [name, type, offset] of VERTEX) {
      const loc = gl.getAttribLocation(program, name);
      if (loc < 0) continue;
      gl.enableVertexAttribArray(loc);
      if (type === UNSIGNED_INT) gl.vertexAttribIPointer(loc, 4, type, STRIDE, offset);
      else gl.vertexAttribPointer(loc, 4, type, false, STRIDE, offset);
    }
    this._aA = gl.getAttribLocation(program, "aA");
    this._aB = gl.getAttribLocation(program, "aB"); // < 0 when place() ignores it
    for (const loc of [this._aA, this._aB]) {
      if (loc < 0) continue;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribDivisor(loc, 1); // one icon = one instance of its SVG's mesh
    }
    gl.bindVertexArray(null);
  }

  /**
   * A texture with `filter` for both minification and magnification (any wrap mode:
   * samples are clamped to texel centres inside their cell).
   */
  private _texture(filter: number): WebGLTexture {
    const gl = this._gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    return tex;
  }

  /** Location of uniform `name`, looked up once. */
  private _loc(name: string): WebGLUniformLocation | null {
    if (!this._u.has(name)) this._u.set(name, this._gl.getUniformLocation(this._program, name));
    return this._u.get(name) ?? null;
  }

  /** Parses `svgs` and generates their MSDF cells (`pixelsPerEm` texels per viewBox height). */
  load(svgs: string[], pixelsPerEm: number): void {
    const parsed = svgs.map(parseSvgLayers);
    // One float MSDF cell per path, packed into one texture without quantization.
    const cells = parsed.flatMap(({ layers }, svg) =>
      layers.flatMap((layer) => {
        const m = generateShapeMSDF(layer.shape, pixelsPerEm, pixelsPerEm / 8);
        return m ? [{ svg, layer, m, w: m.w, h: m.h, x: 0, y: 0 }] : [];
      }),
    );
    const { w: W, h: H } = potpack([...cells]); // a copy: potpack sorts in place, cells keep paint order
    const texels = new Float32Array(W * H * 3);
    for (const { m, x, y, w, h } of cells) {
      for (let row = 0; row < h; row++) {
        texels.set(m.msdf.subarray(row * w * 3, (row + 1) * w * 3), ((y + row) * W + x) * 3);
      }
    }
    // Template mesh: 4 vertices per layer (corner k at x = k & 1, y = k >> 1), cells in
    // SVG order, so each SVG's quads are one contiguous index range.
    const bytes = new ArrayBuffer(cells.length * 4 * STRIDE);
    const f32 = new Float32Array(bytes);
    const u16 = new Uint16Array(bytes);
    const u32 = new Uint32Array(bytes);
    const indices = new Uint32Array(cells.length * 6);
    cells.forEach(({ layer: l, m, x, y, w, h }, i) => {
      const grad = l.gradient;
      const stops = grad ? grad.stops.slice(0, MAX_STOPS) : [];
      const colors = grad
        ? stops.map((s) => rgba(s.color, s.opacity * l.opacity))
        : [rgba(l.color, l.opacity)];
      const offsets = stops.map((s) => s.offset);
      const type = grad ? (grad.radial ? 2 : 1) : 0;
      const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] = grad?.matrix ?? [];
      for (let k = 0; k < 4; k++) {
        const v = ((i * 4 + k) * STRIDE) / 4; // in 32-bit words
        const sx = k & 1 ? m.planeRight : m.planeLeft;
        const sy = k >> 1 ? m.planeTop : m.planeBottom;
        const tx = (sx - m.planeLeft) * pixelsPerEm - 0.5; // MSDF texel coordinate
        const ty = (sy - m.planeBottom) * pixelsPerEm - 0.5;
        f32.set([sx, sy, tx, ty, a * sx + c * sy + e, b * sx + d * sy + f, type, stops.length], v);
        u16.set([x, y, w, h], (v + 8) * 2);
        u32.set(colors, v + 10);
        f32.set(offsets, v + 18);
      }
      const q = i * 4;
      indices.set([q, q + 1, q + 2, q + 2, q + 1, q + 3], i * 6);
    });
    const gl = this._gl;
    gl.bindTexture(gl.TEXTURE_2D, this._msdfTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB32F, W, H, 0, gl.RGB, gl.FLOAT, texels);
    gl.bindTexture(gl.TEXTURE_2D, this._halfTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F, W, H, 0, gl.RGB, gl.FLOAT, texels); // GL rounds
    gl.bindVertexArray(this._vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._template);
    gl.bufferData(gl.ARRAY_BUFFER, bytes, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    this.msdf = { width: W, height: H, data: texels };
    this._pxPerEm = pixelsPerEm;
    this._counts = parsed.map((_, svg) => cells.filter((c) => c.svg === svg).length);
    this._firstQuad = this._counts.map((_, svg) => cells.findIndex((c) => c.svg >= svg));
    this._uploaded = null; // the draw ranges depend on the SVGs
    [this.widths, this.layers] = [parsed.map((p) => p.width), cells.length];
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
   * Draws one instance per 8 floats of `instances` (two vec4s for `place()`); icon i
   * shows SVG i % count. Re-uploads `instances` only when given a different array.
   * `camera` is (pan x, pan y, zoom) in device px, y-up, applied after `place()`.
   *
   * Paint order: an instanced draw covers one SVG's mesh, so with several SVGs the
   * icon list is cut into slices (at most MAX_DRAWS draws in all) and each slice is
   * drawn SVG by SVG. Slices keep instance order (later on top); only icons of
   * different SVGs within one slice can paint out of order.
   */
  draw(instances: Float32Array, time = 0, camera = [0, 0, 1]): void {
    const gl = this._gl;
    if (this.layers === 0 || instances.length === 0) return;
    gl.useProgram(this._program);
    gl.bindVertexArray(this._vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._instances);
    if (instances !== this._uploaded) this._upload(instances);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._halfTex);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._msdfTex);
    gl.enable(gl.BLEND); // premultiplied output, overlapping layers
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(this._loc("uViewport"), gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(this._loc("uPxRangeEm"), 1 / 8); // pxrange = pixelsPerEm / 8 (see load)
    // GPU filter limits: texel size on screen, and float16 precision (see the header).
    const hardwareMax = Math.min(this.hardwareFilterMaxTexelPx * this._pxPerEm, HALF_FLOAT_MAX_PX);
    gl.uniform1f(this._loc("uHardwareMax"), hardwareMax);
    gl.uniform2f(this._loc("uMsdfInv"), 1 / this.msdf.width, 1 / this.msdf.height);
    gl.uniform1f(this._loc("uTime"), time);
    gl.uniform3fv(this._loc("uCamera"), camera);
    const svgWidth = this._loc("svgWidth");
    for (let r = 0; r < this._ranges.length; r += 3) {
      const [svg, first, icons] = [this._ranges[r]!, this._ranges[r + 1]!, this._ranges[r + 2]!];
      gl.uniform1f(svgWidth, this.widths[svg]!);
      if (this._aA >= 0) gl.vertexAttribPointer(this._aA, 4, gl.FLOAT, false, 32, first * 32);
      if (this._aB >= 0) gl.vertexAttribPointer(this._aB, 4, gl.FLOAT, false, 32, first * 32 + 16);
      const [quad, quads] = [this._firstQuad[svg]!, this._counts[svg]!];
      gl.drawElementsInstanced(gl.TRIANGLES, quads * 6, gl.UNSIGNED_INT, quad * 24, icons);
    }
    this.drawCalls = this._ranges.length / 3;
    gl.bindVertexArray(null);
  }

  /** Uploads `instances` reordered into the draw ranges (slice by slice, SVG by SVG). */
  private _upload(instances: Float32Array): void {
    const n = this._counts.length;
    const count = instances.length / 8;
    const slices = n === 1 ? 1 : Math.max(1, Math.min(count, Math.floor(MAX_DRAWS / n)));
    const grouped = n === 1 ? instances : new Float32Array(instances.length);
    this._ranges = [];
    for (let slice = 0, k = 0; slice < slices; slice++) {
      const lo = Math.floor((slice * count) / slices);
      const hi = Math.floor(((slice + 1) * count) / slices);
      for (let svg = 0; svg < n; svg++) {
        const first = k;
        for (let i = lo + ((svg - (lo % n) + n) % n); i < hi; i += n, k++) {
          if (grouped !== instances) grouped.set(instances.subarray(i * 8, i * 8 + 8), k * 8);
        }
        if (k > first && this._counts[svg]! > 0) this._ranges.push(svg, first, k - first);
      }
    }
    this._gl.bufferData(this._gl.ARRAY_BUFFER, grouped, this._gl.STATIC_DRAW);
    this._uploaded = instances;
  }
}
