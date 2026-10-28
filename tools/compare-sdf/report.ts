/**
 * Assembles the self-contained comparison report (report.html) from
 * build.ts's and gl-parity.ts's outputs: fills the numbers quoted in the
 * prose of report.template.html, inlines the data (zlib + base64) and the
 * bundled page script (page.ts).
 *
 * Usage: npx tsx tools/compare-sdf/report.ts [outDir]   (default tools/compare-sdf-out)
 */
import { readFileSync, writeFileSync } from "fs";
import { deflateSync } from "zlib";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { buildSync } from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const outDir = resolve(process.argv[2] ?? resolve(ROOT, "tools/compare-sdf-out"));
const read = (f: string): Buffer => readFileSync(resolve(outDir, f));

interface Stat {
  edgeErrPx: number;
  defectPct: number;
}
interface VariantResult {
  id: string;
  method: string;
  pxPerEm: number;
  channels: number;
  atlasW: number;
  atlasH: number;
  bytes: number;
  uploadBytes: number;
  stats: Stat[];
}
interface Results {
  config: { P: number; DISPLAY: number[] };
  fonts: { name: string; glyphCount: number; variants: VariantResult[] }[];
}
interface Parity {
  renderer: string;
  runs: number;
  fonts: {
    name: string;
    parity: { totalBytes: number; differing: number; maxDiff: number };
    timingMs: {
      msdfgenTsAtlas: number;
      webglGenerate: number;
      webglIntoCanvas: number;
      jsGenerate: number;
    };
  }[];
}

const results = JSON.parse(read("results.json").toString()) as Results;
const parity = JSON.parse(read("gl-parity.json").toString()) as Parity;

const font = (name: string): Results["fonts"][number] =>
  results.fonts.find((f) => f.name === name)!;
const variant = (name: string, id: string): VariantResult =>
  font(name).variants.find((v) => v.id === id)!;
const zi = (size: number): number => results.config.DISPLAY.indexOf(size);

const kb = (b: number): string =>
  b >= 1e6 ? `${(b / 1e6).toFixed(2)} MB` : `${Math.round(b / 1e3)} KB`;
const pct = (v: number): string => v.toFixed(2);
const ratio = (v: number): string => v.toFixed(1);
const px = (v: number): string => (Number.isInteger(v) ? String(v) : v.toFixed(2));

/**
 * Bytes of webgl-sdf-generator atlas needed to match the default MSDF atlas's
 * wrong-pixel rate at `size`, interpolated log-log along the SDF sweep.
 */
function isoBytes(name: string, size: number): number {
  const target = variant(name, "msdf").stats[zi(size)]!.defectPct;
  const pts = font(name)
    .variants.filter((v) => v.method === "webgl-sdf")
    .map((v) => ({ x: v.bytes, y: v.stats[zi(size)]!.defectPct }))
    .sort((a, b) => a.x - b.x);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    if (a.y >= target && b.y <= target) {
      if (a.y === b.y) return a.x;
      const t = (Math.log(target) - Math.log(a.y)) / (Math.log(b.y) - Math.log(a.y));
      return Math.exp(Math.log(a.x) + t * (Math.log(b.x) - Math.log(a.x)));
    }
  }
  throw new Error(`${name} @${size}: SDF sweep never crosses MSDF's ${target}%`);
}

