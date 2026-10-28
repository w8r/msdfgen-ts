/**
 * Fair visual + numeric comparison: msdfgen-ts MSDF vs webgl-sdf-generator
 * (the single-channel SDF generator behind troika-three-text).
 *
 * What is held equal, so the only variable is the distance field itself:
 *   - Input geometry: the same em-normalized TrueType outline (our parser)
 *     feeds both, as an SVG path for webgl-sdf-generator.
 *   - Atlas layout: same per-glyph crop (ink bounds + the same em padding),
 *     same potpack packing, same texel-centre convention.
 *   - Distance range in em: webgl-sdf-generator's maxDistance = half our
 *     range, exponent 1 — the same encoding as msdfgen's `d / range + 0.5`,
 *     so one shader formula decodes both.
 *   - Reconstruction: shared.ts `renderField`, identical except median(rgb)
 *     vs the single channel.
 *   - Memory: SDF resolution is searched so its packed atlas holds the same
 *     bytes as the MSDF atlas, under two accountings (RGB8 = the 3 channels
 *     MSDF needs; RGBA8 = what Atlas actually uploads).
 * Ground truth is an independent exact-coverage rasterizer of the outline.
 * Glyph prep, geometry and generation live in fields.ts, shared with the
 * report page.
 *
 * Writes results.json (metrics), viewer.json + cells.bin (the default-budget
 * atlases for the report's gallery and atlas previews) into the output directory.
 *
 * Usage: npx tsx tools/compare-sdf/build.ts [outDir]   (default tools/compare-sdf-out)
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Font } from "../../src/font/font";
import {
  CODEPOINTS,
  type GlyphSrc,
  P,
  PXRANGE,
  type Packing,
  RANGE_EM,
  cellGeoms,
  genExactSdf,
  genMsdf,
  genWebglSdf,
  matchBudget,
  pack,
  prepGlyphs,
} from "./fields";
import {
  type ErrorStats,
  type FieldSet,
  accumulateError,
  blankImage,
  emptyStats,
  renderField,
  renderGroundTruth,
} from "./shared";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");

/** Display sizes, px/em. 20 … 640 = 0.5× … 16× the MSDF atlas's resolution. */
export const DISPLAY = [20, 40, 80, 160, 320, 640];
/** Extra resolutions for the quality-vs-memory curves. */
// MSDF points keep pxrange (= 4 × s/40) an integer, as Atlas requires.
const SWEEP_MSDF = [20, 30, 50, 60, 80];
const SWEEP_SDF = [48, 56, 64, 96, 112, 128, 160];

export const FONTS = [
  { name: "PT Serif", file: "PTSerif-Regular.ttf" },
  { name: "Roboto", file: "Roboto.ttf" },
];

export type Method = "msdf" | "webgl-sdf" | "exact-sdf";

export interface Variant {
  id: string;
  label: string;
  method: Method;
  /** "main" = the equal-budget comparison; "sweep" = extra curve points. */
  role: "main" | "sweep";
  set: FieldSet;
  packing: Packing;
  /** Distance data in the packed atlas: W × H × channels. */
  bytes: number;
  /** As a texture: MSDF uploads RGBA8 (4 B/texel, alpha unused); a 1-channel
   *  SDF is 1 B/texel (R8, or troika-style 4 glyphs per RGBA texel). */
  uploadBytes: number;
  genMs: number;
}

function sdfVariant(
  font: Font,
  glyphs: GlyphSrc[],
  id: string,
  label: string,
  role: Variant["role"],
  pxPerEm: number,
  method: "webgl-sdf" | "exact-sdf",
): Variant {
  const t0 = performance.now();
  const cells = glyphs.map((g) =>
    method === "webgl-sdf" ? genWebglSdf(g, pxPerEm) : genExactSdf(font, g, pxPerEm),
  );
  const genMs = performance.now() - t0;
  const packing = pack(cellGeoms(glyphs, pxPerEm));
  const texels = packing.width * packing.height;
  return {
    id,
    label,
    method,
    role,
    set: { channels: 1, pxPerEm, rangeEm: RANGE_EM, cells },
    packing,
    bytes: texels,
    uploadBytes: texels,
    genMs,
  };
}

