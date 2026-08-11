import { readFileSync } from "fs";
import { execFileSync } from "child_process";
import { generateMSDF } from "./src/msdf/generate.js";
import { edgeColoringSimple } from "./src/msdf/edge-coloring.js";
import { distanceSignCorrection, msdfErrorCorrection } from "./src/msdf/error-correction.js";
import { normalizeShape } from "./src/shape/normalize.js";
import { parseShapeDesc } from "./test/utils/shapedesc.js";

const BINARY = "tools/msdfgen-ref/build/msdfgen";
const fixDir = process.argv[2] ?? "test/golden/roboto/U0062_32px";
const meta = JSON.parse(readFileSync(`${fixDir}/meta.json`, "utf8")) as any;
const shapeText = readFileSync(`${fixDir}/shape.txt`, "utf8");
const { width: w, height: h, scale, tx, ty, pxrange } = meta;

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
const postGenerate = new Float32Array(out); // snapshot

distanceSignCorrection(out, shape, w, h, scale, tx, ty);
const postSign = new Float32Array(out); // snapshot

msdfErrorCorrection(out, shape, w, h, scale, tx, ty, pxrange);

// Find worst pixel
let maxDiff = 0,
  wx = 0,
  wy = 0,
  wch = 0;
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++)
    for (let ch = 0; ch < 3; ch++) {
      const i = (y * w + x) * 3 + ch;
      const diff = Math.abs(refData[i]! - out[i]!);
      if (diff > maxDiff) {
        maxDiff = diff;
        wx = x;
        wy = y;
        wch = ch;
      }
    }

console.log(`worst=(${wx},${wy}) ch${wch} diff=${maxDiff.toFixed(6)}`);
console.log(
  `ref=${refData[(wy * w + wx) * 3 + wch]}, final=${out[(wy * w + wx) * 3 + wch]}, preCorr=${postSign[(wy * w + wx) * 3 + wch]}, postGen=${postGenerate[(wy * w + wx) * 3 + wch]}`,
);

// Print 5x5 region for each stage
const print5x5 = (label: string, arr: Float32Array) => {
  console.log(`\n${label}:`);
  for (let y = Math.max(0, wy - 2); y <= Math.min(h - 1, wy + 2); y++) {
    let row = `y=${y}: `;
    for (let x = Math.max(0, wx - 2); x <= Math.min(w - 1, wx + 2); x++) {
      const b = (y * w + x) * 3;
      row += `(${arr[b]!.toFixed(3)},${arr[b + 1]!.toFixed(3)},${arr[b + 2]!.toFixed(3)}) `;
    }
    console.log(row);
  }
};

print5x5("REF", refData);
print5x5("PostGenerate", postGenerate);
print5x5("PostSignCorrect", postSign);
print5x5("PostErrCorrect", out);
