# msdfgen-ts

A zero-dependency TypeScript port of [Viktor Chlumský's msdfgen](https://github.com/Chlumsky/msdfgen) (core only), with a minimal built-in TrueType parser, runtime glyph atlas generation, and a WebGPU text rendering demo.

Runs entirely in the browser — no WASM, no server, no canvas fallbacks.

## Algorithm diagrams

Three SVG diagrams covering the pipeline, the per-pixel generation loop, and the data abstraction layers → **[docs/algorithm.md](docs/algorithm.md)**.

## What it does

1. **Parses TrueType fonts** (`glyf` outlines, `cmap`, `kern`, and metric tables) directly from an `ArrayBuffer`.
2. **Generates MSDF bitmaps** per glyph, numerically matching C++ msdfgen output to within 1×10⁻⁴ per texel.
3. **Packs glyphs** into a dynamically growing texture atlas.
4. **Renders text** with an interactive WebGPU demo: pan + smooth "infinite" zoom that stays crisp at any magnification via on-demand atlas tier switching.

**Target bundle size:** < 50 KB minified + gzip.

## What it doesn't do

- CFF / OTF cubic charstrings (planned for v2)
- Variable fonts (`gvar`, `fvar`)
- Text shaping, ligatures, complex scripts — kerning via `kern` table format 0 only
- SVG input or PNG output
- Node canvas / DOM inside the library itself

## Install

```
npm install msdfgen-ts   # not yet published — build from source for now
```

## Build from source

```sh
npm install
npm run build        # outputs ES module + IIFE to dist/
npm run size         # minified + gzip size report
```

### Run the WebGPU demo

```sh
npm run dev          # Vite dev server; open the demo/ entry in a WebGPU-capable browser
```

## API

```ts
import { Font, generateMSDF, distanceSignCorrection, msdfErrorCorrection } from 'msdfgen-ts';

// 1. Parse a font
const font = new Font(await fetch('/Inter.ttf').then(r => r.arrayBuffer()));

// 2. Get the shape for a glyph
const glyphId = font.glyphId(/* codepoint */ 'A'.codePointAt(0)!);
const shape   = font.shape(glyphId);   // quadratic-spline contours, em-normalised

// 3. Generate a 32×32 MSDF bitmap (pxrange = 4)
const out    = new Float32Array(32 * 32 * 3);
const scale  = 24;      // pixels per em
const tx     = 0.1;     // translate x (em units)
const ty     = 0.05;    // translate y (em units)
generateMSDF(shape, 32, 32, scale, tx, ty, 4 /* pxrange */, out);
distanceSignCorrection(out, shape, 32, 32, scale, tx, ty);
msdfErrorCorrection(out, shape, 32, 32, scale, tx, ty, 4);

// out is now ready to upload to WebGL / WebGPU as a 3-channel float texture
```

### Glyph metrics

```ts
const metrics = font.metrics(glyphId);
// { advanceWidth, lsb, xMin, yMin, xMax, yMax } — all in em units
```

### Atlas (glyph cache + packing)

```ts
import { Font, Atlas } from 'msdfgen-ts';

const font = new Font(await fetch('/Inter.ttf').then(r => r.arrayBuffer()));
const atlas = new Atlas(font, { size: 48, pxrange: 4 }); // px per em cell, distance range

for (const ch of 'Hello, world!') {
  const { rect, advance } = atlas.getGlyph(ch.codePointAt(0)!); // generates + packs on first miss
  // rect: { x, y, w, h } in atlas.texture texel space
  // advance: glyph advance width in em units
}

// atlas.texture: Uint8Array, RGBA8, width×height×4, y-down (row 0 = top)
// atlas.width / atlas.height grow (power of two) as more glyphs are added;
// already-packed rects never move, so cached GlyphInfo values stay valid.
gpuDevice.queue.writeTexture(/* ... */, atlas.texture, /* ... */, [atlas.width, atlas.height]);
```

## Repository layout

```
src/
  font/            TrueType parser (reader, sfnt, cmap, glyf, kern, …)
  shape/           Contour + edge-segment types, normalisation, scanline
  msdf/            Edge colouring, MSDF generation, error correction
  atlas/           Shelf packer, glyph cache
  math/            scalar helpers (no Vec2 in hot paths)
  index.ts         Public API surface
demo/
  webgpu/          Instanced-quad renderer, WGSL median shader (M5)
test/
  golden/          Committed fl32 fixtures from C++ msdfgen (read-only)
  parser/          Font-metric tests vs opentype.js
  msdf/            Full golden-diff suite (1158 cases)
tools/
  setup-reference.sh   Clones + builds msdfgen at pinned commit
  gen-golden.mjs       Generates test/golden/ fixtures
  bench.mjs            Performance benchmark
  atlas-preview.mjs    Dumps sample atlases to PNG for visual inspection
```

## Development commands

| Command | Description |
|---|---|
| `npm run gate:m0` | Test infrastructure (fixture comparator) |
| `npm run gate:m1` | Font parser — metrics + outlines vs opentype.js |
| `npm run gate:m2` | Signed-distance correctness |
| `npm run gate:m3` | Full MSDF golden diff (1158 cases, tolerance 1×10⁻⁴) |
| `npm run gate:m4` | Atlas: packer properties + glyph-cache + golden byte match |
| `npm run gen-golden` | Regenerate golden fixtures from C++ binary |
| `npm run setup-reference` | Clone + build the C++ reference binary |
| `npm run atlas-preview` | Dump sample atlases (Latin, Latin+Cyrillic, icons) to PNG — see below |
| `npm run lint` | oxlint |
| `npm run typecheck` | tsc --noEmit |

### Generating atlas preview PNGs

`tools/atlas-preview.mjs` builds a few real `Atlas` instances (Roboto ASCII, NotoSans
Latin+Cyrillic, Lucide icons) and writes two PNGs per atlas to `tools/atlas-preview-out/`
(gitignored — regenerate locally, don't commit them):

- `<name>.png` — the raw RGBA8 texture as uploaded to the GPU (3 packed MSDF channels;
  looks like colored noise — that's expected, it's not meant to be viewed directly).
- `<name>-reconstructed.png` — `median(R,G,B)` thresholded at 128, grayscale: what the
  WGSL median shader reconstructs at render time, i.e. what the glyphs actually look like.

```sh
npx tsx tools/atlas-preview.mjs
# or:
npm run atlas-preview
```

Uses only Node's built-in `zlib` for the PNG's DEFLATE stream — no new dependency.

## Numerical accuracy

The ground truth is the C++ msdfgen binary. Every generated MSDF is compared texel-by-texel against reference output; the gate passes only when `maxAbsDiff ≤ 1×10⁻⁴`. Key implementation details that enforce this:

- **No FMA contraction, either side** — the reference binary builds with `-ffp-contract=off`
  (see `tools/setup-reference.sh`) so it matches plain sequential IEEE754 double arithmetic,
  same as JS. This avoids chasing one compiler's fused-multiply-add codegen in JS; see
  CLAUDE.md's "Reference notes" for the full story.
- **Scalar hot paths** — the inner per-pixel / per-edge loops use only local `number` variables (no allocation, no closures).
- **Perpendicular-distance refinement** — mirrors C++ `distanceToPerpendicularDistance` exactly, including the unclamped-parameter sign convention.
- **Error correction** — full port of `MSDFErrorCorrection::protectCorners`, `protectEdges`, `findErrors`, and `apply`.

## Performance targets

- Median MSDF generation for a 48 px glyph (pxrange 4): **< 3 ms** on a CI machine.
- Zero allocations in the per-pixel loop.
- Bundle: **< 50 KB** minified + gzip.

## Licence

MIT — see [LICENSE](LICENSE).

Includes a port of [msdfgen](https://github.com/Chlumsky/msdfgen) © Viktor Chlumský, also MIT.
