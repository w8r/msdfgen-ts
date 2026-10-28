/**
 * Overlap removal: rewrites a shape as the boundary of its nonzero fill, so
 * overlapping contours (variable fonts, composite glyphs) no longer leave
 * holes where msdfgen's overlapping-contour combiner gets their interior
 * edges wrong. msdfgen itself does this step with Skia path ops
 * (MSDFGEN_USE_SKIA: resolveShapeGeometry); this file is original.
 *
 * Every edge is split where it crosses another, each piece is kept iff the
 * fill differs on its two sides, and the kept pieces are relinked into
 * contours. Shapes without overlaps are returned untouched, and anything
 * ambiguous (coincident curves, pieces that don't link up) also leaves the
 * shape as it was — never worse than no preprocessing.
 */

import { EdgeSegment, type SegmentType } from "./segments";
import { type Shape } from "./shape";
import { Scanline, computeShapeScanline, FILL_NONZERO } from "./scanline";
import { cross } from "../math/scalar";

/** Em-space size below which sub-curves are treated as straight chords. */
const FLAT = 1e-5;
/** Em-space tolerance for relinking endpoints and matching duplicate pieces. */
const LINK = 1e-6;
/** Subdivision steps allowed per edge pair; running out means coincident curves. */
const BUDGET = 20000;

/** Control points of `e` as a flat [x0, y0, x1, y1, ...] array. */
function cps(e: EdgeSegment): number[] {
  return [e.p0x, e.p0y, e.p1x, e.p1y, e.p2x, e.p2y, e.p3x, e.p3y].slice(0, 2 * e.type + 4);
}

/** Segment from a flat control-point array (2, 3 or 4 points). */
function seg(q: number[]): EdgeSegment {
  const type = (q.length / 2 - 2) as SegmentType;
  return new EdgeSegment(
    type,
    q[0]!,
    q[1]!,
    q[2]!,
    q[3]!,
    q[4] ?? 0,
    q[5] ?? 0,
    q[6] ?? 0,
    q[7] ?? 0,
  );
}

/** Control points of the sub-curve over [t0, t1], by blossoming. */
function sub(p: number[], t0: number, t1: number): number[] {
  const n = p.length / 2 - 1;
  const out: number[] = [];
  for (let k = 0; k <= n; k++) {
    const q = p.slice();
    for (let j = 0; j < n; j++) {
      const t = j < n - k ? t0 : t1;
      for (let i = 0; i < q.length - 2; i++) q[i] = q[i]! + t * (q[i + 2]! - q[i]!);
      q.length -= 2;
    }
    out.push(q[0]!, q[1]!);
  }
  return out;
}

/** Axis-aligned bounds [minX, minY, maxX, maxY] of a control polygon. */
function box(p: number[]): number[] {
  const b = [Infinity, Infinity, -Infinity, -Infinity];
  for (let i = 0; i < p.length; i += 2) {
    b[0] = Math.min(b[0]!, p[i]!);
    b[1] = Math.min(b[1]!, p[i + 1]!);
    b[2] = Math.max(b[2]!, p[i]!);
    b[3] = Math.max(b[3]!, p[i + 1]!);
  }
  return b;
}

let _budget = 0;

/**
 * Pushes (ta, tb) parameter pairs where curves `a` and `b` meet within
 * [a0, a1] × [b0, b1]: bounding-box subdivision down to near-flat pieces,
 * then an exact chord-chord intersection.
 */
function crossings(
  a: number[],
  a0: number,
  a1: number,
  b: number[],
  b0: number,
  b1: number,
  hits: number[],
): void {
  if (--_budget < 0) return;
  const p = sub(a, a0, a1);
  const q = sub(b, b0, b1);
  const A = box(p);
  const B = box(q);
  if (A[0]! > B[2]! || B[0]! > A[2]! || A[1]! > B[3]! || B[1]! > A[3]!) return;
  const sa = Math.max(A[2]! - A[0]!, A[3]! - A[1]!);
  const sb = Math.max(B[2]! - B[0]!, B[3]! - B[1]!);
  if (sa < FLAT && sb < FLAT) {
    const rx = p[p.length - 2]! - p[0]!;
    const ry = p[p.length - 1]! - p[1]!;
    const sx = q[q.length - 2]! - q[0]!;
    const sy = q[q.length - 1]! - q[1]!;
    const d = cross(rx, ry, sx, sy);
    const u = cross(q[0]! - p[0]!, q[1]! - p[1]!, sx, sy) / d;
    const v = cross(q[0]! - p[0]!, q[1]! - p[1]!, rx, ry) / d;
    if (u >= 0 && u <= 1 && v >= 0 && v <= 1) hits.push(a0 + u * (a1 - a0), b0 + v * (b1 - b0));
  } else if (sa > sb) {
    crossings(a, a0, (a0 + a1) / 2, b, b0, b1, hits);
    crossings(a, (a0 + a1) / 2, a1, b, b0, b1, hits);
  } else {
    crossings(a, a0, a1, b, b0, (b0 + b1) / 2, hits);
    crossings(a, a0, a1, b, (b0 + b1) / 2, b1, hits);
  }
}

/** Parameter of point (x, y) projected onto line `a`. */
function project(a: number[], x: number, y: number): number {
  const dx = a[2]! - a[0]!;
  const dy = a[3]! - a[1]!;
  return ((x - a[0]!) * dx + (y - a[1]!) * dy) / (dx * dx + dy * dy);
}

