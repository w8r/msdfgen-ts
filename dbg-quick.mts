import { readFileSync } from "fs";
import { resolve } from "path";
import { generateMSDF } from "./src/msdf/generate.js";
import { edgeColoringSimple } from "./src/msdf/edge-coloring.js";
import { distanceSignCorrection, msdfErrorCorrection } from "./src/msdf/error-correction.js";
import { normalizeShape } from "./src/shape/normalize.js";
import { parseShapeDesc } from "./test/utils/shapedesc.js";

const BINARY = resolve("tools/msdfgen-ref/build/msdfgen");
const fixDir = process.argv[2] ?? "test/golden/roboto/U0440_32px";
const meta = JSON.parse(readFileSync(`${fixDir}/meta.json`, "utf8")) as any;
const shapeText = readFileSync(`${fixDir}/shape.txt`, "utf8");
const { width: w, height: h, scale, tx, ty, pxrange } = meta;

const shape = parseShapeDesc(shapeText);
normalizeShape(shape);
edgeColoringSimple(shape, 3.0, 0n);
const out = new Float32Array(w * h * 3);
generateMSDF(shape, w, h, scale, tx, ty, pxrange, out);
const rawOut = new Float32Array(out);
distanceSignCorrection(out, shape, w, h, scale, tx, ty);
msdfErrorCorrection(out, shape, w, h, scale, tx, ty, pxrange);

// Read reference
const refBuf = readFileSync(`${fixDir}/bitmap.fl32`);
const refData = new Float32Array(refBuf.buffer.slice(refBuf.byteOffset + 16));

// Find worst pixel
let maxDiff = 0, wx = 0, wy = 0, wch = 0;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let ch = 0; ch < 3; ch++) {
  const i = (y*w+x)*3+ch;
  const d = Math.abs(refData[i]! - out[i]!);
  if (d > maxDiff) { maxDiff = d; wx = x; wy = y; wch = ch; }
}
console.log(`maxAbsDiff=${maxDiff} worst=(${wx},${wy}) ch${wch}`);

// Print region around worst pixel showing ref vs raw vs final
console.log(`\nRegion around (${wx},${wy}) — showing ch${wch}: ref | raw | final (diff)`);
for (let y = Math.max(0,wy-2); y <= Math.min(h-1,wy+2); y++) {
  let line = `y=${y}: `;
  for (let x = Math.max(0,wx-2); x <= Math.min(w-1,wx+2); x++) {
    const i = (y*w+x)*3+wch;
    const d = Math.abs(refData[i]! - out[i]!);
    const marker = (x===wx && y===wy) ? '*' : ' ';
    line += `${marker}(${x},${y}):${refData[i]!.toFixed(3)}|${rawOut[i]!.toFixed(3)}|${out[i]!.toFixed(3)}[d=${d.toFixed(3)}] `;
  }
  console.log(line);
}

// All pixels with diff > 0.01
console.log('\nAll pixels with diff > 0.01:');
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let ch = 0; ch < 3; ch++) {
  const i = (y*w+x)*3+ch;
  const d = Math.abs(refData[i]! - out[i]!);
  if (d > 0.01) console.log(`  (${x},${y}) ch${ch}: ref=${refData[i]!.toFixed(4)} raw=${rawOut[i]!.toFixed(4)} final=${out[i]!.toFixed(4)} diff=${d.toFixed(4)}`);
}
