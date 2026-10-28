/**
 * Pure (DOM- and Node-free) rendering + error metrics shared by the
 * webgl-sdf-generator comparison's Node build (build.ts) and its in-browser
 * viewer (viewer.ts), so every number in the report and every pixel in the
 * viewer comes from the same code.
 *
 * Fairness contract: `renderField` is the ONLY reconstruction path, and the
 * two methods differ in exactly one line — `median(r,g,b)` for MSDF versus
 * the single value for SDF. Bilinear filtering of 8-bit texels, texel-centre
 * convention, distance-to-coverage mapping and compositing are shared.
 *
 * Dev tooling only, not part of the library.
 */

/** One glyph's distance field, cropped to its own cell. */
export interface FieldCell {
  /** Cell size in texels. */
  w: number;
  h: number;
  /** Cell rect in em, relative to the pen origin (y-up, baseline y=0). Texel
   *  `i` has its centre at `planeLeft + (i + 0.5) / pxPerEm`. */
  planeLeft: number;
  planeBottom: number;
  /** `w * h * channels` bytes, row 0 = bottom (y-up), as generated. */
  data: Uint8Array;
}

/** A set of glyph cells generated at one resolution. */
export interface FieldSet {
  /** 3 = MSDF (RGB, median), 1 = SDF. */
  channels: 1 | 3;
  /** Generation scale, texels per em. */
  pxPerEm: number;
  /** Total distance range in em (msdfgen `pxrange / scale`). */
  rangeEm: number;
  /** Indexed like the glyph list; null = no outline (space). */
  cells: (FieldCell | null)[];
}

/** Flat outline in em units, y-up: `kind, x0, y0, x1, y1, x2, y2` records,
 *  kind 0 = line (x2/y2 unused), 1 = quadratic (x1/y1 = control). */
export type Outline = Float64Array | Float32Array;

/** Values per {@link Outline} record. */
export const OUTLINE_STRIDE = 7;

/** A raster target: float coverage in [0, 1], row 0 = top. */
export interface CoverageImage {
  width: number;
  height: number;
  data: Float32Array;
}

/** Creates a blank coverage image. */
export function blankImage(width: number, height: number): CoverageImage {
  return { width, height, data: new Float32Array(width * height) };
}

function median3(a: number, b: number, c: number): number {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
}

/**
 * Reconstructs one glyph from its distance field into `img`, composited
 * "over" whatever is already there (glyph cells overlap via padding).
 *
 * The pen origin lands at screen `(ox, oy)` (y-down pixels, baseline at
 * `oy`), at `z` screen pixels per em. Each pixel is sampled at its centre;
 * texels are bilinearly filtered as 8-bit values clamped to the cell (the
 * GPU equivalent of a half-texel UV inset), and the result is mapped to
 * coverage with the standard MSDF shader formula
 * `clamp(screenPxRange * (d - 0.5) + 0.5, 0, 1)`.
 */
