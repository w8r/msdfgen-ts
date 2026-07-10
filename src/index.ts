// Public API surface for M1.
// Em-normalisation (÷ unitsPerEm) is NOT applied here — that happens at
// a single named boundary in M3 when blitting to the atlas texture.

export type { Shape } from "./shape/shape.js";
export type { Contour } from "./shape/contour.js";
export { EdgeSegment, LINEAR, QUADRATIC, CUBIC } from "./shape/segments.js";
export type { SegmentType } from "./shape/segments.js";
export { Font } from "./font/font.js";
export type { FontMetrics } from "./font/font.js";
