/**
 * unionShape (src/shape/union.ts): overlapping contours become the boundary
 * of their nonzero fill. The fill itself must not change, no point may stay
 * covered twice, and shapes without overlaps must be left untouched.
 *
 * clipShape and subtractShape (same file): the result must fill exactly the
 * points the boolean op says (both / the first but not the cut), again with
 * no point covered twice.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";
import { Font } from "../../src/font/font";
import { emNormalizeShape } from "../../src/shape/normalize";
import { clipShape, subtractShape, unionShape } from "../../src/shape/union";
import { Scanline, computeShapeScanline } from "../../src/shape/scanline";
import { CUBIC, EdgeSegment, LINEAR, type SignedDistanceResult } from "../../src/shape/segments";
import { type Contour } from "../../src/shape/contour";
import { type Shape } from "../../src/shape/shape";

const FONTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../fonts");
const GRID = 48;

function emShape(font: Font, gid: number): Shape {
  const shape = font.shape(gid);
  emNormalizeShape(shape, font.metrics.unitsPerEm);
  return shape;
}

/** Winding numbers of `shape` on a GRID×GRID lattice over [-0.3, 1.2]². */
function windings(shape: Shape): Int32Array {
  const out = new Int32Array(GRID * GRID);
  const line = new Scanline();
  for (let j = 0; j < GRID; j++) {
    computeShapeScanline(shape, -0.3 + (1.5 * (j + 0.5)) / GRID, line);
    for (let i = 0; i < GRID; i++) {
      out[j * GRID + i] = line.sumIntersections(-0.3 + (1.5 * (i + 0.5)) / GRID);
    }
  }
  return out;
}

/** Grid point k of windings(), as [x, y]. */
function gridPoint(k: number): [number, number] {
  return [
    -0.3 + (1.5 * ((k % GRID) + 0.5)) / GRID,
    -0.3 + (1.5 * (Math.floor(k / GRID) + 0.5)) / GRID,
  ];
}

/** Smallest distance from (x, y) to any edge of `contours`. */
function edgeDistance(contours: Contour[], x: number, y: number): number {
  const sd: SignedDistanceResult = { distance: 0, dot: 0, param: 0 };
  let d = Infinity;
  for (const e of contours.flat()) {
    e.signedDistance(x, y, sd);
    d = Math.min(d, Math.abs(sd.distance));
  }
  return d;
}

/** Closed circle contour of four cubic quarter arcs, counter-clockwise unless `cw`. */
function circle(cx: number, cy: number, r: number, cw = false): EdgeSegment[] {
  const k = r * 0.5522847498;
  const s = cw ? -1 : 1;
  const arcs: EdgeSegment[] = [];
  for (let q = 0; q < 4; q++) {
    const a = (s * q * Math.PI) / 2;
    const b = (s * (q + 1) * Math.PI) / 2;
    const [c0, s0, c1, s1] = [Math.cos(a), Math.sin(a), Math.cos(b), Math.sin(b)];
    arcs.push(
      new EdgeSegment(
        CUBIC,
        cx + r * c0,
        cy + r * s0,
        cx + r * c0 - s * k * s0,
        cy + r * s0 + s * k * c0,
        cx + r * c1 + s * k * s1,
        cy + r * s1 - s * k * c1,
        cx + r * c1,
        cy + r * s1,
      ),
    );
  }
  return arcs;
}

/**
 * Combines `subject` with the `others` groups (clip: inside one of them,
 * subtract: outside all of them, union: or inside one of them) and returns
 * where the result's fill differs from what that op means (away from any
 * edge), or holds a point twice.
 */
