/**
 * Scanline fill testing for distance-field sign correction.
 *
 * Ported from core/Scanline.cpp and core/Shape.cpp: Shape::scanline.
 * msdfgen © Viktor Chlumský — MIT licence.
 */

import { sign } from "../math/scalar.js";
import { type Shape } from "./shape.js";

/** Fill-rule tags — match C++ msdfgen's FillRule enum. */
export const FILL_NONZERO = 0 as const;
export const FILL_ODD = 1 as const;
export const FILL_POSITIVE = 2 as const;
export const FILL_NEGATIVE = 3 as const;

export type FillRule =
  | typeof FILL_NONZERO
  | typeof FILL_ODD
  | typeof FILL_POSITIVE
  | typeof FILL_NEGATIVE;

/**
 * Interprets an accumulated winding number under a fill rule.
 * port of core/Scanline.cpp: interpretFillRule
 *
 * @param intersections Accumulated signed crossing count at a point.
 * @param fillRule Fill rule to apply.
 * @returns True when the point is considered filled.
 */
export function interpretFillRule(intersections: number, fillRule: FillRule): boolean {
  switch (fillRule) {
    case FILL_NONZERO:
      return intersections !== 0;
    case FILL_ODD:
      return (intersections & 1) !== 0;
    case FILL_POSITIVE:
      return intersections > 0;
    case FILL_NEGATIVE:
      return intersections < 0;
  }
  return false;
}

/** A single scanline crossing: x-coordinate and running winding direction. */
interface Intersection {
  x: number;
  direction: number;
}

/**
 * A horizontal scanline through a shape, storing sorted edge crossings with
 * prefix-summed winding directions for O(log n) fill queries.
 * port of core/Scanline.cpp: Scanline
 */
export class Scanline {
  private _intersections: Intersection[] = [];
  private _lastIndex = 0;

  /**
   * Replaces the crossings, sorting by x and prefix-summing the directions.
   * port of core/Scanline.cpp: Scanline::setIntersections + preprocess
   *
   * @param intersections Unsorted crossings (ownership transferred; mutated).
   */
  setIntersections(intersections: Intersection[]): void {
    this._intersections = intersections;
    this._lastIndex = 0;
    if (intersections.length > 0) {
      // Stable ordering by x, matching qsort with a sign() comparator.
      intersections.sort((a, b) => sign(a.x - b.x));
      let totalDirection = 0;
      for (let i = 0; i < intersections.length; i++) {
        totalDirection += intersections[i]!.direction;
        intersections[i]!.direction = totalDirection;
      }
    }
  }

  /**
   * Finds the index of the last crossing at or before x (or -1).
   * port of core/Scanline.cpp: Scanline::moveTo
   * @param x Query x-coordinate.
   * @returns Index into the sorted crossings, or -1 when x precedes all.
   */
  private _moveTo(x: number): number {
    const n = this._intersections.length;
    if (n === 0) return -1;
    let index = this._lastIndex;
    if (x < this._intersections[index]!.x) {
      do {
        if (index === 0) {
          this._lastIndex = 0;
          return -1;
        }
        --index;
      } while (x < this._intersections[index]!.x);
    } else {
      while (index < n - 1 && x >= this._intersections[index + 1]!.x) ++index;
    }
    this._lastIndex = index;
    return index;
  }

  /**
   * Returns the accumulated winding number at x.
   * port of core/Scanline.cpp: Scanline::sumIntersections
   * @param x Query x-coordinate.
   * @returns Signed winding number.
   */
  sumIntersections(x: number): number {
    const index = this._moveTo(x);
    if (index >= 0) return this._intersections[index]!.direction;
    return 0;
  }

  /**
   * Tests whether the point at x is filled under the given fill rule.
   * port of core/Scanline.cpp: Scanline::filled
   * @param x Query x-coordinate.
   * @param fillRule Fill rule to apply.
   * @returns True when filled.
   */
  filled(x: number, fillRule: FillRule): boolean {
    return interpretFillRule(this.sumIntersections(x), fillRule);
  }
}

/** Scratch crossing buffers for {@link computeShapeScanline} (module-scope). */
const _xScratch = [0, 0, 0];
const _dyScratch = [0, 0, 0];

/**
 * Fills `line` with the crossings of `shape` at height `y`.
 * port of core/Shape.cpp: Shape::scanline
 *
 * @param shape Shape to intersect (contours of EdgeSegment).
 * @param y Scanline height (shape space).
 * @param line Scanline to populate (its crossings are replaced).
 */
export function computeShapeScanline(shape: Shape, y: number, line: Scanline): void {
  const intersections: Intersection[] = [];
  for (const contour of shape.contours) {
    for (const edge of contour) {
      const n = edge.scanlineIntersections(y, _xScratch, _dyScratch);
      for (let i = 0; i < n; i++) {
        intersections.push({ x: _xScratch[i]!, direction: _dyScratch[i]! });
      }
    }
  }
  line.setIntersections(intersections);
}
