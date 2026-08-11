# msdfgen-ts

A zero-dependency TypeScript port of [Viktor Chlumský's msdfgen](https://github.com/Chlumsky/msdfgen) (core only), with a minimal built-in TrueType parser, runtime glyph atlas generation, and a WebGPU text rendering demo.

Runs entirely in the browser — no WASM, no server, no canvas fallbacks.

## Algorithm diagrams

Three SVG diagrams covering the pipeline, the per-pixel generation loop, and the data abstraction layers: [docs/diagrams/algorithm.md](docs/diagrams/algorithm.md).

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

## Repository layout

```
src/
  font/            TrueType parser (reader, sfnt, cmap, glyf, kern, …)
  shape/           Contour + edge-segment types, normalisation, scanline
  msdf/            Edge colouring, MSDF generation, error correction
  atlas/           Shelf packer, glyph cache (M4)
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
```

## Development commands

| Command | Description |
|---|---|
| `npm run gate:m0` | Test infrastructure (fixture comparator) |
| `npm run gate:m1` | Font parser — metrics + outlines vs opentype.js |
| `npm run gate:m2` | Signed-distance correctness |
| `npm run gate:m3` | Full MSDF golden diff (1158 cases, tolerance 1×10⁻⁴) |
| `npm run gen-golden` | Regenerate golden fixtures from C++ binary |
| `npm run setup-reference` | Clone + build the C++ reference binary |
| `npm run lint` | oxlint |
| `npm run typecheck` | tsc --noEmit |

## Numerical accuracy

The ground truth is the C++ msdfgen binary. Every generated MSDF is compared texel-by-texel against reference output; the gate passes only when `maxAbsDiff ≤ 1×10⁻⁴`. Key implementation details that enforce this:

- **FMA matching** — squared-distance computations use `Math.fround` to replicate ARM64 `fmadd` rounding behaviour.
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
