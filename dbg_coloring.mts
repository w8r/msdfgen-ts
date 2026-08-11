import { readFileSync } from 'fs';
import { parseShapeDesc } from './test/utils/shapedesc.js';
import { normalizeShape } from './src/shape/normalize.js';
import { edgeColoringSimple } from './src/msdf/edge-coloring.js';

const shapeText = readFileSync('./test/golden/roboto/U0434_32px/shape.txt', 'utf8');
const { shape } = parseShapeDesc(shapeText);
const savedColors = shape.contours.map(c => c.map(e => e.color));

normalizeShape(shape);
edgeColoringSimple(shape, 3.0, 0n);

for (let ci = 0; ci < shape.contours.length; ci++) {
    console.log(`contour ${ci}:`);
    for (let ei = 0; ei < shape.contours[ci]!.length; ei++) {
        const orig = savedColors[ci]![ei];
        const recolored = shape.contours[ci]![ei]!.color;
        const match = orig === recolored ? 'OK' : `DIFF (orig=${orig})`;
        console.log(`  e${ei}: recolored=${recolored} ${match}`);
    }
}
