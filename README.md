# msdfgen-ts

Crisp text at any size for WebGL and WebGPU. Load a TrueType font, get a multi-channel signed distance field (MSDF) atlas, all at runtime in the browser.

**[Live demos](https://w8r.github.io/msdfgen-ts/)** · minimal examples: [WebGPU](demo/hello-webgpu/main.ts), [WebGL2](demo/hello-webgl/main.ts)

- TypeScript port of [msdfgen](https://github.com/Chlumsky/msdfgen) that matches the C++ output to 1e-4 per texel
- Built-in TrueType parser with kerning
- 14 KB gzipped, no WASM, one tiny dependency ([potpack](https://github.com/mapbox/potpack))

## Install

```sh
npm install msdfgen-ts
```

## Usage

```ts
import { Font, Atlas } from "msdfgen-ts";

const font = new Font(await (await fetch("Roboto.ttf")).arrayBuffer());
const atlas = new Atlas(font, { pixelsPerEm: 48, pxrange: 4 });

const { glyphs } = atlas.layout("Hello, world!");
```

`atlas.texture` is an RGBA8 `Uint8Array` (`atlas.width × atlas.height`, row 0 at the top), ready for `writeTexture` / `texImage2D`. Each laid-out glyph gives you one quad, in em units (multiply by your font size in pixels):

```ts
for (const { glyph: g, penX, penY } of glyphs) {
  const quad = [penX + g.planeLeft, penY + g.planeBottom, penX + g.planeRight, penY + g.planeTop]; // y-up
  const uv = [(g.x + 0.5) / atlas.width, (g.y + 0.5) / atlas.height,
              (g.w - 1) / atlas.width, (g.h - 1) / atlas.height]; // x, y, w, h
}
```

Draw it with the standard MSDF fragment shader, where `screenPxRange = atlas.pxrangeEm * fontSizePx`:

```glsl
float median(float a, float b, float c) { return max(min(a, b), min(max(a, b), c)); }

void main() {
  vec3 s = texture(atlas, uv).rgb;
  float opacity = clamp(screenPxRange * (median(s.r, s.g, s.b) - 0.5) + 0.5, 0.0, 1.0);
  color = vec4(textColor.rgb, textColor.a * opacity);
}
```

Enable alpha blending (glyph quads overlap), use linear texture filtering, and measure `fontSizePx` in device pixels (CSS size × `devicePixelRatio`). The complete setup is in the minimal examples: [WebGPU](demo/hello-webgpu/main.ts) and [WebGL2](demo/hello-webgl/main.ts).

### More

- **Multi-line text:** `atlas.layoutMultiline("line one\nline two")`.
- **Preload a character range:** `atlas.glyphs(codepoints)` generates any iterable of codepoints in one batch, e.g. all of Latin and Cyrillic up front.
- **Icon fonts:** `atlas.glyphsByIndex(ids)` addresses glyphs by index, for glyphs with no codepoint. `font.numGlyphs` gives the count.
- **Adding glyphs repacks the atlas.** Glyph objects are updated in place, so keep the objects you got and re-read `x`/`y` after adding more; don't copy them into variables.
- **Off the main thread:** `msdfgen-ts/worker` runs the same build in a Web Worker. See [`src/atlas-worker.ts`](src/atlas-worker.ts) for the message protocol.

## Limitations

- TrueType (`glyf`) outlines only. No CFF/OTF, no variable fonts.
- No text shaping (ligatures, complex scripts). Kerning comes from the `kern` table only.
- Generation takes about 2–10 ms per glyph at 48 px/em, depending on complexity. Build atlases up front or in the worker, not per frame.

## Demos

```sh
npm install
npm run dev:hello-webgpu  # also: dev:hello-webgl, dev:webgpu-zoom, dev:webgl-zoom, dev:lucide, dev:bench
```

## Development

```sh
npm run setup-reference   # build the C++ msdfgen reference binary (needs cmake, freetype, libpng)
npm run gate:all          # full test suite, including the 1158-case golden comparison against msdfgen
npm run build             # dist/: ES module, IIFE, worker, types
```

How the algorithm works, with diagrams: [docs/algorithm.md](docs/algorithm.md). Project conventions: [CLAUDE.md](CLAUDE.md).

## License

MIT. Includes a port of [msdfgen](https://github.com/Chlumsky/msdfgen) © Viktor Chlumský, also MIT.
