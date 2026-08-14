import { readFileSync } from "fs";
import { Font } from "./src/font/font.js";
import { emNormalizeShape, normalizeShape } from "./src/shape/normalize.js";
import { LINEAR, QUADRATIC, CUBIC } from "./src/shape/segments.js";

const buf = readFileSync("test/fonts/NotoSans.ttf");
const font = new Font(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer);
const gid = font.glyphId(0x41);
const shape = font.shape(gid);
console.log("raw unitsPerEm=", font.unitsPerEm);
console.log("raw p0=", shape.contours[0]?.[0]?.p0x, shape.contours[0]?.[0]?.p0y);
emNormalizeShape(shape, font.unitsPerEm);
console.log("after em p0=", shape.contours[0]?.[0]?.p0x, shape.contours[0]?.[0]?.p0y);
normalizeShape(shape);
for (let ci = 0; ci < shape.contours.length; ci++) {
  const c = shape.contours[ci]!;
  console.log(`contour ${ci}: len=${c.length}`);
  for (let i = 0; i < c.length; i++) {
    const e = c[i]!;
    const t = e.type === LINEAR ? "LIN" : e.type === QUADRATIC ? "QUAD" : "CUB";
    console.log(`  [${i}] ${t} (${e.p0x.toFixed(4)},${e.p0y.toFixed(4)}) → (${e.endX().toFixed(4)},${e.endY().toFixed(4)})`);
  }
}
