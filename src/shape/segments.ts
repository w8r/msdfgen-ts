/**
 * EdgeSegment — the single monomorphic segment class used throughout the library.
 *
 * Performance contract (never violate — hot path):
 *  - One class, no subclasses. Dispatch via `switch (seg.type)`.
 *  - All fields are plain numbers, initialised in constructor order.
 *  - Unused fields are set to 0; CUBIC fields are always allocated but ignored for
 *    LINEAR / QUADRATIC segments.
 *  - Never add conditional fields; always initialise every field in the same order.
 */

import { solveQuadratic, solveCubic, sign, nonZeroSign, mix } from "../math/scalar.js";

/** Segment type tags — match C++ msdfgen's EdgeType enum. */
export const LINEAR = 0 as const;
export const QUADRATIC = 1 as const;
export const CUBIC = 2 as const;

export type SegmentType = typeof LINEAR | typeof QUADRATIC | typeof CUBIC;

/**
 * Reusable output for {@link EdgeSegment.signedDistance}.  Allocated once per
 * generator call (or module scope) and passed in — the hot per-pixel loop must
 * never allocate.  Mirrors C++ msdfgen's `SignedDistance` plus the by-reference
 * `param` out-value returned from `EdgeSegment::signedDistance`.
 */
export interface SignedDistanceResult {
  /** Signed distance (sign from edge winding). */
  distance: number;
  /** Alignment term, used to break ties between edges (`|cosθ|` at endpoints). */
  dot: number;
  /** Nearest-point parameter t (may lie outside [0,1] for endpoint regions). */
  param: number;
}

/**
 * Compares two signed distances the way msdfgen's `SignedDistance::operator<`
 * does: smaller absolute distance wins; ties broken by the smaller `dot`.
 * port of core/SignedDistance.hpp: operator<
 *
 * @param aDist Candidate distance.
 * @param aDot Candidate dot.
 * @param bDist Incumbent distance.
 * @param bDot Incumbent dot.
 * @returns True when (aDist,aDot) is closer than (bDist,bDot).
 */
export function signedDistanceLess(
  aDist: number,
  aDot: number,
  bDist: number,
  bDot: number,
): boolean {
  const aa = aDist < 0 ? -aDist : aDist;
  const ba = bDist < 0 ? -bDist : bDist;
  return aa < ba || (aa === ba && aDot < bDot);
}

/** Number of evenly spaced starting points for the cubic Newton search.
 *  port of core/edge-segments.h: MSDFGEN_CUBIC_SEARCH_STARTS */
const CUBIC_SEARCH_STARTS = 4;
/** Maximum Newton refinement steps per cubic search start.
 *  port of core/edge-segments.h: MSDFGEN_CUBIC_SEARCH_STEPS */
const CUBIC_SEARCH_STEPS = 4;

/** Scratch root buffer for equation solvers (module-scope, single-threaded). */
const _roots = [0, 0, 0];

/**
 * Veltkamp splitting constant for float64 (2^27+1).
 * Used by {@link _sqDistFMA} to get the exact product error of x*x.
 */
const _VK = 134217729.0;

/**
 * Computes fl(exact(x²) + fl(y²)), matching what ARM64 generates for
 * `sqrt(x*x+y*y)` when compiled with -O3 -ffp-contract=on:
 *   fmul  t, y, y          ; t  = fl(y²)
 *   fmadd r, x, x, t       ; r  = fl(exact(x²) + t)
 *   fsqrt result, r
 *
 * Use `Math.sqrt(_sqDistFMA(x, y))` instead of `Math.sqrt(x*x+y*y)` for
 * endpoint-to-pixel distance comparisons so the float64 ordering matches the
 * C++ reference on ARM64.  Leave direction-normalization sqrt calls unchanged.
 *
 * port of Vector2::length() — ARM64 compiled form with FMA contraction.
 */
function _sqDistFMA(x: number, y: number): number {
  // t = fl(y²)  (standard rounded multiplication, same as C++ first fmul)
  const t = y * y;
  // Compute exact(x²) = p + e via Veltkamp-Dekker split
  const cx = _VK * x;
  const xh = cx - (cx - x); // high 27-bit half of x
  const xl = x - xh;        // low  26-bit half of x
  const p = x * x;          // fl(x²)  (= fmadd input, rounded)
  const e = ((xh * xh - p) + 2.0 * xh * xl) + xl * xl; // exact(x²) - p
  // fl(exact(x²) + t) using compensated addition (TwoSum on p+t, then add e)
  // Assumes |p| >= |t|, which holds when |x| >= |y| (x-component >= y-component).
  // In the rare opposite case the error is still ≤ 1 ULP, never changing sign.
  const s = p + t;
  return s + (e + (t - (s - p)));
}

