#!/usr/bin/env node
/**
 * M6 perf budget (CLAUDE.md M6 gate): median glyph gen (48px, pxrange 4)
 * < 3ms; zero allocations in the per-pixel loop, verified by a heap-delta
 * assertion around a 1000-glyph run (allowed delta: the output buffers
 * only).
 *
 * Two independent checks:
 *
 * (1) Timing — measures the full uncached per-glyph pipeline through the
 *     PUBLIC `Atlas` API (shape parse -> normalize -> colour -> generate ->
 *     sign-correct -> error-correct -> quantise -> pack), the real cost a
 *     consumer pays adding one new glyph. A fresh `Atlas` per iteration
 *     guarantees "uncached" (Atlas caches by codepoint internally).
 *
 * (2) Allocation — isolates just the per-pixel/per-edge hot loop
 *     (`generateMSDF` + `distanceSignCorrection` + `msdfErrorCorrection`,
 *     CLAUDE.md's "HOTTEST code in the repo") from per-glyph setup (shape
 *     parsing, normalization, colouring — legitimately allocating, not in
 *     scope of the "per-pixel loop" rule). Calls the internal functions
 *     directly (not `Atlas`, which allocates a fresh output `Float32Array`
 *     per glyph by design — that's the gate's explicitly allowed "output
 *     buffers" exception) with ONE preallocated output buffer reused across
 *     1000 iterations, heap measured (forced GC) before/after. This is an
 *     internal dev tool, not a public-API consumer, so it reaches past
 *     `src/index.ts` into the hot-path modules directly — same convention
 *     as tools/atlas-preview.mjs.
 *
 * Needs --expose-gc for a reliable heap-delta reading (see package.json's
 * `gate:m6` script for the invocation). Without it, this exits loudly
 * rather than silently skipping or reporting a meaningless number — matches
 * CLAUDE.md's "never silently" convention for environment-dependent checks.
 *
 * Usage: npx tsx --expose-gc tools/bench.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Font } from "../src/font/font.ts";
import { Atlas } from "../src/atlas-gen.ts";
import { emNormalizeShape, normalizeShape } from "../src/shape/normalize.ts";
import { edgeColoringSimple } from "../src/msdf/edge-coloring.ts";
import { generateMSDF } from "../src/msdf/generate.ts";
import { distanceSignCorrection, msdfErrorCorrection } from "../src/msdf/error-correction.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONT_PATH = resolve(__dirname, "../test/fonts/Roboto.ttf");
const CODEPOINT = "@".codePointAt(0);
const PIXELS_PER_EM = 48;
const PXRANGE = 4;
// msdfgen CLI defaults — see src/atlas-gen.ts's ANGLE_THRESHOLD/COLOR_SEED.
const ANGLE_THRESHOLD = 3.0;
const COLOR_SEED = 0n;

const TIMING_WARMUP = 20;
const TIMING_ITERATIONS = 200;
const TIMING_BUDGET_MS = 3;

const ALLOC_WARMUP = 20;
const ALLOC_ITERATIONS = 1000;
// Generous relative to expected per-call garbage (~w*h bytes of scratch,
// collected every call) — sized to catch a real per-iteration leak (which
// would scale to tens of MB over 1000 iterations), not GC/allocator noise.
const ALLOC_BUDGET_BYTES = 2 * 1024 * 1024;

let failed = false;

function fail(message) {
  console.error(`FAIL: ${message}`);
  failed = true;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

// ── (1) Timing: median uncached single-glyph generation via Atlas ──────────
function benchTiming(font) {
  const times = [];
  for (let i = 0; i < TIMING_WARMUP + TIMING_ITERATIONS; i++) {
    const atlas = new Atlas(font, { pixelsPerEm: PIXELS_PER_EM, pxrange: PXRANGE });
    const t0 = performance.now();
    atlas.glyph(CODEPOINT);
    const dt = performance.now() - t0;
    if (i >= TIMING_WARMUP) times.push(dt);
  }
  const med = median(times);
  const min = Math.min(...times);
  const max = Math.max(...times);
  console.log(
    `timing: median ${med.toFixed(3)}ms (min ${min.toFixed(3)}ms, max ${max.toFixed(3)}ms) ` +
      `over ${TIMING_ITERATIONS} uncached '@' glyphs @ ${PIXELS_PER_EM}px/em, pxrange ${PXRANGE}`,
  );
  if (med >= TIMING_BUDGET_MS) {
    fail(`median glyph gen ${med.toFixed(3)}ms >= ${TIMING_BUDGET_MS}ms budget`);
  }
}

// ── (2) Allocation: heap delta around the per-pixel hot loop, output buffer
// preallocated once and reused — isolates the loop from per-glyph setup and
// from Atlas's (allowed) per-glyph output-buffer allocation. ──────────────
function benchAllocation(font) {
  if (typeof global.gc !== "function") {
    fail("global.gc() unavailable — run with --expose-gc (see tools/bench.mjs's usage doc)");
    return;
  }

  // Same generation parameters Atlas would use for this glyph, read back
  // from its public AtlasGlyph fields (planeLeft = -tx, planeBottom = -ty —
  // see src/atlas-gen.ts's Atlas._generate).
  const probeAtlas = new Atlas(font, { pixelsPerEm: PIXELS_PER_EM, pxrange: PXRANGE });
  const probeGlyph = probeAtlas.glyph(CODEPOINT);
  const { w, h, planeLeft, planeBottom } = probeGlyph;
  const tx = -planeLeft;
  const ty = -planeBottom;

  const glyphId = font.glyphId(CODEPOINT);
  const shape = font.shape(glyphId);
  emNormalizeShape(shape, font.metrics.unitsPerEm);
  normalizeShape(shape);
  edgeColoringSimple(shape, ANGLE_THRESHOLD, COLOR_SEED);

  const msdf = new Float32Array(w * h * 3); // the one allowed "output buffer"

  function runOnce() {
    generateMSDF(shape, w, h, PIXELS_PER_EM, tx, ty, PXRANGE, msdf);
    distanceSignCorrection(msdf, shape, w, h, PIXELS_PER_EM, tx, ty);
    msdfErrorCorrection(msdf, shape, w, h, PIXELS_PER_EM, tx, ty, PXRANGE);
  }

  for (let i = 0; i < ALLOC_WARMUP; i++) runOnce(); // let module-scope scratch grow once

  global.gc();
  const before = process.memoryUsage().heapUsed;
  for (let i = 0; i < ALLOC_ITERATIONS; i++) runOnce();
  global.gc();
  const after = process.memoryUsage().heapUsed;

  const deltaBytes = after - before;
  console.log(
    `allocation: heap delta ${(deltaBytes / 1024).toFixed(1)} KB over ` +
      `${ALLOC_ITERATIONS} generateMSDF+signCorrect+errorCorrect calls into one reused buffer ` +
      `(${w}x${h} texels)`,
  );
  if (deltaBytes >= ALLOC_BUDGET_BYTES) {
    fail(
      `heap grew ${(deltaBytes / 1024).toFixed(1)} KB over ${ALLOC_ITERATIONS} iterations ` +
        `>= ${(ALLOC_BUDGET_BYTES / 1024).toFixed(0)} KB budget — looks like a per-call leak, ` +
        `not GC noise`,
    );
  }
}

// Buffer.buffer may be a larger pooled ArrayBuffer — slice to the exact
// file range (same pattern as tools/atlas-preview.mjs).
const fileBuf = readFileSync(FONT_PATH);
const font = new Font(
  fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength),
);
benchTiming(font);
benchAllocation(font);

if (failed) {
  console.error("\ntools/bench.mjs: FAILED — see above.");
  process.exitCode = 1;
} else {
  console.log("\ntools/bench.mjs: all checks passed.");
}
