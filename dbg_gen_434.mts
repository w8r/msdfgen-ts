import { readFileSync } from 'fs';
import { generateMSDF } from './src/msdf/generate.ts';
import { parseShapeDesc } from './test/utils/shapedesc.ts';
import { edgeColoringSimple } from './src/msdf/edge-coloring.ts';

const shapeText = readFileSync('test/golden/roboto/U0434_32px/shape.txt', 'utf8');
const meta = JSON.parse(readFileSync('test/golden/roboto/U0434_32px/meta.json', 'utf8'));
const { shape, colorsSpecified } = parseShapeDesc(shapeText);
if (!colorsSpecified) edgeColoringSimple(shape, 3.0, 0n);

const width = meta.width as number;
const height = meta.height as number;
const tx6 = parseFloat(meta.tx.toFixed(6));
const ty6 = parseFloat(meta.ty.toFixed(6));
const out = new Float32Array(width * height * 3);
console.log('Running generateMSDF for U0434_32px...');
generateMSDF(shape, width, height, meta.scale, tx6, ty6, meta.pxrange, out);
const px = 9, py = 22;
const G = out[(py * width + px) * 3 + 1]!;
console.log(`Final G at (9,22) = ${G.toFixed(8)} (expected ~0.649478, got ~0.755857 if bug active)`);