/**
 * A single curve segment within a contour.
 *
 * Field layout (matches C++ msdfgen EdgeSegment conventions):
 *   LINEAR    — p0=start, p1=end,           p2=p3=0
 *   QUADRATIC — p0=start, p1=control, p2=end, p3=0
 *   CUBIC     — p0=start, p1=ctrl1,  p2=ctrl2, p3=end
 */
export class EdgeSegment {
  /** @type {SegmentType} */
  type: SegmentType;
  /** Start x (always on-curve). */
  p0x: number;
  /** Start y (always on-curve). */
  p0y: number;
  /** LINEAR: end x. QUADRATIC: control x. CUBIC: first control x. */
  p1x: number;
  /** LINEAR: end y. QUADRATIC: control y. CUBIC: first control y. */
  p1y: number;
  /** QUADRATIC/CUBIC: second control or end x. LINEAR: 0. */
  p2x: number;
  /** QUADRATIC/CUBIC: second control or end y. LINEAR: 0. */
  p2y: number;
  /** CUBIC: end x. Others: 0. */
  p3x: number;
  /** CUBIC: end y. Others: 0. */
  p3y: number;
  /**
   * Edge color bitmask for MSDF channel assignment.
   * port of core/EdgeColor.h: EdgeColor (BLACK=0, RED=1, GREEN=2, YELLOW=3, BLUE=4, MAGENTA=5, CYAN=6, WHITE=7)
   */
  color: number;

  /**
   * @param type Segment type (LINEAR=0, QUADRATIC=1, CUBIC=2).
   * @param p0x Start x.
   * @param p0y Start y.
   * @param p1x LINEAR: end x. QUADRATIC: control x. CUBIC: first control x.
   * @param p1y LINEAR: end y. QUADRATIC: control y. CUBIC: first control y.
   * @param p2x QUADRATIC: end x. CUBIC: second control x. LINEAR: 0.
   * @param p2y QUADRATIC: end y. CUBIC: second control y. LINEAR: 0.
   * @param p3x CUBIC: end x. Others: 0.
   * @param p3y CUBIC: end y. Others: 0.
   */
  constructor(
    type: SegmentType,
    p0x: number,
    p0y: number,
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
    p3x: number,
    p3y: number,
  ) {
    this.type = type;
    this.p0x = p0x;
    this.p0y = p0y;
    this.p1x = p1x;
    this.p1y = p1y;
    this.p2x = p2x;
    this.p2y = p2y;
    this.p3x = p3x;
    this.p3y = p3y;
    this.color = 7; // WHITE — overwritten by edgeColoringSimple
  }

  /** Endpoint x (the on-curve destination of this segment). */
  endX(): number {
    switch (this.type) {
      case LINEAR:
        return this.p1x;
      case QUADRATIC:
        return this.p2x;
      default:
        return this.p3x; // CUBIC
    }
  }

  /** Endpoint y. */
  endY(): number {
    switch (this.type) {
      case LINEAR:
        return this.p1y;
      case QUADRATIC:
        return this.p2y;
      default:
        return this.p3y; // CUBIC
    }
  }

  /**
   * Returns the point on the segment at parameter t ∈ [0,1].
   * port of core/edge-segments.cpp: LinearSegment::point, QuadraticSegment::point, CubicSegment::point
   *
   * @param param Parameter t.
   * @param out Two-element array [x, y] to write into (reuse to avoid allocation).
   */
  point(param: number, out: number[]): void {
    const t = param;
    switch (this.type) {
      case LINEAR: {
        // mix(p0, p1, t)
        out[0] = this.p0x + t * (this.p1x - this.p0x);
        out[1] = this.p0y + t * (this.p1y - this.p0y);
        return;
      }
      case QUADRATIC: {
        // mix(mix(p0,p1,t), mix(p1,p2,t), t)
        const m0x = this.p0x + t * (this.p1x - this.p0x);
        const m0y = this.p0y + t * (this.p1y - this.p0y);
        const m1x = this.p1x + t * (this.p2x - this.p1x);
        const m1y = this.p1y + t * (this.p2y - this.p1y);
        out[0] = m0x + t * (m1x - m0x);
        out[1] = m0y + t * (m1y - m0y);
        return;
      }
      default: {
        // CUBIC: de Casteljau
        const m01x = this.p0x + t * (this.p1x - this.p0x);
        const m01y = this.p0y + t * (this.p1y - this.p0y);
        const m12x = this.p1x + t * (this.p2x - this.p1x);
        const m12y = this.p1y + t * (this.p2y - this.p1y);
        const m23x = this.p2x + t * (this.p3x - this.p2x);
        const m23y = this.p2y + t * (this.p3y - this.p2y);
        const p12x = m01x + t * (m12x - m01x);
        const p12y = m01y + t * (m12y - m01y);
        const m23bx = m12x + t * (m23x - m12x);
        const m23by = m12y + t * (m23y - m12y);
        out[0] = p12x + t * (m23bx - p12x);
        out[1] = p12y + t * (m23by - p12y);
        return;
      }
    }
  }

