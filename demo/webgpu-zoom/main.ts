/**
 * Interactive pan/zoom WebGPU demo — WebGPU twin of demo/webgl-zoom/main.ts.
 * Drag to pan, wheel/pinch to zoom toward the cursor. "Auto tier" (on by
 * default) regenerates the atlas at the nearest resolution tier as the
 * effective on-screen glyph density crosses a threshold, so zoom stays
 * crisp well past any single tier's native resolution ("infinite zoom" —
 * see CLAUDE.md M5). Uncheck it to pin one fixed tier and use the resolution
 * selector for an A/B quality comparison at the same zoom/pan instead.
 *
 * Tier regen here is SYNCHRONOUS on the main thread, not the worker path
 * CLAUDE.md's M5 section describes. This demo's text is short (~20 glyphs),
 * so a full regen is well under a frame; the worker wrapper is deferred
 * until M6's bench numbers show it's actually needed for longer text.
 *
 * Camera state (world position under the viewport centre + zoom factor) is
 * kept in plain JS numbers (f64) and only ever narrowed to f32 at the very
 * last step — writing each glyph's already-small SCREEN-SPACE pixel rect
 * into the instance Float32Array. The vertex shader never sees the camera or
 * large world coordinates, only per-instance screen pixels + a screenPxRange
 * uniform, so there's no "huge NDC coordinate loses precision in f32" failure
 * mode even at deep zoom: the translate (world -> screen, f64) always happens
 * before the scale-sensitive part reaches GPU-precision numbers.
 *
 * Shares its shader with demo/webgpu/ (same reconstruction, same instance
 * layout) — only the per-frame camera transform and tier switching are new.
 */
import { Font, Atlas, type LaidOutGlyph } from "../../src/index";
import shaderCode from "../webgpu/msdf.wgsl?raw";

// See demo/canvas/main.ts for why this isn't a hardcoded leading-slash path.
const FONT_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;
const ATLAS_SIZES = [24, 32, 48, 64] as const; // pixelsPerEm tiers
const DEFAULT_ATLAS_SIZE = 64;
const PXRANGE_RATIO = 8; // pxrange = pixelsPerEm / PXRANGE_RATIO, matches the fixed corpus convention (32px -> pxrange4)
const BASE_PX_PER_EM = 48; // pixel-per-em at zoom = 1
const MIN_ZOOM = 0.05;
const MAX_ZOOM = 4096; // well past the top tier's crisp range — softens by design past that point
const ZOOM_SPEED = 0.0018; // wheel deltaY -> exponential zoom factor
// Regen threshold margins (auto-tier mode). Prevents thrashing (regen every
// frame) right at a boundary during a smooth zoom gesture: upgrade only once
// clearly past the current tier's native resolution, downgrade only once
// clearly within a smaller tier's headroom.
const TIER_UP_MARGIN = 1.2;
const TIER_DOWN_MARGIN = 1.2;
const CANVAS_CSS_WIDTH = 1100;
const CANVAS_CSS_HEIGHT = 480;
const TEXT = "Hello Привет 123 @#&";
const FG_COLOR: [number, number, number, number] = [0.08, 0.08, 0.08, 1];
const BG_COLOR: [number, number, number, number] = [1, 1, 1, 1];
const FLOATS_PER_INSTANCE = 8;

/** World-space camera focus point (em units) + zoom factor. All f64. */
interface Camera {
  x: number;
  y: number;
  zoom: number;
}

/** Human-readable zoom factor — plain "1.5x"/"75x"/"24,576x", not `1.50e+0x`. */
function formatZoom(zoom: number): string {
  if (zoom < 10) return `${zoom.toFixed(2)}x`;
  if (zoom < 100) return `${zoom.toFixed(1)}x`;
  return `${Math.round(zoom).toLocaleString()}x`;
}

