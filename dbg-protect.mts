import { readFileSync } from "fs";
import { resolve } from "path";
import { generateMSDF } from "./src/msdf/generate.js";
import { edgeColoringSimple } from "./src/msdf/edge-coloring.js";
import { distanceSignCorrection } from "./src/msdf/error-correction.js";
import { normalizeShape } from "./src/shape/normalize.js";
import { parseShapeDesc } from "./test/utils/shapedesc.js";
import type { Shape } from "./src/shape/shape.js";

const dir = process.argv[2] ?? "test/golden/notosans/U0444_32px";
const meta = JSON.parse(readFileSync(`${dir}/meta.json`, "utf8")) as any;
const shapeText = readFileSync(`${dir}/shape.txt`, "utf8");
const { width: w, height: h, scale, tx, ty, pxrange } = meta;
const shape = parseShapeDesc(shapeText);
normalizeShape(shape);
edgeColoringSimple(shape, 3.0, 0n);

// Manually run protectCorners
const stencil = new Uint8Array(w * h);
const PROTECTED = 2;
const _ept = [0, 0];
let cornersFound = 0;
for (const contour of (shape as any).contours) {
  if (contour.length === 0) continue;
  let prevEdge = contour[contour.length - 1];
  for (const edge of contour) {
    const common = prevEdge.color & edge.color;
    if (!(common & (common - 1))) {
      cornersFound++;
      edge.point(0, _ept);
      const pxf = scale * (_ept[0] + tx);
      const pyf = scale * (_ept[1] + ty);
      const l = Math.floor(pxf - 0.5) | 0;
      const b = Math.floor(pyf - 0.5) | 0;
      const r = l + 1,
        t = b + 1;
      console.log(
        `corner at shape(${_ept[0].toFixed(3)},${_ept[1].toFixed(3)}) pixel(${pxf.toFixed(2)},${pyf.toFixed(2)}) → protecting l=${l},b=${b},r=${r},t=${t}`,
      );
      if (l < w && b < h && r >= 0 && t >= 0) {
        if (l >= 0 && b >= 0) stencil[b * w + l] |= PROTECTED;
        if (r < w && b >= 0) stencil[b * w + r] |= PROTECTED;
        if (l >= 0 && t < h) stencil[t * w + l] |= PROTECTED;
        if (r < w && t < h) stencil[t * w + r] |= PROTECTED;
      }
    }
    prevEdge = edge;
  }
}
console.log(`Total corners: ${cornersFound}`);
// Check if (13,10) and (14,10) are protected:
console.log(`(13,10) protected: ${(stencil[10 * w + 13] & PROTECTED) !== 0}`);
console.log(`(14,10) protected: ${(stencil[10 * w + 14] & PROTECTED) !== 0}`);
