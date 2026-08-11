import { readFileSync } from "fs";
import { execFileSync } from "child_process";
import { resolve } from "path";
import { generateMSDF } from "./src/msdf/generate.js";
import { edgeColoringSimple } from "./src/msdf/edge-coloring.js";
import { distanceSignCorrection, msdfErrorCorrection } from "./src/msdf/error-correction.js";
import { normalizeShape } from "./src/shape/normalize.js";
import { parseShapeDesc } from "./test/utils/shapedesc.js";

const BINARY = resolve("tools/msdfgen-ref/build/msdfgen");
const fixDir = process.argv[2] ?? "test/golden/roboto/U0038_32px";
const meta = JSON.parse(readFileSync(`${fixDir}/meta.json`, "utf8")) as any;
const shapeText = readFileSync(`${fixDir}/shape.txt`, "utf8");
const { width: w, height: h, scale, tx, ty, pxrange } = meta;

// Run reference
const tmpOut = "/tmp/msdf-ref.fl32";
execFileSync(BINARY, [
  "msdf",
  "-shapedesc",
  `${fixDir}/shape.txt`,
  "-o",
  tmpOut,
  "-format",
  "fl32",
  "-dimensions",
  String(w),
  String(h),
  "-pxrange",
  String(pxrange),
  "-scale",
  String(scale),
  "-translate",
  tx.toFixed(6),
  ty.toFixed(6),
  "-scanline",
]);

const refBuf = readFileSync(tmpOut);
const refData = new Float32Array(
  refBuf.buffer.slice(refBuf.byteOffset + 16, refBuf.byteOffset + refBuf.byteLength),
);

const shape = parseShapeDesc(shapeText);
normalizeShape(shape);
edgeColoringSimple(shape, 3.0, 0n);
const out = new Float32Array(w * h * 3);
generateMSDF(shape, w, h, scale, tx, ty, pxrange, out);

// Scan for Infinity after generate
function scanInf(label: string, arr: Float32Array) {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      for (let ch = 0; ch < 3; ch++) {
        if (!isFinite(arr[(y * w + x) * 3 + ch]!)) {
          console.log(`[${label}] Infinity at (${x},${y}) ch${ch} = ${arr[(y * w + x) * 3 + ch]}`);
        }
      }
}
scanInf("PostGenerate", out);
distanceSignCorrection(out, shape, w, h, scale, tx, ty);
scanInf("PostSignCorrect", out);
msdfErrorCorrection(out, shape, w, h, scale, tx, ty, pxrange);
scanInf("PostErrCorrect", out);

let maxDiff = 0,
  worstX = 0,
  worstY = 0,
  worstCh = 0;
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++)
    for (let ch = 0; ch < 3; ch++) {
      const i = (y * w + x) * 3 + ch;
      const diff = Math.abs(refData[i]! - out[i]!);
      if (diff > maxDiff) {
        maxDiff = diff;
        worstX = x;
        worstY = y;
        worstCh = ch;
      }
    }

console.log(`maxAbsDiff=${maxDiff.toFixed(6)} worst=(${worstX},${worstY}) ch${worstCh}`);
console.log(
  `ref=${refData[(worstY * w + worstX) * 3 + worstCh]}, ours=${out[(worstY * w + worstX) * 3 + worstCh]}`,
);

// Print region
const wx = worstX,
  wy = worstY;
for (const [label, arr] of [
  ["REF", refData],
  ["OURS", out],
] as [string, Float32Array][]) {
  console.log(`\n${label} around (${wx},${wy}):`);
  for (let y = Math.max(0, wy - 2); y <= Math.min(h - 1, wy + 2); y++) {
    let row = `y=${y}: `;
    for (let x = Math.max(0, wx - 2); x <= Math.min(w - 1, wx + 2); x++) {
      const b = (y * w + x) * 3;
      row += `(${arr[b]!.toFixed(3)},${arr[b + 1]!.toFixed(3)},${arr[b + 2]!.toFixed(3)}) `;
    }
    console.log(row);
  }
}
