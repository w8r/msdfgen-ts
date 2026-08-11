// Quick debug: add debug prints to generate.ts temporarily via monkey-patching
import { readFileSync } from 'fs';
import { parseShapeDesc } from './test/utils/shapedesc.js';
import { normalizeShape } from './src/shape/normalize.js';
import { edgeColoringSimple } from './src/msdf/edge-coloring.js';

const shapeText = readFileSync('./test/golden/roboto/U0434_32px/shape.txt', 'utf8');
const { shape, colorsSpecified } = parseShapeDesc(shapeText);
normalizeShape(shape);
if (!colorsSpecified) edgeColoringSimple(shape, 3.0, 0n);

const meta = JSON.parse(readFileSync('./test/golden/roboto/U0434_32px/meta.json', 'utf8'));
const { scale, tx, ty } = meta;
const tx6 = parseFloat(tx.toFixed(6));
const ty6 = parseFloat(ty.toFixed(6));

// Compute exact pixel coords
const x = 9, y = 22;
const px = (x + 0.5) / scale - tx6;
const py = (y + 0.5) / scale - ty6;
console.log(`px=${px.toFixed(10)} py=${py.toFixed(10)}`);

// Now manually compute signed distances for each edge of contour 1
const contour1 = shape.contours[1]!;
for (let ei = 0; ei < contour1.length; ei++) {
    const edge = contour1[ei]!;
    const result = { distance: 0, dot: 0, param: 0 };
    // Use the EdgeSegment signedDistance - need to import it
    // Let's just compute manually for the edges we know are LINEAR
    const p0x = edge.p0x, p0y = edge.p0y;
    const p1x = edge.type === 0 ? edge.p1x : edge.p2x; // LINEAR uses p1
    const p1y = edge.type === 0 ? edge.p1y : edge.p2y;
    const aqx = px - p0x, aqy = py - p0y;
    const abx = p1x - p0x, aby = p1y - p0y;
    const abLen2 = abx*abx + aby*aby;
    const param = (aqx*abx + aqy*aby) / abLen2;
    const orthoOrDist = param > 0 && param < 1 
        ? (aqx * aby - aqy * abx) / Math.sqrt(abLen2)
        : null;
    const useEnd = param > 0.5;
    const ex = (useEnd ? p1x : p0x) - px;
    const ey = (useEnd ? p1y : p0y) - py;
    const endDist = Math.sqrt(ex*ex + ey*ey);
    const cross = aqx * aby - aqy * abx;
    const signed = orthoOrDist !== null && Math.abs(orthoOrDist) < endDist 
        ? orthoOrDist 
        : (cross >= 0 ? 1 : -1) * endDist;
    console.log(`  e${ei}: type=${edge.type} color=${edge.color} param=${param.toFixed(4)} signedDist=${signed.toFixed(8)}`);
}
