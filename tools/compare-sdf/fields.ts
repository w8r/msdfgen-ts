/**
 * Glyph preparation, atlas geometry, memory-budget matching and distance-field
 * generation for both methods. Node- and DOM-free, so build.ts (which computes
 * the report's numbers) and page.ts (whose viewer generates other budgets on
 * demand in the browser) run exactly the same code.
 *
 * Dev tooling only, not part of the library.
 */
import potpack from "potpack";
import createSDFGenerator from "webgl-sdf-generator";
import { type Font } from "../../src/font/font";
import { Atlas, pixelFloatToByte } from "../../src/atlas-gen";
import { emNormalizeShape, normalizeShape } from "../../src/shape/normalize";
import { generateSDF } from "../../src/msdf/sdf";
import { LINEAR, QUADRATIC } from "../../src/shape/segments";
import { type FieldCell } from "./shared";

/** Default MSDF atlas: the library defaults. */
export const P = 40;
export const PXRANGE = 4;
/** Distance range in em, held equal for every atlas in the comparison. */
export const RANGE_EM = PXRANGE / P;

/** Printable ASCII + basic Cyrillic. */
export const CODEPOINTS: number[] = [];
for (let c = 33; c <= 126; c++) CODEPOINTS.push(c);
CODEPOINTS.push(0x401, 0x451);
for (let c = 0x410; c <= 0x44f; c++) CODEPOINTS.push(c);

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface GlyphSrc {
  cp: number;
  gid: number;
  /** Advance width, em. */
  advance: number;
  /** See shared.ts `Outline`. */
  outline: Float64Array;
  /** SVG path (M/L/Q/Z), em units, y-up — webgl-sdf-generator's input. */
  path: string;
  bounds: Bounds | null;
}

const _pt = [0, 0];

/** Em-normalized outline, SVG path and bounds of one glyph. */
export function prepGlyph(font: Font, cp: number): GlyphSrc {
  const gid = font.glyphId(cp);
  const upe = font.metrics.unitsPerEm;
  const shape = font.shape(gid);
  emNormalizeShape(shape, upe);
  const recs: number[] = [];
  let path = "";
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const contour of shape.contours) {
    if (contour.length === 0) continue;
    path += `M${contour[0]!.p0x},${contour[0]!.p0y}`;
    for (const seg of contour) {
      if (seg.type === LINEAR) {
        recs.push(0, seg.p0x, seg.p0y, seg.p1x, seg.p1y, 0, 0);
        path += `L${seg.p1x},${seg.p1y}`;
      } else if (seg.type === QUADRATIC) {
        recs.push(1, seg.p0x, seg.p0y, seg.p1x, seg.p1y, seg.p2x, seg.p2y);
        path += `Q${seg.p1x},${seg.p1y},${seg.p2x},${seg.p2y}`;
      } else {
        throw new Error(`U+${cp.toString(16)}: unexpected cubic in a TrueType outline`);
      }
      // Same 16-sample bounds as Atlas._shapeBounds, so cells match exactly.
      for (let i = 0; i <= 16; i++) {
        seg.point(i / 16, _pt);
        minX = Math.min(minX, _pt[0]!);
        minY = Math.min(minY, _pt[1]!);
        maxX = Math.max(maxX, _pt[0]!);
        maxY = Math.max(maxY, _pt[1]!);
      }
    }
    path += "Z";
  }
  return {
    cp,
    gid,
    advance: font.advance(gid) / upe,
    outline: new Float64Array(recs),
    path,
    bounds: recs.length > 0 ? { minX, minY, maxX, maxY } : null,
  };
}

/** The comparison's glyph set for `font`, in a fixed order (cell indices). */
export function prepGlyphs(font: Font): GlyphSrc[] {
  return CODEPOINTS.filter((cp) => font.glyphId(cp) !== 0).map((cp) => prepGlyph(font, cp));
}

export interface CellGeom {
  w: number;
  h: number;
  planeLeft: number;
  planeBottom: number;
}

/** atlas-gen.ts's cell geometry at an arbitrary resolution: ink bounds in
 *  texels plus the MSDF's em padding (rounded up to whole texels). */
export function cellGeom(b: Bounds, pxPerEm: number): CellGeom {
  const pad = Math.ceil((PXRANGE * pxPerEm) / P - 1e-9);
  const w = Math.max(1, Math.ceil((b.maxX - b.minX) * pxPerEm)) + 2 * pad;
  const h = Math.max(1, Math.ceil((b.maxY - b.minY) * pxPerEm)) + 2 * pad;
  return { w, h, planeLeft: b.minX - pad / pxPerEm, planeBottom: b.minY - pad / pxPerEm };
}

/** Cell geometry of every glyph at `pxPerEm` (null for empty outlines). */
export function cellGeoms(glyphs: GlyphSrc[], pxPerEm: number): (CellGeom | null)[] {
  return glyphs.map((g) => (g.bounds ? cellGeom(g.bounds, pxPerEm) : null));
}

/** webgl-sdf-generator viewBox for a cell: [left, bottom, right, top] in em —
 *  its row 0 lands on viewBox[1], so cells come out y-up like msdfgen's. */