function opErrors(
  subject: Shape,
  others: Contour[][],
  op: "clip" | "subtract",
  label: string,
): string[] {
  const expected = windings(subject);
  const groups = others.map((g) => windings({ contours: g, inverseYAxis: false }));
  const edges = [...subject.contours, ...others.flat()];
  if (op === "clip") clipShape(subject, others);
  else subtractShape(subject, others);
  const after = windings(subject);
  const errors: string[] = [];
  for (let k = 0; k < after.length; k++) {
    const [x, y] = gridPoint(k);
    if (Math.abs(after[k]!) > 1) errors.push(`${label}: overlap left at ${x},${y}`);
    const [a, b] = [expected[k] !== 0, groups.some((w) => w[k] !== 0)];
    const want = op === "clip" ? a && b : a && !b;
    if (want !== (after[k] !== 0) && edgeDistance(edges, x, y) > 1e-4) {
      errors.push(`${label}: fill ${want ? "lost" : "added"} at ${x},${y}`);
    }
  }
  return errors;
}

/** opErrors for clipShape. */
function clipErrors(subject: Shape, clip: Contour[][], label: string): string[] {
  return opErrors(subject, clip, "clip", label);
}

/** Closed polygon contour through the points [x0, y0, x1, y1, ...]. */
function polygon(...p: number[]): EdgeSegment[] {
  const n = p.length / 2;
  return Array.from({ length: n }, (_, i) => {
    const j = (i + 1) % n;
    return new EdgeSegment(LINEAR, p[2 * i]!, p[2 * i + 1]!, p[2 * j]!, p[2 * j + 1]!, 0, 0, 0, 0);
  });
}

