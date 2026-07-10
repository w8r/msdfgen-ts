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
}