function msdfVariant(
  font: Font,
  glyphs: GlyphSrc[],
  id: string,
  label: string,
  role: Variant["role"],
  pxPerEm: number,
): Variant {
  const t0 = performance.now();
  const { cells, packing } = genMsdf(font, glyphs, pxPerEm);
  const genMs = performance.now() - t0;
  const texels = packing.width * packing.height;
  return {
    id,
    label,
    method: "msdf",
    role,
    set: { channels: 3, pxPerEm, rangeEm: RANGE_EM, cells },
    packing,
    bytes: texels * 3,
    uploadBytes: texels * 4,
    genMs,
  };
}

export interface PreparedFont {
  name: string;
  font: Font;
  glyphs: GlyphSrc[];
  variants: Variant[];
}

/** Generates every variant for one font. `sweep` adds the curve points. */
export function prepareFont(spec: { name: string; file: string }, sweep: boolean): PreparedFont {
  const font = new Font(readFileSync(resolve(ROOT, "test/fonts", spec.file)).buffer as ArrayBuffer);
  const glyphs = prepGlyphs(font);
  const msdf = msdfVariant(font, glyphs, "msdf", "msdfgen-ts MSDF", "main", P);
  const texels = msdf.packing.width * msdf.packing.height;
  const sRgb = matchBudget(glyphs, texels * 3);
  const sRgba = matchBudget(glyphs, texels * 4);
  const variants = [
    msdf,
    sdfVariant(
      font,
      glyphs,
      "sdf-1x",
      "webgl-sdf-generator, same texel size",
      "main",
      P,
      "webgl-sdf",
    ),
    sdfVariant(
      font,
      glyphs,
      "sdf-rgb",
      "webgl-sdf-generator, = bytes vs RGB8",
      "main",
      sRgb,
      "webgl-sdf",
    ),
    sdfVariant(
      font,
      glyphs,
      "sdf-rgba",
      "webgl-sdf-generator, = bytes vs RGBA8",
      "main",
      sRgba,
      "webgl-sdf",
    ),
    sdfVariant(
      font,
      glyphs,
      "exact-sdf-rgb",
      "exact SDF (msdfgen), = bytes vs RGB8",
      "main",
      sRgb,
      "exact-sdf",
    ),
  ];
  if (sweep) {
    for (const s of SWEEP_MSDF) {
      variants.push(msdfVariant(font, glyphs, `msdf-${s}`, `msdfgen-ts MSDF @${s}`, "sweep", s));
    }
    for (const s of SWEEP_SDF) {
      variants.push(
        sdfVariant(font, glyphs, `sdf-${s}`, `webgl-sdf-generator @${s}`, "sweep", s, "webgl-sdf"),
      );
    }
  }
  return { name: spec.name, font, glyphs, variants };
}

/** Error of every variant at every display size: stats[variant][display]. */
export function measure(prep: PreparedFont): ErrorStats[][] {
  const { glyphs, variants } = prep;
  const stats = variants.map(() => DISPLAY.map(() => emptyStats()));
  for (let zi = 0; zi < DISPLAY.length; zi++) {
    const z = DISPLAY[zi]!;
    for (let gi = 0; gi < glyphs.length; gi++) {
      const b = glyphs[gi]!.bounds;
      if (!b) continue;
      const margin = Math.ceil(RANGE_EM * z) + 2;
      const W = Math.ceil((b.maxX - b.minX) * z) + 2 * margin;
      const H = Math.ceil((b.maxY - b.minY) * z) + 2 * margin;
      // Off-grid sub-pixel phase so axis-aligned stems don't land on pixel edges.
      const ox = margin - b.minX * z + 0.37;
      const oy = margin + b.maxY * z + 0.61;
      const truth = blankImage(W, H);
      const perim = renderGroundTruth(glyphs[gi]!.outline, z, ox, oy, truth);
      const img = blankImage(W, H);
      for (let vi = 0; vi < variants.length; vi++) {
        const v = variants[vi]!;
        img.data.fill(0);
        renderField(v.set, v.set.cells[gi]!, z, ox, oy, img);
        accumulateError(img, truth, perim, stats[vi]![zi]!);
      }
    }
  }
  return stats;
}

