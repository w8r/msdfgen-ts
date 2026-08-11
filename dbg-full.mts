import { readFileSync } from "fs";
import { execFileSync } from "child_process";
import { generateMSDF } from "./src/msdf/generate.js";
import { distanceSignCorrection, msdfErrorCorrection } from "./src/msdf/error-correction.js";
import { edgeColoringSimple } from "./src/msdf/edge-coloring.js";
import { normalizeShape } from "./src/shape/normalize.js";
import { parseShapeDesc } from "./test/utils/shapedesc.js";

const dir = process.argv[2] ?? "test/golden/ptserif/U0433_48px";
const tx2 = parseInt(process.argv[3] ?? "17");
const ty2 = parseInt(process.argv[4] ?? "14");

const meta = JSON.parse(readFileSync(`${dir}/meta.json`, "utf8")) as any;
const shapeText = readFileSync(`${dir}/shape.txt`, "utf8");
const { width: w, height: h, scale, tx: txRaw, ty: tyRaw, pxrange } = meta;
const tx = parseFloat(txRaw.toFixed(6));
const ty = parseFloat(tyRaw.toFixed(6));
const shape = parseShapeDesc(shapeText);
normalizeShape(shape);
edgeColoringSimple(shape, 3.0, 0n);

// Full TS pipeline
const out = new Float32Array(w * h * 3);
generateMSDF(shape, w, h, scale, tx, ty, pxrange, out);
const rawOut = new Float32Array(out);
distanceSignCorrection(out, shape, w, h, scale, tx, ty);
const postSign = new Float32Array(out);
msdfErrorCorrection(out, shape, w, h, scale, tx, ty, pxrange);

// Full C++ pipeline
execFileSync(
  "./tools/msdfgen-ref/build/msdfgen",
  [
    "msdf",
    "-shapedesc",
    `${dir}/shape.txt`,
    "-o",
    "/tmp/dbg_full.fl32",
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
  ],
  { stdio: ["pipe", "pipe", "pipe"] },
);
const refBuf = readFileSync("/tmp/dbg_full.fl32");
const ref = new Float32Array(refBuf.buffer, refBuf.byteOffset + 16);

const i = (ty2 * w + tx2) * 3;
console.log(`At (${tx2},${ty2}):`);
console.log(
  `  raw:      ch0=${rawOut[i]!.toFixed(6)} ch1=${rawOut[i + 1]!.toFixed(6)} ch2=${rawOut[i + 2]!.toFixed(6)}`,
);
console.log(
  `  postSign: ch0=${postSign[i]!.toFixed(6)} ch1=${postSign[i + 1]!.toFixed(6)} ch2=${postSign[i + 2]!.toFixed(6)}`,
);
console.log(
  `  full TS:  ch0=${out[i]!.toFixed(6)} ch1=${out[i + 1]!.toFixed(6)} ch2=${out[i + 2]!.toFixed(6)}`,
);
console.log(
  `  full C++: ch0=${ref[i]!.toFixed(6)} ch1=${ref[i + 1]!.toFixed(6)} ch2=${ref[i + 2]!.toFixed(6)}`,
);
console.log(
  `  diff:     ch0=${Math.abs(out[i]! - ref[i]!).toFixed(6)} ch1=${Math.abs(out[i + 1]! - ref[i + 1]!).toFixed(6)} ch2=${Math.abs(out[i + 2]! - ref[i + 2]!).toFixed(6)}`,
);
