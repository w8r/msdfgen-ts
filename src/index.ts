// Public API surface.
// Em-normalisation (÷ unitsPerEm) is NOT applied at parse time — Atlas
// applies it, plus the float→byte quantization, at glyph-generation time.

export type { Shape } from "./shape/shape";
export type { Contour } from "./shape/contour";
export { EdgeSegment, LINEAR, QUADRATIC, CUBIC } from "./shape/segments";
export type { SegmentType } from "./shape/segments";
export { Font } from "./font/font";
export type { FontMetrics } from "./font/font";
export { Atlas, pixelFloatToByte } from "./atlas/atlas";
export type { AtlasOptions, GlyphInfo } from "./atlas/atlas";