/** Everything that gets rebuilt when the atlas tier (resolution) changes. */
interface Tier {
  pixelsPerEm: number;
  pxrange: number;
  atlas: Atlas;
  glyphs: LaidOutGlyph[];
  widthEm: number;
  halfTexelU: number;
  halfTexelV: number;
  /** Wall-clock time spent generating + packing this tier's atlas (ms). */
  genMs: number;
}

function buildTier(font: Font, pixelsPerEm: number): Tier {
  const pxrange = pixelsPerEm / PXRANGE_RATIO;
  const atlas = new Atlas(font, { pixelsPerEm, pxrange });
  const genStart = performance.now();
  const { glyphs, widthEm } = atlas.layout(TEXT);
  const genMs = performance.now() - genStart;
  return {
    pixelsPerEm,
    pxrange,
    atlas,
    glyphs,
    widthEm,
    halfTexelU: 0.5 / atlas.width,
    halfTexelV: 0.5 / atlas.height,
    genMs,
  };
}

/**
 * Picks the smallest atlas tier that still covers the current on-screen
 * glyph density (`pixelPerEm`: em -> device pixels this frame) — smaller
 * tier = less texture memory + cheaper regen, so always prefer it once
 * there's real headroom. The up/down margins only add hysteresis right at
 * a boundary (don't flip tiers every frame during a slow zoom); once a
 * switch is warranted, it jumps straight to the smallest sufficient tier
 * in one call, both directions (regen cost is the same either way — see
 * demo/webgpu-zoom/main.ts's top-of-file note on why this is sync, not a
 * worker).
 */
