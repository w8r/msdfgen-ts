/**
 * Pure scalar math utilities — no allocations, no Vec2.
 *
 * These are the arithmetic helpers used throughout the hot paths in msdf/.
 * Keep all functions pure (no side effects, no allocation).
 *
 * Ported from core/arithmetics.hpp and core/equation-solver.cpp.
 * msdfgen © Viktor Chlumský — MIT licence.
 */

// ── basic vector operations (scalar form) ──────────────────────────────────

/**
 * 2-D dot product.
 * @param ax First vector x.
 * @param ay First vector y.
 * @param bx Second vector x.
 * @param by Second vector y.
 * @returns Dot product a·b.
 */
export function dot(ax: number, ay: number, bx: number, by: number): number {
  return ax * bx + ay * by;
}

/**
 * 2-D cross product (scalar z-component of the 3-D cross product).
 * @param ax First vector x.
 * @param ay First vector y.
 * @param bx Second vector x.
 * @param by Second vector y.
 * @returns Cross product a×b.
 */
export function cross(ax: number, ay: number, bx: number, by: number): number {
  return ax * by - ay * bx;
}

/**
 * Linear interpolation.
 * port of core/arithmetics.hpp: mix
 * @param a Start value.
 * @param b End value.
 * @param t Weight (0 = a, 1 = b).
 * @returns (1-t)*a + t*b.
 */
export function mix(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b;
}

/**
 * Returns the sign of n: 1 for positive, -1 for negative, 0 for zero.
 * port of core/arithmetics.hpp: sign
 * @param n Input value.
 * @returns Sign of n.
 */
export function sign(n: number): number {
  return +(n > 0) - +(n < 0);
}

/**
 * Returns 1 for non-negative values and -1 for negative values.
 * port of core/arithmetics.hpp: nonZeroSign
 * @param n Input value.
 * @returns 1 if n >= 0, -1 if n < 0.
 */
export function nonZeroSign(n: number): number {
  return 2 * +(n > 0) - 1;
}

/**
 * Clamps n to [a, b].
 * port of core/arithmetics.hpp: clamp (3-argument form)
 * @param n Value to clamp.
 * @param a Lower bound.
 * @param b Upper bound.
 * @returns Clamped value.
 */
export function clamp(n: number, a: number, b: number): number {
  return n < a ? a : n > b ? b : n;
}

/**
 * Returns the median of three values (the middle value).
 * port of core/arithmetics.hpp: median
 * @param a First value.
 * @param b Second value.
 * @param c Third value.
 * @returns The median of a, b, c.
 */
export function median3(a: number, b: number, c: number): number {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
}

/**
 * Returns the length of a 2-D vector.
 * @param x Vector x component.
 * @param y Vector y component.
 * @returns Vector length.
 */
export function length2(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

// ── equation solvers ────────────────────────────────────────────────────────

/**
 * Solves ax² + bx + c = 0, writes up to 2 real roots into x[0], x[1].
 * Returns the number of real roots (0, 1, or 2).
 * Returns -1 when the equation is identically 0 (infinite solutions).
 * port of core/equation-solver.cpp: solveQuadratic
 *
 * @param x Output array (length >= 2).
 * @param a Coefficient of x².
 * @param b Coefficient of x.
 * @param c Constant term.
 * @returns Number of real solutions.
 */
export function solveQuadratic(x: number[], a: number, b: number, c: number): number {
  // a == 0 -> linear equation
  if (a === 0 || Math.abs(b) > 1e12 * Math.abs(a)) {
    if (b === 0) {
      if (c === 0) return -1; // 0 == 0
      return 0;
    }
    x[0] = -c / b;
    return 1;
  }
  const dscr = b * b - 4 * a * c;
  if (dscr > 0) {
    const sqrtDscr = Math.sqrt(dscr);
    x[0] = (-b + sqrtDscr) / (2 * a);
    x[1] = (-b - sqrtDscr) / (2 * a);
    return 2;
  } else if (dscr === 0) {
    x[0] = -b / (2 * a);
    return 1;
  }
  return 0;
}

/**
 * Solves the normed cubic x³ + ax² + bx + c = 0, writes roots into x[0..2].
 * Returns the number of real roots.
 * port of core/equation-solver.cpp: solveCubicNormed (static)
 */
function solveCubicNormed(x: number[], a: number, b: number, c: number): number {
  const a2 = a * a;
  const q = (1 / 9) * (a2 - 3 * b);
  const r = (1 / 54) * (a * (2 * a2 - 9 * b) + 27 * c);
  const r2 = r * r;
  const q3 = q * q * q;
  const a3 = a * (1 / 3);
  if (r2 < q3) {
    let t = r / Math.sqrt(q3);
    if (t < -1) t = -1;
    if (t > 1) t = 1;
    t = Math.acos(t);
    const sqQ = -2 * Math.sqrt(q);
    x[0] = sqQ * Math.cos((1 / 3) * t) - a3;
    x[1] = sqQ * Math.cos((1 / 3) * (t + 2 * Math.PI)) - a3;
    x[2] = sqQ * Math.cos((1 / 3) * (t - 2 * Math.PI)) - a3;
    return 3;
  } else {
    const u = (r < 0 ? 1 : -1) * Math.pow(Math.abs(r) + Math.sqrt(r2 - q3), 1 / 3);
    const v = u === 0 ? 0 : q / u;
    x[0] = u + v - a3;
    if (u === v || Math.abs(u - v) < 1e-12 * Math.abs(u + v)) {
      x[1] = -0.5 * (u + v) - a3;
      return 2;
    }
    return 1;
  }
}

/**
 * Solves ax³ + bx² + cx + d = 0, writes up to 3 real roots into x[0..2].
 * Returns the number of real roots.
 * port of core/equation-solver.cpp: solveCubic
 *
 * @param x Output array (length >= 3).
 * @param a Coefficient of x³.
 * @param b Coefficient of x².
 * @param c Coefficient of x.
 * @param d Constant term.
 * @returns Number of real solutions.
 */
export function solveCubic(x: number[], a: number, b: number, c: number, d: number): number {
  if (a !== 0) {
    const bn = b / a;
    if (Math.abs(bn) < 1e6) {
      // above this ratio the numerical error gets larger than if we treated a as zero
      return solveCubicNormed(x, bn, c / a, d / a);
    }
  }
  return solveQuadratic(x, b, c, d);
}
