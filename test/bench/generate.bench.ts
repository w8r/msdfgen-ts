/**
 * Vitest benchmarks for the MSDF hot path.
 *
 * Non-gating — `npm run gate:m6` (tools/bench.mjs) is the actual pass/fail
 * budget check (median < 3ms, heap-delta bounded). This file is for
 * developer-facing comparative numbers (`npm run bench:vitest`, or
 * `vitest bench --compare` against a saved baseline) while iterating on
 * `generate.ts` / `segments.ts` / `error-correction.ts` — same corpus and
 * params as tools/bench.mjs so the two stay comparable.
 *
 * See docs/m6-perf-investigation.md for the profiling history behind these
 * cases.
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { bench, describe } from "vitest";
import { Font } from "../../src/font/font";
import { Atlas } from "../../src/atlas-gen";
import { emNormalizeShape, normalizeShape } from "../../src/shape/normalize";
import { edgeColoringSimple } from "../../src/msdf/edge-coloring";
import { generateMSDF } from "../../src/msdf/generate";
import { distanceSignCorrection, msdfErrorCorrection } from "../../src/msdf/error-correction";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONT_PATH = resolve(__dirname, "../fonts/Roboto.ttf");
const PIXELS_PER_EM = 48;
const PXRANGE = 4;
// msdfgen CLI defaults — see src/atlas-gen.ts's ANGLE_THRESHOLD/COLOR_SEED.
const ANGLE_THRESHOLD = 3.0;
const COLOR_SEED = 0n;

const fileBuf = readFileSync(FONT_PATH);
const font = new Font(
  fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength) as ArrayBuffer,
);

// `@` is the corpus's worst-case glyph for edge density (see
// docs/m6-perf-investigation.md — spatial pruning doesn't help it because
// its edges are all close together by construction).
const DENSE_CODEPOINT = "@".codePointAt(0)!;
// A plain round-ish glyph, for contrast against the dense case above.
const SPARSE_CODEPOINT = "o".codePointAt(0)!;

describe("generateMSDF (uncached, full per-glyph pipeline via Atlas)", () => {
  bench("dense glyph '@'", () => {
    const atlas = new Atlas(font, { pixelsPerEm: PIXELS_PER_EM, pxrange: PXRANGE });
    atlas.glyph(DENSE_CODEPOINT);
  });

  bench("sparse glyph 'o'", () => {
    const atlas = new Atlas(font, { pixelsPerEm: PIXELS_PER_EM, pxrange: PXRANGE });
    atlas.glyph(SPARSE_CODEPOINT);
  });
});

describe("generateMSDF hot-path only (pixel/edge loop, no shape parse/normalize)", () => {
  // Same recipe as tools/bench.mjs's benchAllocation: probe an Atlas glyph
  // for its w/h/tx/ty (planeLeft = -tx, planeBottom = -ty — see
  // src/atlas-gen.ts's Atlas._generateForGlyphId), then drive
  // generateMSDF/distanceSignCorrection/msdfErrorCorrection directly with a
  // single reused output buffer — isolates the hot loop from per-glyph
  // shape parse/normalize/colour and from Atlas's per-glyph buffer alloc.
  const probeAtlas = new Atlas(font, { pixelsPerEm: PIXELS_PER_EM, pxrange: PXRANGE });
  const probeGlyph = probeAtlas.glyph(DENSE_CODEPOINT);
  const { w, h, planeLeft, planeBottom } = probeGlyph;
  const tx = -planeLeft;
  const ty = -planeBottom;

  const glyphId = font.glyphId(DENSE_CODEPOINT);
  const shape = font.shape(glyphId);
  emNormalizeShape(shape, font.metrics.unitsPerEm);
  normalizeShape(shape);
  edgeColoringSimple(shape, ANGLE_THRESHOLD, COLOR_SEED);

  const out = new Float32Array(w * h * 3); // the one allowed "output buffer"

  bench("generateMSDF + sign correction + error correction (reused buffer)", () => {
    generateMSDF(shape, w, h, PIXELS_PER_EM, tx, ty, PXRANGE, out);
    distanceSignCorrection(out, shape, w, h, PIXELS_PER_EM, tx, ty);
    msdfErrorCorrection(out, shape, w, h, PIXELS_PER_EM, tx, ty, PXRANGE);
  });
});
