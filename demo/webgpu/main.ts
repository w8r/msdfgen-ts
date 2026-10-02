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
import { Font, Atlas, type LaidOutGlyph } from "../../src/index";
import shaderCode from "./msdf.wgsl?raw";

// See demo/canvas/main.ts for why this isn't a hardcoded leading-slash path.
const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;
const PIXELS_PER_EM = 40; // atlas generation resolution (single-atlas row)
const PXRANGE = 8;
const OUTPUT_SIZES = [16, 32, 64, 128, 256];
const TEXT = "Hello Привет 123 @#&";
const FG_COLOR: [number, number, number, number] = [0.08, 0.08, 0.08, 1];
const BG_COLOR: [number, number, number, number] = [1, 1, 1, 1];

// ── Auto-tier row ────────────────────────────────────────────────────────
const ATLAS_SIZES = [16, 24, 32, 48, 64] as const; // pixelsPerEm tiers available for auto-selection
const TIER_PXRANGE_RATIO = 8; // pxrange = pixelsPerEm / TIER_PXRANGE_RATIO, matches the zoom demos' convention

/** Smallest tier whose native resolution covers `targetSize`, or the top tier past that. */
function pickTierForSize(targetSize: number): (typeof ATLAS_SIZES)[number] {
  for (const size of ATLAS_SIZES) {
    if (size >= targetSize) return size;
  }
  return ATLAS_SIZES[ATLAS_SIZES.length - 1]!;
}

/** Appends a label + small 2D canvas showing `atlas.texture` as-is (raw RGBA) —
 *  debug view of what the reconstruction shader is actually sampling. Uses
 *  a 2D canvas rather than another WebGPU context because this is just a
 *  1:1 texel dump, not a shader-reconstructed render. */
