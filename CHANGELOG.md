# Changelog

## Unreleased

- **`parseSvg` no longer leaves a hole where two overlapping elements are drawn in opposite directions.** Each element is wound the same way before they are merged (the largest contour of an element decides), so they union instead of cancelling out. `parseSvgLayers` is unchanged: its layers are filled one by one.

## v0.3.0

- **Kerning matches Chrome:** `Atlas.layout()` and `Font.kerning()` now read GPOS (pair, single and contextual positioning, with GDEF lookup flags), not only the legacy `kern` table, so fonts such as Roboto and Noto Sans are kerned. Text is split into script runs the way Chrome splits it, and kerning never crosses a run. Default-ignorable characters are hidden, and space characters a font lacks fall back to its space glyph, as in HarfBuzz. A test lays out every character pair of the test fonts in Chrome and checks that every glyph lands in the same place.
- **Faster layout:** `Atlas.layout()` is 14–45% faster on the test fonts despite the extra work, and fonts with a large `kern` table load about 90× faster (the table is no longer copied into a map).
- **Breaking:** `layout()` positions may change for any font with GPOS kerning, and `Font.kerning()` returns GPOS values.

## 0.2.0

- **SVG input:** `parseSvg(svg)` returns `{ shape, width }`, one merged shape for single-colour icons. `parseSvgLayers(svg)` returns `{ layers, width }`, one shape per filled path with its colour or gradient, for colour icons. Supported: paths and basic shapes, transforms, `.class` CSS, solid/linear/radial gradient fills, even-odd fills, clip paths, group opacity, clipping to the viewBox. No strokes, masks, filters, `<use>` outside clip paths, or `<text>`. No DOM.
- **`Atlas.shapes(entries)`:** packs any shape under a key of your choice, in the same texture as glyphs. `new Atlas(null, opts)` makes an atlas without a font.
- **`generateShapeMSDF(shape, pixelsPerUnit, pxrange)`:** one shape's float MSDF and plane bounds, without an atlas.
- **`float` option:** `atlas.floatTexture` holds the same cells as unclamped float RGB, for deep zoom.
- **Tree-shakeable:** a font-only app doesn't bundle the SVG parser, and an SVG-only app doesn't bundle the TrueType parser.
- **Demos:** `hello-svg` (minimal colour-SVG example), `svg` (import any SVG, gradients), `svg-bounce` (10,000 instances in one draw call).

## 0.1.1

- Overlapping contours are merged before generation, fixing cracks where glyph parts overlap; glyph quads no longer stretch their UVs.

## 0.1.0

First release.

- **MSDF generation:** a TypeScript port of [msdfgen](https://github.com/Chlumsky/msdfgen)'s core, including edge coloring, scanline sign correction and full error correction. Output matches the C++ reference to within 1e-4 per texel, verified in CI against 1158 golden bitmaps.
- **TrueType parser:** `glyf` outlines (simple and composite glyphs), `cmap` formats 4 and 12, metrics, and `kern` format 0 kerning.
- **`Atlas`:** generates glyphs on demand and packs them into one RGBA8 texture. Includes `layout()` and `layoutMultiline()` for kerned text, `glyphs()` for character ranges, and `glyphsByIndex()` for icon fonts.
- **`msdfgen-ts/worker`:** builds atlases in a Web Worker.
- **Package:** ES module, IIFE (`MsdfgenTs` global) and TypeScript types; 14 KB gzipped; no WASM; one dependency (potpack).

Known limitations: TrueType outlines only (no CFF/OTF or variable fonts), no text shaping, and generation takes about 2–10 ms per glyph at 48 px/em.