  /**
   * Returns the (unnormalized) direction tangent at parameter t.
   * port of core/edge-segments.cpp: LinearSegment::direction, QuadraticSegment::direction, CubicSegment::direction
   *
   * @param param Parameter t.
   * @param out Two-element array [dx, dy] to write into.
   */
  direction(param: number, out: number[]): void {
    const t = param;
    switch (this.type) {
      case LINEAR: {
        out[0] = this.p1x - this.p0x;
        out[1] = this.p1y - this.p0y;
        return;
      }
      case QUADRATIC: {
        // mix(p1-p0, p2-p1, t); if zero -> p2-p0
        const tx = this.p1x - this.p0x + t * (this.p2x - this.p1x - (this.p1x - this.p0x));
        const ty = this.p1y - this.p0y + t * (this.p2y - this.p1y - (this.p1y - this.p0y));
        if (tx !== 0 || ty !== 0) {
          out[0] = tx;
          out[1] = ty;
        } else {
          out[0] = this.p2x - this.p0x;
          out[1] = this.p2y - this.p0y;
        }
        return;
      }
      default: {
        // CUBIC: mix(mix(p1-p0,p2-p1,t), mix(p2-p1,p3-p2,t), t)
        const d01x = this.p1x - this.p0x;
        const d01y = this.p1y - this.p0y;
        const d12x = this.p2x - this.p1x;
        const d12y = this.p2y - this.p1y;
        const d23x = this.p3x - this.p2x;
        const d23y = this.p3y - this.p2y;
        const tx =
          d01x + t * (d12x - d01x) + t * (d12x + t * (d23x - d12x) - (d01x + t * (d12x - d01x)));
        const ty =
          d01y + t * (d12y - d01y) + t * (d12y + t * (d23y - d12y) - (d01y + t * (d12y - d01y)));
        if (tx !== 0 || ty !== 0) {
          out[0] = tx;
          out[1] = ty;
        } else if (t === 0) {
          out[0] = this.p2x - this.p0x;
          out[1] = this.p2y - this.p0y;
        } else if (t === 1) {
          out[0] = this.p3x - this.p1x;
          out[1] = this.p3y - this.p1y;
        } else {
          out[0] = tx;
          out[1] = ty;
        }
        return;
      }
    }
  }