function appendAtlasPreview(root: HTMLElement, tag: string, atlas: Atlas): void {
  const label = document.createElement("div");
  label.className = "label";
  label.textContent = `underlying atlas texture — ${tag} (${atlas.width}×${atlas.height}, raw MSDF channels)`;
  root.appendChild(label);
  const canvas = document.createElement("canvas");
  canvas.width = atlas.width;
  canvas.height = atlas.height;
  canvas.className = "atlas-preview";
  canvas.style.display = "block";
  canvas.style.border = "1px solid #ddd";
  canvas.style.background = "white";
  canvas.style.imageRendering = "pixelated";
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(atlas.width, atlas.height);
  image.data.set(atlas.texture);
  ctx.putImageData(image, 0, 0);
  root.appendChild(canvas);
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
  sampler: GPUSampler,
  atlasTexture: GPUTexture,
  quadBuffer: GPUBuffer,
  indexBuffer: GPUBuffer,
  atlas: Atlas,
  glyphs: LaidOutGlyph[],
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
  // pxrangeEm is uniform across all glyphs (crop, not scale — see atlas-gen.ts),
  // so screenPxRange stays a single frame-wide uniform.
  const screenPxRange = atlas.pxrangeEm * targetSize;
  const padEm = 0.3;
  const baselineY = 0.75 * canvas.height;

  const FLOATS_PER_INSTANCE = 8;
  const instanceData = new Float32Array(glyphs.length * FLOATS_PER_INSTANCE);
  for (let i = 0; i < glyphs.length; i++) {
    const { glyph, penX } = glyphs[i]!;
    const originX = (penX + padEm) * targetSize;
    const cellLeft = originX + glyph.planeLeft * targetSize;
    const cellTop = baselineY - glyph.planeTop * targetSize;
    const cellWidthPx = (glyph.planeRight - glyph.planeLeft) * targetSize;
    const cellHeightPx = (glyph.planeTop - glyph.planeBottom) * targetSize;

    const base = i * FLOATS_PER_INSTANCE;
    instanceData[base + 0] = cellLeft;
    instanceData[base + 1] = cellTop;
    instanceData[base + 2] = cellWidthPx;
    instanceData[base + 3] = cellHeightPx;
    instanceData[base + 4] = glyph.x / atlas.width + halfTexelU;
    instanceData[base + 5] = glyph.y / atlas.height + halfTexelV;
    instanceData[base + 6] = glyph.w / atlas.width - 2 * halfTexelU;
    instanceData[base + 7] = glyph.h / atlas.height - 2 * halfTexelV;
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
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: sampler },
      { binding: 2, resource: atlasTexture.createView() },
    ],
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
    root.dataset.ready = "true"; // signal for tools/screenshot.ts
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
  const atlas = new Atlas(font, { pixelsPerEm: PIXELS_PER_EM, pxrange: PXRANGE });
  const genStart = performance.now();
  const { glyphs, widthEm } = atlas.layout(TEXT);
  const genMs = performance.now() - genStart;

  // ── Atlas texture + sampler (shared across all output sizes) ────────────
  const atlasTexture = createAtlasTexture(device, atlas);
  // Adjacent atlas cells are packed with zero gap — sampling exactly at a
  // cell's edge with bilinear filtering would blend in the next glyph's texels.
  // Inset the sampled UV rect by half a texel on each side so no sample ever
  // reaches outside this glyph's own cell (done per-instance in renderAtSize).
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

  root.textContent = "";
  const info = document.createElement("p");
  info.textContent = `One ${PIXELS_PER_EM}px/em atlas (pxrange ${PXRANGE}) via WebGPU, rendered at: ${OUTPUT_SIZES.join(", ")}px — same source texels every time. Atlas gen: ${genMs.toFixed(2)}ms.`;
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
      sampler,
      atlasTexture,
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

  // ── Auto-tier row: one atlas + GPU texture per distinct tier picked, built
  // on demand and cached — same pickTier selection the zoom demos use
  // continuously, resolved once per fixed OUTPUT_SIZES entry here. ────────
  const tierInfo = document.createElement("p");
  tierInfo.textContent = `Auto-tiered: each size below uses the smallest of [${ATLAS_SIZES.join(", ")}]px/em whose atlas covers it — compare against the single-atlas row above.`;
  root.appendChild(tierInfo);

  interface TierEntry {
    atlas: Atlas;
    texture: GPUTexture;
    glyphs: LaidOutGlyph[];
    widthEm: number;
    genMs: number;
  }
  const tierAtlases = new Map<number, TierEntry>();
  function tierEntry(pixelsPerEm: number): TierEntry {
    let entry = tierAtlases.get(pixelsPerEm);
    if (!entry) {
      const a = new Atlas(font, { pixelsPerEm, pxrange: pixelsPerEm / TIER_PXRANGE_RATIO });
      const t0 = performance.now();
      const laid = a.layout(TEXT);
      const genMsTier = performance.now() - t0;
      entry = {
        atlas: a,
        texture: createAtlasTexture(device, a),
        glyphs: laid.glyphs,
        widthEm: laid.widthEm,
        genMs: genMsTier,
      };
      tierAtlases.set(pixelsPerEm, entry);
    }
    return entry;
  }

  for (const size of OUTPUT_SIZES) {
    const tierSize = pickTierForSize(size);
    const entry = tierEntry(tierSize);
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = `${size}px (atlas ${tierSize}px/em)`;
    root.appendChild(label);
    const canvas = await renderAtSize(
      device,
      pipeline,
      bindGroupLayout,
      sampler,
      entry.texture,
      quadBuffer,
      indexBuffer,
      entry.atlas,
      entry.glyphs,
      entry.widthEm,
      size,
      dpr,
      format,
    );
    root.appendChild(canvas);
  }

  const tierGenSummary = document.createElement("p");
  const tierGenParts = [...tierAtlases.entries()]
    .sort(([a], [b]) => a - b)
    .map(([px, e]) => `${px}px/em ${e.genMs.toFixed(2)}ms`);
  const tierGenTotal = [...tierAtlases.values()].reduce((a, e) => a + e.genMs, 0);
  tierGenSummary.textContent = `Atlas gen (tiers actually built): ${tierGenParts.join(" · ")} — total ${tierGenTotal.toFixed(2)}ms.`;
  root.appendChild(tierGenSummary);

  // ── Underlying atlas texture previews — the single-atlas row's atlas,
  // then one per tier actually built. Debug view of what the shader samples.
  appendAtlasPreview(root, "single-atlas row", atlas);
  const builtSizes = [...tierAtlases.keys()].sort((a, b) => a - b);
  for (const px of builtSizes) {
    appendAtlasPreview(root, `auto-tier ${px}px/em`, tierAtlases.get(px)!.atlas);
  }

  root.dataset.ready = "true"; // signal for tools/screenshot.ts
}

/** Creates an rgba8unorm GPU texture, uploads `atlas.texture`, returns it. */
function createAtlasTexture(device: GPUDevice, atlas: Atlas): GPUTexture {
  const texture = device.createTexture({
    size: [atlas.width, atlas.height],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
  });
  device.queue.writeTexture(
    { texture },
    atlas.texture,
    { bytesPerRow: atlas.width * 4 },
    { width: atlas.width, height: atlas.height },
  );
  return texture;
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  root.dataset.ready = "true";
  throw err;
});
