import { readFileSync } from "fs";
import { generateMSDF } from "./src/msdf/generate.js";
import { edgeColoringSimple } from "./src/msdf/edge-coloring.js";
import { distanceSignCorrection } from "./src/msdf/error-correction.js";
import { normalizeShape } from "./src/shape/normalize.js";
import { parseShapeDesc } from "./test/utils/shapedesc.js";

const dir = process.argv[2] ?? "test/golden/notosans/U0444_32px";
const targetX = parseInt(process.argv[3] ?? "13");
const targetY = parseInt(process.argv[4] ?? "10");

const meta = JSON.parse(readFileSync(`${dir}/meta.json`, "utf8")) as any;
const shapeText = readFileSync(`${dir}/shape.txt`, "utf8");
const { width: w, height: h, scale, tx, ty, pxrange } = meta;
const shape = parseShapeDesc(shapeText);
normalizeShape(shape);
edgeColoringSimple(shape, 3.0, 0n);
const msdf = new Float32Array(w * h * 3);
generateMSDF(shape, w, h, scale, tx, ty, pxrange, msdf);
distanceSignCorrection(msdf, shape, w, h, scale, tx, ty);

// Print neighborhood values (post sign correction)
console.log("Post sign-correction neighborhood:");
for (let dy = -1; dy <= 1; dy++) {
  for (let dx = -1; dx <= 1; dx++) {
    const x = targetX + dx,
      y = targetY + dy;
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const i = (y * w + x) * 3;
    console.log(
      `  (${x},${y}): ch0=${msdf[i]?.toFixed(4)} ch1=${msdf[i + 1]?.toFixed(4)} ch2=${msdf[i + 2]?.toFixed(4)}`,
    );
  }
}

// Manually run findErrors for (targetX, targetY) with debug
const PROTECTED = 2;
const ARTIFACT_T_EPSILON = 0.01;
const DEFAULT_MIN_DEVIATION_RATIO = 1.11111111111111111;
const hSpan = DEFAULT_MIN_DEVIATION_RATIO / pxrange;
const dSpan = (DEFAULT_MIN_DEVIATION_RATIO * Math.SQRT2) / pxrange;

function median3(a: number, b: number, c: number): number {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
}

function rangeTest(
  at: number,
  bt: number,
  xt: number,
  am: number,
  bm: number,
  xm: number,
  span: number,
  prot: boolean,
): number {
  const FLAG_CANDIDATE = 0x01,
    FLAG_ARTIFACT = 0x02;
  if (
    (am > 0.5 && bm > 0.5 && xm <= 0.5) ||
    (am < 0.5 && bm < 0.5 && xm >= 0.5) ||
    (!prot && median3(am, bm, xm) !== xm)
  ) {
    const axSpan = (xt - at) * span;
    const bxSpan = (bt - xt) * span;
    if (!(xm >= am - axSpan && xm <= am + axSpan && xm >= bm - bxSpan && xm <= bm + bxSpan)) {
      return FLAG_CANDIDATE | FLAG_ARTIFACT;
    }
    return FLAG_CANDIDATE;
  }
  return 0;
}

const idx = targetY * w + targetX;
const cBase = idx * 3;
const cm = median3(msdf[cBase]!, msdf[cBase + 1]!, msdf[cBase + 2]!);

console.log(`\n(${targetX},${targetY}): cm=${cm.toFixed(4)}, prot=false`);

// Check all 4 diagonal neighbors
const diags = [
  { name: "LB", bOff: -1, cOff: -w, dOff: -w - 1 },
  { name: "RB", bOff: 1, cOff: -w, dOff: -w + 1 },
  { name: "LT", bOff: -1, cOff: w, dOff: w - 1 },
  { name: "RT", bOff: 1, cOff: w, dOff: w + 1 },
];

for (const { name, bOff, cOff, dOff } of diags) {
  const bIdx = idx + bOff;
  const cIdx = idx + cOff;
  const dIdx = idx + dOff;
  const bBase = bIdx * 3,
    ccBase = cIdx * 3,
    dBase = dIdx * 3;
  const dm = median3(msdf[dBase]!, msdf[dBase + 1]!, msdf[dBase + 2]!);

  const abc = [
    msdf[cBase]! - msdf[bBase]! - msdf[ccBase]!,
    msdf[cBase + 1]! - msdf[bBase + 1]! - msdf[ccBase + 1]!,
    msdf[cBase + 2]! - msdf[bBase + 2]! - msdf[ccBase + 2]!,
  ];
  const l = [-msdf[cBase]! - abc[0]!, -msdf[cBase + 1]! - abc[1]!, -msdf[cBase + 2]! - abc[2]!];
  const q = [msdf[dBase]! + abc[0]!, msdf[dBase + 1]! + abc[1]!, msdf[dBase + 2]! + abc[2]!];

  const channelPairs = [
    [0, 1],
    [1, 2],
    [2, 0],
  ] as const;
  for (const [ch0, ch1] of channelPairs) {
    const dA = msdf[cBase + ch0]! - msdf[cBase + ch1]!;
    const dBC = msdf[bBase + ch0]! - msdf[bBase + ch1]! + msdf[ccBase + ch0]! - msdf[ccBase + ch1]!;
    const dD = msdf[dBase + ch0]! - msdf[dBase + ch1]!;
    const qc = dD - dBC + dA,
      lc = dBC - dA - dA,
      ac = dA;

    let sols: number[] = [];
    if (Math.abs(qc) < 1e-15) {
      if (Math.abs(lc) > 0) sols.push(-ac / lc);
    } else {
      const disc = lc * lc - 4 * qc * ac;
      if (disc >= 0) {
        const sq = Math.sqrt(disc);
        sols.push((-lc + sq) / (2 * qc));
        sols.push((-lc - sq) / (2 * qc));
      }
    }

    for (const t of sols) {
      if (!(t > ARTIFACT_T_EPSILON && t < 1 - ARTIFACT_T_EPSILON)) continue;
      const xm = median3(
        t * (t * q[0]! + l[0]!) + msdf[cBase]!,
        t * (t * q[1]! + l[1]!) + msdf[cBase + 1]!,
        t * (t * q[2]! + l[2]!) + msdf[cBase + 2]!,
      );
      const flags = rangeTest(0, 1, t, cm, dm, xm, dSpan, false);
      console.log(
        `  ${name} pair(${ch0},${ch1}): t=${t.toFixed(4)} xm=${xm} am=${cm.toFixed(4)} dm=${dm.toFixed(4)} flags=${flags.toString(2)}`,
      );
    }
  }
}