  /**
   * Splits the segment into thirds. Each of the 3 returned segments covers
   * [0,1/3], [1/3,2/3], [2/3,1] of the original parameter range.
   * port of core/edge-segments.cpp: LinearSegment::splitInThirds, QuadraticSegment::splitInThirds, CubicSegment::splitInThirds
   *
   * @returns Tuple [part0, part1, part2].
   */
  splitInThirds(): [EdgeSegment, EdgeSegment, EdgeSegment] {
    // Scratch arrays reused within this call (non-hot code path).
    const pa: number[] = [0, 0];
    const pb: number[] = [0, 0];
    switch (this.type) {
      case LINEAR: {
        this.point(1 / 3, pa);
        this.point(2 / 3, pb);
        const sl0 = new EdgeSegment(LINEAR, this.p0x, this.p0y, pa[0]!, pa[1]!, 0, 0, 0, 0);
        const sl1 = new EdgeSegment(LINEAR, pa[0]!, pa[1]!, pb[0]!, pb[1]!, 0, 0, 0, 0);
        const sl2 = new EdgeSegment(LINEAR, pb[0]!, pb[1]!, this.p1x, this.p1y, 0, 0, 0, 0);
        sl0.color = sl1.color = sl2.color = this.color;
        return [sl0, sl1, sl2];
      }
      case QUADRATIC: {
        // part0: (p0, mix(p0,p1,1/3), point(1/3))
        // part1: (point(1/3), mix(mix(p0,p1,5/9),mix(p1,p2,4/9),.5), point(2/3))
        // part2: (point(2/3), mix(p1,p2,2/3), p2)
        this.point(1 / 3, pa);
        this.point(2 / 3, pb);
        const ctrl0x = this.p0x + (1 / 3) * (this.p1x - this.p0x);
        const ctrl0y = this.p0y + (1 / 3) * (this.p1y - this.p0y);
        // mix(mix(p0,p1,5/9), mix(p1,p2,4/9), 0.5)
        const m59x = this.p0x + (5 / 9) * (this.p1x - this.p0x);
        const m59y = this.p0y + (5 / 9) * (this.p1y - this.p0y);
        const m49x = this.p1x + (4 / 9) * (this.p2x - this.p1x);
        const m49y = this.p1y + (4 / 9) * (this.p2y - this.p1y);
        const ctrl1x = m59x + 0.5 * (m49x - m59x);
        const ctrl1y = m59y + 0.5 * (m49y - m59y);
        const ctrl2x = this.p1x + (2 / 3) * (this.p2x - this.p1x);
        const ctrl2y = this.p1y + (2 / 3) * (this.p2y - this.p1y);
        const sq0 = new EdgeSegment(QUADRATIC, this.p0x, this.p0y, ctrl0x, ctrl0y, pa[0]!, pa[1]!, 0, 0);
        const sq1 = new EdgeSegment(QUADRATIC, pa[0]!, pa[1]!, ctrl1x, ctrl1y, pb[0]!, pb[1]!, 0, 0);
        const sq2 = new EdgeSegment(QUADRATIC, pb[0]!, pb[1]!, ctrl2x, ctrl2y, this.p2x, this.p2y, 0, 0);
        sq0.color = sq1.color = sq2.color = this.color;
        return [sq0, sq1, sq2];
      }
      default: {
        // CUBIC
        this.point(1 / 3, pa);
        this.point(2 / 3, pb);
        // part0 ctrl1: p0==p1 ? p0 : mix(p0,p1,1/3)
        const c0c1x =
          this.p0x === this.p1x && this.p0y === this.p1y
            ? this.p0x
            : this.p0x + (1 / 3) * (this.p1x - this.p0x);
        const c0c1y =
          this.p0x === this.p1x && this.p0y === this.p1y
            ? this.p0y
            : this.p0y + (1 / 3) * (this.p1y - this.p0y);
        // part0 ctrl2: mix(mix(p0,p1,1/3), mix(p1,p2,1/3), 1/3)
        const m01_13x = this.p0x + (1 / 3) * (this.p1x - this.p0x);
        const m01_13y = this.p0y + (1 / 3) * (this.p1y - this.p0y);
        const m12_13x = this.p1x + (1 / 3) * (this.p2x - this.p1x);
        const m12_13y = this.p1y + (1 / 3) * (this.p2y - this.p1y);
        const m23_13x = this.p2x + (1 / 3) * (this.p3x - this.p2x);
        const m23_13y = this.p2y + (1 / 3) * (this.p3y - this.p2y);
        const c0c2x = m01_13x + (1 / 3) * (m12_13x - m01_13x);
        const c0c2y = m01_13y + (1 / 3) * (m12_13y - m01_13y);
        // part1 ctrl1: mix(mix(mix(p0,p1,1/3),mix(p1,p2,1/3),1/3), mix(mix(p1,p2,1/3),mix(p2,p3,1/3),1/3), 2/3)
        const m1213_13x = m12_13x + (1 / 3) * (m23_13x - m12_13x);
        const m1213_13y = m12_13y + (1 / 3) * (m23_13y - m12_13y);
        const c1c1x = c0c2x + (2 / 3) * (m1213_13x - c0c2x);
        const c1c1y = c0c2y + (2 / 3) * (m1213_13y - c0c2y);
        // part2 and part1 ctrl2 use 2/3 splits
        const m01_23x = this.p0x + (2 / 3) * (this.p1x - this.p0x);
        const m01_23y = this.p0y + (2 / 3) * (this.p1y - this.p0y);
        const m12_23x = this.p1x + (2 / 3) * (this.p2x - this.p1x);
        const m12_23y = this.p1y + (2 / 3) * (this.p2y - this.p1y);
        const m23_23x = this.p2x + (2 / 3) * (this.p3x - this.p2x);
        const m23_23y = this.p2y + (2 / 3) * (this.p3y - this.p2y);
        const c0_23x = m01_23x + (2 / 3) * (m12_23x - m01_23x);
        const c0_23y = m01_23y + (2 / 3) * (m12_23y - m01_23y);
        const m1223_23x = m12_23x + (2 / 3) * (m23_23x - m12_23x);
        const m1223_23y = m12_23y + (2 / 3) * (m23_23y - m12_23y);
        // part1 ctrl2: mix(c0_23, m1223_23, 1/3)
        const c1c2x = c0_23x + (1 / 3) * (m1223_23x - c0_23x);
        const c1c2y = c0_23y + (1 / 3) * (m1223_23y - c0_23y);
        // part2 ctrl1: mix(m12_23, m23_23, 2/3) = m1223_23
        // part2 ctrl2: p2==p3 ? p3 : mix(p2,p3,2/3)
        const c2c2x =
          this.p2x === this.p3x && this.p2y === this.p3y
            ? this.p3x
            : this.p2x + (2 / 3) * (this.p3x - this.p2x);
        const c2c2y =
          this.p2x === this.p3x && this.p2y === this.p3y
            ? this.p3y
            : this.p2y + (2 / 3) * (this.p3y - this.p2y);
        const sc0 = new EdgeSegment(CUBIC, this.p0x, this.p0y, c0c1x, c0c1y, c0c2x, c0c2y, pa[0]!, pa[1]!);
        const sc1 = new EdgeSegment(CUBIC, pa[0]!, pa[1]!, c1c1x, c1c1y, c1c2x, c1c2y, pb[0]!, pb[1]!);
        const sc2 = new EdgeSegment(
          CUBIC,
          pb[0]!,
          pb[1]!,
          m1223_23x,
          m1223_23y,
          c2c2x,
          c2c2y,
          this.p3x,
          this.p3y,
        );
        sc0.color = sc1.color = sc2.color = this.color;
        return [sc0, sc1, sc2];
      }
    }
  }

