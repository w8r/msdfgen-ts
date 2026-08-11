import { readFileSync } from "fs";
import { generateMSDF } from "./src/msdf/generate.js";
import { edgeColoringSimple } from "./src/msdf/edge-coloring.js";
import { distanceSignCorrection } from "./src/msdf/error-correction.js";
import { normalizeShape } from "./src/shape/normalize.js";
import { parseShapeDesc } from "./test/utils/shapedesc.js";

const dir = process.argv[2] ?? "test/golden/roboto/U0064_32px";
const targetX = parseInt(process.argv[3] ?? "14");
const targetY = parseInt(process.argv[4] ?? "11");

const meta = JSON.parse(readFileSync(`${dir}/meta.json`, "utf8")) as any;
const shapeText = readFileSync(`${dir}/shape.txt`, "utf8");
const { width: w, height: h, scale, tx, ty, pxrange } = meta;
const shape = parseShapeDesc(shapeText);
normalizeShape(shape);
edgeColoringSimple(shape, 3.0, 0n);
const msdf = new Float32Array(w * h * 3);
generateMSDF(shape, w, h, scale, tx, ty, pxrange, msdf);
distanceSignCorrection(msdf, shape, w, h, scale, tx, ty);

// Print 5x5 neighborhood
console.log("Post sign-correction neighborhood (5x5):");
for (let dy = -2; dy <= 2; dy++) {
  for (let dx = -2; dx <= 2; dx++) {
    const x = targetX + dx, y = targetY + dy;
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const i = (y*w+x)*3;
    console.log(`  (${x},${y}): ch0=${msdf[i]?.toFixed(6)} ch1=${msdf[i+1]?.toFixed(6)} ch2=${msdf[i+2]?.toFixed(6)}`);
  }
}

const idx = targetY * w + targetX;
const aBase = idx * 3;
const am_ch0 = msdf[aBase]!; const am_ch1 = msdf[aBase+1]!; const am_ch2 = msdf[aBase+2]!;

function medianF(a: number, b: number, c: number): number {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
}
function medianCpp(a: number, b: number, c: number): number {
  const minAB = (a < b) ? a : b;
  const maxAB = (b < a) ? a : b;
  const minMaxABc = (maxAB < c) ? maxAB : c;
  return (minMaxABc < minAB) ? minAB : minMaxABc;
}

const am = medianF(am_ch0, am_ch1, am_ch2);
console.log(`\n(${targetX},${targetY}): am=${am.toFixed(6)} [ch0=${am_ch0.toFixed(6)}, ch1=${am_ch1.toFixed(6)}, ch2=${am_ch2.toFixed(6)}]`);

const diags = [
  {name:'LB', bOff:-1, cOff:-w, dOff:-w-1},
  {name:'RB', bOff:+1, cOff:-w, dOff:-w+1},
  {name:'LT', bOff:-1, cOff:+w, dOff:+w-1},
  {name:'RT', bOff:+1, cOff:+w, dOff:+w+1},
];

const DEFAULT_MIN_DEVIATION_RATIO = 10.0/9.0;
const dSpan = DEFAULT_MIN_DEVIATION_RATIO * Math.SQRT2 / pxrange;

