/**
 * M5 checkpoint 1: static instanced-quad WebGPU text renderer.
 *
 * No camera, no pan/zoom, no atlas tiering yet — this only proves the GPU
 * pipeline (instanced quads + WGSL median shader) renders the same text
 * correctly, sourced from the same Atlas as demo/canvas/main.ts's CPU
 * reconstruction. Camera/zoom/tiering come in later checkpoints once this
 * is confirmed working in a real WebGPU-capable browser.
 *
 * Renders the same atlas at several output sizes (like demo/canvas/main.ts's
 * OUTPUT_SIZES showcase) — one small atlas, several on-screen scales, same
 * source texels every time. Device-level resources (pipeline, sampler,
 * atlas texture, bind group) are created once and shared; only the
 * per-canvas context, instance buffer, and uniform buffer differ per size.
 */
import { Font, Atlas, type GlyphInfo } from "../../src/index";
import shaderCode from "./msdf.wgsl?raw";

const FONT_URL = "/test/fonts/PTSerif-Regular.ttf";
const ATLAS_SIZE = 64;
const ATLAS_PXRANGE = 8;
const OUTPUT_SIZES = [16, 32, 64, 128, 256]; // em-sizes to render the same atlas at
const TEXT = "Hello Привет 123 @#&";
const FG_COLOR: [number, number, number, number] = [0.08, 0.08, 0.08, 1];
const BG_COLOR: [number, number, number, number] = [1, 1, 1, 1];

interface LayoutGlyph {
  info: GlyphInfo;
  penX: number; // em units
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

/**
 * Renders `glyphs` (laid out in em units) at `targetSizeCss` px-per-em onto a
 * fresh canvas, reusing the shared device/pipeline/bindGroup built once in
 * main(). Returns the canvas once the GPU frame has actually finished.
 */
async function renderAtSize(
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  bindGroupLayout: GPUBindGroupLayout,
  uniformEntries: (buffer: GPUBuffer) => GPUBindGroupEntry[],
  quadBuffer: GPUBuffer,
  indexBuffer: GPUBuffer,
  atlas: Atlas,
  glyphs: LayoutGlyph[],
  widthEm: number,
  targetSizeCss: number,
  dpr: number,
  format: GPUTextureFormat,
): Promise<HTMLCanvasElement> {
  const cssWidth = Math.ceil((widthEm + 0.6) * targetSizeCss);
  const cssHeight = Math.ceil(1.6 * targetSizeCss);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  canvas.className = "gpu-canvas";
  const targetSize = targetSizeCss * dpr;

  const context = canvas.getContext("webgpu")!;
  context.configure({ device, format, alphaMode: "opaque" });

  const halfTexelU = 0.5 / atlas.width;
  const halfTexelV = 0.5 / atlas.height;

  // ── Instance buffer: [posX, posY, sizeX, sizeY, uvMinX, uvMinY, uvSizeX, uvSizeY] ──
  const genScale = ATLAS_SIZE - 2 * ATLAS_PXRANGE;
  const originXInCellPx = ATLAS_PXRANGE;
  const baselineFromTopPx = ATLAS_SIZE - ATLAS_PXRANGE - 0.25 * genScale;
  const outputScale = targetSize / genScale;
  const screenPxRange = ATLAS_PXRANGE * outputScale;
  const padEm = 0.3;
  const baselineY = 0.75 * canvas.height;

  const FLOATS_PER_INSTANCE = 8;
  const instanceData = new Float32Array(glyphs.length * FLOATS_PER_INSTANCE);
  for (let i = 0; i < glyphs.length; i++) {
    const { info, penX } = glyphs[i]!;
    const originX = (penX + padEm) * targetSize;
    const cellLeft = originX - originXInCellPx * outputScale;
    const cellTop = baselineY - baselineFromTopPx * outputScale;
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
  const instanceBuffer = device.createBuffer({
    size: instanceData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(instanceBuffer, 0, instanceData);

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

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: uniformEntries(uniformBuffer),
  });

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: { r: BG_COLOR[0], g: BG_COLOR[1], b: BG_COLOR[2], a: BG_COLOR[3] },
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
  await device.queue.onSubmittedWorkDone(); // wait for the GPU frame to actually finish before returning

  return canvas;
}

async function main(): Promise<void> {
  const root = document.getElementById("root")!;

  if (!navigator.gpu) {
    root.textContent = "WebGPU is not available in this browser (navigator.gpu is undefined).";
    root.dataset.ready = "true"; // signal for tools/screenshot.mjs
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    root.textContent = "WebGPU adapter request failed (no compatible GPU found).";
    root.dataset.ready = "true";
    return;
  }
  const device = await adapter.requestDevice();
  const format = navigator.gpu.getPreferredCanvasFormat();
  const dpr = window.devicePixelRatio || 1;

  root.textContent = "Loading font…";
  const buf = await fetch(FONT_URL).then((r) => r.arrayBuffer());
  const font = new Font(buf);
  const atlas = new Atlas(font, { size: ATLAS_SIZE, pxrange: ATLAS_PXRANGE });
  const { glyphs, widthEm } = layout(font, atlas, TEXT);

  // ── Atlas texture + sampler (shared across all output sizes) ────────────
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
  // Adjacent atlas cells are packed with zero gap (see ShelfPacker) — sampling
  // exactly at a cell's edge with bilinear filtering would blend in the next
  // glyph's texels. Inset the sampled UV rect by half a texel on each side so
  // no sample ever reaches outside this glyph's own cell (done per-instance
  // in renderAtSize).
  const sampler = device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge",
  });

  // ── Unit quad + index buffer (shared across all instances and sizes) ────
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

  const FLOATS_PER_INSTANCE = 8;

  // ── Pipeline (shared — layout: "auto" derives one bind group layout) ────
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
  const bindGroupLayout = pipeline.getBindGroupLayout(0);
  const uniformEntries = (uniformBuffer: GPUBuffer): GPUBindGroupEntry[] => [
    { binding: 0, resource: { buffer: uniformBuffer } },
    { binding: 1, resource: sampler },
    { binding: 2, resource: atlasTexture.createView() },
  ];

  root.textContent = "";
  const info = document.createElement("p");
  info.textContent = `One ${ATLAS_SIZE}px atlas (pxrange ${ATLAS_PXRANGE}) via WebGPU, rendered at: ${OUTPUT_SIZES.join(", ")}px — same source texels every time.`;
  root.appendChild(info);

  for (const size of OUTPUT_SIZES) {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = `${size}px`;
    root.appendChild(label);
    const canvas = await renderAtSize(
      device,
      pipeline,
      bindGroupLayout,
      uniformEntries,
      quadBuffer,
      indexBuffer,
      atlas,
      glyphs,
      widthEm,
      size,
      dpr,
      format,
    );
    root.appendChild(canvas);
  }

  root.dataset.ready = "true"; // signal for tools/screenshot.mjs
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  root.dataset.ready = "true";
  throw err;
});
