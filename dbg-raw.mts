import { readFileSync } from "fs";
import { execFileSync } from "child_process";
import { generateMSDF } from "./src/msdf/generate.js";
import { edgeColoringSimple } from "./src/msdf/edge-coloring.js";
import { normalizeShape } from "./src/shape/normalize.js";
import { parseShapeDesc } from "./test/utils/shapedesc.js";

const dir = process.argv[2] ?? "test/golden/ptserif/U0031_32px";
const tx2 = parseInt(process.argv[3] ?? "11");
const ty2 = parseInt(process.argv[4] ?? "27");

const meta = JSON.parse(readFileSync(`${dir}/meta.json`, "utf8")) as any;
const shapeText = readFileSync(`${dir}/shape.txt`, "utf8");
const { width: w, height: h, scale, tx: txRaw, ty: tyRaw, pxrange } = meta;
const tx = parseFloat(txRaw.toFixed(6));
const ty = parseFloat(tyRaw.toFixed(6));
const shape = parseShapeDesc(shapeText);
normalizeShape(shape);
edgeColoringSimple(shape, 3.0, 0n);

const out = new Float32Array(w * h * 3);
generateMSDF(shape, w, h, scale, tx, ty, pxrange, out);

// Run C++ without scanline (no sign correction, no error correction)
execFileSync("./tools/msdfgen-ref/build/msdfgen", [
  "msdf", "-shapedesc", `${dir}/shape.txt`,
  "-o", "/tmp/pt_nosc.fl32", "-format", "fl32",
  "-dimensions", String(w), String(h),
  "-pxrange", String(pxrange), "-scale", String(scale),
  "-translate", tx.toFixed(6), ty.toFixed(6)
  // No -scanline: raw MSDF, no sign correction or error correction
], { stdio: ["pipe", "pipe", "pipe"] });
const refBuf = readFileSync("/tmp/pt_nosc.fl32");
const ref = new Float32Array(refBuf.buffer, refBuf.byteOffset + 16);

const i = (ty2 * w + tx2) * 3;
console.log(`RAW generateMSDF at (${tx2},${ty2}):`);
console.log(`  TS  ch0=${out[i]!.toFixed(6)} ch1=${out[i+1]!.toFixed(6)} ch2=${out[i+2]!.toFixed(6)}`);
console.log(`  C++ ch0=${ref[i]!.toFixed(6)} ch1=${ref[i+1]!.toFixed(6)} ch2=${ref[i+2]!.toFixed(6)}`);
console.log(`  diff: ch0=${Math.abs(out[i]!-ref[i]!).toFixed(6)} ch1=${Math.abs(out[i+1]!-ref[i+1]!).toFixed(6)} ch2=${Math.abs(out[i+2]!-ref[i+2]!).toFixed(6)}`);

// Find worst difference in whole bitmap
let maxD = 0, mx = 0, my = 0, mc = 0;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) {
  const j = (y * w + x) * 3 + c;
  const d = Math.abs(out[j]! - ref[j]!);
  if (d > maxD) { maxD = d; mx = x; my = y; mc = c; }
}
console.log(`\nMax diff in raw MSDF: ${maxD.toFixed(6)} at (${mx},${my}) ch${mc}`);
const wi = (my * w + mx) * 3;
console.log(`  TS  (${mx},${my}): ${out[wi]!.toFixed(6)} ${out[wi+1]!.toFixed(6)} ${out[wi+2]!.toFixed(6)}`);
console.log(`  C++ (${mx},${my}): ${ref[wi]!.toFixed(6)} ${ref[wi+1]!.toFixed(6)} ${ref[wi+2]!.toFixed(6)}`);
