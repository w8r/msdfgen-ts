/**
 * unionShape (src/shape/union.ts): overlapping contours become the boundary
 * of their nonzero fill. The fill itself must not change, no point may stay
 * covered twice, and shapes without overlaps must be left untouched.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";
import { Font } from "../../src/font/font";
import { emNormalizeShape } from "../../src/shape/normalize";
import { unionShape } from "../../src/shape/union";
import { Scanline, computeShapeScanline } from "../../src/shape/scanline";
import { type SignedDistanceResult } from "../../src/shape/segments";
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

describe("unionShape", () => {
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