function pickTier(
  pixelPerEm: number,
  currentSize: (typeof ATLAS_SIZES)[number],
): (typeof ATLAS_SIZES)[number] {
  if (pixelPerEm > currentSize * TIER_UP_MARGIN) {
    for (const size of ATLAS_SIZES) {
      if (size >= pixelPerEm) return size;
    }
    return ATLAS_SIZES[ATLAS_SIZES.length - 1]!; // already at the top tier
  }
  if (pixelPerEm <= currentSize / TIER_DOWN_MARGIN) {
    for (const size of ATLAS_SIZES) {
      if (size >= pixelPerEm) return size; // smallest tier with enough headroom
    }
  }
  return currentSize;
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

  root.textContent = "";

  const controls = document.createElement("div");
  controls.className = "controls";
  const autoLabel = document.createElement("label");
  const autoCheckbox = document.createElement("input");
  autoCheckbox.type = "checkbox";
  autoCheckbox.checked = true;
  autoLabel.appendChild(autoCheckbox);
  autoLabel.appendChild(document.createTextNode(" Auto tier (infinite zoom)"));
  controls.appendChild(autoLabel);

  const sizeLabel = document.createElement("label");
  sizeLabel.textContent = "  Atlas size ";
  const sizeSelect = document.createElement("select");
  for (const size of ATLAS_SIZES) {
    const opt = document.createElement("option");
    opt.value = String(size);
    opt.textContent = `${size}px (pxrange ${size / PXRANGE_RATIO})`;
    if (size === DEFAULT_ATLAS_SIZE) opt.selected = true;
    sizeSelect.appendChild(opt);
  }
  sizeSelect.disabled = autoCheckbox.checked;
  sizeLabel.appendChild(sizeSelect);
  controls.appendChild(sizeLabel);
  root.appendChild(controls);

  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(CANVAS_CSS_WIDTH * dpr);
  canvas.height = Math.round(CANVAS_CSS_HEIGHT * dpr);
  canvas.style.width = `${CANVAS_CSS_WIDTH}px`;
  canvas.style.height = `${CANVAS_CSS_HEIGHT}px`;
  canvas.className = "gpu-canvas";
  root.appendChild(canvas);
  const readout = document.createElement("div");
  readout.className = "readout";
  root.appendChild(readout);

  const context = canvas.getContext("webgpu")!;
  context.configure({ device, format, alphaMode: "opaque" });

  const buf = await fetch(FONT_URL).then((r) => r.arrayBuffer());
  const font = new Font(buf);

  // ── Sampler (shared across tiers) ────────────────────────────────────────
  const sampler = device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge",
  });

  // ── Unit quad + index buffer (shared across all instances and tiers) ────
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

  // TEXT has a fixed glyph count regardless of tier, so this buffer's size
  // never needs to change across tier switches.
  const glyphCount = [...TEXT].length;
  const instanceData = new Float32Array(glyphCount * FLOATS_PER_INSTANCE);
  const instanceBuffer = device.createBuffer({
    size: instanceData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  const uniformData = new Float32Array(12); // viewportSize(2) + screenPxRange(1) + pad(1) + fgColor(4) + bgColor(4)
  const uniformBuffer = device.createBuffer({
    size: uniformData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

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

  // ── Tier state (rebuilt on resolution change) — texture + bind group need
  // recreating since a bind group is bound to a specific texture view. ────
  let tier = buildTier(font, DEFAULT_ATLAS_SIZE);
  let atlasTexture: GPUTexture;
  let bindGroup: GPUBindGroup;

  function uploadAtlasTexture(): void {
    atlasTexture = device.createTexture({
      size: [tier.atlas.width, tier.atlas.height],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    device.queue.writeTexture(
      { texture: atlasTexture },
      tier.atlas.texture,
      { bytesPerRow: tier.atlas.width * 4 },
      { width: tier.atlas.width, height: tier.atlas.height },
    );
    bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: sampler },
        { binding: 2, resource: atlasTexture.createView() },
      ],
    });
  }
  uploadAtlasTexture();

  // ── Camera: start centred on the text, zoomed to fit ────────────────────
  const camera: Camera = { x: tier.widthEm / 2, y: -0.15, zoom: 1 };
  let autoTier = autoCheckbox.checked;

  /**
   * Writes this frame's instance/uniform data (translate world->screen in
   * f64, then narrow to f32 only in the typed arrays) and queues one frame.
   * Does not await GPU completion — interactive redraws should not pile up
   * latency; the caller awaits completion only for the very first frame
   * (see the data-ready signal below).
   */
  function render(): void {
    const pixelPerEm = BASE_PX_PER_EM * camera.zoom;

    if (autoTier) {
      const wanted = pickTier(pixelPerEm, tier.pixelsPerEm as (typeof ATLAS_SIZES)[number]);
      if (wanted !== tier.pixelsPerEm) {
        tier = buildTier(font, wanted);
        uploadAtlasTexture();
        sizeSelect.value = String(wanted);
      }
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // pxrangeEm is uniform across all glyphs (crop, not scale — see atlas-gen.ts),
    // so screenPxRange stays a single frame-wide uniform.
    const screenPxRange = tier.atlas.pxrangeEm * pixelPerEm;

    for (let i = 0; i < tier.glyphs.length; i++) {
      const { glyph, penX } = tier.glyphs[i]!;
      // World -> screen (f64) happens here, before anything narrows to f32.
      const originXScreen = centerX + (penX - camera.x) * pixelPerEm;
      const originYScreen = centerY - (0 - camera.y) * pixelPerEm;
      const cellLeft = originXScreen + glyph.planeLeft * pixelPerEm;
      const cellTop = originYScreen - glyph.planeTop * pixelPerEm;
      const cellWidthPx = (glyph.planeRight - glyph.planeLeft) * pixelPerEm;
      const cellHeightPx = (glyph.planeTop - glyph.planeBottom) * pixelPerEm;

      const base = i * FLOATS_PER_INSTANCE;
      instanceData[base + 0] = cellLeft;
      instanceData[base + 1] = cellTop;
      instanceData[base + 2] = cellWidthPx;
      instanceData[base + 3] = cellHeightPx;
      instanceData[base + 4] = glyph.x / tier.atlas.width + tier.halfTexelU;
      instanceData[base + 5] = glyph.y / tier.atlas.height + tier.halfTexelV;
      instanceData[base + 6] = glyph.w / tier.atlas.width - 2 * tier.halfTexelU;
      instanceData[base + 7] = glyph.h / tier.atlas.height - 2 * tier.halfTexelV;
    }
    device.queue.writeBuffer(
      instanceBuffer,
      0,
      instanceData,
      0,
      tier.glyphs.length * FLOATS_PER_INSTANCE,
    );

    uniformData[0] = canvas.width;
    uniformData[1] = canvas.height;
    uniformData[2] = screenPxRange;
    uniformData[3] = 0;
    uniformData.set(FG_COLOR, 4);
    uniformData.set(BG_COLOR, 8);
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

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
    pass.drawIndexed(6, tier.glyphs.length);
    pass.end();
    device.queue.submit([encoder.finish()]);

    readout.textContent = `zoom ${formatZoom(camera.zoom)} · effective screenPxRange ${screenPxRange.toFixed(1)}px · atlas ${tier.pixelsPerEm}px/em, pxrange ${tier.pxrange} (${autoTier ? "auto" : "fixed"} tier) · last atlas gen ${tier.genMs.toFixed(2)}ms`;
  }

  autoCheckbox.addEventListener("change", () => {
    autoTier = autoCheckbox.checked;
    sizeSelect.disabled = autoTier;
    render(); // snaps to the right tier immediately if auto was just turned on
  });

  sizeSelect.addEventListener("change", () => {
    // Picking a size manually is an explicit A/B-comparison request —
    // disables auto so it doesn't get immediately overridden next frame.
    autoTier = false;
    autoCheckbox.checked = false;
    const size = Number(sizeSelect.value);
    tier = buildTier(font, size);
    // camera.x/y/zoom deliberately untouched — same view, new tier, so the
    // quality difference at this exact zoom is directly comparable.
    uploadAtlasTexture();
    render();
  });

  // ── Pointer pan (drag to move content under the cursor 1:1) ─────────────
  let dragging = false;
  let lastScreenX = 0;
  let lastScreenY = 0;

  canvas.addEventListener("pointerdown", (ev) => {
    dragging = true;
    lastScreenX = ev.clientX;
    lastScreenY = ev.clientY;
    canvas.setPointerCapture(ev.pointerId);
  });
  canvas.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    const dxCss = ev.clientX - lastScreenX;
    const dyCss = ev.clientY - lastScreenY;
    lastScreenX = ev.clientX;
    lastScreenY = ev.clientY;
    const pixelPerEm = BASE_PX_PER_EM * camera.zoom;
    // Opposite signs for the two axes — see the matching comment in
    // demo/webgl-zoom/main.ts's pointermove handler.
    camera.x -= (dxCss * dpr) / pixelPerEm;
    camera.y += (dyCss * dpr) / pixelPerEm;
    render();
  });
  const stopDrag = (): void => {
    dragging = false;
  };
  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);

  // ── Wheel zoom, anchored to the cursor ───────────────────────────────────
  canvas.addEventListener(
    "wheel",
    (ev) => {
      ev.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const cursorScreenX = (ev.clientX - rect.left) * dpr;
      const cursorScreenY = (ev.clientY - rect.top) * dpr;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const pixelPerEmOld = BASE_PX_PER_EM * camera.zoom;
      const worldX = camera.x + (cursorScreenX - centerX) / pixelPerEmOld;
      const worldY = camera.y + (centerY - cursorScreenY) / pixelPerEmOld;

      const factor = Math.exp(-ev.deltaY * ZOOM_SPEED);
      camera.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, camera.zoom * factor));

      const pixelPerEmNew = BASE_PX_PER_EM * camera.zoom;
      camera.x = worldX - (cursorScreenX - centerX) / pixelPerEmNew;
      camera.y = worldY - (centerY - cursorScreenY) / pixelPerEmNew;

      render();
    },
    { passive: false },
  );

  render();
  await device.queue.onSubmittedWorkDone(); // wait for the first GPU frame to actually finish before signaling ready
  root.dataset.ready = "true"; // signal for tools/screenshot.mjs
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  root.dataset.ready = "true";
  throw err;
});