for (const {name, bOff, cOff, dOff} of diags) {
  const bBase = (idx + bOff) * 3;
  const cBase2 = (idx + cOff) * 3;
  const dBase = (idx + dOff) * 3;
  
  const dm = medianF(msdf[dBase]!, msdf[dBase+1]!, msdf[dBase+2]!);
  if (Math.abs(am - 0.5) < Math.abs(dm - 0.5)) { console.log(`\n${name}: skipped (dm=${dm.toFixed(4)} is closer to 0.5)`); continue; }
  
  console.log(`\n${name}: dm=${dm.toFixed(6)}`);
  console.log(`  b: ch0=${msdf[bBase]?.toFixed(4)} ch1=${msdf[bBase+1]?.toFixed(4)} ch2=${msdf[bBase+2]?.toFixed(4)}`);
  console.log(`  c: ch0=${msdf[cBase2]?.toFixed(4)} ch1=${msdf[cBase2+1]?.toFixed(4)} ch2=${msdf[cBase2+2]?.toFixed(4)}`);
  console.log(`  d: ch0=${msdf[dBase]?.toFixed(4)} ch1=${msdf[dBase+1]?.toFixed(4)} ch2=${msdf[dBase+2]?.toFixed(4)}`);
  
  // Compute abc/l/q in float64 (old) and float32 (new)
  const abc_f64 = [0, 1, 2].map(ch => msdf[aBase+ch]! - msdf[bBase+ch]! - msdf[cBase2+ch]!);
  const l_f64 = [0, 1, 2].map(ch => -msdf[aBase+ch]! - abc_f64[ch]!);
  const q_f64 = [0, 1, 2].map(ch => msdf[dBase+ch]! + abc_f64[ch]!);
  
  const abc_f32 = [0, 1, 2].map(ch => Math.fround(Math.fround(msdf[aBase+ch]! - msdf[bBase+ch]!) - msdf[cBase2+ch]!));
  const l_f32 = [0, 1, 2].map(ch => Math.fround(-msdf[aBase+ch]! - abc_f32[ch]!));
  const q_f32 = [0, 1, 2].map(ch => Math.fround(msdf[dBase+ch]! + abc_f32[ch]!));
  
  const abcDiff = abc_f64.some((v, i) => v !== abc_f32[i]);
  const lDiff = l_f64.some((v, i) => v !== l_f32[i]);
  const qDiff = q_f64.some((v, i) => v !== q_f32[i]);
  
  if (abcDiff || lDiff || qDiff) {
    console.log(`  abc f64: [${abc_f64.map(v => v.toFixed(6)).join(', ')}]`);
    console.log(`  abc f32: [${abc_f32.map(v => v.toFixed(6)).join(', ')}]`);
    console.log(`  l f64:   [${l_f64.map(v => v.toFixed(6)).join(', ')}]`);
    console.log(`  l f32:   [${l_f32.map(v => v.toFixed(6)).join(', ')}]`);
    console.log(`  q f64:   [${q_f64.map(v => v.toFixed(6)).join(', ')}]`);
    console.log(`  q f32:   [${q_f32.map(v => v.toFixed(6)).join(', ')}]`);
  } else {
    console.log(`  abc/l/q f64 === f32 (no difference)`);
    console.log(`  abc: [${abc_f64.map(v => v.toFixed(6)).join(', ')}]`);
    console.log(`  l:   [${l_f64.map(v => v.toFixed(6)).join(', ')}]`);
    console.log(`  q:   [${q_f64.map(v => v.toFixed(6)).join(', ')}]`);
  }
  
  // Check pairs with both f64 and f32
  const pairs = [[0,1],[1,2],[2,0]] as const;
  const tEx_f64 = [0,1,2].map(ch => q_f64[ch]! !== 0 ? -0.5 * l_f64[ch]! / q_f64[ch]! : -1);
  const tEx_f32 = [0,1,2].map(ch => q_f32[ch]! !== 0 ? -0.5 * l_f32[ch]! / q_f32[ch]! : -1);
  
  for (const [ch0, ch1] of pairs) {
    const dA_f64 = msdf[aBase+ch0]! - msdf[aBase+ch1]!;
    const dBC_f64 = (msdf[bBase+ch0]! - msdf[bBase+ch1]!) + (msdf[cBase2+ch0]! - msdf[cBase2+ch1]!);
    const dD_f64 = msdf[dBase+ch0]! - msdf[dBase+ch1]!;
    const qC_f64 = dD_f64 - dBC_f64 + dA_f64;
    const lC_f64 = dBC_f64 - dA_f64 - dA_f64;
    const aC_f64 = dA_f64;
    
    const dA_f32 = Math.fround(msdf[aBase+ch0]! - msdf[aBase+ch1]!);
    const dBC_f32 = Math.fround(Math.fround(msdf[bBase+ch0]! - msdf[bBase+ch1]!) + Math.fround(msdf[cBase2+ch0]! - msdf[cBase2+ch1]!));
    const dD_f32 = Math.fround(msdf[dBase+ch0]! - msdf[dBase+ch1]!);
    const qC_f32 = Math.fround(Math.fround(dD_f32 - dBC_f32) + dA_f32);
    const lC_f32 = Math.fround(Math.fround(dBC_f32 - dA_f32) - dA_f32);
    const aC_f32 = dA_f32;
    
    // Solve with f64 coefficients (old way)
    const disc_f64 = lC_f64**2 - 4*qC_f64*aC_f64;
    const sols_f64: number[] = [];
    if (Math.abs(qC_f64) < 1e-15) { if (lC_f64 !== 0) sols_f64.push(-aC_f64/lC_f64); }
    else if (disc_f64 >= 0) {
      const sq = Math.sqrt(disc_f64);
      sols_f64.push((-lC_f64+sq)/(2*qC_f64));
      sols_f64.push((-lC_f64-sq)/(2*qC_f64));
    }
    const validSols_f64 = sols_f64.filter(t => t > 0.01 && t < 0.99);
    
    // Solve with f32 coefficients (new way)
    const disc_f32 = lC_f32**2 - 4*qC_f32*aC_f32;
    const sols_f32: number[] = [];
    if (qC_f32 === 0 || Math.abs(lC_f32) > 1e12*Math.abs(qC_f32)) { if (lC_f32 !== 0) sols_f32.push(-aC_f32/lC_f32); }
    else if (disc_f32 > 0) {
      const sq = Math.sqrt(disc_f32);
      sols_f32.push((-lC_f32+sq)/(2*qC_f32));
      sols_f32.push((-lC_f32-sq)/(2*qC_f32));
    } else if (disc_f32 === 0) {
      sols_f32.push(-lC_f32/(2*qC_f32));
    }
    const validSols_f32 = sols_f32.filter(t => t > 0.01 && t < 0.99);
    
    if (validSols_f64.length === 0 && validSols_f32.length === 0) continue;
    
    console.log(`\n  pair(${ch0},${ch1}):`);
    if (dA_f64 !== dA_f32 || dBC_f64 !== dBC_f32 || dD_f64 !== dD_f32) {
      console.log(`    dA  f64=${dA_f64.toFixed(8)}  f32=${dA_f32.toFixed(8)}`);
      console.log(`    dBC f64=${dBC_f64.toFixed(8)}  f32=${dBC_f32.toFixed(8)}`);
      console.log(`    dD  f64=${dD_f64.toFixed(8)}  f32=${dD_f32.toFixed(8)}`);
    } else {
      console.log(`    dA=${dA_f64.toFixed(8)} dBC=${dBC_f64.toFixed(8)} dD=${dD_f64.toFixed(8)}`);
    }
    
    if (qC_f64 !== qC_f32 || lC_f64 !== lC_f32) {
      console.log(`    qCoeff f64=${qC_f64.toFixed(8)} f32=${qC_f32.toFixed(8)}`);
      console.log(`    lCoeff f64=${lC_f64.toFixed(8)} f32=${lC_f32.toFixed(8)}`);
      console.log(`    disc   f64=${disc_f64.toFixed(8)} f32=${disc_f32.toFixed(8)}`);
    } else {
      console.log(`    qCoeff=${qC_f64.toFixed(8)} lCoeff=${lC_f64.toFixed(8)} disc=${disc_f64.toFixed(8)}`);
    }
    
    console.log(`    sols f64: [${validSols_f64.map(t => t.toFixed(6)).join(', ')}]`);
    console.log(`    sols f32: [${validSols_f32.map(t => t.toFixed(6)).join(', ')}]`);
    
    const tEx0_f32 = tEx_f32[ch0]!;
    const tEx1_f32 = tEx_f32[ch1]!;
    const tEx0_f64 = tEx_f64[ch0]!;
    const tEx1_f64 = tEx_f64[ch1]!;
    
    for (const t of [...validSols_f64, ...validSols_f32.filter(t => !validSols_f64.includes(t))]) {
      // bilinear at t, f64 approach
      const ch_f64 = [0,1,2].map(ch => t*(t*q_f64[ch]!+l_f64[ch]!)+msdf[aBase+ch]!);
      const xm_f64 = medianF(ch_f64[0]!, ch_f64[1]!, ch_f64[2]!);
      
      // bilinear at t, f32 approach (medianCpp)
      const ch_f32 = [0,1,2].map(ch => Math.fround(t*(t*q_f32[ch]!+l_f32[ch]!)+msdf[aBase+ch]!));
      const xm_f32 = medianCpp(ch_f32[0]!, ch_f32[1]!, ch_f32[2]!);
      
      console.log(`    t=${t.toFixed(6)}: xm_f64=${xm_f64.toFixed(6)} xm_f32=${xm_f32.toFixed(6)}`);
      console.log(`      ch_f64=[${ch_f64.map(v => v.toFixed(4)).join(',')}] ch_f32=[${ch_f32.map(v => v.toFixed(4)).join(',')}]`);
      
      // rangeTest(0,1,t,am,dm,xm):
      function rangeTest(at: number, bt: number, xt: number, am_: number, bm_: number, xm_: number) {
        const span = dSpan;
        const axSpan = (xt-at)*span, bxSpan = (bt-xt)*span;
        const cond1 = (am_>0.5 && bm_>0.5 && xm_<=0.5) || (am_<0.5 && bm_<0.5 && xm_>=0.5);
        const cond3 = medianF(am_, bm_, xm_) !== xm_;
        if (cond1 || cond3) {
          const spanCheck = !(xm_ >= am_-axSpan && xm_ <= am_+axSpan && xm_ >= bm_-bxSpan && xm_ <= bm_+bxSpan);
          return { cond1, cond3, spanCheck, flag: cond1 || (cond3 && spanCheck) };
        }
        return { cond1, cond3, spanCheck: false, flag: false };
      }
      
      const rt_f64 = rangeTest(0,1,t,am,dm,xm_f64);
      const rt_f32 = rangeTest(0,1,t,am,dm,xm_f32);
      
      if (rt_f64.flag !== rt_f32.flag || xm_f64 !== xm_f32) {
        console.log(`      f64: cond1=${rt_f64.cond1} cond3=${rt_f64.cond3} spanCheck=${rt_f64.spanCheck} → ${rt_f64.flag?'ARTIFACT':'no-flag'}`);
        console.log(`      f32: cond1=${rt_f32.cond1} cond3=${rt_f32.cond3} spanCheck=${rt_f32.spanCheck} → ${rt_f32.flag?'ARTIFACT':'no-flag'}`);
      } else {
        console.log(`      rangeTest(main): both → ${rt_f64.flag?'ARTIFACT':'no-flag'}`);
      }
      
      // tEx checks
      for (const [tEx_f, label] of [[tEx0_f32, 'tEx0_f32'], [tEx1_f32, 'tEx1_f32']] as [number, string][]) {
        if (!(tEx_f > 0 && tEx_f < 1)) continue;
        const em_ch_f32 = [0,1,2].map(ch => Math.fround(tEx_f*(tEx_f*q_f32[ch]!+l_f32[ch]!)+msdf[aBase+ch]!));
        const em_f32 = medianCpp(em_ch_f32[0]!, em_ch_f32[1]!, em_ch_f32[2]!);
        const em0 = tEx_f > t ? am : em_f32;
        const em1 = tEx_f > t ? em_f32 : dm;
        const tEnd0 = tEx_f > t ? 0 : tEx_f;
        const tEnd1 = tEx_f > t ? tEx_f : 1;
        const rt = rangeTest(tEnd0, tEnd1, t, em0, em1, xm_f32);
        if (rt.flag) {
          console.log(`      ${label}=${tEx_f.toFixed(4)}: em=${em_f32.toFixed(4)} → rangeTest → ARTIFACT`);
        }
      }
    }
  }
}
