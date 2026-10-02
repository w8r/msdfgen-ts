# Changelog

## 0.1.0

First release.

- **MSDF generation:** a TypeScript port of [msdfgen](https://github.com/Chlumsky/msdfgen)'s core, including edge coloring, scanline sign correction and full error correction. Output matches the C++ reference to within 1e-4 per texel, verified in CI against 1158 golden bitmaps.
- **TrueType parser:** `glyf` outlines (simple and composite glyphs), `cmap` formats 4 and 12, metrics, and `kern` format 0 kerning.
- **`Atlas`:** generates glyphs on demand and packs them into one RGBA8 texture. Includes `layout()` and `layoutMultiline()` for kerned text, `glyphs()` for character ranges, and `glyphsByIndex()` for icon fonts.
- **`msdfgen-ts/worker`:** builds atlases in a Web Worker.
- **Package:** ES module, IIFE (`MsdfgenTs` global) and TypeScript types; 14 KB gzipped; no WASM; one dependency (potpack).

Known limitations: TrueType outlines only (no CFF/OTF or variable fonts), no text shaping, and generation takes about 2–10 ms per glyph at 48 px/em.
