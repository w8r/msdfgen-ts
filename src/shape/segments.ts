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

/** Segment type tags — match C++ msdfgen's EdgeType enum. */
export const LINEAR = 0 as const;
export const QUADRATIC = 1 as const;
export const CUBIC = 2 as const;

export type SegmentType = typeof LINEAR | typeof QUADRATIC | typeof CUBIC;

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
        const tx = (this.p1x - this.p0x) + t * ((this.p2x - this.p1x) - (this.p1x - this.p0x));
        const ty = (this.p1y - this.p0y) + t * ((this.p2y - this.p1y) - (this.p1y - this.p0y));
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
        const tx = (d01x + t * (d12x - d01x)) + t * ((d12x + t * (d23x - d12x)) - (d01x + t * (d12x - d01x)));
        const ty = (d01y + t * (d12y - d01y)) + t * ((d12y + t * (d23y - d12y)) - (d01y + t * (d12y - d01y)));
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
        return [
          new EdgeSegment(LINEAR, this.p0x, this.p0y, pa[0]!, pa[1]!, 0, 0, 0, 0),
          new EdgeSegment(LINEAR, pa[0]!, pa[1]!, pb[0]!, pb[1]!, 0, 0, 0, 0),
          new EdgeSegment(LINEAR, pb[0]!, pb[1]!, this.p1x, this.p1y, 0, 0, 0, 0),
        ];
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
        return [
          new EdgeSegment(QUADRATIC, this.p0x, this.p0y, ctrl0x, ctrl0y, pa[0]!, pa[1]!, 0, 0),
          new EdgeSegment(QUADRATIC, pa[0]!, pa[1]!, ctrl1x, ctrl1y, pb[0]!, pb[1]!, 0, 0),
          new EdgeSegment(QUADRATIC, pb[0]!, pb[1]!, ctrl2x, ctrl2y, this.p2x, this.p2y, 0, 0),
        ];
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
        return [
          new EdgeSegment(CUBIC, this.p0x, this.p0y, c0c1x, c0c1y, c0c2x, c0c2y, pa[0]!, pa[1]!),
          new EdgeSegment(CUBIC, pa[0]!, pa[1]!, c1c1x, c1c1y, c1c2x, c1c2y, pb[0]!, pb[1]!),
          new EdgeSegment(CUBIC, pb[0]!, pb[1]!, m1223_23x, m1223_23y, c2c2x, c2c2y, this.p3x, this.p3y),
        ];
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
    return new EdgeSegment(CUBIC, this.p0x, this.p0y, c1x, c1y, c2x, c2y, this.p2x, this.p2y);
  }
}
