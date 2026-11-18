// Public API surface.
// Em-normalisation (÷ unitsPerEm) is NOT applied at parse time — Atlas
// applies it, plus the float→byte quantization, at glyph-generation time.

export type { Shape } from "./shape/shape";
export type { Contour } from "./shape/contour";
export { EdgeSegment, LINEAR, QUADRATIC, CUBIC } from "./shape/segments";
export type { SegmentType } from "./shape/segments";
export { Font } from "./font/font";
export type { FontMetrics } from "./font/font";
export { parseSvg, parseSvgLayers } from "./svg/svg";
export type { SvgLayer, SvgGradient } from "./svg/svg";
export { generateShapeMSDF } from "./msdf/shape-msdf";
export type { ShapeMSDF } from "./msdf/shape-msdf";
export { Atlas, pixelFloatToByte } from "./atlas-gen";
export type { AtlasOptions, AtlasGlyph, LaidOutGlyph } from "./atlas-gen";
