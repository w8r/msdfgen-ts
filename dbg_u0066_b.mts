import { readFileSync } from "fs";
import { parseShapeDesc } from "./test/utils/shapedesc.ts";
import { normalizeShape } from "./src/shape/normalize.ts";
import { edgeColoringSimple } from "./src/msdf/edge-coloring.ts";
import type { Contour } from "./src/shape/contour.ts";

const shapePath = "./test/golden/notosans/U0066_48px/shape.txt";
const shapeText = readFileSync(shapePath, "utf8");
const { shape, colorsSpecified } = parseShapeDesc(shapeText);
normalizeShape(shape);
if (!colorsSpecified) edgeColoringSimple(shape, 3.0, 0n);

const W = 48,
  H = 48,
  scale = 40,
  tx = 0.1,
  ty = 0.35,
  pxrange = 4;
// Target pixel bm (y=4, x=47)
const px = (47 + 0.5) / scale - tx;
const py = (4 + 0.5) / scale - ty;
console.log(`px=${px}, py=${py}`);

const DBL_MAX = Number.MAX_VALUE;
const _sd = { distance: 0, dot: 0, param: 0 };
const _pt = [0, 0];
const _dir = [0, 0];

const contours = shape.contours;
const ci = 0;
const edges = contours[ci]!;
const ne = edges.length;

// Replicate generate.ts Phase 1 for B channel (ci3+2)
let cTD_b = DBL_MAX,
  cDot_b = DBL_MAX,
  cNEI_b = -1,
  cNPar_b = 0;
let cNeg_b = -DBL_MAX,
  cPos_b = DBL_MAX;

for (let ei = 0; ei < ne; ei++) {
  const edge = edges[ei]!;
  const doB = !!(edge.color & 4);
  if (!doB) continue;

  const prevEdge = edges[(ei + ne - 1) % ne]!;
  const nextEdge = edges[(ei + 1) % ne]!;

  edge.signedDistance(px, py, _sd as any);
  const dist = _sd.distance,
    dot = _sd.dot,
    param = _sd.param;
  const absDist = Math.abs(dist);

  // addEdgeTrueDistance
  const cAbs = Math.abs(cTD_b);
  if (absDist < cAbs || (absDist === cAbs && dot < cDot_b)) {
    cTD_b = dist;
    cDot_b = dot;
    cNEI_b = ei;
    cNPar_b = param;
  }

  // Compute perps
  edge.point(0, _pt as any);
  const apx = px - _pt[0]!,
    apy = py - _pt[1]!;
  edge.point(1, _pt as any);
  const bpx = px - _pt[0]!,
    bpy = py - _pt[1]!;

  edge.direction(0, _dir as any);
  let dlen = Math.sqrt(_dir[0]! ** 2 + _dir[1]! ** 2);
  const aDx = dlen > 0 ? _dir[0]! / dlen : 0,
    aDy = dlen > 0 ? _dir[1]! / dlen : 0;
  edge.direction(1, _dir as any);
  dlen = Math.sqrt(_dir[0]! ** 2 + _dir[1]! ** 2);
  const bDx = dlen > 0 ? _dir[0]! / dlen : 0,
    bDy = dlen > 0 ? _dir[1]! / dlen : 0;
  prevEdge.direction(1, _dir as any);
  dlen = Math.sqrt(_dir[0]! ** 2 + _dir[1]! ** 2);
  const pDx = dlen > 0 ? _dir[0]! / dlen : 0,
    pDy = dlen > 0 ? _dir[1]! / dlen : 0;
  nextEdge.direction(0, _dir as any);
  dlen = Math.sqrt(_dir[0]! ** 2 + _dir[1]! ** 2);
  const nDx = dlen > 0 ? _dir[0]! / dlen : 0,
    nDy = dlen > 0 ? _dir[1]! / dlen : 0;

  const addSx = pDx + aDx,
    addSy = pDy + aDy;
  const addSl = Math.sqrt(addSx * addSx + addSy * addSy);
  const add = addSl > 0 ? apx * (addSx / addSl) + apy * (addSy / addSl) : 0;

  const bddSx = bDx + nDx,
    bddSy = bDy + nDy;
  const bddSl = Math.sqrt(bddSx * bddSx + bddSy * bddSy);
  const bdd = bddSl > 0 ? -(bpx * (bddSx / bddSl) + bpy * (bddSy / bddSl)) : 0;

  if (add > 0) {
    const ts_a = -(apx * aDx + apy * aDy);
    if (ts_a > 0) {
      const perp = apx * aDy - apy * aDx;
      if (Math.abs(perp) < absDist) {
        if (perp <= 0 && perp > cNeg_b) cNeg_b = perp;
        else if (perp > 0 && perp < cPos_b) cPos_b = perp;
      }
    }
  }
  if (bdd > 0) {
    const ts_b = bpx * bDx + bpy * bDy;
    if (ts_b > 0) {
      const perp = bpx * bDy - bpy * bDx;
      if (Math.abs(perp) < absDist) {
        if (perp <= 0 && perp > cNeg_b) cNeg_b = perp;
        else if (perp > 0 && perp < cPos_b) cPos_b = perp;
      }
    }
  }
}

