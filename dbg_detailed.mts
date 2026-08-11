// Direct instrumentation of per-contour distances
import { readFileSync } from 'fs';
import { parseShapeDesc } from './test/utils/shapedesc.js';
import { normalizeShape } from './src/shape/normalize.js';

const shapeText = readFileSync('./test/golden/roboto/U0434_32px/shape.txt', 'utf8');
const { shape, colorsSpecified } = parseShapeDesc(shapeText);
normalizeShape(shape);

const meta = JSON.parse(readFileSync('./test/golden/roboto/U0434_32px/meta.json', 'utf8'));
const { scale, pxrange } = meta;
const tx6 = parseFloat(meta.tx.toFixed(6));
const ty6 = parseFloat(meta.ty.toFixed(6));

const px = (9 + 0.5) / scale - tx6;
const py = (22 + 0.5) / scale - ty6;

console.log(`px=${px} py=${py}`);

// Import EdgeSegment types
import { EdgeSegment } from './src/shape/segments.js';

// Compute distances for each contour
for (let ci = 0; ci < shape.contours.length; ci++) {
    const contour = shape.contours[ci]!;
    const nc = contour.length;
    
    const DBL_MAX = Number.MAX_VALUE;
    
    let td_r = -DBL_MAX, td_g = -DBL_MAX, td_b = -DBL_MAX;
    let dot_r = 0, dot_g = 0, dot_b = 0;
    let neg_r = -DBL_MAX, neg_g = -DBL_MAX, neg_b = -DBL_MAX;
    let pos_r = DBL_MAX, pos_g = DBL_MAX, pos_b = DBL_MAX;
    let nei_r = -1, nei_g = -1, nei_b = -1;
    let par_r = 0, par_g = 0, par_b = 0;
    
    const out = { distance: 0, dot: 0, param: 0 };
    
    for (let ei = 0; ei < nc; ei++) {
        const edge = contour[ei]!;
        const col = edge.color;
        const doR = (col & 1) !== 0;
        const doG = (col & 2) !== 0;
        const doB = (col & 4) !== 0;
        
        // Need to call signedDistance... let's do it manually for LINEAR
        if (edge.type !== 0) { // skip non-linear for now
            continue;
        }
        const p0x = edge.p0x, p0y = edge.p0y;
        const p1x = edge.p1x, p1y = edge.p1y;
        const aqx = px - p0x, aqy = py - p0y;
        const abx = p1x - p0x, aby = p1y - p0y;
        const abLen2 = abx*abx + aby*aby;
        const param = (aqx*abx + aqy*aby) / abLen2;
        const ortho = param > 0 && param < 1 ? (aqx * aby - aqy * abx) / Math.sqrt(abLen2) : null;
        const useEnd = param > 0.5;
        const ex = (useEnd ? p1x : p0x) - px, ey = (useEnd ? p1y : p0y) - py;
        const endDist = Math.sqrt(ex*ex + ey*ey);
        const cross = aqx * aby - aqy * abx;
        const dist = (ortho !== null && Math.abs(ortho) < endDist) ? ortho : (cross >= 0 ? 1 : -1) * endDist;
        const absDist = Math.abs(dist);
        const dot = ortho !== null ? 0 : absDist === 0 ? 0 : 1;
        
        if (doR && (absDist < Math.abs(td_r) || (absDist === Math.abs(td_r) && dot < dot_r))) {
            td_r = dist; dot_r = dot; nei_r = ei; par_r = param;
        }
        if (doG && (absDist < Math.abs(td_g) || (absDist === Math.abs(td_g) && dot < dot_g))) {
            td_g = dist; dot_g = dot; nei_g = ei; par_g = param;
        }
        if (doB && (absDist < Math.abs(td_b) || (absDist === Math.abs(td_b) && dot < dot_b))) {
            td_b = dist; dot_b = dot; nei_b = ei; par_b = param;
        }
        
        // Perpendicular accumulation (simplified: just update pos/neg from the dist value)
        if (dist <= 0 && dist > neg_r && doR) neg_r = dist;
        else if (dist > 0 && dist < pos_r && doR) pos_r = dist;
        if (dist <= 0 && dist > neg_g && doG) neg_g = dist;
        else if (dist > 0 && dist < pos_g && doG) pos_g = dist;
        if (dist <= 0 && dist > neg_b && doB) neg_b = dist;
        else if (dist > 0 && dist < pos_b && doB) pos_b = dist;
    }
    
    // _computeFromState: pick neg or pos based on sign of td, then try nearEdge perp
    const cdR_raw = td_r >= 0 ? pos_r : neg_r;
    const cdG_raw = td_g >= 0 ? pos_g : neg_g;
    const cdB_raw = td_b >= 0 ? pos_b : neg_b;
    
    // Apply nearEdge distToPerp (simplified: for LINEAR param in [0,1], just use td)
    const cdR = Math.abs(td_r) < Math.abs(cdR_raw) ? td_r : cdR_raw;
    const cdG = Math.abs(td_g) < Math.abs(cdG_raw) ? td_g : cdG_raw;
    const cdB = Math.abs(td_b) < Math.abs(cdB_raw) ? td_b : cdB_raw;
    
    const med = (a: number, b: number, c: number) => Math.max(Math.min(a,b), Math.min(Math.max(a,b), c));
    const cdM = med(cdR, cdG, cdB);
    
    console.log(`ci=${ci}: td_r=${td_r.toFixed(8)} td_g=${td_g.toFixed(8)} td_b=${td_b.toFixed(8)}`);
    console.log(`  cdR=${cdR.toFixed(8)} cdG=${cdG.toFixed(8)} cdB=${cdB.toFixed(8)} cdM=${cdM.toFixed(8)}`);
    console.log(`  nei_r=${nei_r} par_r=${par_r.toFixed(4)} nei_g=${nei_g} par_g=${par_g.toFixed(4)} nei_b=${nei_b} par_b=${par_b.toFixed(4)}`);
}