function variantSummary(v: Variant): Record<string, unknown> {
  return {
    id: v.id,
    label: v.label,
    method: v.method,
    role: v.role,
    pxPerEm: v.set.pxPerEm,
    channels: v.set.channels,
    atlasW: v.packing.width,
    atlasH: v.packing.height,
    bytes: v.bytes,
    uploadBytes: v.uploadBytes,
    genMs: Math.round(v.genMs),
  };
}

/** The main variants' cells + atlas layout, for the report's gallery and atlas
 *  previews. Glyph outlines, metrics and kerning the page derives from the
 *  font itself (fields.ts `prepGlyphs`, same glyph order). */
function viewerData(
  spec: { name: string; file: string },
  prep: PreparedFont,
  cellChunks: Uint8Array[],
  offsets: { cells: number },
): Record<string, unknown> {
  const sets = prep.variants
    .filter((v) => v.role === "main")
    .map((v) => ({
      ...variantSummary(v),
      rangeEm: v.set.rangeEm,
      cells: v.set.cells.map((c, i) => {
        if (!c) return null;
        const pos = v.packing.pos[i]!;
        const entry = [pos.x, pos.y, c.w, c.h, c.planeLeft, c.planeBottom, offsets.cells];
        cellChunks.push(c.data);
        offsets.cells += c.data.length;
        return entry;
      }),
    }));
  return { name: spec.name, file: spec.file, glyphCount: prep.glyphs.length, sets };
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

function printFont(prep: PreparedFont, stats: ErrorStats[][]): void {
  console.log(`\n== ${prep.name}: ${prep.glyphs.length} glyphs ==`);
  console.log("".padEnd(40) + DISPLAY.map((z) => `${z}px`.padStart(8)).join(""));
  prep.variants.forEach((v, vi) => {
    const row = stats[vi]!;
    console.log(
      `${v.label.padEnd(40)}` +
        row.map((s) => ((100 * s.badPixels) / s.edgePixels).toFixed(2).padStart(8)).join("") +
        `   ${v.set.pxPerEm} px/em, ${v.packing.width}x${v.packing.height}x${v.set.channels} = ${v.bytes} B`,
    );
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outDir = resolve(process.argv[2] ?? resolve(ROOT, "tools/compare-sdf-out"));
  mkdirSync(outDir, { recursive: true });
  const results: Record<string, unknown>[] = [];
  const viewerFonts: Record<string, unknown>[] = [];
  const cellChunks: Uint8Array[] = [];
  const offsets = { cells: 0 };
  for (const spec of FONTS) {
    const prep = prepareFont(spec, true);
    const stats = measure(prep);
    printFont(prep, stats);
    results.push({
      name: prep.name,
      glyphCount: prep.glyphs.length,
      variants: prep.variants.map((v, vi) => ({
        ...variantSummary(v),
        stats: stats[vi]!.map((s) => ({
          edgeErrPx: s.absErr / s.perimeter,
          defectPct: (100 * s.badPixels) / s.edgePixels,
          badPixels: s.badPixels,
          edgePixels: s.edgePixels,
        })),
      })),
    });
    viewerFonts.push(viewerData(spec, prep, cellChunks, offsets));
  }
  const config = { P, PXRANGE, RANGE_EM, DISPLAY, codepoints: CODEPOINTS.length };
  writeFileSync(
    resolve(outDir, "results.json"),
    JSON.stringify({ config, fonts: results }, null, 1),
  );
  writeFileSync(resolve(outDir, "viewer.json"), JSON.stringify({ config, fonts: viewerFonts }));
  writeFileSync(resolve(outDir, "cells.bin"), concat(cellChunks));
  console.log(`\nwrote ${outDir}/{results.json,viewer.json,cells.bin}`);
}