console.log(`Phase1: cTD_b=${cTD_b.toFixed(8)}, cNEI_b=${cNEI_b}, cNPar_b=${cNPar_b.toFixed(4)}`);
console.log(
  `        cNeg_b=${cNeg_b === -DBL_MAX ? "-INF" : cNeg_b.toFixed(8)}, cPos_b=${cPos_b === DBL_MAX ? "INF" : cPos_b.toFixed(8)}`,
);

// _computeFromState
let minDist = cTD_b < 0 ? cNeg_b : cPos_b;
console.log(
  `minDist from state (before distToPerp): ${minDist === -DBL_MAX ? "-INF" : minDist === DBL_MAX ? "INF" : minDist.toFixed(8)}`,
);

// _distToPerp
if (cNEI_b >= 0) {
  const seg = edges[cNEI_b]!;
  let d = cTD_b;
  const param = cNPar_b;
  console.log(`_distToPerp: ei=${cNEI_b}, origDist=${cTD_b.toFixed(8)}, param=${param.toFixed(4)}`);
  if (param < 0) {
    seg.direction(0, _dir as any);
    const dlen = Math.sqrt(_dir[0]! ** 2 + _dir[1]! ** 2);
    if (dlen > 0) {
      const ndx = _dir[0]! / dlen,
        ndy = _dir[1]! / dlen;
      seg.point(0, _pt as any);
      const aqx = px - _pt[0]!,
        aqy = py - _pt[1]!;
      const ts = aqx * ndx + aqy * ndy;
      const perp = aqx * ndy - aqy * ndx;
      console.log(`  param<0: ts=${ts.toFixed(6)}, perp=${perp.toFixed(8)}`);
      if (ts < 0 && Math.abs(perp) <= Math.abs(d)) {
        d = perp;
        console.log(`  -> updated d to ${d.toFixed(8)}`);
      }
    }
  }
  if (param > 1) {
    seg.direction(1, _dir as any);
    const dlen = Math.sqrt(_dir[0]! ** 2 + _dir[1]! ** 2);
    if (dlen > 0) {
      const ndx = _dir[0]! / dlen,
        ndy = _dir[1]! / dlen;
      seg.point(1, _pt as any);
      const bqx = px - _pt[0]!,
        bqy = py - _pt[1]!;
      const ts = bqx * ndx + bqy * ndy;
      const perp = bqx * ndy - bqy * ndx;
      console.log(`  param>1: ts=${ts.toFixed(6)}, perp=${perp.toFixed(8)}`);
      if (ts > 0 && Math.abs(perp) <= Math.abs(d)) {
        d = perp;
        console.log(`  -> updated d to ${d.toFixed(8)}`);
      }
    }
  }
  if (Math.abs(d) < Math.abs(minDist)) {
    console.log(`  _distToPerp: d=${d.toFixed(8)} < minDist=${minDist.toFixed(8)}, updating`);
    minDist = d;
  } else {
    console.log(`  _distToPerp: d=${d.toFixed(8)} not better than minDist=${minDist.toFixed(8)}`);
  }
}

const encoded = minDist * (scale / pxrange) + 0.5;
console.log(`\nFinal B raw distance: ${minDist.toFixed(8)}`);
console.log(`Final B encoded: ${encoded.toFixed(6)}`);
