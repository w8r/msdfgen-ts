/**
 * M5 checkpoint 1: static instanced-quad WebGPU text renderer.
 *
 * No camera, no pan/zoom, no atlas tiering yet — this only proves the GPU
 * pipeline (instanced quads + WGSL median shader) renders the same text
 * correctly, sourced from the same Atlas as demo/canvas/main.ts's CPU
 * reconstruction. Camera/zoom/tiering come in later checkpoints once this
 * is confirmed working in a real WebGPU-capable browser.
 */
import { Font, Atlas, type GlyphInfo } from "../../src/index";
import shaderCode from "./msdf.wgsl?raw";

const FONT_URL = "/test/fonts/PTSerif-Regular.ttf";
const ATLAS_SIZE = 32;
const ATLAS_PXRANGE = 4;
const TARGET_SIZE = 64; // px per em, rendered on screen
const TEXT = "Hello Привет 123 @#&";
const FG_COLOR: [number, number, number, number] = [0.08, 0.08, 0.08, 1];
const BG_COLOR: [number, number, number, number] = [1, 1, 1, 1];

interface LayoutGlyph {
  info: GlyphInfo;
  penX: number; // em units
}

function layout(font: Font, atlas: Atlas, text: string): { glyphs: LayoutGlyph[]; widthEm: number } {
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

async function main(): Promise<void> {
  const root = document.getElementById("root")!;

  if (!navigator.gpu) {
    root.textContent = "WebGPU is not available in this browser (navigator.gpu is undefined).";
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    root.textContent = "WebGPU adapter request failed (no compatible GPU found).";
    return;
  }
  const device = await adapter.requestDevice();

  root.textContent = "";
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 220;
  canvas.className = "gpu-canvas";
  root.appendChild(canvas);

  const context = canvas.getContext("webgpu")!;
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: "opaque" });

  const buf = await fetch(FONT_URL).then((r) => r.arrayBuffer());
  const font = new Font(buf);
  const atlas = new Atlas(font, { size: ATLAS_SIZE, pxrange: ATLAS_PXRANGE });
  const { glyphs } = layout(font, atlas, TEXT);

  // ── Atlas texture ────────────────────────────────────────────────────────
  const atlasTexture = device.createTexture({
    size: [atlas.width, atlas.height],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture(
    { texture: atlasTexture },
    atlas.texture,
    { bytesPerRow: atlas.width * 4 },
    { width: atlas.width, height: atlas.height },
  );
  const sampler = device.createSampler({ magFilter: "linear", minFilter: "linear" });

  // ── Instance buffer: [posX, posY, sizeX, sizeY, uvMinX, uvMinY, uvSizeX, uvSizeY] ──
  const genScale = ATLAS_SIZE - 2 * ATLAS_PXRANGE;
  const originXInCellPx = ATLAS_PXRANGE;
  const baselineFromTopPx = ATLAS_SIZE - ATLAS_PXRANGE - 0.25 * genScale;
  const outputScale = TARGET_SIZE / genScale;
  const screenPxRange = ATLAS_PXRANGE * outputScale;
  const padEm = 0.3;
  const baselineY = 0.6 * canvas.height;

  const FLOATS_PER_INSTANCE = 8;
  const instanceData = new Float32Array(glyphs.length * FLOATS_PER_INSTANCE);
  for (let i = 0; i < glyphs.length; i++) {
    const { info, penX } = glyphs[i]!;
    const originX = (penX + padEm) * TARGET_SIZE;
    const cellLeft = originX - originXInCellPx * outputScale;
    const cellTop = baselineY - baselineFromTopPx * outputScale;
    const cellSizePx = info.size * outputScale;

    const base = i * FLOATS_PER_INSTANCE;
    instanceData[base + 0] = cellLeft;
    instanceData[base + 1] = cellTop;
    instanceData[base + 2] = cellSizePx;
    instanceData[base + 3] = cellSizePx;
    instanceData[base + 4] = info.rect.x / atlas.width;
    instanceData[base + 5] = info.rect.y / atlas.height;
    instanceData[base + 6] = info.rect.w / atlas.width;
    instanceData[base + 7] = info.rect.h / atlas.height;
  }
  const instanceBuffer = device.createBuffer({
    size: instanceData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(instanceBuffer, 0, instanceData);

  // ── Unit quad (shared across all instances) ─────────────────────────────
  // prettier-ignore
  const quadCorners = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
  const quadBuffer = device.createBuffer({
    size: quadCorners.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(quadBuffer, 0, quadCorners);

  const quadIndices = new Uint16Array([0, 1, 2, 2, 1, 3]);
  const indexBuffer = device.createBuffer({
    size: quadIndices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(indexBuffer, 0, quadIndices);

  // ── Uniforms: viewportSize(vec2) + screenPxRange(f32) + pad(f32) + fgColor(vec4) + bgColor(vec4) ──
  const uniformData = new Float32Array([
    canvas.width,
    canvas.height,
    screenPxRange,
    0,
    ...FG_COLOR,
    ...BG_COLOR,
  ]);
  const uniformBuffer = device.createBuffer({
    size: uniformData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(uniformBuffer, 0, uniformData);

  // ── Pipeline ─────────────────────────────────────────────────────────────
  const module = device.createShaderModule({ code: shaderCode });
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module,
      entryPoint: "vs_main",
      buffers: [
        {
          arrayStride: 8,
          stepMode: "vertex",
          attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
        },
        {
          arrayStride: FLOATS_PER_INSTANCE * 4,
          stepMode: "instance",
          attributes: [
            { shaderLocation: 1, offset: 0, format: "float32x2" },
            { shaderLocation: 2, offset: 8, format: "float32x2" },
            { shaderLocation: 3, offset: 16, format: "float32x2" },
            { shaderLocation: 4, offset: 24, format: "float32x2" },
          ],
        },
      ],
    },
    fragment: {
      module,
      entryPoint: "fs_main",
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
    primitive: { topology: "triangle-list" },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: sampler },
      { binding: 2, resource: atlasTexture.createView() },
    ],
  });

  // ── Render (static — one frame is enough for now) ───────────────────────
  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 1, g: 1, b: 1, a: 1 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.setVertexBuffer(0, quadBuffer);
  pass.setVertexBuffer(1, instanceBuffer);
  pass.setIndexBuffer(indexBuffer, "uint16");
  pass.drawIndexed(6, glyphs.length);
  pass.end();
  device.queue.submit([encoder.finish()]);

  const label = document.createElement("p");
  label.textContent = `Rendered ${glyphs.length} glyphs via WebGPU (${ATLAS_SIZE}px atlas -> ${TARGET_SIZE}px on screen).`;
  root.appendChild(label);
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  throw err;
});