  /**
   * Computes the signed distance from `origin` to this segment, writing the
   * result (distance, alignment dot, nearest parameter) into `out`.
   * port of core/edge-segments.cpp:
   *   LinearSegment / QuadraticSegment / CubicSegment ::signedDistance
   *
   * The sign follows the edge winding via `nonZeroSign(crossProduct(...))`.
   * Hot path: uses only local number variables and the module-scope root buffer.
   *
   * @param ox Query point x (shape space).
   * @param oy Query point y (shape space).
   * @param out Reusable result object (mutated).
   */
  signedDistance(ox: number, oy: number, out: SignedDistanceResult): void {
    switch (this.type) {
      case LINEAR: {
        const p0x = this.p0x,
          p0y = this.p0y,
          p1x = this.p1x,
          p1y = this.p1y;
        const aqx = ox - p0x,
          aqy = oy - p0y;
        const abx = p1x - p0x,
          aby = p1y - p0y;
        const abLen2 = abx * abx + aby * aby;
        const param = (aqx * abx + aqy * aby) / abLen2;
        // eq = p[param > .5] - origin
        const useEnd = param > 0.5;
        const ex = (useEnd ? p1x : p0x) - ox;
        const ey = (useEnd ? p1y : p0y) - oy;
        const endpointDistance = Math.sqrt(_sqDistFMA(ex, ey));
        if (param > 0 && param < 1) {
          // port of core/edge-segments.cpp: LinearSegment::signedDistance, orthoDistance
          // C++ uses dot(ab.getOrthonormal(false), aq) = (aby/len)*aqx + (-abx/len)*aqy.
          // Normalizing FIRST (divide-then-multiply) gives exact results for axis-aligned edges,
          // matching ARM64 -O3 FMA behavior where abLen uses fmadd.
          const abLen = Math.sqrt(_sqDistFMA(abx, aby));
          const abNx = abx / abLen;
          const abNy = aby / abLen;
          const orthoDistance = abNy * aqx - abNx * aqy;
          if (Math.abs(orthoDistance) < endpointDistance) {
            out.distance = orthoDistance;
            out.dot = 0;
            out.param = param;
            return;
          }
        }
        // C++: nonZeroSign(crossProduct(aq, ab)) where aq = origin-p[0]
        // crossProduct(aq, ab) = aqx*aby - aqy*abx (uniform for all param values)
        const cross = aqx * aby - aqy * abx;
        out.distance = nonZeroSign(cross) * endpointDistance;
        // dot = |dot(ab.normalize(), eq.normalize())| using FMA-matched length
        const abLen = Math.sqrt(_sqDistFMA(abx, aby));
        out.dot =
          endpointDistance === 0 || abLen === 0
            ? 0
            : Math.abs((abx * ex + aby * ey) / (abLen * endpointDistance));
        out.param = param;
        return;
      }
      case QUADRATIC: {
        const p0x = this.p0x,
          p0y = this.p0y,
          p1x = this.p1x,
          p1y = this.p1y,
          p2x = this.p2x,
          p2y = this.p2y;
        const qax = p0x - ox,
          qay = p0y - oy;
        const abx = p1x - p0x,
          aby = p1y - p0y;
        const brx = p2x - p1x - abx,
          bry = p2y - p1y - aby;
        const a = brx * brx + bry * bry;
        const b = 3 * (abx * brx + aby * bry);
        const c = 2 * (abx * abx + aby * aby) + (qax * brx + qay * bry);
        const d = qax * abx + qay * aby;
        const solutions = solveCubic(_roots, a, b, c, d);

        // epDir = direction(0) = ab (nonzero for a real quadratic)
        let epDirx = abx,
          epDiry = aby;
        const qaLen = Math.sqrt(_sqDistFMA(qax, qay));
        let minDistance = nonZeroSign(epDirx * qay - epDiry * qax) * qaLen;
        let param = -(qax * epDirx + qay * epDiry) / (epDirx * epDirx + epDiry * epDiry);
        {
          const bqx = p2x - ox,
            bqy = p2y - oy;
          const distB = Math.sqrt(_sqDistFMA(bqx, bqy));
          if (distB < Math.abs(minDistance)) {
            // epDir = direction(1) = p2 - p1
            epDirx = p2x - p1x;
            epDiry = p2y - p1y;
            minDistance = nonZeroSign(epDirx * bqy - epDiry * bqx) * distB;
            // param = dot(origin - p1, epDir)/dot(epDir,epDir)
            param =
              ((ox - p1x) * epDirx + (oy - p1y) * epDiry) / (epDirx * epDirx + epDiry * epDiry);
          }
        }
        for (let i = 0; i < solutions; ++i) {
          const t = _roots[i]!;
          if (t > 0 && t < 1) {
            // qe = qa + 2t*ab + t²*br
            const qex = qax + 2 * t * abx + t * t * brx;
            const qey = qay + 2 * t * aby + t * t * bry;
            const distance = Math.sqrt(_sqDistFMA(qex, qey));
            if (distance <= Math.abs(minDistance)) {
              // dir = ab + t*br
              const dirx = abx + t * brx;
              const diry = aby + t * bry;
              minDistance = nonZeroSign(dirx * qey - diry * qex) * distance;
              param = t;
            }
          }
        }

        if (param >= 0 && param <= 1) {
          out.distance = minDistance;
          out.dot = 0;
          out.param = param;
          return;
        }
        out.distance = minDistance;
        out.param = param;
        if (param < 0.5) {
          // |dot(direction(0).normalize(), qa.normalize())|
          const dl = Math.sqrt(abx * abx + aby * aby);
          out.dot = qaLen === 0 || dl === 0 ? 0 : Math.abs((abx * qax + aby * qay) / (dl * qaLen));
        } else {
          const d1x = p2x - p1x,
            d1y = p2y - p1y;
          const bqx = p2x - ox,
            bqy = p2y - oy;
          const dl = Math.sqrt(d1x * d1x + d1y * d1y);
          const bl = Math.sqrt(bqx * bqx + bqy * bqy);
          out.dot = dl === 0 || bl === 0 ? 0 : Math.abs((d1x * bqx + d1y * bqy) / (dl * bl));
        }
        return;
      }
      default: {
        // CUBIC
        const p0x = this.p0x,
          p0y = this.p0y,
          p1x = this.p1x,
          p1y = this.p1y,
          p2x = this.p2x,
          p2y = this.p2y,
          p3x = this.p3x,
          p3y = this.p3y;
        const qax = p0x - ox,
          qay = p0y - oy;
        const abx = p1x - p0x,
          aby = p1y - p0y;
        const brx = p2x - p1x - abx,
          bry = p2y - p1y - aby;
        const asx = p3x - p2x - (p2x - p1x) - brx;
        const asy = p3y - p2y - (p2y - p1y) - bry;

        // epDir = direction(0)
        let epDirx = abx,
          epDiry = aby;
        if (epDirx === 0 && epDiry === 0) {
          epDirx = p2x - p0x;
          epDiry = p2y - p0y;
        }
        const qaLen = Math.sqrt(_sqDistFMA(qax, qay));
        let minDistance = nonZeroSign(epDirx * qay - epDiry * qax) * qaLen;
        let param = -(qax * epDirx + qay * epDiry) / (epDirx * epDirx + epDiry * epDiry);
        {
          const bqx = p3x - ox,
            bqy = p3y - oy;
          const distB = Math.sqrt(_sqDistFMA(bqx, bqy));
          if (distB < Math.abs(minDistance)) {
            // epDir = direction(1)
            let e1x = p3x - p2x,
              e1y = p3y - p2y;
            if (e1x === 0 && e1y === 0) {
              e1x = p3x - p1x;
              e1y = p3y - p1y;
            }
            epDirx = e1x;
            epDiry = e1y;
            minDistance = nonZeroSign(epDirx * bqy - epDiry * bqx) * distB;
            // param = dot(epDir - (p3-origin), epDir)/dot(epDir,epDir)
            param =
              ((epDirx - bqx) * epDirx + (epDiry - bqy) * epDiry) /
              (epDirx * epDirx + epDiry * epDiry);
          }
        }
        for (let i = 0; i <= CUBIC_SEARCH_STARTS; ++i) {
          let t = (1 / CUBIC_SEARCH_STARTS) * i;
          let qex = qax + 3 * t * abx + 3 * t * t * brx + t * t * t * asx;
          let qey = qay + 3 * t * aby + 3 * t * t * bry + t * t * t * asy;
          let d1x = 3 * abx + 6 * t * brx + 3 * t * t * asx;
          let d1y = 3 * aby + 6 * t * bry + 3 * t * t * asy;
          let d2x = 6 * brx + 6 * t * asx;
          let d2y = 6 * bry + 6 * t * asy;
          let improvedT =
            t - (qex * d1x + qey * d1y) / (d1x * d1x + d1y * d1y + (qex * d2x + qey * d2y));
          if (improvedT > 0 && improvedT < 1) {
            let remainingSteps = CUBIC_SEARCH_STEPS;
            do {
              t = improvedT;
              qex = qax + 3 * t * abx + 3 * t * t * brx + t * t * t * asx;
              qey = qay + 3 * t * aby + 3 * t * t * bry + t * t * t * asy;
              d1x = 3 * abx + 6 * t * brx + 3 * t * t * asx;
              d1y = 3 * aby + 6 * t * bry + 3 * t * t * asy;
              if (!--remainingSteps) break;
              d2x = 6 * brx + 6 * t * asx;
              d2y = 6 * bry + 6 * t * asy;
              improvedT =
                t - (qex * d1x + qey * d1y) / (d1x * d1x + d1y * d1y + (qex * d2x + qey * d2y));
            } while (improvedT > 0 && improvedT < 1);
            const distance = Math.sqrt(_sqDistFMA(qex, qey));
            if (distance < Math.abs(minDistance)) {
              minDistance = nonZeroSign(d1x * qey - d1y * qex) * distance;
              param = t;
            }
          }
        }

        if (param >= 0 && param <= 1) {
          out.distance = minDistance;
          out.dot = 0;
          out.param = param;
          return;
        }
        out.distance = minDistance;
        out.param = param;
        if (param < 0.5) {
          let dx = abx,
            dy = aby;
          if (dx === 0 && dy === 0) {
            dx = p2x - p0x;
            dy = p2y - p0y;
          }
          const dl = Math.sqrt(dx * dx + dy * dy);
          out.dot = qaLen === 0 || dl === 0 ? 0 : Math.abs((dx * qax + dy * qay) / (dl * qaLen));
        } else {
          let dx = p3x - p2x,
            dy = p3y - p2y;
          if (dx === 0 && dy === 0) {
            dx = p3x - p1x;
            dy = p3y - p1y;
          }
          const bqx = p3x - ox,
            bqy = p3y - oy;
          const dl = Math.sqrt(dx * dx + dy * dy);
          const bl = Math.sqrt(bqx * bqx + bqy * bqy);
          out.dot = dl === 0 || bl === 0 ? 0 : Math.abs((dx * bqx + dy * bqy) / (dl * bl));
        }
        return;
      }
    }
  }

