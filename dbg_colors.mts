import { readFileSync } from 'fs';
import { parseShapeDesc } from './test/utils/shapedesc.js';

const shapeText = readFileSync('./test/golden/roboto/U0434_32px/shape.txt', 'utf8');
const { shape, colorsSpecified } = parseShapeDesc(shapeText);
console.log('colorsSpecified:', colorsSpecified);
console.log('contour 1 edge colors:');
for (let i = 0; i < shape.contours[1]!.length; i++) {
    console.log(`  e${i}: color=${shape.contours[1]![i]!.color}`);
}
