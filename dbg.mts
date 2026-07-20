import { readFileSync } from "fs";
import { Font } from "./src/font/font.js";
const buf = readFileSync("test/fonts/PTSerif-Regular.ttf");
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
const f = new Font(ab);
console.log("unitsPerEm", f.metrics.unitsPerEm);
const gid = f.glyphId(0x77);
const shape = f.shape(gid);
const c0 = shape.contours[0]!;
for (let i = 0; i < Math.min(c0.length, 4); i++) {
  const s = c0[i]!;
  console.log(`edge ${i} type=${s.type}`, s.p0x, s.p0y, "|", s.p1x, s.p1y, "|", s.p2x, s.p2y);
}
const s = c0[1]!;
const inv = 1 / f.metrics.unitsPerEm;
const p0x = s.p0x * inv,
  p0y = s.p0y * inv,
  p1x = s.p1x * inv,
  p1y = s.p1y * inv,
  p2x = s.p2x * inv,
  p2y = s.p2y * inv;
const d01x = p1x - p0x,
  d01y = p1y - p0y,
  d12x = p2x - p1x,
  d12y = p2y - p1y;
const cross = d01x * d12y - d01y * d12x;
console.log("em cross =", cross);
console.log("raw pts", s.p0x, s.p0y, s.p1x, s.p1y, s.p2x, s.p2y);
console.log("raw d01", s.p1x - s.p0x, s.p1y - s.p0y, "d12", s.p2x - s.p1x, s.p2y - s.p1y);
console.log("raw cross =", (s.p1x - s.p0x) * (s.p2y - s.p1y) - (s.p1y - s.p0y) * (s.p2x - s.p1x));
