// Public API surface.
// Em-normalisation (÷ unitsPerEm) is NOT applied at parse time — Atlas
// applies it, plus the float→byte quantization, at glyph-generation time.

export type { Shape } from "./shape/shape.js";
export type { Contour } from "./shape/contour.js";
export { EdgeSegment, LINEAR, QUADRATIC, CUBIC } from "./shape/segments.js";
export type { SegmentType } from "./shape/segments.js";
export { Font } from "./font/font.js";
export type { FontMetrics } from "./font/font.js";
export { Atlas, pixelFloatToByte } from "./atlas/atlas.js";
export type { AtlasOptions, GlyphInfo } from "./atlas/atlas.js";