export function renderField(
  set: FieldSet,
  cell: FieldCell,
  z: number,
  ox: number,
  oy: number,
  img: CoverageImage,
): void {
  const { w, h, data } = cell;
  const ch = set.channels;
  const s = set.pxPerEm;
  const screenPxRange = set.rangeEm * z;
  const W = img.width;
  const out = img.data;

  const left = ox + cell.planeLeft * z;
  const right = left + (w / s) * z;
  const bottom = oy - cell.planeBottom * z;
  const top = bottom - (h / s) * z;
  // Shade pixels whose centre falls inside the cell quad (rasterization rule).
  const x0 = Math.max(0, Math.ceil(left - 0.5));
  const x1 = Math.min(W, Math.ceil(right - 0.5));
  const y0 = Math.max(0, Math.ceil(top - 0.5));
  const y1 = Math.min(img.height, Math.ceil(bottom - 0.5));
  const k = s / z;

  for (let py = y0; py < y1; py++) {
    // Texel-index space: texel j's centre is at v = j.
    let v = (bottom - (py + 0.5)) * k - 0.5;
    v = v < 0 ? 0 : v > h - 1 ? h - 1 : v;
    const j0 = Math.min(Math.floor(v), h - 2 < 0 ? 0 : h - 2);
    const j1 = Math.min(j0 + 1, h - 1);
    const fy = v - j0;
    for (let px = x0; px < x1; px++) {
      let u = (px + 0.5 - left) * k - 0.5;
      u = u < 0 ? 0 : u > w - 1 ? w - 1 : u;
      const i0 = Math.min(Math.floor(u), w - 2 < 0 ? 0 : w - 2);
      const i1 = Math.min(i0 + 1, w - 1);
      const fx = u - i0;
      const a00 = (j0 * w + i0) * ch;
      const a10 = (j0 * w + i1) * ch;
      const a01 = (j1 * w + i0) * ch;
      const a11 = (j1 * w + i1) * ch;
      let d: number;
      if (ch === 3) {
        const r = bilerp(data, a00, a10, a01, a11, fx, fy);
        const g = bilerp(data, a00 + 1, a10 + 1, a01 + 1, a11 + 1, fx, fy);
        const b = bilerp(data, a00 + 2, a10 + 2, a01 + 2, a11 + 2, fx, fy);
        d = median3(r, g, b);
      } else {
        d = bilerp(data, a00, a10, a01, a11, fx, fy);
      }
      let a = screenPxRange * (d - 0.5) + 0.5;
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      const o = py * W + px;
      out[o] = out[o]! + (1 - out[o]!) * a;
    }
  }
}

function bilerp(
  d: Uint8Array,
  a00: number,
  a10: number,
  a01: number,
  a11: number,
  fx: number,
  fy: number,
): number {
  const top = d[a00]! + (d[a10]! - d[a00]!) * fx;
  const bot = d[a01]! + (d[a11]! - d[a01]!) * fx;
  return (top + (bot - top) * fy) / 255;
}

/** Sub-scanlines per pixel row for the ground-truth rasterizer. */
const GT_SUBSAMPLES = 64;
/** Max chord deviation (screen px) when flattening quadratics for ground truth. */
const GT_FLATTEN_TOL = 0.01;

/**
 * Ground truth: exact area coverage of the vector outline (nonzero fill),
 * composited "over" `img`. Independent of both distance-field generators —
 * it rasterizes the outline directly: 64 sub-scanlines per pixel row, exact
 * analytic horizontal coverage on each, quadratics flattened to 0.01 px.
 *
 * @returns Outline length in screen pixels (for normalising error metrics).
 */
