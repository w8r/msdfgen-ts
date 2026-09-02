/**
 * Real roots of a*x^3 + b*x^2 + c*x + d on a bounded interval [x0, x1].
 *
 * Bracketed Newton with bisection fallback. No transcendentals, no closures,
 * no allocation. Roots are written into `out` in ascending order; returns count.
 *
 * Clip x0/x1 to your actual domain (e.g. 0..1 for Bezier parameters) — that's
 * where most of the speed comes from.
 */

const MAX_ITERS = 24;

/** Horner eval of the monic cubic x^3 + b x^2 + c x + d */
function evalCubic(b: number, c: number, d: number, x: number): number {
  return ((x + b) * x + c) * x + d;
}

/**
 * Isolate the single root of a monotonic piece [lo, hi] with a known sign
 * change. Newton, clamped to the bracket, bisecting whenever it escapes
 * (which also covers df == 0 at the endpoints, since ±Infinity fails the test).
 */
function refine(
  b: number,
  c: number,
  d: number,
  lo: number,
  hi: number,
  flo: number,
  fhi: number,
): number {
  const negLo = flo < 0;
  // false-position seed: already within an order of magnitude for most inputs
  let x = lo - (flo * (hi - lo)) / (fhi - flo);
  if (!(x > lo && x < hi)) x = 0.5 * (lo + hi);

  for (let i = 0; i < MAX_ITERS; i++) {
    const fx = evalCubic(b, c, d, x);
    if (fx === 0) return x;
    if (fx < 0 === negLo) lo = x;
    else hi = x;

    const dfx = (3 * x + 2 * b) * x + c;
    let nx = x - fx / dfx;
    if (!(nx > lo && nx < hi)) nx = 0.5 * (lo + hi);

    const dx = nx - x;
    x = nx;
    const adx = dx < 0 ? -dx : dx;
    if (adx <= 1e-15 * (x < 0 ? -x : x)) break;
  }
  return x;
}

/** Emit the root of [lo, hi] if there is one. `hi` is never emitted here. */
function segment(
  b: number,
  c: number,
  d: number,
  lo: number,
  hi: number,
  flo: number,
  fhi: number,
  out: Float64Array | number[],
  n: number,
): number {
  if (flo === 0) out[n++] = lo;
  else if (flo < 0 !== fhi < 0) out[n++] = refine(b, c, d, lo, hi, flo, fhi);
  return n;
}

/** Stable quadratic fallback: a x^2 + b x + c on [x0, x1]. */
export function quadraticRoots(
  a: number,
  b: number,
  c: number,
  x0: number,
  x1: number,
  out: Float64Array | number[],
): number {
  let n = 0;
  if (a === 0) {
    if (b === 0) return 0;
    const t = -c / b;
    if (t >= x0 && t <= x1) out[n++] = t;
    return n;
  }
  const disc = b * b - 4 * a * c;
  if (disc < 0) return 0;

  const sq = Math.sqrt(disc);
  const q = -0.5 * (b + (b < 0 ? -sq : sq));
  let r0: number, r1: number;
  if (q === 0) {
    r0 = 0;
    r1 = 0;
  } else {
    r0 = q / a;
    r1 = c / q;
    if (r0 > r1) {
      const t = r0;
      r0 = r1;
      r1 = t;
    }
  }
  if (r0 >= x0 && r0 <= x1) out[n++] = r0;
  if (r1 !== r0 && r1 >= x0 && r1 <= x1) out[n++] = r1;
  return n;
}

export function cubicRoots(
  a: number,
  b: number,
  c: number,
  d: number,
  x0: number,
  x1: number,
  out: Float64Array | number[],
): number {
  if (a === 0) return quadraticRoots(b, c, d, x0, x1, out);

  const ia = 1 / a;
  b *= ia;
  c *= ia;
  d *= ia;

  const f0 = evalCubic(b, c, d, x0);
  const f1 = evalCubic(b, c, d, x1);

  // Derivative 3x^2 + 2bx + c: its discriminant tells us how many
  // monotonic pieces the cubic has.
  const disc = b * b - 3 * c;
  let n = 0;

  if (disc <= 0) {
    // strictly monotonic -> at most one root
    n = segment(b, c, d, x0, x1, f0, f1, out, 0);
  } else {
    const s = Math.sqrt(disc) / 3;
    const m = -b / 3;
    const xa = m - s;
    const xb = m + s;

    let lo = x0;
    let flo = f0;
    if (xa > x0 && xa < x1) {
      const fa = evalCubic(b, c, d, xa);
      n = segment(b, c, d, lo, xa, flo, fa, out, n);
      lo = xa;
      flo = fa;
    }
    if (xb > x0 && xb < x1) {
      const fb = evalCubic(b, c, d, xb);
      n = segment(b, c, d, lo, xb, flo, fb, out, n);
      lo = xb;
      flo = fb;
    }
    n = segment(b, c, d, lo, x1, flo, f1, out, n);
  }

  if (f1 === 0) out[n++] = x1;
  return n;
}