/** Collinear lines meet along a stretch, not at points: split each at the other's ends. */
function collinear(a: number[], b: number[], hits: number[]): boolean {
  if (a.length !== 4 || b.length !== 4) return false;
  const dx = a[2]! - a[0]!;
  const dy = a[3]! - a[1]!;
  const tol = 1e-9 * Math.hypot(dx, dy);
  if (Math.abs(cross(dx, dy, b[0]! - a[0]!, b[1]! - a[1]!)) > tol) return false;
  if (Math.abs(cross(dx, dy, b[2]! - a[0]!, b[3]! - a[1]!)) > tol) return false;
  hits.push(project(a, b[0]!, b[1]!), 0, project(a, b[2]!, b[3]!), 1);
  hits.push(0, project(b, a[0]!, a[1]!), 1, project(b, a[2]!, a[3]!));
  return true;
}

/** Control points in reverse order (same curve, opposite direction). */
function reverse(p: number[]): number[] {
  const out: number[] = [];
  for (let i = p.length - 2; i >= 0; i -= 2) out.push(p[i]!, p[i + 1]!);
  return out;
}

const _line = new Scanline();
const _pt = [0, 0];
const _dir = [0, 0];

/** Nonzero fill of `shape` at (x, y). */
function filled(shape: Shape, x: number, y: number): boolean {
  computeShapeScanline(shape, y, _line);
  return _line.filled(x, FILL_NONZERO);
}

/**
 * Replaces `shape`'s contours with the boundary of their union (nonzero
 * fill), in place. Leaves the shape untouched when it has no overlaps or
 * when they can't be resolved cleanly. Expects em-normalized geometry,
 * before `normalizeShape`.
 *
 * @param shape Shape to resolve (mutated in place).
 */
export function unionShape(shape: Shape): void {
  const edges = shape.contours.flat().map(cps);
  const boxes = edges.map(box);
  const splits = edges.map((): number[] => []);
  for (let i = 0; i < edges.length; i++) {
    const a = boxes[i]!;
    for (let j = i + 1; j < edges.length; j++) {
      const b = boxes[j]!;
      if (a[0]! > b[2]! || b[0]! > a[2]! || a[1]! > b[3]! || b[1]! > a[3]!) continue;
      const hits: number[] = [];
      _budget = BUDGET;
      if (!collinear(edges[i]!, edges[j]!, hits)) crossings(edges[i]!, 0, 1, edges[j]!, 0, 1, hits);
      if (_budget < 0) return; // coincident curves
      for (let k = 0; k < hits.length; k += 2) {
        splits[i]!.push(hits[k]!);
        splits[j]!.push(hits[k + 1]!);
      }
    }
  }

  // Keep each piece whose two sides differ, oriented like most of the outline.
  let changed = false;
  const pieces: number[][] = [];
  const right: boolean[] = [];
  edges.forEach((p, i) => {
    const ts = [0];
    for (const t of splits[i]!.sort((x, y) => x - y)) {
      if (t - ts[ts.length - 1]! > 1e-7 && t < 1 - 1e-7) ts.push(t);
    }
    ts.push(1);
    for (let k = 1; k < ts.length; k++) {
      const q = sub(p, ts[k - 1]!, ts[k]!);
      const e = seg(q);
      e.point(0.5, _pt);
      e.direction(0.5, _dir);
      const len = Math.hypot(_dir[0]!, _dir[1]!);
      const chord = Math.hypot(q[q.length - 2]! - q[0]!, q[q.length - 1]! - q[1]!);
      if (len === 0 || chord === 0) continue;
      // Sample just off each side, closer than any near-tangent sliver (~chord²).
      const o = Math.min(1e-6, (chord * chord) / 64) / len;
      const r = filled(shape, _pt[0]! + _dir[1]! * o, _pt[1]! - _dir[0]! * o);
      if (r === filled(shape, _pt[0]! - _dir[1]! * o, _pt[1]! + _dir[0]! * o)) {
        changed = true;
      } else {
        pieces.push(q);
        right.push(r);
      }
    }
  });
  const majority = 2 * right.filter(Boolean).length >= right.length;
  const kept: number[][] = [];
  pieces.forEach((q, i) => {
    if (right[i] !== majority) {
      q = reverse(q);
      changed = true;
    }
    const same = (k: number[]): boolean =>
      k.length === q.length && k.every((v, n) => Math.abs(v - q[n]!) < LINK);
    if (kept.some(same)) changed = true;
    else kept.push(q);
  });
  if (!changed) return;

  // Relink pieces end-to-start into closed contours.
  const used = kept.map(() => false);
  const contours: EdgeSegment[][] = [];
  for (let s = 0; s < kept.length; s++) {
    if (used[s]) continue;
    used[s] = true;
    const c = [kept[s]!];
    for (;;) {
      const last = c[c.length - 1]!;
      const ex = last[last.length - 2]!;
      const ey = last[last.length - 1]!;
      if (c.length > 1 && Math.hypot(ex - c[0]![0]!, ey - c[0]![1]!) < LINK) {
        c[0]![0] = ex;
        c[0]![1] = ey;
        break;
      }
      let next = -1;
      let best = LINK;
      kept.forEach((q, j) => {
        const d = Math.hypot(q[0]! - ex, q[1]! - ey);
        if (!used[j] && d < best) {
          next = j;
          best = d;
        }
      });
      if (next < 0) return; // a contour didn't close: leave the shape as it was
      used[next] = true;
      kept[next]![0] = ex;
      kept[next]![1] = ey;
      c.push(kept[next]!);
    }
    contours.push(c.map(seg));
  }
  shape.contours = contours;
}