export function viewBox(geo: CellGeom, pxPerEm: number): [number, number, number, number] {
  return [
    geo.planeLeft,
    geo.planeBottom,
    geo.planeLeft + geo.w / pxPerEm,
    geo.planeBottom + geo.h / pxPerEm,
  ];
}

export interface Packing {
  width: number;
  height: number;
  /** Atlas position per glyph (null for empty outlines). */
  pos: ({ x: number; y: number } | null)[];
}

/** Packs cells with potpack in glyph order — the same boxes in the same order
 *  as Atlas, so for an MSDF resolution this is Atlas's own layout. */
export function pack(geoms: (CellGeom | null)[]): Packing {
  const boxes = geoms.map((g) => ({ w: g?.w ?? 0, h: g?.h ?? 0, x: 0, y: 0 }));
  const { w, h } = potpack(boxes.filter((b) => b.w > 0));
  return { width: w, height: h, pos: boxes.map((b) => (b.w > 0 ? { x: b.x, y: b.y } : null)) };
}

/** Largest px/em (0.25 steps, from `start`) whose packed 1-byte atlas of all
 *  `glyphs` fits in `bytes`. */
export function matchBudget(glyphs: GlyphSrc[], bytes: number, start: number = P): number {
  let best = start;
  for (let s = start; s <= 4 * start; s += 0.25) {
    const p = pack(cellGeoms(glyphs, s));
    const used = p.width * p.height;
    if (used <= bytes) best = s;
    else if (used > bytes * 1.1) break;
  }
  return best;
}

/** pxrange that keeps the distance range at {@link RANGE_EM} for an MSDF at
 *  `pxPerEm`. Atlas needs it whole, so valid MSDF resolutions are multiples of 10. */
export function msdfPxrange(pxPerEm: number): number {
  const r = (PXRANGE * pxPerEm) / P;
  if (!Number.isInteger(r)) throw new Error(`MSDF at ${pxPerEm} px/em needs a whole pxrange`);
  return r;
}

/**
 * msdfgen-ts MSDF cells for `glyphs`, generated by the library's own Atlas.
 * Cells don't depend on which other glyphs share the atlas, so a subset
 * yields the same bytes as the full set.
 * @returns Cells (y-up RGB, indexed like `glyphs`) and the atlas's layout.
 */
export function genMsdf(
  font: Font,
  glyphs: GlyphSrc[],
  pxPerEm: number,
): { cells: (FieldCell | null)[]; packing: Packing } {
  const atlas = new Atlas(font, { pixelsPerEm: pxPerEm, pxrange: msdfPxrange(pxPerEm) });
  const ag = atlas.glyphs(glyphs.map((g) => g.cp));
  const W = atlas.width;
  const tex = atlas.texture;
  const cells = ag.map((g): FieldCell | null => {
    if (g.w === 0) return null;
    // Atlas texture is y-down RGBA; cells are y-up RGB.
    const data = new Uint8Array(g.w * g.h * 3);
    for (let r = 0; r < g.h; r++) {
      const src = g.y + (g.h - 1 - r);
      for (let i = 0; i < g.w; i++) {
        const s = (src * W + g.x + i) * 4;
        const d = (r * g.w + i) * 3;
        data[d] = tex[s]!;
        data[d + 1] = tex[s + 1]!;
        data[d + 2] = tex[s + 2]!;
      }
    }
    return { w: g.w, h: g.h, planeLeft: g.planeLeft, planeBottom: g.planeBottom, data };
  });
  return {
    cells,
    packing: {
      width: W,
      height: atlas.height,
      pos: ag.map((g) => (g.w === 0 ? null : { x: g.x, y: g.y })),
    },
  };
}

const sdfGen = createSDFGenerator();

/** webgl-sdf-generator, JS path (same algorithm as its WebGL path — checked
 *  byte-for-byte by gl-parity.ts). Linear encoding, maxDistance = half range. */
export function genWebglSdf(g: GlyphSrc, pxPerEm: number): FieldCell | null {
  if (!g.bounds) return null;
  const geo = cellGeom(g.bounds, pxPerEm);
  const data = sdfGen.javascript.generate(
    geo.w,
    geo.h,
    g.path,
    viewBox(geo, pxPerEm),
    RANGE_EM / 2,
    1,
  );
  return { ...geo, data };
}

/** msdfgen's exact single-channel SDF (our port of `msdfgen sdf`) — the
 *  control that separates "one channel vs three" from curve flattening. */
export function genExactSdf(font: Font, g: GlyphSrc, pxPerEm: number): FieldCell | null {
  if (!g.bounds) return null;
  const geo = cellGeom(g.bounds, pxPerEm);
  const shape = font.shape(g.gid);
  emNormalizeShape(shape, font.metrics.unitsPerEm);
  normalizeShape(shape);
  const f = new Float32Array(geo.w * geo.h);
  generateSDF(
    shape,
    {
      width: geo.w,
      height: geo.h,
      scale: pxPerEm,
      tx: -geo.planeLeft,
      ty: -geo.planeBottom,
      pxrange: RANGE_EM * pxPerEm,
    },
    f,
  );
  const data = new Uint8Array(f.length);
  for (let i = 0; i < f.length; i++) data[i] = pixelFloatToByte(f[i]!);
  return { ...geo, data };
}
