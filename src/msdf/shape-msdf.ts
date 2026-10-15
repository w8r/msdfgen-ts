/**
 * The whole MSDF pipeline for one shape, from any source (font glyph, SVG):
 * normalize → colour → generate → sign-correct → error-correct, into a
 * bitmap cropped to the shape's bounds plus `pxrange` texels of padding.
 *
 * Byte-for-byte the msdfgen `msdf -scanline` pipeline (see
 * test/msdf/msdf.test.ts); the bounds/cropping on top is original.
 * msdfgen is MIT © Viktor Chlumský.
 */

import { type Shape } from "../shape/shape";
import { normalizeShape } from "../shape/normalize";
import { edgeColoringSimple } from "./edge-coloring";
import { generateMSDF } from "./generate";
import { distanceSignCorrection, msdfErrorCorrection } from "./error-correction";

/** Edge-coloring corner angle threshold (radians) — matches msdfgen CLI default. */
const ANGLE_THRESHOLD = 3.0;
/** Edge-coloring PRNG seed — matches msdfgen CLI default. */
const COLOR_SEED = 0n;
/** Segment t-samples per axis for shape bounds (control-hull would be tighter
 *  in theory but is looser in practice for outward-curving Béziers; 16 is
 *  well under a texel of slop at any realistic pixelsPerEm). */
const BOUNDS_SAMPLES = 16;

/** A shape's MSDF bitmap and where it sits in shape space. */
export interface ShapeMSDF {
  /** Float MSDF, `w × h × 3`, row-major, y-up (row 0 = bottom). */
  msdf: Float32Array;
  w: number;
  h: number;
  /** Bitmap rect in shape units (y-up). */
  planeLeft: number;
  planeBottom: number;
  planeRight: number;
  planeTop: number;
}

/**
 * Generates the MSDF of `shape` at `pixelsPerUnit` texels per shape unit.
 * Mutates `shape` (normalized + edge-coloured). Returns `null` for a shape
 * with no contours.
 *
 * @param shape Closed contours, y-up, in the units `pixelsPerUnit` scales.
 * @param pixelsPerUnit Texels per shape unit (an atlas's `pixelsPerEm`).
 * @param pxrange Distance range in texels (msdfgen `-pxrange`).
 * @returns The bitmap and its plane bounds, or `null` if `shape` is empty.
 */
export function generateShapeMSDF(
  shape: Shape,
  pixelsPerUnit: number,
  pxrange: number,
): ShapeMSDF | null {
  if (shape.contours.length === 0) return null;

  const bounds = shapeBounds(shape);
  const s = pixelsPerUnit;
  const pxr = pxrange;
  // Cell size in texels = ceil(bbox in texels) + 2*pxr on each side.
  const w = Math.max(1, Math.ceil((bounds.maxX - bounds.minX) * s)) + 2 * pxr;
  const h = Math.max(1, Math.ceil((bounds.maxY - bounds.minY) * s)) + 2 * pxr;
  // Place the shape so its bbox min sits at cell texel (pxr, pxr).
  // msdfgen projection convention: pixel = s*(shape + t) (ignoring the
  // −0.5 texel-centre offset, as elsewhere in this codebase's plane bounds).
  const tx = pxr / s - bounds.minX;
  const ty = pxr / s - bounds.minY;

  normalizeShape(shape);
  edgeColoringSimple(shape, ANGLE_THRESHOLD, COLOR_SEED);

  const msdf = new Float32Array(w * h * 3);
  generateMSDF(shape, w, h, s, tx, ty, pxr, msdf);
  distanceSignCorrection(msdf, shape, w, h, s, tx, ty);
  msdfErrorCorrection(msdf, shape, w, h, s, tx, ty, pxr);

  return {
    msdf,
    w,
    h,
    planeLeft: -tx,
    planeBottom: -ty,
    planeRight: w / s - tx,
    planeTop: h / s - ty,
  };
}

/** Reusable point sample buffer for `shapeBounds`. */
const _pt: number[] = [0, 0];

/**
 * Axis-aligned bounds of a shape, sampled at `BOUNDS_SAMPLES` t-values per
 * segment. Not mathematically tight, but well under a texel of slop at any
 * realistic `pixelsPerUnit` — good enough for cropping (and for SVG
 * `objectBoundingBox` gradients).
 *
 * @param shape Shape to measure.
 * @returns Its axis-aligned bounds, in shape units.
 */
export function shapeBounds(shape: Shape): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const contour of shape.contours) {
    for (const seg of contour) {
      for (let i = 0; i <= BOUNDS_SAMPLES; i++) {
        seg.point(i / BOUNDS_SAMPLES, _pt);
        const x = _pt[0]!;
        const y = _pt[1]!;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY };
}
