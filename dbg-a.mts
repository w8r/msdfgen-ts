import { readFileSync } from "fs";
import { Font } from "./src/font/font.js";
import { emNormalizeShape, normalizeShape } from "./src/shape/normalize.js";
import { resolveOverlaps } from "./src/shape/resolve-overlaps.js";

const buf = readFileSync("test/fonts/NotoSans.ttf");
const font = new Font(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer);
const gid = font.glyphId(0x41);
const shape = font.shape(gid);
emNormalizeShape(shape, font.metrics.unitsPerEm);
normalizeShape(shape);
console.log("BEFORE contours:", shape.contours.length, "edges:", shape.contours.map(c => c.length).join(","));
for (const c of shape.contours) {
  let a = 0;
  for (const e of c) a += (e.p0x * e.endY() - e.endX() * e.p0y);
  console.log("  area~", (a / 2).toFixed(4));
}
resolveOverlaps(shape);
console.log("AFTER contours:", shape.contours.length, "edges:", shape.contours.map(c => c.length).join(","));
for (const c of shape.contours) {
  let a = 0;
  for (const e of c) a += (e.p0x * e.endY() - e.endX() * e.p0y);
  console.log("  area~", (a / 2).toFixed(4));
}
