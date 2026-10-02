/**
 * Tiny MSDF text renderer for the landing page hero: WebGPU when available,
 * WebGL2 otherwise. Same setup as demo/hello-webgpu and demo/hello-webgl,
 * behind one interface so the page can swap text, font and size freely.
 */
import type { Atlas, LaidOutGlyph } from "../../src/index";

export interface TextRenderer {
  readonly api: "WebGPU" | "WebGL2";
  /** Re-upload the atlas texture and rebuild the glyph quads. */
  setText(atlas: Atlas, glyphs: LaidOutGlyph[], widthEm: number): void;
  /** Draw at `fontSizePx` device pixels per em, text centred in the canvas. */
  draw(fontSizePx: number): void;
}

const COLOR = [0.96, 0.93, 0.86, 1];
const CLEAR = [0.06, 0.07, 0.09, 1] as const;
const CAP_HEIGHT_EM = 0.7;

/** Two triangles per glyph: xy in em (text centred on the origin), zw = atlas uv. */
function buildVertices(atlas: Atlas, glyphs: LaidOutGlyph[], widthEm: number): Float32Array {
  const quads = glyphs.filter(({ glyph }) => glyph.w > 0);
  const out = new Float32Array(quads.length * 24);
  quads.forEach(({ glyph: g, penX, penY }, i) => {
    const x0 = penX + g.planeLeft - widthEm / 2;
    const x1 = penX + g.planeRight - widthEm / 2;
    const y0 = penY + g.planeBottom - CAP_HEIGHT_EM / 2;
    const y1 = penY + g.planeTop - CAP_HEIGHT_EM / 2;
    const u0 = (g.x + 0.5) / atlas.width;
    const u1 = (g.x + g.w - 0.5) / atlas.width;
    const vTop = (g.y + 0.5) / atlas.height;
    const vBottom = (g.y + g.h - 0.5) / atlas.height;
    // prettier-ignore
    out.set([
      x0, y0, u0, vBottom,  x1, y0, u1, vBottom,  x0, y1, u0, vTop,
      x0, y1, u0, vTop,     x1, y0, u1, vBottom,  x1, y1, u1, vTop,
    ], i * 24);
  });
  return out;
}

/** Match the canvas backing store to its CSS size in device pixels. */
function resize(canvas: HTMLCanvasElement): void {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
}

// ── WebGPU ──────────────────────────────────────────────────────────────────

const WGSL = /* wgsl */ `
struct Uniforms { scale: vec2f, screenPxRange: f32, color: vec4f }
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var atlasTexture: texture_2d<f32>;
@group(0) @binding(2) var atlasSampler: sampler;
struct VertexOut { @builtin(position) position: vec4f, @location(0) uv: vec2f }
@vertex fn vs(@location(0) v: vec4f) -> VertexOut {
  return VertexOut(vec4f(v.xy * u.scale, 0.0, 1.0), v.zw);
}
fn median(a: f32, b: f32, c: f32) -> f32 { return max(min(a, b), min(max(a, b), c)); }
@fragment fn fs(in: VertexOut) -> @location(0) vec4f {
  let s = textureSample(atlasTexture, atlasSampler, in.uv).rgb;
  let opacity = clamp(u.screenPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  return vec4f(u.color.rgb, u.color.a * opacity);
}`;

