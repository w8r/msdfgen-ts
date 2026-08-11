import { readFileSync } from 'fs';
import { generateMSDF } from './src/msdf/generate.ts';
import { distanceSignCorrection, msdfErrorCorrection } from './src/msdf/error-correction.ts';
import { parseShapeDesc } from './test/utils/shapedesc.ts';
import { edgeColoringSimple } from './src/msdf/edge-coloring.ts';

const meta = JSON.parse(readFileSync('test/golden/notosans/U0066_48px/meta.json', 'utf8'));
const shapeText = readFileSync('test/golden/notosans/U0066_48px/shape.txt', 'utf8');
const { shape, colorsSpecified } = parseShapeDesc(shapeText);
if (!colorsSpecified) edgeColoringSimple(shape, 3.0, 0n);

const { width, height, scale, pxrange } = meta;
const tx6 = parseFloat(meta.tx.toFixed(6));
const ty6 = parseFloat(meta.ty.toFixed(6));

const out = new Float32Array(width * height * 3);
generateMSDF(shape, width, height, scale, tx6, ty6, pxrange, out);
distanceSignCorrection(out, shape, width, height, scale, tx6, ty6);
msdfErrorCorrection(out, shape, width, height, scale, tx6, ty6, pxrange);

// Read golden
const buf = readFileSync('test/golden/notosans/U0066_48px/bitmap.fl32');
const gold = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);

// Find worst pixel
let maxDiff = 0;
let wx = 0, wy = 0, wch = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    for (let ch = 0; ch < 3; ch++) {
      const idx = (y * width + x) * 3 + ch;
      const diff = Math.abs(out[idx]! - gold[idx]!);
      if (diff > maxDiff) { maxDiff = diff; wx = x; wy = y; wch = ch; }
    }
  }
}
console.log(`Worst: (${wx},${wy}) ch${wch} diff=${maxDiff.toFixed(6)}`);
console.log(`  TS   R=${out[(wy*width+wx)*3]!.toFixed(6)} G=${out[(wy*width+wx)*3+1]!.toFixed(6)} B=${out[(wy*width+wx)*3+2]!.toFixed(6)}`);
console.log(`  Gold R=${gold[(wy*width+wx)*3]!.toFixed(6)} G=${gold[(wy*width+wx)*3+1]!.toFixed(6)} B=${gold[(wy*width+wx)*3+2]!.toFixed(6)}`);

// Count errors > 0.01
let errCount = 0;
for (let i = 0; i < out.length; i++) if (Math.abs(out[i]! - gold[i]!) > 0.01) errCount++;
console.log(`Pixels with diff>0.01: ${errCount} out of ${out.length}`);
