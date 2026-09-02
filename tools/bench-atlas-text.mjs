#!/usr/bin/env node
/**
 * Diagnostic (non-gating) companion to tools/bench.mjs: measures whole-string
 * atlas generation time for the demos' actual TEXT constants, at their actual
 * pixelsPerEm/pxrange, using their actual font (PTSerif-Regular.ttf) — the
 * real number a viewer sees in the "last atlas gen" readout, as opposed to
 * bench.mjs's single-worst-case-glyph number.
 *
 * Not part of gate:m6 — CLAUDE.md's M6 gate is specifically "median glyph
 * gen (48px, pxrange 4)", a single-glyph number with a fixed budget. This
 * script exists so a whole-string regression (or improvement) is visible
 * on demand rather than eyeballed off a live demo readout, and so it's
 * cheap to re-run after any future change to the hot path — see CLAUDE.md's
 * Reference notes: "we can always regress performance later."
 *
 * Usage: npx tsx tools/bench-atlas-text.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Font } from "../src/font/font.ts";
import { Atlas } from "../src/atlas-gen.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONT_PATH = resolve(__dirname, "../test/fonts/PTSerif-Regular.ttf");

const DEMOS = [
  {
    name: "webgpu-zoom",
    pixelsPerEm: 40,
    pxrange: 5,
    text: "Hello Привет 123 @#& *º savagery",
  },
  {
    name: "webgl-zoom",
    pixelsPerEm: 40,
    pxrange: 5,
    text: "*%#`²Hello Привет 123 @#&",
  },
];

const ITERATIONS = 30;
const WARMUP = 5;

const fileBuf = readFileSync(FONT_PATH);
const font = new Font(
  fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength),
);

function uniqueCodepoints(text) {
  const seen = new Set();
  for (const ch of text) seen.add(ch.codePointAt(0));
  return seen.size;
}

for (const demo of DEMOS) {
  const times = [];
  for (let i = 0; i < WARMUP + ITERATIONS; i++) {
    const atlas = new Atlas(font, { pixelsPerEm: demo.pixelsPerEm, pxrange: demo.pxrange });
    const t0 = performance.now();
    atlas.layoutMultiline(demo.text);
    const dt = performance.now() - t0;
    if (i >= WARMUP) times.push(dt);
  }
  times.sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)];
  const min = times[0];
  const max = times[times.length - 1];
  console.log(
    `${demo.name}: median ${median.toFixed(2)}ms (min ${min.toFixed(2)}ms, max ${max.toFixed(2)}ms) — ` +
      `${uniqueCodepoints(demo.text)} unique glyphs @ ${demo.pixelsPerEm}px/em, pxrange ${demo.pxrange}, ` +
      `PTSerif-Regular.ttf`,
  );
}