async function createWebGPU(canvas: HTMLCanvasElement): Promise<TextRenderer | null> {
  const adapter = await navigator.gpu?.requestAdapter();
  if (!adapter) return null;
  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  if (!context) return null;
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: "opaque" });

  const module = device.createShaderModule({ code: WGSL });
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module,
      buffers: [
        { arrayStride: 16, attributes: [{ shaderLocation: 0, offset: 0, format: "float32x4" }] },
      ],
    },
    fragment: {
      module,
      targets: [
        {
          format,
          blend: {
            color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha" },
            alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha" },
          },
        },
      ],
    },
  });
  const sampler = device.createSampler({ magFilter: "linear", minFilter: "linear" });
  const uniforms = new Float32Array(8); // scale.xy, screenPxRange, (pad), color.rgba
  uniforms.set(COLOR, 4);
  const uniformBuffer = device.createBuffer({
    size: 32,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  let vertexBuffer: GPUBuffer | null = null;
  let vertexCount = 0;
  let texture: GPUTexture | null = null;
  let bindGroup: GPUBindGroup | null = null;
  let pxrangeEm = 0;

  return {
    api: "WebGPU",
    setText(atlas, glyphs, widthEm) {
      const vertices = buildVertices(atlas, glyphs, widthEm);
      vertexCount = vertices.length / 4;
      pxrangeEm = atlas.pxrangeEm;
      vertexBuffer?.destroy();
      vertexBuffer = device.createBuffer({
        size: Math.max(16, vertices.byteLength),
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      device.queue.writeBuffer(vertexBuffer, 0, vertices);
      if (atlas.width === 0) return; // only whitespace so far
      texture?.destroy();
      texture = device.createTexture({
        size: [atlas.width, atlas.height],
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
      });
      device.queue.writeTexture({ texture }, atlas.texture, { bytesPerRow: atlas.width * 4 }, [
        atlas.width,
        atlas.height,
      ]);
      bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: uniformBuffer } },
          { binding: 1, resource: texture.createView() },
          { binding: 2, resource: sampler },
        ],
      });
    },
    draw(fontSizePx) {
      resize(canvas);
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: CLEAR[0], g: CLEAR[1], b: CLEAR[2], a: CLEAR[3] },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });
      if (bindGroup && vertexBuffer && vertexCount > 0) {
        uniforms[0] = (2 * fontSizePx) / canvas.width;
        uniforms[1] = (2 * fontSizePx) / canvas.height;
        uniforms[2] = pxrangeEm * fontSizePx;
        device.queue.writeBuffer(uniformBuffer, 0, uniforms);
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.setVertexBuffer(0, vertexBuffer);
        pass.draw(vertexCount);
      }
      pass.end();
      device.queue.submit([encoder.finish()]);
    },
  };
}

// ── WebGL2 ──────────────────────────────────────────────────────────────────

const VERT = `#version 300 es
in vec4 aVertex;
uniform vec2 uScale;
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

function createWebGL2(canvas: HTMLCanvasElement): TextRenderer | null {
  const gl = canvas.getContext("webgl2");
  if (!gl) return null;

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
  const aVertex = gl.getAttribLocation(program, "aVertex");
  gl.enableVertexAttribArray(aVertex);
  gl.vertexAttribPointer(aVertex, 4, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const uScale = gl.getUniformLocation(program, "uScale");
  const uScreenPxRange = gl.getUniformLocation(program, "uScreenPxRange");
  gl.uniform4fv(gl.getUniformLocation(program, "uColor"), COLOR);

  let vertexCount = 0;
  let pxrangeEm = 0;

  return {
    api: "WebGL2",
    setText(atlas, glyphs, widthEm) {
      const vertices = buildVertices(atlas, glyphs, widthEm);
      vertexCount = vertices.length / 4;
      pxrangeEm = atlas.pxrangeEm;
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
      if (atlas.width === 0) return; // only whitespace so far
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
    },
    draw(fontSizePx) {
      resize(canvas);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(...CLEAR);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (vertexCount === 0) return;
      gl.uniform2f(uScale, (2 * fontSizePx) / canvas.width, (2 * fontSizePx) / canvas.height);
      gl.uniform1f(uScreenPxRange, pxrangeEm * fontSizePx);
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    },
  };
}

/** WebGPU if the browser has an adapter, otherwise WebGL2, otherwise null. */
export async function createRenderer(canvas: HTMLCanvasElement): Promise<TextRenderer | null> {
  return (await createWebGPU(canvas)) ?? createWebGL2(canvas);
}
