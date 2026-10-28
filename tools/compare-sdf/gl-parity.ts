/**
 * Fairness check + generation timing for the webgl-sdf-generator comparison.
 *
 * build.ts measures webgl-sdf-generator through its JavaScript path (needs no
 * GPU, deterministic). This script runs the library's real WebGL path in
 * headless Chromium on the same inputs and diffs the bytes, so the report can
 * state how closely the JS output it measures matches the GPU output.
 * It also times, in the same browser: msdfgen-ts `Atlas` (CPU), webgl-sdf-
 * generator `webgl.generate` (GPU + per-glyph readback), `generateIntoCanvas`
 * (GPU, no readback — the path troika-three-text uses) and its JS fallback.
 *
 * Both GPU calls get an explicit WebGL2 context. Under WebGL1 (the library's
 * default implicit context) its intermediate texture is created without
 * CLAMP_TO_EDGE wrap, so any non-power-of-two cell is an incomplete texture
 * and the output is garbage — silently, since its isSupported() trial is 4×4.
 * Troika never hits this (fixed 64×64 cells); our tight cells are NPOT.
 *
 * GPU flags: headless Chromium defaults to SwiftShader; these select the real
 * GPU through ANGLE/GL. Override with COMPARE_CHROMIUM_ARGS.
 *
 * Usage: npx tsx tools/compare-sdf/gl-parity.ts [outDir]   (default tools/compare-sdf-out)
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { createRequire } from "module";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { buildSync } from "esbuild";
import { chromium } from "playwright";
import { FONTS, prepareFont } from "./build";
import { P, PXRANGE, RANGE_EM, cellGeom, viewBox } from "./fields";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const require = createRequire(import.meta.url);

const CHROMIUM_ARGS = (
  process.env["COMPARE_CHROMIUM_ARGS"] ?? "--enable-gpu --ignore-gpu-blocklist --use-angle=gl"
)
  .split(" ")
  .filter(Boolean);
const RUNS = 5;

interface Job {
  w: number;
  h: number;
  path: string;
  vb: [number, number, number, number];
  x: number;
  y: number;
}

const outDir = resolve(process.argv[2] ?? resolve(ROOT, "tools/compare-sdf-out"));
mkdirSync(outDir, { recursive: true });

const sdfLib = readFileSync(require.resolve("webgl-sdf-generator"), "utf8");
const ourLib = buildSync({
  entryPoints: [resolve(ROOT, "src/index.ts")],
  bundle: true,
  format: "iife",
  globalName: "MSDFTS",
  write: false,
}).outputFiles[0]!.text;

const browser = await chromium.launch({ args: CHROMIUM_ARGS });
const page = await browser.newPage();
await page.setContent("<!doctype html><html><body></body></html>");
// tsx (esbuild keepNames) wraps named functions in `__name(...)`, which then
// rides along into page.evaluate's serialized callback; give it a no-op.
await page.addScriptTag({ content: "window.__name = (f) => f;" });
await page.addScriptTag({ content: sdfLib });
await page.addScriptTag({ content: ourLib });

const fonts: Record<string, unknown>[] = [];
let renderer = "";
for (const spec of FONTS) {
  const prep = prepareFont(spec, false);
  const v = prep.variants.find((x) => x.id === "sdf-rgb")!;
  const s = v.set.pxPerEm;
  const jobs: Job[] = [];
  const expected: Uint8Array[] = [];
  prep.glyphs.forEach((g, i) => {
    if (!g.bounds) return;
    const geo = cellGeom(g.bounds, s);
    const pos = v.packing.pos[i]!;
    jobs.push({ w: geo.w, h: geo.h, path: g.path, vb: viewBox(geo, s), x: pos.x, y: pos.y });
    expected.push(v.set.cells[i]!.data);
  });
  const fontB64 = readFileSync(resolve(ROOT, "test/fonts", spec.file)).toString("base64");
  const cps = prep.glyphs.map((g) => g.cp);

  const res = await page.evaluate(
    ({ jobs, maxDist, runs, fontB64, cps, P, PXRANGE, atlasW, atlasH }) => {
      const w = window as any;
      const gen = w.webgl_sdf_generator();
      const ctx = document.createElement("canvas").getContext("webgl2")!;
      const supported: boolean = gen.webgl.isSupported(ctx);
      const dbg = ctx.getExtension("WEBGL_debug_renderer_info");
      const renderer = dbg ? String(ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "?";

      const time = (fn: () => void, n: number): number => {
        let best = Infinity;
        for (let r = 0; r < n; r++) {
          const t0 = performance.now();
          fn();
          best = Math.min(best, performance.now() - t0);
        }
        return best;
      };

      // GPU path with readback: the bytes we diff against build.ts's JS output.
      let outs: Uint8Array[] = [];
      const webglGenerate = time(() => {
        outs = jobs.map((j) => gen.webgl.generate(j.w, j.h, j.path, j.vb, maxDist, 1, ctx));
      }, runs);

      // GPU path straight into an atlas canvas (troika's path); 1px readback to sync.
      const canvas = document.createElement("canvas");
      canvas.width = atlasW;
      canvas.height = atlasH;
      const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true })!;
      const px = new Uint8Array(4);
      const webglIntoCanvas = time(() => {
        for (const j of jobs) {
          gen.webgl.generateIntoCanvas(j.w, j.h, j.path, j.vb, maxDist, 1, gl, j.x, j.y, 0);
        }
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      }, runs);

      const jsGenerate = time(() => {
        for (const j of jobs) gen.javascript.generate(j.w, j.h, j.path, j.vb, maxDist, 1);
      }, 2);

      const bytes = Uint8Array.from(atob(fontB64), (c) => c.charCodeAt(0));
      const font = new w.MSDFTS.Font(bytes.buffer);
      const ours = time(() => {
        new w.MSDFTS.Atlas(font, { pixelsPerEm: P, pxrange: PXRANGE }).glyphs(cps);
      }, runs);

      const flat = new Uint8Array(outs.reduce((n, o) => n + o.length, 0));
      let o = 0;
      for (const out of outs) {
        flat.set(out, o);
        o += out.length;
      }
      let bin = "";
      for (let i = 0; i < flat.length; i += 0x8000) {
        bin += String.fromCharCode(...flat.subarray(i, i + 0x8000));
      }
      return {
        supported,
        renderer,
        webglGenerate,
        webglIntoCanvas,
        jsGenerate,
        ours,
        gpuB64: btoa(bin),
      };
    },
    {
      jobs,
      maxDist: RANGE_EM / 2,
      runs: RUNS,
      fontB64,
      cps,
      P,
      PXRANGE,
      atlasW: v.packing.width,
      atlasH: v.packing.height,
    },
  );
  renderer = res.renderer;

  const gpu = new Uint8Array(Buffer.from(res.gpuB64, "base64"));
  let o = 0;
  let differing = 0;
  let maxDiff = 0;
  const hist = [0, 0, 0];
  for (const exp of expected) {
    for (let i = 0; i < exp.length; i++) {
      const d = Math.abs(gpu[o + i]! - exp[i]!);
      if (d > 0) differing++;
      if (d > maxDiff) maxDiff = d;
      hist[Math.min(d, 2)]!++;
    }
    o += exp.length;
  }
  const total = o;
  if (gpu.length !== total) throw new Error(`GPU output length ${gpu.length} != ${total}`);
  const row = {
    name: spec.name,
    glyphs: jobs.length,
    sdfPxPerEm: s,
    webglSupported: res.supported,
    parity: { totalBytes: total, differing, maxDiff, offBy1: hist[1], offBy2plus: hist[2] },
    timingMs: {
      msdfgenTsAtlas: res.ours,
      webglGenerate: res.webglGenerate,
      webglIntoCanvas: res.webglIntoCanvas,
      jsGenerate: res.jsGenerate,
    },
  };
  console.log(JSON.stringify(row));
  fonts.push(row);
}
await browser.close();

writeFileSync(
  resolve(outDir, "gl-parity.json"),
  JSON.stringify({ chromiumArgs: CHROMIUM_ARGS, renderer, runs: RUNS, fonts }, null, 1),
);
console.log(`renderer: ${renderer}\nwrote ${outDir}/gl-parity.json`);