describe("unionShape", () => {
  it("still merges a shape that has near-parallel diagonal lines", () => {
    // Parallel 45° diagonals one font unit (1/2048 em) apart overlap in
    // thousands of subdivision boxes; subdividing them used to exhaust the
    // per-pair budget and leave every overlap in the shape unresolved.
    const u = 1 / 2048;
    const shape: Shape = {
      contours: [
        polygon(0, 0, 1, 1, 1, 0),
        polygon(0, u, 0, 1 + u, 1, 1 + u),
        polygon(2, 0, 2, 1, 3, 1, 3, 0),
        polygon(2.4, 0.2, 2.4, 1.2, 3.4, 1.2, 3.4, 0.2),
      ],
      inverseYAxis: false,
    };
    unionShape(shape);
    // The two triangles stay apart; the two overlapping squares become one.
    expect(shape.contours.length).toBe(3);
  });

  for (const file of ["Roboto.ttf", "NotoSans.ttf", "PTSerif-Regular.ttf"]) {
    it(`keeps the fill and removes every overlap (${file}, printable ASCII + Latin-1)`, () => {
      const buf = readFileSync(resolve(FONTS_DIR, file));
      const font = new Font(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      const sd: SignedDistanceResult = { distance: 0, dot: 0, param: 0 };
      let resolved = 0;
      const errors: string[] = [];
      for (let cp = 0x21; cp <= 0xff; cp++) {
        const gid = font.glyphId(cp);
        const before = windings(emShape(font, gid));
        const shape = emShape(font, gid);
        const contours = shape.contours;
        unionShape(shape);
        const after = windings(shape);
        if (shape.contours !== contours) resolved++;
        for (let k = 0; k < before.length; k++) {
          const x = -0.3 + (1.5 * ((k % GRID) + 0.5)) / GRID;
          const y = -0.3 + (1.5 * (Math.floor(k / GRID) + 0.5)) / GRID;
          if (Math.abs(after[k]!) > 1)
            errors.push(`U+${cp.toString(16)} overlap left at ${x},${y}`);
          if ((before[k] !== 0) === (after[k] !== 0)) continue;
          // Fill changed: only acceptable within rounding distance of an edge.
          let d = Infinity;
          for (const e of emShape(font, gid).contours.flat()) {
            e.signedDistance(x, y, sd);
            d = Math.min(d, Math.abs(sd.distance));
          }
          if (d > 1e-4) errors.push(`U+${cp.toString(16)} fill changed at ${x},${y}`);
        }
      }
      expect(errors).toEqual([]);
      // Roboto and Noto Sans (variable fonts) overlap; PT Serif never does, so
      // all its glyphs must come back untouched.
      expect(resolved > 0).toBe(file !== "PTSerif-Regular.ttf");
    });
  }
});

describe("clipShape", () => {
  it("keeps exactly the fill inside the clip, clip groups unioned whatever their orientation", () => {
    // Overlapping subject contours (merged too), clipped by a clockwise circle
    // and a counter-clockwise square that overlap: under one nonzero fill they
    // would cancel out where they overlap.
    const subject: Shape = {
      contours: [polygon(0, 0, 0.6, 0, 0.6, 0.6, 0, 0.6), circle(0.6, 0.6, 0.35)],
      inverseYAxis: false,
    };
    const clip = [[circle(0.3, 0.3, 0.3, true)], [polygon(0.4, 0.4, 1, 0.4, 1, 1, 0.4, 1)]];
    expect(clipErrors(subject, clip, "squares")).toEqual([]);
  });

  it("leaves a shape inside the clip untouched, and clips one outside it (or by nothing) away", () => {
    const inside: Shape = { contours: [circle(0.5, 0.5, 0.2)], inverseYAxis: false };
    const contours = inside.contours;
    clipShape(inside, [[polygon(0, 0, 1, 0, 1, 1, 0, 1)]]);
    expect(inside.contours).toBe(contours);

    const outside: Shape = { contours: [circle(0.5, 0.5, 0.2)], inverseYAxis: false };
    clipShape(outside, [[polygon(2, 0, 3, 0, 3, 1, 2, 1)]]);
    expect(outside.contours).toEqual([]);

    const none: Shape = { contours: [circle(0.5, 0.5, 0.2)], inverseYAxis: false };
    clipShape(none, []);
    expect(none.contours).toEqual([]);
  });

  for (const file of ["Roboto.ttf", "PTSerif-Regular.ttf"]) {
    it(`clips every glyph to a circle and a square (${file}, printable ASCII + Latin-1)`, () => {
      const buf = readFileSync(resolve(FONTS_DIR, file));
      const font = new Font(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      const errors: string[] = [];
      for (let cp = 0x21; cp <= 0xff; cp++) {
        const gid = font.glyphId(cp);
        // Quadratic glyph edges against cubic and line clip edges.
        const label = `U+${cp.toString(16)}`;
        errors.push(...clipErrors(emShape(font, gid), [[circle(0.3, 0.35, 0.3)]], label));
        const square = polygon(0.25, 0.1, 0.65, 0.1, 0.65, 0.5, 0.25, 0.5);
        errors.push(...clipErrors(emShape(font, gid), [[square]], label));
      }
      expect(errors).toEqual([]);
    });
  }
});

describe("subtractShape", () => {
  // Overlapping subject contours; other groups a clockwise circle and a
  // counter-clockwise square that overlap (one nonzero fill would cancel them).
  const subject = (): Shape => ({
    contours: [polygon(0, 0, 0.6, 0, 0.6, 0.6, 0, 0.6), circle(0.6, 0.6, 0.35)],
    inverseYAxis: false,
  });
  const others = [[circle(0.3, 0.3, 0.3, true)], [polygon(0.4, 0.4, 1, 0.4, 1, 1, 0.4, 1)]];

  it("subtract keeps exactly the fill outside every cut group", () => {
    expect(opErrors(subject(), others, "subtract", "subtract")).toEqual([]);
  });

  it("leaves shapes nothing overlaps untouched", () => {
    const s: Shape = { contours: [circle(0.5, 0.5, 0.2)], inverseYAxis: false };
    const contours = s.contours;
    subtractShape(s, [[polygon(2, 0, 3, 0, 3, 1, 2, 1)]]);
    subtractShape(s, []);
    expect(s.contours).toBe(contours);
  });

  for (const file of ["Roboto.ttf", "PTSerif-Regular.ttf"]) {
    it(`subtracts a circle from every glyph (${file})`, () => {
      const buf = readFileSync(resolve(FONTS_DIR, file));
      const font = new Font(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
      const errors: string[] = [];
      for (let cp = 0x21; cp <= 0xff; cp++) {
        const gid = font.glyphId(cp);
        const label = `U+${cp.toString(16)}`;
        errors.push(...opErrors(emShape(font, gid), [[circle(0.3, 0.35, 0.3)]], "subtract", label));
      }
      expect(errors).toEqual([]);
    });
  }
});