export function renderGroundTruth(
  outline: Outline,
  z: number,
  ox: number,
  oy: number,
  img: CoverageImage,
): number {
  const W = img.width;
  const H = img.height;
  // Flatten to screen-space line segments (y-down).
  const ex: number[] = [];
  let perimeter = 0;
  const push = (ax: number, ay: number, bx: number, by: number): void => {
    ex.push(ax, ay, bx, by);
    perimeter += Math.hypot(bx - ax, by - ay);
  };
  for (let r = 0; r < outline.length; r += OUTLINE_STRIDE) {
    const x0 = ox + outline[r + 1]! * z;
    const y0 = oy - outline[r + 2]! * z;
    const x1 = ox + outline[r + 3]! * z;
    const y1 = oy - outline[r + 4]! * z;
    if (outline[r] === 0) {
      push(x0, y0, x1, y1);
      continue;
    }
    const x2 = ox + outline[r + 5]! * z;
    const y2 = oy - outline[r + 6]! * z;
    const dd = Math.hypot(x0 - 2 * x1 + x2, y0 - 2 * y1 + y2);
    const n = Math.max(1, Math.ceil(Math.sqrt(dd / (4 * GT_FLATTEN_TOL))));
    let px = x0;
    let py = y0;
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      const mt = 1 - t;
      const qx = mt * mt * x0 + 2 * mt * t * x1 + t * t * x2;
      const qy = mt * mt * y0 + 2 * mt * t * y1 + t * t * y2;
      push(px, py, qx, qy);
      px = qx;
      py = qy;
    }
  }

  // Bucket edges by the pixel rows they span.
  const rows: number[][] = [];
  for (let y = 0; y < H; y++) rows.push([]);
  for (let e = 0; e < ex.length; e += 4) {
    const ya = ex[e + 1]!;
    const yb = ex[e + 3]!;
    if (ya === yb) continue;
    const r0 = Math.max(0, Math.floor(Math.min(ya, yb)));
    const r1 = Math.min(H - 1, Math.floor(Math.max(ya, yb)));
    for (let y = r0; y <= r1; y++) rows[y]!.push(e);
  }

  const acc = new Float64Array(W + 1);
  const xs: number[] = [];
  const dirs: number[] = [];
  const order: number[] = [];
  for (let y = 0; y < H; y++) {
    const list = rows[y]!;
    if (list.length === 0) continue;
    acc.fill(0);
    for (let k = 0; k < GT_SUBSAMPLES; k++) {
      const sy = y + (k + 0.5) / GT_SUBSAMPLES;
      xs.length = 0;
      dirs.length = 0;
      for (const e of list) {
        const ax = ex[e]!;
        const ay = ex[e + 1]!;
        const bx = ex[e + 2]!;
        const by = ex[e + 3]!;
        if (ay <= sy === by <= sy) continue;
        xs.push(ax + ((sy - ay) * (bx - ax)) / (by - ay));
        dirs.push(by > ay ? 1 : -1);
      }
      order.length = 0;
      for (let i = 0; i < xs.length; i++) order.push(i);
      order.sort((a, b) => xs[a]! - xs[b]!);
      let wind = 0;
      for (let i = 0; i < order.length; i++) {
        const idx = order[i]!;
        const was = wind;
        wind += dirs[idx]!;
        if (was === 0 && wind !== 0) {
          // Span opens here; find where winding returns to zero.
          let j = i + 1;
          let wj = wind;
          for (; j < order.length; j++) {
            wj += dirs[order[j]!]!;
            if (wj === 0) break;
          }
          if (j >= order.length) break; // open span (malformed outline)
          addSpan(acc, W, xs[idx]!, xs[order[j]!]!);
          wind = 0;
          i = j;
        }
      }
    }
    const o = y * W;
    const out = img.data;
    for (let x = 0; x < W; x++) {
      const a = acc[x]! / GT_SUBSAMPLES;
      if (a > 0) out[o + x] = out[o + x]! + (1 - out[o + x]!) * (a > 1 ? 1 : a);
    }
  }
  return perimeter;
}

/** Adds exact horizontal coverage of [xa, xb) to `acc`. */
function addSpan(acc: Float64Array, W: number, xa: number, xb: number): void {
  if (xa < 0) xa = 0;
  if (xb > W) xb = W;
  if (xb <= xa) return;
  const ia = Math.floor(xa);
  const ib = Math.floor(xb);
  if (ia === ib) {
    acc[ia] = acc[ia]! + (xb - xa);
    return;
  }
  acc[ia] = acc[ia]! + (ia + 1 - xa);
  for (let i = ia + 1; i < ib; i++) acc[i] = acc[i]! + 1;
  if (ib < W) acc[ib] = acc[ib]! + (xb - ib);
}

/** Accumulated error of one method against ground truth. */
export interface ErrorStats {
  /** Σ |coverage − truth| over all pixels, in px². */
  absErr: number;
  /** Pixels whose coverage is off by more than 0.5 (visibly the wrong colour). */
  badPixels: number;
  /** Pixels on the true edge (0 < truth < 1). */
  edgePixels: number;
  /** Outline length in px. */
  perimeter: number;
}

/** Fresh zeroed {@link ErrorStats}. */
export function emptyStats(): ErrorStats {
  return { absErr: 0, badPixels: 0, edgePixels: 0, perimeter: 0 };
}

/** Accumulates the error of `img` against `truth` into `stats`. */
export function accumulateError(
  img: CoverageImage,
  truth: CoverageImage,
  perimeter: number,
  stats: ErrorStats,
): void {
  const a = img.data;
  const t = truth.data;
  for (let i = 0; i < a.length; i++) {
    const g = t[i]!;
    const e = Math.abs(a[i]! - g);
    stats.absErr += e;
    if (e > 0.5) stats.badPixels++;
    if (g > 0.001 && g < 0.999) stats.edgePixels++;
  }
  stats.perimeter += perimeter;
}
