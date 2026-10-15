/**
 * Small WebGL2 renderer for full-colour SVGs: one MSDF cell per `<path>`
 * (parseSvgLayers), drawn back to front with its fill colour or gradient.
 * Demo code on purpose — the library itself stays GPU- and DOM-free.
 */
import { Atlas, parseSvgLayers } from "../../src/index";

const MAX_STOPS = 8;

const VERT = `#version 300 es
uniform vec4 uPlane;  // quad in shape units: left, bottom, right, top
uniform vec4 uUv;     // atlas uv at the bottom-left and top-right corners
uniform vec3 uPlace;  // device px: origin x, origin y (bottom-left), px per shape unit
uniform vec2 uViewport;
out vec2 vUv;
out vec2 vShape;
void main() {
  vec2 c = vec2(gl_VertexID & 1, gl_VertexID >> 1); // triangle-strip corner
  vShape = mix(uPlane.xy, uPlane.zw, c);
  vUv = mix(uUv.xy, uUv.zw, c);
  gl_Position = vec4((uPlace.xy + vShape * uPlace.z) / uViewport * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uAtlas;
uniform float uPxRange;
uniform vec4 uColor;
uniform int uGradient;           // 0 solid, 1 linear, 2 radial
uniform vec3 uMatrix[2];         // shape space -> gradient space, one row each
uniform vec4 uStopColor[${MAX_STOPS}];
uniform float uStopOffset[${MAX_STOPS}];
uniform int uStops;
in vec2 vUv;
in vec2 vShape;
out vec4 color;
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }
void main() {
  vec3 s = texture(uAtlas, vUv).rgb;
  float coverage = clamp(uPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  vec4 c = uColor;
  if (uGradient > 0) {
    vec2 g = vec2(dot(uMatrix[0], vec3(vShape, 1.0)), dot(uMatrix[1], vec3(vShape, 1.0)));
    float t = clamp(uGradient == 1 ? g.x : length(g), 0.0, 1.0);
    c = uStopColor[0];
    for (int i = 1; i < ${MAX_STOPS}; i++) {
      if (i >= uStops) break;
      float span = max(uStopOffset[i] - uStopOffset[i - 1], 1e-6);
      c = mix(c, uStopColor[i], clamp((t - uStopOffset[i - 1]) / span, 0.0, 1.0));
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

/** Per-layer draw state: quad, uv rect and paint uniforms. */
interface Layer {
  plane: number[];
  uv: number[];
  color: number[];
  gradient: number;
  matrix: number[];
  stopColors: number[];
  stopOffsets: number[];
}

/** Draws one SVG (all its layers) with WebGL2. */
export class SvgRenderer {
  /** Atlas holding every layer's MSDF cell; set by {@link SvgRenderer.load}. */
  atlas: Atlas | null = null;
  /** viewBox width / height of the loaded SVG. */
  width = 1;
  private readonly _gl: WebGL2RenderingContext;
  private readonly _program: WebGLProgram;
  private readonly _texture: WebGLTexture;
  private _layers: Layer[] = [];

  constructor(gl: WebGL2RenderingContext) {
    this._gl = gl;
    this._program = gl.createProgram()!;
    for (const [type, src] of [
      [gl.VERTEX_SHADER, VERT],
      [gl.FRAGMENT_SHADER, FRAG],
    ] as const) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      gl.attachShader(this._program, shader);
    }
    gl.linkProgram(this._program);
    this._texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  /** Parses `svg` and generates one atlas (`pixelsPerEm` texels per viewBox height). */
  load(svg: string, pixelsPerEm: number): Atlas {
    const { layers, width } = parseSvgLayers(svg);
    const atlas = new Atlas(null, { pixelsPerEm, pxrange: pixelsPerEm / 8 });
    const glyphs = atlas.shapes(layers.map((l, i) => [String(i), l.shape] as const));
    const [W, H] = [atlas.width, atlas.height];
    this._layers = layers.flatMap((l, i) => {
      const g = glyphs[i]!;
      if (g.w === 0) return [];
      const grad = l.gradient;
      const stops = (grad?.stops ?? []).slice(0, MAX_STOPS);
      const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] = grad?.matrix ?? [];
      return [
        {
          plane: [g.planeLeft, g.planeBottom, g.planeRight, g.planeTop],
          uv: [g.x / W, (g.y + g.h) / H, (g.x + g.w) / W, g.y / H], // texture is y-down
          color: rgba(l.color, l.opacity),
          gradient: grad ? (grad.radial ? 2 : 1) : 0,
          matrix: [a, c, e, b, d, f],
          stopColors: stops.flatMap((s) => rgba(s.color, s.opacity * l.opacity)),
          stopOffsets: stops.map((s) => s.offset),
        },
      ];
    });
    const gl = this._gl;
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, atlas.texture);
    this.atlas = atlas;
    this.width = width;
    return atlas;
  }

  /** Draws the SVG with its viewBox bottom-left at (`x`, `y`) device px, `size` px tall. */
  draw(x: number, y: number, size: number): void {
    const gl = this._gl;
    const u = (name: string): WebGLUniformLocation | null =>
      gl.getUniformLocation(this._program, name);
    gl.useProgram(this._program);
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.enable(gl.BLEND); // premultiplied output, overlapping layers
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(u("uViewport"), gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform3f(u("uPlace"), x, y, size);
    gl.uniform1f(u("uPxRange"), (this.atlas?.pxrangeEm ?? 0) * size);
    for (const l of this._layers) {
      gl.uniform4fv(u("uPlane"), l.plane);
      gl.uniform4fv(u("uUv"), l.uv);
      gl.uniform4fv(u("uColor"), l.color);
      gl.uniform1i(u("uGradient"), l.gradient);
      gl.uniform3fv(u("uMatrix"), l.matrix);
      gl.uniform1i(u("uStops"), l.stopOffsets.length);
      if (l.stopOffsets.length > 0) {
        gl.uniform4fv(u("uStopColor"), l.stopColors);
        gl.uniform1fv(u("uStopOffset"), l.stopOffsets);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }
}
