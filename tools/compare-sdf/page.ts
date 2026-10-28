/**
 * Page script of the comparison report (bundled into report.html by
 * report.ts): synced pan/zoom viewer, findings gallery, quality-vs-memory
 * charts, result tables and atlas previews. Every glyph pixel is produced by
 * shared.ts and fields.ts — the same code that computed the report's numbers
 * in Node. The gallery and atlas previews use the default-budget atlases
 * build.ts embedded; the viewer generates any other budget on demand.
 */
import { Font } from "../../src/font/font";
import {
  type GlyphSrc,
  P,
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
  type CoverageImage,
  type FieldSet,
  blankImage,
  renderField,
  renderGroundTruth,
} from "./shared";

// ── Data ────────────────────────────────────────────────────────────────────

/** x, y, w, h, planeLeft, planeBottom, byte offset into cells.bin */
type CellRow = [number, number, number, number, number, number, number];

interface SetMeta {
  id: string;
  label: string;
  method: string;
  pxPerEm: number;
  channels: 1 | 3;
  atlasW: number;
  atlasH: number;
  bytes: number;
  uploadBytes: number;
  rangeEm: number;
  cells: (CellRow | null)[];
}

interface FontMeta {
  name: string;
  file: string;
  glyphCount: number;
  sets: SetMeta[];
}

interface StatRow {
  edgeErrPx: number;
  defectPct: number;
}

interface VariantResult {
  id: string;
  label: string;
  method: string;
  role: string;
  pxPerEm: number;
  channels: number;
  atlasW: number;
  atlasH: number;
  bytes: number;
  uploadBytes: number;
  stats: StatRow[];
}

interface Results {
  config: { P: number; DISPLAY: number[] };
  fonts: { name: string; glyphCount: number; variants: VariantResult[] }[];
}

interface FontData {
  name: string;
  font: Font;
  /** Same glyphs, same order as build.ts (fields.ts `prepGlyphs`). */
  glyphs: GlyphSrc[];
  /** Codepoint → glyph index. */
  index: Map<number, number>;
  lineHeight: number;
  spaceAdvance: number;
  /** Default-budget atlases embedded by build.ts. */
  sets: Map<string, FieldSet>;
  setMeta: Map<string, SetMeta>;
}

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`missing #${id}`);
  return el as T;
}

function jsonScript<T>(id: string): T {
  return JSON.parse(byId(id).textContent ?? "") as T;
}

/** Base64 → zlib-inflated bytes. */
async function inflateScript(id: string): Promise<ArrayBuffer> {
  const bin = atob((byId(id).textContent ?? "").trim());
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const stream = new Blob([u8]).stream().pipeThrough(new DecompressionStream("deflate"));
  return new Response(stream).arrayBuffer();
}

function loadFont(meta: FontMeta, cells: Uint8Array, fontBytes: ArrayBuffer): FontData {
  const font = new Font(fontBytes);
  const glyphs = prepGlyphs(font);
  if (glyphs.length !== meta.glyphCount) {
    throw new Error(`${meta.name}: ${glyphs.length} glyphs, build.ts had ${meta.glyphCount}`);
  }
  const index = new Map<number, number>();
  glyphs.forEach((g, i) => index.set(g.cp, i));
  const sets = new Map<string, FieldSet>();
  const setMeta = new Map<string, SetMeta>();
  for (const s of meta.sets) {
    setMeta.set(s.id, s);
    sets.set(s.id, {
      channels: s.channels,
      pxPerEm: s.pxPerEm,
      rangeEm: s.rangeEm,
      cells: s.cells.map((r) =>
        r
          ? {
              w: r[2],
              h: r[3],
              planeLeft: r[4],
              planeBottom: r[5],
              data: cells.subarray(r[6], r[6] + r[2] * r[3] * s.channels),
            }
          : null,
      ),
    });
  }
  const m = font.metrics;
  return {
    name: meta.name,
    font,
    glyphs,
    index,
    lineHeight: (m.ascender - m.descender + m.lineGap) / m.unitsPerEm,
    spaceAdvance: font.advance(font.glyphId(32)) / m.unitsPerEm,
    sets,
    setMeta,
  };
}

// ── Layout + rendering ──────────────────────────────────────────────────────

interface Placed {
  gi: number;
  penX: number;
  penY: number;
}