const values: Record<string, string> = {
  glyphs: String(font("PT Serif").glyphCount),
  P: String(results.config.P),
  renderer: parity.renderer.replace(/^ANGLE \(|\)$/g, ""),
  runs: String(parity.runs),
};
for (const [key, name] of [
  ["pt", "PT Serif"],
  ["rb", "Roboto"],
] as const) {
  const msdf = variant(name, "msdf");
  values[`${key}.msdf.atlas`] = `${msdf.atlasW}×${msdf.atlasH}×3`;
  values[`${key}.msdf.kb`] = kb(msdf.bytes);
  values[`${key}.msdf.upkb`] = kb(msdf.uploadBytes);
  for (const id of ["sdf-1x", "sdf-rgb", "sdf-rgba"]) {
    const v = variant(name, id);
    const k = id.replace("sdf-", "");
    values[`${key}.${k}.px`] = px(v.pxPerEm);
    values[`${key}.${k}.atlas`] = `${v.atlasW}×${v.atlasH}×1`;
    values[`${key}.${k}.kb`] = kb(v.bytes);
  }
  for (const size of results.config.DISPLAY) {
    values[`${key}.d${size}.msdf`] = pct(msdf.stats[zi(size)]!.defectPct);
    values[`${key}.d${size}.rgb`] = pct(variant(name, "sdf-rgb").stats[zi(size)]!.defectPct);
    values[`${key}.d${size}.rgba`] = pct(variant(name, "sdf-rgba").stats[zi(size)]!.defectPct);
    values[`${key}.d${size}.exact`] = pct(
      variant(name, "exact-sdf-rgb").stats[zi(size)]!.defectPct,
    );
    values[`${key}.e${size}.msdf`] = msdf.stats[zi(size)]!.edgeErrPx.toFixed(3);
    values[`${key}.e${size}.rgb`] = variant(name, "sdf-rgb").stats[zi(size)]!.edgeErrPx.toFixed(3);
  }
  for (const size of [320, 640]) {
    const b = isoBytes(name, size);
    values[`${key}.iso${size}.rgb`] = ratio(b / msdf.bytes);
    values[`${key}.iso${size}.rgba`] = ratio(b / msdf.uploadBytes);
  }
  const p = parity.fonts.find((f) => f.name === name)!;
  values[`${key}.t.ours`] = String(Math.round(p.timingMs.msdfgenTsAtlas));
  values[`${key}.t.into`] = String(Math.round(p.timingMs.webglIntoCanvas));
  values[`${key}.t.gen`] = String(Math.round(p.timingMs.webglGenerate));
  values[`${key}.t.js`] = String(Math.round(p.timingMs.jsGenerate));
  values[`${key}.t.speedup`] = String(
    Math.round(p.timingMs.msdfgenTsAtlas / p.timingMs.webglIntoCanvas),
  );
  values[`${key}.parity.diff`] = String(p.parity.differing);
  values[`${key}.parity.total`] = p.parity.totalBytes.toLocaleString("en-US");
  values[`${key}.parity.max`] = String(p.parity.maxDiff);
}

const template = readFileSync(resolve(__dirname, "report.template.html"), "utf8");
let html = template.replace(/\{\{([\w.-]+)\}\}/g, (_, k: string) => {
  const v = values[k];
  if (v === undefined) throw new Error(`report.template.html: no value for {{${k}}}`);
  return v;
});

const script = buildSync({
  entryPoints: [resolve(__dirname, "page.ts")],
  bundle: true,
  format: "iife",
  target: "es2020",
  minify: true,
  write: false,
}).outputFiles[0]!.text;

const b64 = (buf: Buffer): string => deflateSync(buf, { level: 9 }).toString("base64");
const jsonTag = (id: string, text: string): string =>
  `<script type="application/json" id="${id}">${text.replace(/</g, "\\u003c")}</script>`;
// The fonts themselves ship too: the page derives outlines and kerning from
// them, and its viewer generates other memory budgets on demand.
const viewerFonts = (JSON.parse(read("viewer.json").toString()) as { fonts: { file: string }[] })
  .fonts;
const data = [
  jsonTag("data-results", read("results.json").toString()),
  jsonTag("data-viewer", read("viewer.json").toString()),
  `<script type="text/plain" id="data-cells">${b64(read("cells.bin"))}</script>`,
  ...viewerFonts.map(
    (f, i) =>
      `<script type="text/plain" id="data-font-${i}">${b64(readFileSync(resolve(ROOT, "test/fonts", f.file)))}</script>`,
  ),
].join("\n");

html = html.replace("<!-- @data -->", () => data);
html = html.replace(
  "<!-- @script -->",
  () => `<script>${script.replace(/<\/script/gi, "<\\/script")}</script>`,
);
writeFileSync(resolve(outDir, "report.html"), html);
console.log(`wrote ${outDir}/report.html (${(html.length / 1e6).toFixed(2)} MB)`);
