/**
 * Debug script to trace BLUE channel computation at pixel (11,27) for ptserif '1'.
 */
import { readFileSync } from "fs";
import { edgeColoringSimple, RED, GREEN, BLUE } from "./src/msdf/edge-coloring.js";
import { normalizeShape } from "./src/shape/normalize.js";
import { parseShapeDesc } from "./test/utils/shapedesc.js";
import { type Contour } from "./src/shape/contour.js";

const dir = process.argv[2] ?? "test/golden/ptserif/U0031_32px";
const targetX = parseInt(process.argv[3] ?? "11");
const targetY = parseInt(process.argv[4] ?? "27");
const targetCh = parseInt(process.argv[5] ?? "2"); // BLUE

const meta = JSON.parse(readFileSync(`${dir}/meta.json`, "utf8")) as any;
const shapeText = readFileSync(`${dir}/shape.txt`, "utf8");
const { width: w, height: h, scale, tx, ty, pxrange } = meta;
const shape = parseShapeDesc(shapeText);
normalizeShape(shape);
edgeColoringSimple(shape, 3.0, 0n);

// Print edge colors
const contours = shape.contours;
for (let ci = 0; ci < contours.length; ci++) {
  const c = contours[ci]!;
  console.log(`Contour ${ci} (${c.length} edges):`);
  for (let ei = 0; ei < c.length; ei++) {
    const e = c[ei]!;
    const colorStr = (e.color & RED ? "R" : "-") + (e.color & GREEN ? "G" : "-") + (e.color & BLUE ? "B" : "-");
    console.log(`  edge ${ei}: color=${colorStr}(${e.color}) type=${e.type} p0=(${e.p0x.toFixed(3)},${e.p0y.toFixed(3)})`);
  }
}

// Now compute the signed distance for each edge at pixel (11,27) for BLUE channel
const px = (targetX + 0.5) / scale - tx;
const py = (targetY + 0.5) / scale - ty;
console.log(`\nPixel (${targetX},${targetY}) → shape (${px.toFixed(4)}, ${py.toFixed(4)})`);

const ch = targetCh; // 2 = BLUE
const DBL_MAX = Number.MAX_VALUE;

// Replicate per-edge distance computation
const _sd = { distance: 0, dot: 0, param: 0 };
const _dir = [0, 0];
const _pt = [0, 0];

let cTD = -DBL_MAX, cDot = 0, cNeg = -DBL_MAX, cPos = DBL_MAX, cNEI = -1, cNPar = 0;

const c0 = contours[0]!;
const n = c0.length;
for (let ei = 0; ei < n; ei++) {
  const edge = c0[ei]!;
  const doCh = (edge.color & (ch === 0 ? RED : ch === 1 ? GREEN : BLUE)) !== 0;
  if (!doCh) continue;

  edge.signedDistance(px, py, _sd);
  const dist = _sd.distance, dot = _sd.dot, param = _sd.param;
  const absDist = Math.abs(dist);
  const cAbs = Math.abs(cTD);
  const wins = absDist < cAbs || (absDist === cAbs && dot < cDot);

  console.log(`  ei=${ei} dist=${dist.toFixed(6)} dot=${dot.toFixed(4)} param=${param.toFixed(4)} ${wins ? "← BEST" : ""}`);

  if (wins) {
    cTD = dist; cDot = dot; cNEI = ei; cNPar = param;
  }

  // Perpendicular distances
  const prevEdge = c0[(ei + n - 1) % n]!;
  const nextEdge = c0[(ei + 1) % n]!;

  edge.point(0, _pt);
  const apx = px - _pt[0]!, apy = py - _pt[1]!;
  edge.point(1, _pt);
  const bpx = px - _pt[0]!, bpy = py - _pt[1]!;

  edge.direction(0, _dir);
  let dlen = Math.sqrt(_dir[0]! ** 2 + _dir[1]! ** 2);
  const aDx = dlen > 0 ? _dir[0]! / dlen : 0;
  const aDy = dlen > 0 ? _dir[1]! / dlen : 0;

  edge.direction(1, _dir);
  dlen = Math.sqrt(_dir[0]! ** 2 + _dir[1]! ** 2);
  const bDx = dlen > 0 ? _dir[0]! / dlen : 0;
  const bDy = dlen > 0 ? _dir[1]! / dlen : 0;

  prevEdge.direction(1, _dir);
  dlen = Math.sqrt(_dir[0]! ** 2 + _dir[1]! ** 2);
  const pDx = dlen > 0 ? _dir[0]! / dlen : 0;
  const pDy = dlen > 0 ? _dir[1]! / dlen : 0;

  nextEdge.direction(0, _dir);
  dlen = Math.sqrt(_dir[0]! ** 2 + _dir[1]! ** 2);
  const nDx = dlen > 0 ? _dir[0]! / dlen : 0;
  const nDy = dlen > 0 ? _dir[1]! / dlen : 0;

  const addSx = pDx + aDx, addSy = pDy + aDy;
  const addSl = Math.sqrt(addSx ** 2 + addSy ** 2);
  const add = addSl > 0 ? apx * (addSx / addSl) + apy * (addSy / addSl) : 0;

  const bddSx = bDx + nDx, bddSy = bDy + nDy;
  const bddSl = Math.sqrt(bddSx ** 2 + bddSy ** 2);
  const bdd = bddSl > 0 ? -(bpx * (bddSx / bddSl) + bpy * (bddSy / bddSl)) : 0;

  if (add > 0) {
    const ts_a = -(apx * aDx + apy * aDy);
    if (ts_a > 0) {
      const perp = apx * aDy - apy * aDx;
      if (Math.abs(perp) < absDist) {
        console.log(`    → add>0 perp@start=${perp.toFixed(6)}`);
        if (perp <= 0 && perp > cNeg) cNeg = perp;
        else if (perp > 0 && perp < cPos) cPos = perp;
      }
    }
  }
  if (bdd > 0) {
    const ts_b = bpx * bDx + bpy * bDy;
    if (ts_b > 0) {
      const perp = bpx * bDy - bpy * bDx;
      if (Math.abs(perp) < absDist) {
        console.log(`    → bdd>0 perp@end=${perp.toFixed(6)}`);
        if (perp <= 0 && perp > cNeg) cNeg = perp;
        else if (perp > 0 && perp < cPos) cPos = perp;
      }
    }
  }
}

console.log(`\nFinal: td=${cTD.toFixed(6)} neg=${cNeg} pos=${cPos} nearEI=${cNEI} nearParam=${cNPar.toFixed(4)}`);
const minDist = cTD < 0 ? cNeg : cPos;
console.log(`  minDist (before distToPerp) = ${minDist}`);
const invRange = scale / pxrange;
const ch2val = cTD * invRange + 0.5; // if using td directly
console.log(`  ch${ch} value (using td) = ${ch2val.toFixed(6)}`);
const ch2valPerp = minDist * invRange + 0.5; // using neg/pos
console.log(`  ch${ch} value (using neg/pos) = ${ch2valPerp}`);
