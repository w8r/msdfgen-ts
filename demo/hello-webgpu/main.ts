/**
 * Minimal msdfgen-ts + WebGPU example: one font, one atlas, one draw call.
 * The text breathes between small and full-width size to show that a single
 * 48 px/em atlas stays crisp at every scale. In your app, import from
 * "msdfgen-ts" instead of the source path below.
 */
import { Atlas, Font } from "../../src/index";

const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;
const TEXT = "Crisp at any size";
const COLOR = [0.96, 0.93, 0.86, 1];

const SHADER = /* wgsl */ `
struct Uniforms { scale: vec2f, screenPxRange: f32, color: vec4f }
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var atlasTexture: texture_2d<f32>;
@group(0) @binding(2) var atlasSampler: sampler;

struct VertexOut { @builtin(position) position: vec4f, @location(0) uv: vec2f }

@vertex
fn vs(@location(0) vertex: vec4f) -> VertexOut { // xy: position in em, zw: atlas uv
  return VertexOut(vec4f(vertex.xy * u.scale, 0.0, 1.0), vertex.zw);
}

fn median(a: f32, b: f32, c: f32) -> f32 { return max(min(a, b), min(max(a, b), c)); }

@fragment
fn fs(in: VertexOut) -> @location(0) vec4f {
  let s = textureSample(atlasTexture, atlasSampler, in.uv).rgb;
  let opacity = clamp(u.screenPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  return vec4f(u.color.rgb, u.color.a * opacity);
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

// 3. WebGPU setup.
const adapter = await navigator.gpu?.requestAdapter();
if (!adapter) {
  document.body.insertAdjacentHTML(
    "beforeend",
    `<p class="fallback">WebGPU is not available in this browser.</p>`,
  );
  throw new Error("WebGPU is not available");
}
const device = await adapter.requestDevice();
const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("webgpu")!;
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: "opaque" });

const vertexBuffer = device.createBuffer({
  size: vertices.byteLength,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, vertices);

const texture = device.createTexture({
  size: [atlas.width, atlas.height],
  format: "rgba8unorm",
  usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
});
device.queue.writeTexture({ texture }, atlas.texture, { bytesPerRow: atlas.width * 4 }, [
  atlas.width,
  atlas.height,
]);

const uniforms = new Float32Array(8); // scale.xy, screenPxRange, (pad), color.rgba
uniforms.set(COLOR, 4);
const uniformBuffer = device.createBuffer({
  size: uniforms.byteLength,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const module = device.createShaderModule({ code: SHADER });
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
        // Glyph quads overlap their neighbours, so blending is required.
        blend: {
          color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha" },
          alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha" },
        },
      },
    ],
  },
});

const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [
    { binding: 0, resource: { buffer: uniformBuffer } },
    { binding: 1, resource: texture.createView() },
    // Linear filtering is what keeps MSDF edges smooth.
    { binding: 2, resource: device.createSampler({ magFilter: "linear", minFilter: "linear" }) },
  ],
});

// 4. Render loop. All sizes are in device pixels, so text stays sharp on HiDPI screens.
function frame(timeMs: number): void {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);

  // Breathe between full width and 1/16 of it (log scale, so the motion feels even).
  const fullWidthPxPerEm = (canvas.width * 0.9) / widthEm;
  const fontSizePx = fullWidthPxPerEm * 2 ** (-2 * (1 - Math.cos(timeMs / 2500)));

  uniforms[0] = (2 * fontSizePx) / canvas.width;
  uniforms[1] = (2 * fontSizePx) / canvas.height;
  uniforms[2] = atlas.pxrangeEm * fontSizePx;
  device.queue.writeBuffer(uniformBuffer, 0, uniforms);

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.06, g: 0.07, b: 0.09, a: 1 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.draw(quads.length * 6);
  pass.end();
  device.queue.submit([encoder.finish()]);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
