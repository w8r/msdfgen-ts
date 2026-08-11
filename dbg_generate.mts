import { readFileSync } from "fs";
import { parseShapeDesc } from "./test/utils/shapedesc.js";
import { normalizeShape } from "./src/shape/normalize.js";
import { edgeColoringSimple } from "./src/msdf/edge-coloring.js";
import { generateMSDF } from "./src/msdf/generate.js";

const shapeText = readFileSync("./test/golden/roboto/U0434_32px/shape.txt", "utf8");
const { shape, colorsSpecified } = parseShapeDesc(shapeText);
normalizeShape(shape);
if (!colorsSpecified) edgeColoringSimple(shape, 3.0, 0n);

// Read meta.json
const meta = JSON.parse(readFileSync("./test/golden/roboto/U0434_32px/meta.json", "utf8"));
const { width, height, scale, tx, ty, pxrange } = meta;
const tx6 = parseFloat(tx.toFixed(6));
const ty6 = parseFloat(ty.toFixed(6));

const out = new Float32Array(width * height * 3);
generateMSDF(shape, width, height, scale, tx6, ty6, pxrange, out);

// Pixel (9, 22) in y-up coords: row 22 from bottom
const x = 9,
  y = 22;
const idx = (y * width + x) * 3;
console.log(
  `TS output at (${x},${y}): R=${out[idx]!.toFixed(6)} G=${out[idx + 1]!.toFixed(6)} B=${out[idx + 2]!.toFixed(6)}`,
);

// Read golden
const goldenBuf = readFileSync("./test/golden/roboto/U0434_32px/msdf.fl32");
const golden = new Float32Array(
  goldenBuf.buffer.slice(goldenBuf.byteOffset, goldenBuf.byteOffset + goldenBuf.byteLength),
);
// Skip 4-byte header to get to data? Actually compare.ts uses fl32FromBuffer
// Let's check the golden structure
console.log(
  "golden buffer length:",
  golden.length,
  "expected:",
  width * height * 3 + 1,
  "(with header)",
);
// The format from compare.ts: first 4 bytes = dimensions
const g_w = golden[0]!;
const g_h = Math.round((golden.length - 1) / (g_w * 3));
console.log(`golden dimensions from data: w=${g_w} h=${g_h}`);
const gIdx = (y * g_w + x) * 3 + 1; // +1 for header
console.log(
  `Golden at (${x},${y}): R=${golden[gIdx]!.toFixed(6)} G=${golden[gIdx + 1]!.toFixed(6)} B=${golden[gIdx + 2]!.toFixed(6)}`,
);