interface Layout {
  items: Placed[];
  /** Ink bounds in em (y-up). */
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** Ink bounds of glyph `gi` (em, relative to pen) grown by the distance range:
 *  nothing any of the renderers draws falls outside it. */
function cullBox(f: FontData, gi: number): [number, number, number, number] | null {
  const b = f.glyphs[gi]!.bounds;
  if (!b) return null;
  return [b.minX - RANGE_EM, b.minY - RANGE_EM, b.maxX + RANGE_EM, b.maxY + RANGE_EM];
}

/** Lays out `text` with the font's advances and kern-table kerning, like
 *  Atlas.layout; characters outside the glyph set advance by a space. */
function layout(f: FontData, text: string): Layout {
  const items: Placed[] = [];
  const upe = f.font.metrics.unitsPerEm;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  text.split("\n").forEach((line, li) => {
    const penY = -li * f.lineHeight;
    let penX = 0;
    let prev: GlyphSrc | null = null;
    for (const ch of line) {
      const gi = f.index.get(ch.codePointAt(0)!);
      if (gi === undefined) {
        penX += f.spaceAdvance;
        prev = null;
        continue;
      }
      const g = f.glyphs[gi]!;
      if (prev) penX += f.font.kerning(prev.gid, g.gid) / upe;
      items.push({ gi, penX, penY });
      if (g.bounds) {
        minX = Math.min(minX, penX + g.bounds.minX);
        minY = Math.min(minY, penY + g.bounds.minY);
        maxX = Math.max(maxX, penX + g.bounds.maxX);
        maxY = Math.max(maxY, penY + g.bounds.maxY);
      }
      penX += g.advance;
      prev = g;
    }
  });
  if (items.length === 0) return { items, minX: 0, minY: 0, maxX: 1, maxY: 1 };
  return { items, minX, minY, maxX, maxY };
}

interface Camera {
  /** World point (em, y-up) at the canvas centre. */
  cx: number;
  cy: number;
  /** Device pixels per em. */
  z: number;
}

/** Renders the laid-out text into a W×H coverage image: from a distance-field
 *  set, or (set = null) the exact-coverage ground truth. */
function renderScene(
  f: FontData,
  lay: Layout,
  cam: Camera,
  W: number,
  H: number,
  set: FieldSet | null,
): CoverageImage {
  const img = blankImage(W, H);
  const z = cam.z;
  for (const it of lay.items) {
    const b = cullBox(f, it.gi);
    if (!b) continue;
    const ox = W / 2 + (it.penX - cam.cx) * z;
    const oy = H / 2 + (cam.cy - it.penY) * z;
    if (ox + b[2] * z < 0 || ox + b[0] * z > W || oy - b[3] * z > H || oy - b[1] * z < 0) continue;
    if (!set) {
      renderGroundTruth(f.glyphs[it.gi]!.outline, z, ox, oy, img);
      continue;
    }
    const cell = set.cells[it.gi];
    if (cell) renderField(set, cell, z, ox, oy, img);
  }
  return img;
}

type RGB = [number, number, number];

interface Palette {
  ink: RGB;
  paper: RGB;
  extra: RGB;
  missing: RGB;
}

function cssColor(name: string): RGB {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const m = /^#([0-9a-f]{6})$/i.exec(v);
  if (!m) return [128, 128, 128];
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function readPalette(): Palette {
  return {
    ink: cssColor("--glyph-ink"),
    paper: cssColor("--glyph-paper"),
    extra: cssColor("--err-extra"),
    missing: cssColor("--err-missing"),
  };
}

/** Wrong-pixel threshold: coverage off by more than half. */
const BAD = 0.5;

/**
 * Paints coverage into `canvas` (sized to the image). In diff mode the truth
 * is drawn faintly and each pixel is tinted by its error: `extra` where the
 * render has more ink than the truth, `missing` where it has less.
 * @returns Pixels off by more than {@link BAD}.
 */
function paint(
  canvas: HTMLCanvasElement,
  img: CoverageImage,
  truth: CoverageImage | null,
  diff: boolean,
  pal: Palette,
): number {
  const ctx = canvas.getContext("2d")!;
  const out = ctx.createImageData(img.width, img.height);
  const px = out.data;
  const { ink, paper, extra, missing } = pal;
  let bad = 0;
  for (let i = 0; i < img.data.length; i++) {
    const a = img.data[i]!;
    const t = truth ? truth.data[i]! : a;
    const d = a - t;
    if (d > BAD || d < -BAD) bad++;
    let r: number;
    let g: number;
    let b: number;
    if (!diff || !truth) {
      r = paper[0] + (ink[0] - paper[0]) * a;
      g = paper[1] + (ink[1] - paper[1]) * a;
      b = paper[2] + (ink[2] - paper[2]) * a;
    } else {
      const f = t * 0.14;
      r = paper[0] + (ink[0] - paper[0]) * f;
      g = paper[1] + (ink[1] - paper[1]) * f;
      b = paper[2] + (ink[2] - paper[2]) * f;
      const ad = Math.abs(d);
      if (ad > 0.02) {
        const c = d > 0 ? extra : missing;
        const k = Math.min(1, 0.25 + ad * 1.5);
        r += (c[0] - r) * k;
        g += (c[1] - g) * k;
        b += (c[2] - b) * k;
      }
    }
    const o = i * 4;
    px[o] = r;
    px[o + 1] = g;
    px[o + 2] = b;
    px[o + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);
  return bad;
}

// ── Formatting ──────────────────────────────────────────────────────────────

function kb(bytes: number): string {
  return bytes >= 1e6 ? `${(bytes / 1e6).toFixed(2)} MB` : `${Math.round(bytes / 1e3)} KB`;
}

function pxem(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

const SVG_NS = "http://www.w3.org/2000/svg";
function svg<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return e;
}

// ── Main ────────────────────────────────────────────────────────────────────

const ZMIN = 10;
const ZMAX = 1280;

async function main(): Promise<void> {
  const results = jsonScript<Results>("data-results");
  const viewerMeta = jsonScript<{ fonts: FontMeta[] }>("data-viewer");
  const [cellsBuf, ...fontBufs] = await Promise.all([
    inflateScript("data-cells"),
    ...viewerMeta.fonts.map((_, i) => inflateScript(`data-font-${i}`)),
  ]);
  const cells = new Uint8Array(cellsBuf!);
  const fonts = new Map<string, FontData>();
  viewerMeta.fonts.forEach((m, i) => fonts.set(m.name, loadFont(m, cells, fontBufs[i]!)));

  let pal = readPalette();
  const repaints: (() => void)[] = [];
  const onTheme = (): void => {
    pal = readPalette();
    for (const r of repaints) r();
  };
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", onTheme);
  new MutationObserver(onTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  setupViewer(fonts, () => pal, repaints);
  setupGallery(fonts, () => pal, repaints);
  setupCharts(results);
  setupTables(results);
  setupAtlases(fonts);
  document.documentElement.dataset["ready"] = "1";
}

// ── Viewer ──────────────────────────────────────────────────────────────────

interface Preset {
  font: string;
  text: string;
  z: number;
  /** Focus as a fraction of the ink bounds (0,0 = bottom-left). */
  fx: number;
  fy: number;
}

let loadPreset: (p: Preset) => void = () => {};

/** MSDF resolutions the viewer offers. pxrange has to stay whole at the fixed
 *  0.1 em range (fields.ts `msdfPxrange`), so they step by 10. */
const MSDF_BUDGETS = [20, 30, 40, 50, 60, 70, 80];

/** How the SDF's memory relates to the selected MSDF atlas. */
type SdfRule = "sdf-1x" | "sdf-rgb" | "sdf-rgba" | "exact-sdf-rgb";
const SDF_RULES: SdfRule[] = ["sdf-1x", "sdf-rgb", "sdf-rgba", "exact-sdf-rgb"];

type Kind = "msdf" | "webgl-sdf" | "exact-sdf";

/** Packed size of an atlas holding every glyph of the set. */
interface AtlasDims {
  w: number;
  h: number;
}

/**
 * The viewer's distance fields for one font, at any budget. Atlas sizes are
 * computed for the full glyph set by packing cell geometry (no generation),
 * so the memory figures are the real atlas's; only the glyphs actually laid
 * out are generated, by the same fields.ts code build.ts runs.
 */
class LiveFields {
  private readonly _f: FontData;
  private readonly _sets = new Map<string, FieldSet>();
  private readonly _dims = new Map<number, AtlasDims>();
  private readonly _scales = new Map<string, number>();

  constructor(f: FontData) {
    this._f = f;
  }

  /** Full-set atlas size at `s` px/em. */
  dims(s: number): AtlasDims {
    let d = this._dims.get(s);
    if (!d) {
      const p = pack(cellGeoms(this._f.glyphs, s));
      d = { w: p.width, h: p.height };
      this._dims.set(s, d);
    }
    return d;
  }

  /** SDF px/em for `rule` against the MSDF atlas at `msdfS` px/em. */
  sdfScale(msdfS: number, rule: SdfRule): number {
    if (rule === "sdf-1x") return msdfS;
    const bytesPerTexel = rule === "sdf-rgba" ? 4 : 3;
    const key = `${msdfS}|${bytesPerTexel}`;
    let s = this._scales.get(key);
    if (s === undefined) {
      const m = this.dims(msdfS);
      s = matchBudget(this._f.glyphs, m.w * m.h * bytesPerTexel, msdfS);
      this._scales.set(key, s);
    }
    return s;
  }

  /** The (lazily filled) set of `kind` cells at `s` px/em. */
  set(kind: Kind, s: number): FieldSet {
    const key = `${kind}@${s}`;
    let set = this._sets.get(key);
    if (!set) {
      set = {
        channels: kind === "msdf" ? 3 : 1,
        pxPerEm: s,
        rangeEm: RANGE_EM,
        cells: this._f.glyphs.map(() => null),
      };
      this._sets.set(key, set);
    }
    return set;
  }

  /** Glyphs in `gis` that have an outline but no cell in `set` yet. */
  missing(set: FieldSet, gis: number[]): number[] {
    return gis.filter((gi) => this._f.glyphs[gi]!.bounds && !set.cells[gi]);
  }

  /** Generates `set`'s missing cells for `gis`. */
  fill(kind: Kind, set: FieldSet, gis: number[]): void {
    const miss = this.missing(set, gis);
    if (miss.length === 0) return;
    const glyphs = this._f.glyphs;
    if (kind === "msdf") {
      const { cells } = genMsdf(
        this._f.font,
        miss.map((gi) => glyphs[gi]!),
        set.pxPerEm,
      );
      miss.forEach((gi, k) => {
        set.cells[gi] = cells[k]!;
      });
      return;
    }
    for (const gi of miss) {
      set.cells[gi] =
        kind === "webgl-sdf"
          ? genWebglSdf(glyphs[gi]!, set.pxPerEm)
          : genExactSdf(this._f.font, glyphs[gi]!, set.pxPerEm);
    }
  }
}

function setupViewer(
  fonts: Map<string, FontData>,
  palette: () => Palette,
  repaints: (() => void)[],
): void {
  const fontSel = byId<HTMLSelectElement>("v-font");
  const msdfSel = byId<HTMLSelectElement>("v-msdf");
  const sdfSel = byId<HTMLSelectElement>("v-sdf");
  const textIn = byId<HTMLInputElement>("v-text");
  const diffIn = byId<HTMLInputElement>("v-diff");
  const zoomIn = byId<HTMLInputElement>("v-zoom");
  const zoomOut = byId("v-zoom-readout");
  const stage = byId("v-stage");
  const panels = ["truth", "msdf", "sdf"].map((k) => {
    const root = stage.querySelector<HTMLElement>(`[data-panel="${k}"]`)!;
    return {
      kind: k,
      root,
      canvas: root.querySelector("canvas")!,
      meta: root.querySelector<HTMLElement>(".p-meta")!,
      stat: root.querySelector<HTMLElement>(".p-stat"),
    };
  });
  const live = new Map<string, LiveFields>();
  for (const [name, f] of fonts) live.set(name, new LiveFields(f));

  for (const name of fonts.keys()) fontSel.append(new Option(name, name));
  let font = fonts.get("PT Serif")!;
  let msdfS = P;

  /** Rebuilds both budget selects' labels for the current font and MSDF budget. */
  const fillOptions = (): void => {
    const lf = live.get(font.name)!;
    msdfSel.textContent = "";
    for (const s of MSDF_BUDGETS) {
      const d = lf.dims(s);
      const label =
        `${s} px/em · ${kb(d.w * d.h * 3)} (${kb(d.w * d.h * 4)} as RGBA8)` +
        (s === P ? " · default" : "");
      msdfSel.append(new Option(label, String(s)));
    }
    msdfSel.value = String(msdfS);
    const keep = sdfSel.value || "sdf-rgb";
    sdfSel.textContent = "";
    for (const rule of SDF_RULES) {
      const s = lf.sdfScale(msdfS, rule);
      const d = lf.dims(s);
      const what =
        rule === "sdf-1x"
          ? "Same texel size"
          : rule === "sdf-rgb"
            ? "Equal bytes vs MSDF as RGB8"
            : rule === "sdf-rgba"
              ? "Equal bytes vs MSDF as RGBA8"
              : "Control: exact SDF, = RGB8 bytes";
      sdfSel.append(new Option(`${what} (${pxem(s)} px/em, ${kb(d.w * d.h)})`, rule));
    }
    sdfSel.value = keep;
  };

  fontSel.value = font.name;
  fillOptions();
  let lay = layout(font, textIn.value);
  const cam: Camera = { cx: 0, cy: 0, z: 320 };
  const dpr = (): number => Math.min(2, window.devicePixelRatio || 1);

  const zToSlider = (z: number): number => (1000 * Math.log(z / ZMIN)) / Math.log(ZMAX / ZMIN);
  const sliderToZ = (v: number): number => ZMIN * Math.pow(ZMAX / ZMIN, v / 1000);
  const clampZ = (z: number): number => Math.min(ZMAX, Math.max(ZMIN, z));

  let frame = 0;
  let interacting = 0;
  let settleTimer = 0;
  let lastMs = 0;
  let generating = false;
  const schedule = (): void => {
    if (!frame) frame = requestAnimationFrame(draw);
  };
  const poke = (): void => {
    // While dragging/zooming, render at reduced resolution if frames are slow,
    // then once more at full resolution when the interaction settles.
    interacting = performance.now();
    clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      interacting = 0;
      schedule();
    }, 160);
    schedule();
  };

  function draw(): void {
    frame = 0;
    const lf = live.get(font.name)!;
    const rule = sdfSel.value as SdfRule;
    const sdfS = lf.sdfScale(msdfS, rule);
    const sdfKind: Kind = rule === "exact-sdf-rgb" ? "exact-sdf" : "webgl-sdf";
    const msdfSet = lf.set("msdf", msdfS);
    const sdfSet = lf.set(sdfKind, sdfS);

    // Generate whatever the text needs first; the panels keep their last
    // frame meanwhile. Generation is synchronous, so let the status paint.
    const gis = [...new Set(lay.items.map((it) => it.gi))];
    const pending = lf.missing(msdfSet, gis).length + lf.missing(sdfSet, gis).length;
    if (pending > 0) {
      if (!generating) {
        generating = true;
        for (const p of panels) {
          if (p.stat) p.stat.textContent = `Generating ${pending} glyph cells…`;
        }
        window.setTimeout(() => {
          lf.fill("msdf", msdfSet, gis);
          lf.fill(sdfKind, sdfSet, gis);
          generating = false;
          schedule();
        }, 30);
      }
      return;
    }

    const t0 = performance.now();
    const coarse = interacting && lastMs > 45 ? 0.5 : 1;
    const scale = dpr() * coarse;
    const view = panels[0]!.canvas;
    const W = Math.max(8, Math.round(view.clientWidth * scale));
    const H = Math.max(8, Math.round(view.clientHeight * scale));
    const c: Camera = { cx: cam.cx, cy: cam.cy, z: cam.z * coarse };
    const diff = diffIn.checked;
    const truth = renderScene(font, lay, c, W, H, null);
    for (const p of panels) {
      if (p.canvas.width !== W || p.canvas.height !== H) {
        p.canvas.width = W;
        p.canvas.height = H;
      }
      const set = p.kind === "msdf" ? msdfSet : sdfSet;
      const img = p.kind === "truth" ? truth : renderScene(font, lay, c, W, H, set);
      const bad = paint(p.canvas, img, p.kind === "truth" ? null : truth, diff, palette());
      if (p.kind === "truth") {
        p.meta.textContent = "Exact coverage of the outline";
        continue;
      }
      const d = lf.dims(set.pxPerEm);
      const ch = set.channels;
      p.meta.textContent = `${pxem(set.pxPerEm)} px/em · ${d.w}×${d.h}×${ch} · ${kb(d.w * d.h * ch)}`;
      if (p.stat) p.stat.textContent = coarse < 1 ? "…" : `${bad} wrong pixels in view`;
    }
    const sdfTitle = panels[2]!.root.querySelector(".p-name")!;
    sdfTitle.textContent =
      sdfKind === "exact-sdf" ? "Exact SDF (control)" : "webgl-sdf-generator SDF";
    zoomIn.value = String(Math.round(zToSlider(cam.z)));
    zoomOut.textContent = `${Math.round(cam.z)} px/em · ${(cam.z / msdfS).toFixed(1)}× the MSDF atlas`;
    lastMs = performance.now() - t0;
  }
  repaints.push(schedule);

  const focusOn = (fx: number, fy: number): void => {
    cam.cx = lay.minX + (lay.maxX - lay.minX) * fx;
    cam.cy = lay.minY + (lay.maxY - lay.minY) * fy;
  };

  loadPreset = (p: Preset): void => {
    font = fonts.get(p.font)!;
    fontSel.value = p.font;
    // Presets show the default budget, like the gallery crops they come from.
    msdfS = P;
    fillOptions();
    textIn.value = p.text;
    lay = layout(font, p.text);
    cam.z = p.z;
    focusOn(p.fx, p.fy);
    schedule();
  };

  fontSel.addEventListener("change", () => {
    font = fonts.get(fontSel.value)!;
    fillOptions();
    lay = layout(font, textIn.value);
    focusOn(0.5, 0.5);
    schedule();
  });
  msdfSel.addEventListener("change", () => {
    msdfS = Number(msdfSel.value);
    fillOptions();
    schedule();
  });
  sdfSel.addEventListener("change", schedule);
  diffIn.addEventListener("change", schedule);
  textIn.addEventListener("input", () => {
    lay = layout(font, textIn.value);
    focusOn(0.5, 0.5);
    schedule();
  });
  zoomIn.addEventListener("input", () => {
    cam.z = clampZ(sliderToZ(Number(zoomIn.value)));
    poke();
  });
  const zoomBy = (factor: number, sx?: number, sy?: number, rect?: DOMRect): void => {
    const z1 = clampZ(cam.z * factor);
    if (rect && sx !== undefined && sy !== undefined) {
      // Keep the world point under the pointer fixed.
      const s = dpr();
      const dx = (sx - rect.left - rect.width / 2) * s;
      const dy = (sy - rect.top - rect.height / 2) * s;
      cam.cx += dx / cam.z - dx / z1;
      cam.cy -= dy / cam.z - dy / z1;
    }
    cam.z = z1;
    poke();
  };
  byId("v-zoom-in").addEventListener("click", () => zoomBy(1.5));
  byId("v-zoom-out").addEventListener("click", () => zoomBy(1 / 1.5));
  byId("v-fit").addEventListener("click", () => {
    const view = panels[0]!.canvas;
    const s = dpr();
    const w = (lay.maxX - lay.minX) * 1.15;
    const h = (lay.maxY - lay.minY) * 1.15;
    cam.z = clampZ(Math.min((view.clientWidth * s) / w, (view.clientHeight * s) / h));
    focusOn(0.5, 0.5);
    schedule();
  });

  // Pan (one pointer) and pinch-zoom (two) on any panel; all panels share the camera.
  const pointers = new Map<number, { x: number; y: number }>();
  stage.addEventListener("pointerdown", (e) => {
    if (!(e.target instanceof HTMLCanvasElement)) return;
    e.target.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  });
  stage.addEventListener("pointermove", (e) => {
    const prev = pointers.get(e.pointerId);
    if (!prev || !(e.target instanceof HTMLCanvasElement)) return;
    const s = dpr();
    if (pointers.size === 1) {
      cam.cx -= ((e.clientX - prev.x) * s) / cam.z;
      cam.cy += ((e.clientY - prev.y) * s) / cam.z;
    } else if (pointers.size === 2) {
      const other = [...pointers.entries()].find(([id]) => id !== e.pointerId)![1];
      const d0 = Math.hypot(prev.x - other.x, prev.y - other.y);
      const d1 = Math.hypot(e.clientX - other.x, e.clientY - other.y);
      if (d0 > 0) {
        const rect = e.target.getBoundingClientRect();
        zoomBy(d1 / d0, (e.clientX + other.x) / 2, (e.clientY + other.y) / 2, rect);
      }
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    poke();
  });
  const release = (e: PointerEvent): void => {
    pointers.delete(e.pointerId);
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener(
    "wheel",
    (e) => {
      if (!(e.target instanceof HTMLCanvasElement)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      zoomBy(
        Math.exp(-e.deltaY * unit * 0.0015),
        e.clientX,
        e.clientY,
        e.target.getBoundingClientRect(),
      );
    },
    { passive: false },
  );
  new ResizeObserver(schedule).observe(stage);

  loadPreset(INITIAL);
}

// ── Findings gallery ────────────────────────────────────────────────────────

/** Gallery findings, in the order of the cards in the page (data-preset). */
const PRESETS: Preset[] = [
  { font: "PT Serif", text: "Hello Привет 123 @#&", z: 40, fx: 0.3, fy: 0.5 },
  { font: "PT Serif", text: "W", z: 640, fx: 0.27, fy: 0.12 },
  { font: "PT Serif", text: "Ж", z: 320, fx: 0.5, fy: 0.5 },
  { font: "Roboto", text: "8", z: 320, fx: 0.5, fy: 0.55 },
  { font: "PT Serif", text: "*", z: 480, fx: 0.5, fy: 0.5 },
  { font: "Roboto", text: "Б", z: 320, fx: 0.5, fy: 0.5 },
];

/** The viewer's opening view: a whole glyph at 8× the MSDF atlas. */
const INITIAL: Preset = { font: "PT Serif", text: "W", z: 320, fx: 0.5, fy: 0.5 };

/** Gallery canvases render at a fixed device-pixel size (pixel-doubled on
 *  high-DPI screens), so each crop shows exactly the stated px/em. */
const TILE = 240;

function setupGallery(
  fonts: Map<string, FontData>,
  palette: () => Palette,
  repaints: (() => void)[],
): void {
  const cards = document.querySelectorAll<HTMLElement>("[data-preset]");
  const paintAll = (): void => {
    cards.forEach((card) => {
      const p = PRESETS[Number(card.dataset["preset"])]!;
      const f = fonts.get(p.font)!;
      const lay = layout(f, p.text);
      const cam: Camera = {
        cx: lay.minX + (lay.maxX - lay.minX) * p.fx,
        cy: lay.minY + (lay.maxY - lay.minY) * p.fy,
        z: p.z,
      };
      const truth = renderScene(f, lay, cam, TILE, TILE, null);
      card.querySelectorAll<HTMLElement>("[data-tile]").forEach((tile) => {
        const id = tile.dataset["tile"]!;
        const canvas = tile.querySelector("canvas")!;
        canvas.width = TILE;
        canvas.height = TILE;
        const img = id === "truth" ? truth : renderScene(f, lay, cam, TILE, TILE, f.sets.get(id)!);
        const bad = paint(canvas, img, id === "truth" ? null : truth, false, palette());
        const m = f.setMeta.get(id);
        const meta = tile.querySelector<HTMLElement>(".t-meta")!;
        meta.textContent = m ? `${pxem(m.pxPerEm)} px/em · ${kb(m.bytes)}` : "reference";
        const stat = tile.querySelector<HTMLElement>(".t-stat");
        if (stat) stat.textContent = `${bad} wrong px`;
      });
    });
  };
  cards.forEach((card) => {
    card.querySelector("button")?.addEventListener("click", () => {
      loadPreset(PRESETS[Number(card.dataset["preset"])]!);
      byId("viewer").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  paintAll();
  repaints.push(paintAll);
}

// ── Quality-vs-memory charts ────────────────────────────────────────────────

/** Display sizes the small multiples show (columns). */
const CHART_SIZES = [160, 320, 640];

function setupCharts(results: Results): void {
  const host = byId("charts");
  const tip = byId("chart-tip");
  const W = 340;
  const H = 230;
  const m = { l: 44, r: 44, t: 14, b: 34 };
  const xMin = 100e3;
  const xMax = 3e6;
  const yMin = 0.01;
  const yMax = 100;
  const sx = (b: number): number =>
    m.l + ((Math.log(b) - Math.log(xMin)) / (Math.log(xMax) - Math.log(xMin))) * (W - m.l - m.r);
  const sy = (v: number): number =>
    m.t +
    (1 - (Math.log(Math.max(v, yMin)) - Math.log(yMin)) / (Math.log(yMax) - Math.log(yMin))) *
      (H - m.t - m.b);

  for (const font of results.fonts) {
    const row = el("div", "chart-row");
    row.append(el("h4", "chart-font", font.name));
    const grid = el("div", "chart-grid");
    row.append(grid);
    host.append(row);
    const msdfDefault = font.variants.find((v) => v.id === "msdf")!;
    for (const size of CHART_SIZES) {
      const zi = results.config.DISPLAY.indexOf(size);
      const series = [
        { key: "msdf", name: "msdfgen-ts MSDF", method: "msdf" },
        { key: "sdf", name: "webgl-sdf-generator", method: "webgl-sdf" },
      ].map((s) => ({
        ...s,
        pts: font.variants
          .filter((v) => v.method === s.method && v.bytes <= xMax)
          .map((v) => ({ v, x: v.bytes, y: v.stats[zi]!.defectPct }))
          .sort((a, b) => a.x - b.x),
      }));

      const fig = el("figure", "chart");
      const cap = el("figcaption", "chart-cap");
      cap.append(
        el("strong", "", `${size} px/em`),
        ` · ${size / results.config.P}× the MSDF atlas`,
      );
      fig.append(cap);
      const root = svg("svg", {
        viewBox: `0 0 ${W} ${H}`,
        role: "img",
        "aria-label": `${font.name}, ${size} px/em: wrong pixels versus atlas memory`,
      });
      // Equal-memory band: the default MSDF atlas as RGB8 data … as RGBA8 upload.
      const bx0 = sx(msdfDefault.bytes);
      const bx1 = sx(msdfDefault.uploadBytes);
      root.append(
        svg("rect", {
          x: bx0,
          y: m.t,
          width: bx1 - bx0,
          height: H - m.t - m.b,
          class: "band",
        }),
      );
      for (const v of [0.01, 0.1, 1, 10, 100]) {
        const y = sy(v);
        root.append(svg("line", { x1: m.l, x2: W - m.r, y1: y, y2: y, class: "grid" }));
        const t = svg("text", { x: m.l - 6, y: y + 3.5, class: "tick", "text-anchor": "end" });
        t.textContent = v === 0.01 ? "≤0.01%" : `${v}%`;
        root.append(t);
      }
      for (const b of [100e3, 300e3, 1e6, 3e6]) {
        const x = sx(b);
        root.append(svg("line", { x1: x, x2: x, y1: H - m.b, y2: H - m.b + 4, class: "axis" }));
        const t = svg("text", { x, y: H - m.b + 16, class: "tick", "text-anchor": "middle" });
        t.textContent = b >= 1e6 ? `${b / 1e6} MB` : `${b / 1e3} KB`;
        root.append(t);
      }
      root.append(svg("line", { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, class: "axis" }));
      const ends: { x: number; y: number; name: string }[] = [];
      for (const s of series) {
        const d = s.pts.map((p, i) => `${i ? "L" : "M"}${sx(p.x)},${sy(p.y)}`).join("");
        root.append(svg("path", { d, class: `line ${s.key}` }));
        for (const p of s.pts) {
          root.append(svg("circle", { cx: sx(p.x), cy: sy(p.y), r: 4, class: `dot ${s.key}` }));
        }
        const last = s.pts[s.pts.length - 1]!;
        ends.push({ x: sx(last.x) + 8, y: sy(last.y), name: s.key === "msdf" ? "MSDF" : "SDF" });
      }
      // Direct end labels, only when they don't collide.
      if (Math.abs(ends[0]!.y - ends[1]!.y) >= 13) {
        for (const e of ends) {
          const t = svg("text", { x: e.x, y: e.y + 3.5, class: "end-label" });
          t.textContent = e.name;
          root.append(t);
        }
      }
      // Hover: nearest point of either series.
      const all = series.flatMap((s) => s.pts.map((p) => ({ ...p, s })));
      const hit = svg("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" });
      const ring = svg("circle", { r: 7, class: "hover-ring", visibility: "hidden" });
      root.append(ring, hit);
      hit.addEventListener("pointermove", (ev) => {
        const r = root.getBoundingClientRect();
        const px = ((ev.clientX - r.left) / r.width) * W;
        const py = ((ev.clientY - r.top) / r.height) * H;
        let best = all[0]!;
        let bd = Infinity;
        for (const p of all) {
          const d = Math.hypot(sx(p.x) - px, sy(p.y) - py);
          if (d < bd) {
            bd = d;
            best = p;
          }
        }
        ring.setAttribute("cx", String(sx(best.x)));
        ring.setAttribute("cy", String(sy(best.y)));
        ring.setAttribute("visibility", "visible");
        tip.textContent = "";
        tip.append(
          el("strong", "", `${best.y.toFixed(2)}% wrong pixels`),
          el("span", "", `${best.s.name} · ${pxem(best.v.pxPerEm)} px/em`),
          el("span", "", `${best.v.atlasW}×${best.v.atlasH}×${best.v.channels} = ${kb(best.x)}`),
        );
        tip.hidden = false;
        const tr = tip.getBoundingClientRect();
        let left = ev.clientX + 14;
        if (left + tr.width > window.innerWidth - 8) left = ev.clientX - tr.width - 14;
        tip.style.left = `${left}px`;
        tip.style.top = `${ev.clientY + 14}px`;
      });
      hit.addEventListener("pointerleave", () => {
        tip.hidden = true;
        ring.setAttribute("visibility", "hidden");
      });
      fig.append(root);
      grid.append(fig);
    }
  }
}

// ── Tables ──────────────────────────────────────────────────────────────────

function setupTables(results: Results): void {
  const host = byId("tables");
  const fontSel = byId<HTMLSelectElement>("t-font");
  const metricSel = byId<HTMLSelectElement>("t-metric");
  for (const f of results.fonts) fontSel.append(new Option(f.name, f.name));
  const draw = (): void => {
    const f = results.fonts.find((x) => x.name === fontSel.value)!;
    const metric = metricSel.value as "defectPct" | "edgeErrPx";
    const rows = f.variants.filter((v) => v.role === "main");
    const table = el("table", "results");
    const thead = el("thead");
    const hr = el("tr");
    hr.append(el("th", "", "Distance field"), el("th", "num", "px/em"), el("th", "num", "Atlas"));
    hr.append(el("th", "num", "Memory"));
    for (const z of results.config.DISPLAY) {
      const th = el("th", "num", `${z}`);
      th.title = `${z} px/em = ${z / results.config.P}× the MSDF atlas`;
      hr.append(th);
    }
    thead.append(hr);
    table.append(thead);
    const best = results.config.DISPLAY.map((_, zi) =>
      Math.min(...rows.filter((v) => v.method !== "exact-sdf").map((v) => v.stats[zi]![metric])),
    );
    const tbody = el("tbody");
    for (const v of rows) {
      const tr = el("tr", v.method === "exact-sdf" ? "control" : v.method);
      const name = el("th", "", v.label);
      name.scope = "row";
      tr.append(name, el("td", "num", pxem(v.pxPerEm)));
      tr.append(
        el("td", "num", `${v.atlasW}×${v.atlasH}×${v.channels}`),
        el("td", "num", kb(v.bytes)),
      );
      v.stats.forEach((s, zi) => {
        const val = s[metric];
        const td = el("td", "num", metric === "defectPct" ? `${val.toFixed(2)}%` : val.toFixed(3));
        if (v.method !== "exact-sdf" && val === best[zi]) td.classList.add("best");
        tr.append(td);
      });
      tbody.append(tr);
    }
    table.append(tbody);
    host.textContent = "";
    host.append(table);
  };
  fontSel.addEventListener("change", draw);
  metricSel.addEventListener("change", draw);
  draw();
}

// ── Atlas previews ──────────────────────────────────────────────────────────

function setupAtlases(fonts: Map<string, FontData>): void {
  const host = byId("atlases");
  const fontSel = byId<HTMLSelectElement>("a-font");
  for (const name of fonts.keys()) fontSel.append(new Option(name, name));
  const draw = (): void => {
    const f = fonts.get(fontSel.value)!;
    host.textContent = "";
    // One shared texel→CSS-pixel scale so areas compare directly.
    const ids = ["msdf", "sdf-rgb", "sdf-rgba"];
    const metas = ids.map((id) => f.setMeta.get(id)!);
    const totalW = metas.reduce((n, m) => n + m.atlasW, 0);
    // Inner width: minus the 24px padding each side and the two 20px gaps.
    const avail = host.clientWidth - 2 * 24 - 2 * 20 - 4;
    const k = Math.min(0.75, Math.max(0.2, avail / totalW));
    for (const m of metas) {
      const fig = el("figure", "atlas");
      const canvas = el("canvas");
      canvas.width = m.atlasW;
      canvas.height = m.atlasH;
      canvas.style.width = `${m.atlasW * k}px`;
      // The figure takes the canvas's width so long captions wrap instead of widening the row.
      fig.style.width = `${m.atlasW * k}px`;
      const ctx = canvas.getContext("2d")!;
      const img = ctx.createImageData(m.atlasW, m.atlasH);
      const set = f.sets.get(m.id)!;
      const ch = m.channels;
      set.cells.forEach((c, gi) => {
        const row = m.cells[gi];
        if (!c || !row) return;
        const [ax, ay] = row;
        for (let r = 0; r < c.h; r++) {
          const dy = ay + (c.h - 1 - r); // cells are y-up, the texture is y-down
          for (let i = 0; i < c.w; i++) {
            const s = (r * c.w + i) * ch;
            const d = (dy * m.atlasW + ax + i) * 4;
            img.data[d] = c.data[s]!;
            img.data[d + 1] = c.data[s + (ch === 3 ? 1 : 0)]!;
            img.data[d + 2] = c.data[s + (ch === 3 ? 2 : 0)]!;
            img.data[d + 3] = 255;
          }
        }
      });
      ctx.putImageData(img, 0, 0);
      const cap = el("figcaption");
      cap.append(
        el("strong", "", m.id === "msdf" ? "msdfgen-ts MSDF" : "webgl-sdf-generator SDF"),
        el(
          "span",
          "",
          `${pxem(m.pxPerEm)} px/em · ${m.atlasW}×${m.atlasH}×${ch} = ${kb(m.bytes)}` +
            (m.id === "msdf" ? ` (${kb(m.uploadBytes)} as RGBA8)` : ""),
        ),
      );
      fig.append(canvas, cap);
      host.append(fig);
    }
  };
  fontSel.addEventListener("change", draw);
  draw();
  let lastW = host.clientWidth;
  new ResizeObserver(() => {
    if (Math.abs(host.clientWidth - lastW) > 40) {
      lastW = host.clientWidth;
      draw();
    }
  }).observe(host);
}

main().catch((err: unknown) => {
  const box = document.getElementById("load-error");
  if (box) {
    box.hidden = false;
    box.textContent = `The interactive parts failed to load: ${String(err)}`;
  }
  throw err;
});