  /**
   * Computes the x-coordinates where a horizontal scanline at height `y`
   * crosses this segment, together with the vertical crossing direction.
   * port of core/edge-segments.cpp:
   *   LinearSegment / QuadraticSegment / CubicSegment ::scanlineIntersections
   *
   * @param y Scanline height (shape space).
   * @param xOut Output array (length >= 3) — crossing x-coordinates.
   * @param dyOut Output array (length >= 3) — crossing directions (±1).
   * @returns Number of crossings written (0..3).
   */
  scanlineIntersections(y: number, xOut: number[], dyOut: number[]): number {
    switch (this.type) {
      case LINEAR: {
        const p0y = this.p0y,
          p1y = this.p1y;
        if ((y >= p0y && y < p1y) || (y >= p1y && y < p0y)) {
          const param = (y - p0y) / (p1y - p0y);
          xOut[0] = mix(this.p0x, this.p1x, param);
          dyOut[0] = sign(p1y - p0y);
          return 1;
        }
        return 0;
      }
      case QUADRATIC: {
        const p0x = this.p0x,
          p0y = this.p0y,
          p1x = this.p1x,
          p1y = this.p1y,
          p2x = this.p2x,
          p2y = this.p2y;
        let total = 0;
        let nextDY = y > p0y ? 1 : -1;
        xOut[total] = p0x;
        if (p0y === y) {
          if (p0y < p1y || (p0y === p1y && p0y < p2y)) dyOut[total++] = 1;
          else nextDY = 1;
        }
        {
          const abx = p1x - p0x,
            aby = p1y - p0y;
          const brx = p2x - p1x - abx,
            bry = p2y - p1y - aby;
          const solutions = solveQuadratic(_roots, bry, 2 * aby, p0y - y);
          // Sort the first two solutions ascending.
          if (solutions >= 2 && _roots[0]! > _roots[1]!) {
            const tmp = _roots[0]!;
            _roots[0] = _roots[1]!;
            _roots[1] = tmp;
          }
          for (let i = 0; i < solutions && total < 2; ++i) {
            const t = _roots[i]!;
            if (t >= 0 && t <= 1) {
              xOut[total] = p0x + 2 * t * abx + t * t * brx;
              if (nextDY * (aby + t * bry) >= 0) {
                dyOut[total++] = nextDY;
                nextDY = -nextDY;
              }
            }
          }
        }
        if (p2y === y) {
          if (nextDY > 0 && total > 0) {
            --total;
            nextDY = -1;
          }
          if ((p2y < p1y || (p2y === p1y && p2y < p0y)) && total < 2) {
            xOut[total] = p2x;
            if (nextDY < 0) {
              dyOut[total++] = -1;
              nextDY = 1;
            }
          }
        }
        if (nextDY !== (y >= p2y ? 1 : -1)) {
          if (total > 0) --total;
          else {
            if (Math.abs(p2y - y) < Math.abs(p0y - y)) xOut[total] = p2x;
            dyOut[total++] = nextDY;
          }
        }
        return total;
      }
      default: {
        // CUBIC
        const p0x = this.p0x,
          p0y = this.p0y,
          p1x = this.p1x,
          p1y = this.p1y,
          p2x = this.p2x,
          p2y = this.p2y,
          p3x = this.p3x,
          p3y = this.p3y;
        let total = 0;
        let nextDY = y > p0y ? 1 : -1;
        xOut[total] = p0x;
        if (p0y === y) {
          if (p0y < p1y || (p0y === p1y && (p0y < p2y || (p0y === p2y && p0y < p3y))))
            dyOut[total++] = 1;
          else nextDY = 1;
        }
        {
          const ax = p3x - 3 * p2x + 3 * p1x - p0x;
          const ay = p3y - 3 * p2y + 3 * p1y - p0y;
          const bx = 3 * p2x - 6 * p1x + 3 * p0x;
          const by = 3 * p2y - 6 * p1y + 3 * p0y;
          const cx = 3 * p1x - 3 * p0x;
          const cy = 3 * p1y - 3 * p0y;
          const solutions = solveCubic(_roots, ay, by, cy, p0y - y);
          // Sort solutions ascending (up to 3).
          if (solutions >= 2) {
            if (_roots[0]! > _roots[1]!) {
              const t = _roots[0]!;
              _roots[0] = _roots[1]!;
              _roots[1] = t;
            }
            if (solutions >= 3 && _roots[1]! > _roots[2]!) {
              const t = _roots[1]!;
              _roots[1] = _roots[2]!;
              _roots[2] = t;
              if (_roots[0]! > _roots[1]!) {
                const t2 = _roots[0]!;
                _roots[0] = _roots[1]!;
                _roots[1] = t2;
              }
            }
          }
          for (let i = 0; i < solutions && total < 3; ++i) {
            const t = _roots[i]!;
            if (t >= 0 && t <= 1) {
              xOut[total] = ((ax * t + bx) * t + cx) * t + p0x;
              if (nextDY * ((3 * ay * t + 2 * by) * t + cy) >= 0) {
                dyOut[total++] = nextDY;
                nextDY = -nextDY;
              }
            }
          }
        }
        if (p3y === y) {
          if (nextDY > 0 && total > 0) {
            --total;
            nextDY = -1;
          }
          if (
            (p3y < p2y || (p3y === p2y && (p3y < p1y || (p3y === p1y && p3y < p0y)))) &&
            total < 3
          ) {
            xOut[total] = p3x;
            if (nextDY < 0) {
              dyOut[total++] = -1;
              nextDY = 1;
            }
          }
        }
        if (nextDY !== (y >= p3y ? 1 : -1)) {
          if (total > 0) --total;
          else {
            if (Math.abs(p3y - y) < Math.abs(p0y - y)) xOut[total] = p3x;
            dyOut[total++] = nextDY;
          }
        }
        return total;
      }
    }
  }

  /**
   * Converts a QUADRATIC segment to a degree-elevated CUBIC equivalent.
   * port of core/edge-segments.cpp: QuadraticSegment::convertToCubic
   *
   * Only valid when `this.type === QUADRATIC`.
   * @returns A new CUBIC EdgeSegment with identical geometry.
   */
  convertToCubic(): EdgeSegment {
    // Degree elevation: ctrl1 = mix(p0, ctrl, 2/3), ctrl2 = mix(ctrl, p2, 1/3)
    const c1x = this.p0x + (2 / 3) * (this.p1x - this.p0x);
    const c1y = this.p0y + (2 / 3) * (this.p1y - this.p0y);
    const c2x = this.p1x + (1 / 3) * (this.p2x - this.p1x);
    const c2y = this.p1y + (1 / 3) * (this.p2y - this.p1y);
    const cubic = new EdgeSegment(CUBIC, this.p0x, this.p0y, c1x, c1y, c2x, c2y, this.p2x, this.p2y);
    cubic.color = this.color;
    return cubic;
  }
}
