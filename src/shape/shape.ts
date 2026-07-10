import { type Contour } from "./contour.js";

/**
 * A glyph outline — a collection of closed contours.
 *
 * `inverseYAxis`: when true, the y-axis points down (screen space).
 * TrueType font coordinates are y-up; this flag is flipped at the atlas
 * boundary, in exactly one place, when blitting to a texture.
 */
export interface Shape {
  contours: Contour[];
  inverseYAxis: boolean;
}
