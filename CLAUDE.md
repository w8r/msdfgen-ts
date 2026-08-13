# msdf-ts — CLAUDE.md

TypeScript port of [Chlumsky/msdfgen](https://github.com/Chlumsky/msdfgen) (core only) with a
minimal built-in TrueType parser, runtime atlas generation, and a WebGPU text rendering demo.

## Mission

A zero-dependency TypeScript library that, at runtime in the browser:

1. Parses TrueType fonts (`glyf` outlines) directly from an `ArrayBuffer`
2. Generates MSDF/MTSDF bitmaps per glyph, numerically matching C++ msdfgen
3. Packs glyphs into a dynamically growing atlas texture
4. Ships an **interactive WebGPU demo**: pan + smooth "infinite" zoom over rendered text,
   staying crisp across the entire zoom range (see M5)

Target: < 50 KB minified, zero runtime dependencies, no WASM.

## Non-goals (do NOT implement, do NOT scaffold "for later")

- CFF/OTF (cubic charstrings) — v2
- Variable fonts (`gvar`, `fvar`)
- Text shaping: ligatures, complex scripts, GSUB. Kerning = `kern` table only (format 0)
- SVG input, PNG output
- Skia-style overlap resolution — use scanline sign correction like msdfgen without
  `MSDFGEN_USE_SKIA`
- Node canvas / DOM dependencies in the library itself (demo may use DOM)

## Ground truth: the C++ reference

**The C++ msdfgen binary is the oracle. If our output disagrees with it, our code is wrong.
Never adjust tolerances or fixtures to make a test pass.**

- `tools/setup-reference.sh` clones and builds msdfgen (core only, no ext needed for
  shapedesc input; build with FreeType if using `-font` input) at a **pinned commit**.
- `tools/gen-golden.mjs` produces fixtures: for each (font, glyph, size, pxrange) case it
  invokes the CLI with explicit `-scale`/`-translate` (never `-autoframe`) and stores:
  - the float bitmap (`-format fl32` or `bin`)
  - the exact CLI invocation + shape description (`-exportshape`) alongside it
- Fixtures live in `test/golden/` and are committed. Claude Code must **never regenerate or
  edit fixtures** — only the human does that, deliberately.

Comparison rule: per-texel absolute difference on float bitmaps, `maxAbsDiff <= 1e-4`,
after matching msdfgen's conventions exactly (y-axis direction, texel-center sampling,
distance normalization to range, fill rule).

## Stack decisions (settled — do not revisit)

- **Build:** Vite lib mode (ES + IIFE outputs), terser with `mangle.properties` `/^_/`.
  Demo served by the same Vite dev server (`demo/` as a second entry).
- **Tests:** Vitest. Golden diffs and parser tests run in node; WebGPU e2e runs via
  Vitest browser mode / headless Chromium with WebGPU flags where available, otherwise
  the test is skipped locally with a loud warning (never silently).
- **Repo:** single package, `demo/` folder. Demo imports the library via `src/` alias in
  dev, via the built output in the size gate.

- **Threading:** core generation is a pure synchronous function over transferable typed
  arrays (`generateMSDF(shape, params, out: Float32Array)`) — no DOM, no async inside.
  A thin optional worker wrapper (`atlas/worker.ts` + `atlas.ts` accepting a
  `generator: (job) => Promise<Result> | Result`) makes the worker path a drop-in.
  Gates run the sync path; M5's tier regeneration uses the worker path.
- **Atlas format:** plain MSDF, 3 channels. GPU upload is still `rgba8unorm` (WebGPU has
  no 3-channel sampled format) — alpha written as 255 and ignored by the shader.
  Keep `generateMTSDF` out of scope; do not scaffold it.
- **Lint/format:** oxlint + oxfmt. Pre-commit hook via `git config core.hooksPath .githooks`
  (plain shell script, no husky/lint-staged deps): runs `oxfmt --check` and `oxlint` on
  staged files, blocks commit on failure. Same commands run in CI before any gate.
  The "no `vec2.ts` import from `msdf/`" rule: use oxlint's `no-restricted-imports` if
  supported in the pinned version; otherwise enforce with a 5-line grep script wired into
  `gate:m2`. Formatting is oxfmt's defaults — never hand-tune style, never disable rules
  inline without a comment explaining why.
- **CI:** GitHub Actions from M0. Reference msdfgen binary built once and cached by
  pinned commit hash; every PR runs `gate:m0` … up to the highest green milestone.
  A gate that was green may never go red on main.

## Repository layout

```
src/
  math/
    scalar.ts          # solveQuadratic, solveCubic, clamp, mix, median3 — pure functions
    vec2.ts            # Vec2 for COLD paths only (see performance rules)
  font/
    reader.ts          # DataView cursor: u8/u16/i16/u32/f2dot14/offset16/offset32
    sfnt.ts            # table directory, ttcf handling
    tables/
      cmap.ts          # formats 4 and 12 only
      head.ts  maxp.ts  hhea.ts  hmtx.ts  loca.ts
      glyf.ts          # simple + composite glyphs -> Shape (quadratic segments)
      kern.ts          # format 0 horizontal kerning
    font.ts            # public Font class: glyphId(codepoint), shape(glyphId), metrics
  shape/
    segments.ts        # EdgeSegment: single class, type tag LINEAR|QUADRATIC|CUBIC,
                       # flat numeric fields p0x..p3x etc. HOT.
    contour.ts  shape.ts
    normalize.ts       # contour normalization, winding, scanline sign correction
  msdf/
    edge-coloring.ts   # edgeColoringSimple (deterministic, same seed behavior as C++)
    distance.ts        # signed (pseudo-)distance per segment. HOTTEST code in the repo.
    generate.ts        # generateMSDF / generateMTSDF into Float32Array
    error-correction.ts# full MSDFErrorCorrection port — required, not optional
  atlas/
    packer.ts          # shelf packer, power-of-two growth
    atlas.ts           # glyph cache: codepoint -> {uv rect, metrics}; on miss: parse+gen
  index.ts             # explicit named exports — this file defines the public API surface
demo/
  webgpu/              # instanced quads, WGSL median shader, screenPxRange uniform
test/
  golden/              # committed fixtures from C++ msdfgen — READ ONLY for Claude
  parser/              # font parsing tests (metrics vs opentype.js, devDependency only)
  diff.test.ts         # golden bitmap comparison
  e2e.test.ts          # SSIM vs OffscreenCanvas rasterization
tools/
  setup-reference.sh  gen-golden.mjs  bench.mjs
```

## Milestones — work on exactly ONE at a time

Each milestone has a **gate**: a command that must exit 0. Do not start milestone N+1
until the gate for N is green. Do not refactor previous milestones unless a test is red.
When a gate passes, stop and report; the human reviews before continuing.

### M0 — Test infrastructure first
Reference binary builds in CI; `gen-golden.mjs` produces fixtures for an initial corpus:
3 fonts (e.g. Roboto, Noto Sans, PT Serif — one with heavy diacritics), ~100 glyphs each
(Latin + Cyrillic + punctuation), sizes 32/48, pxrange 4.
**Gate:** `npm run gate:m0` — fixtures exist, comparator utility has its own unit tests
(compares a fixture against itself = pass, against a shifted copy = fail).

### M1 — Font parser
Parse the 3 corpus fonts. Composite glyphs (accented chars) must resolve correctly.
**Gate:** `npm run gate:m1` — for every corpus glyph: advance width, bbox, contour count,
and point data match opentype.js (dev-only dependency) exactly; parser never throws on
any font in `test/fonts/` (add a handful of weird-but-valid fonts).

### M2 — Shape + signed distance
Port segments, `signedDistance`, `pseudoDistance`, bounds, winding, scanline.
**Gate:** `npm run gate:m2` — distance values at sampled points match values dumped from
the C++ side (add a tiny dump harness to the reference build, or validate via
single-channel SDF golden bitmaps: `msdfgen sdf ...` output must match ours to 1e-4).

### M3 — Edge coloring + MSDF generation + error correction
**Gate:** `npm run gate:m3` — full golden diff over the corpus: every MSDF fixture matches
`maxAbsDiff <= 1e-4`. Error correction must be ported before this gate can pass;
if corners look wrong, the bug is here or in coloring order — do not "fix" by blurring.

### M4 — Atlas
Shelf packing, growth, cache, MTSDF option, `Uint8Array` RGBA output for texture upload.
**Gate:** `npm run gate:m4` — property tests: no rect overlap, all rects in bounds,
occupancy > 70% on a 500-glyph fill; per-glyph bitmap in the atlas still matches golden.

### M5 — Interactive WebGPU demo: pan + infinite zoom
Instanced-quad text renderer (WGSL median shader, `screenPxRange` from zoom uniform),
mixed Latin/Cyrillic paragraph, kerning applied. Camera: pointer/wheel pan + exponential
zoom (double-precision camera state on CPU, translate-then-scale in shader to avoid f32
precision death at deep zoom). "Infinite" zoom strategy: MSDF at a fixed atlas resolution
holds up to roughly `atlasGlyphPx * screenPxRange` of magnification; beyond a threshold,
re-generate the visible glyphs into a higher-resolution atlas tier (async, worker) and
swap — zooming must never block the frame; stale tier is acceptable for a few frames.
**Gate:** `npm run gate:m5` —
(a) e2e SSIM: render "Hello Привет 123 @#&" at 512px via the atlas path, compare with
OffscreenCanvas `fillText`, SSIM >= 0.98;
(b) zoom-quality test: render the letter "R" at effective zoom levels 1×, 10×, 100×, 1000×;
at each level compare against a direct high-res rasterization crop, SSIM >= 0.95 —
this proves tier switching works;
(c) interaction is manual-QA'd with a written checklist (60 fps pan/zoom on M-series,
no visible pop except tier swap fade).

### M6 — Size + perf budget
**Gate:** `npm run gate:m6` — minified+gzip size < 50 KB asserted in CI;
`tools/bench.mjs`: median glyph gen (48px, pxrange 4) < 3 ms on the CI machine,
zero allocations in the per-pixel loop verified by a heap-delta assertion around a
1000-glyph run (allowed delta: the output buffers only).

## Performance rules (hard constraints, reviewed in every PR)

1. **Hot paths are scalar.** `distance.ts`, `generate.ts`, `error-correction.ts` inner
   loops: local number variables only. No `new`, no closures, no array/object literals,
   no destructuring returns inside per-pixel or per-edge loops.
2. **One segment class, monomorphic.** `EdgeSegment` has a numeric `type` tag and fixed
   fields `p0x,p0y,p1x,p1y,p2x,p2y,p3x,p3y` (unused = 0). Dispatch via `switch (seg.type)`.
   Never subclass, never add fields conditionally, always initialize every field in the
   constructor in the same order.
3. **Multi-value returns via reusable out-objects** (`SignedDistanceOut {dist, dot, t}`)
   allocated once per generator call, or module-scope scratch (library is synchronous and
   single-threaded per worker — document this).
4. `Vec2` (allocating, immutable) is permitted only in `font/` and setup code. Importing
   `vec2.ts` from `msdf/` is a lint error (oxlint `no-restricted-imports`, or the grep
   fallback — see Stack decisions).
5. Bitmaps are flat `Float32Array` with manual indexing `(y * w + x) * channels`. No 2D
   arrays, no per-pixel objects.
6. Doubles everywhere in math (JS numbers); only convert to `Uint8Array` at the atlas
   boundary (`clamp(v * 256, 0, 255) | 0` — match msdfgen's `pixelFloatToByte` exactly).

## Code style

Google Closure ADVANCED is a **deferred** target — do not add a Closure build now, but
write code that keeps the door open, and document as you go:

- **Every exported function/class/method carries JSDoc**: description, `@param`, `@returns`,
  and Closure-style types where TS types don't survive to JS (`/** @type {number} */` on
  tricky fields). Internal hot functions get at least a one-line purpose comment plus the
  C++ provenance comment.
- The npm build uses rollup + terser (`mangle.properties` regex `/^_/`).

Closure-friendly constraints (cheap now, painful to retrofit):

- Property access by dot only. Never `obj[someString]`, never mix `obj.x` and `obj['x']`.
- No `Object.keys`/`entries`/spread on library objects whose shape matters.
- Private/internal members prefixed `_` (this is also the terser mangle contract).
- Public API = named exports from `src/index.ts` only; nothing else is public.
- No default exports. No `enum` (use `const` objects with `as const` + type). No
  decorators, no getters/setters on hot classes.
- `strict: true`, `noUncheckedIndexedAccess: true`. Target ES2020 modules.

## Working agreement for Claude Code

- One milestone per session/branch. Read this file at session start.
- Before writing code for a milestone, write/extend its gate test first if it doesn't
  fully exist. Red → green, then stop.
- Never modify `test/golden/**`, tolerance constants, or gate criteria. If a gate seems
  wrong, stop and explain why to the human instead.
- Never add a runtime dependency. `opentype.js` is `devDependencies` only and must not be
  imported outside `test/`.
- When porting a C++ function, put a comment with the source file + function name
  (`// port of core/edge-segments.cpp: QuadraticSegment::signedDistance`) and keep the
  algorithm structure recognizable. Cleverness that diverges from the reference is a bug
  farm — match first, optimize inside the gate later.
- If stuck for more than ~3 attempts on a failing golden test, produce a minimal repro
  (single glyph, small bitmap, dump both float grids side by side) and report the first
  divergent texel and both values — don't keep re-shuffling code.
- msdfgen is MIT — keep `LICENSE` attribution to Viktor Chlumský in the repo.
- Use Typescript and `tsx` for scripts

## Reference notes (gotchas that have burned people before)

- msdfgen's y-axis points up; TrueType font units also y-up, but atlas/texture space is
  y-down. Fix orientation in exactly one place (atlas blit) and test it.
- Sample at texel centers: `(x + 0.5)`, `(y + 0.5)` before inverse projection.
- `FONT_SCALING_EM_NORMALIZED`: divide font units by `unitsPerEm` at load. Do the same so
  golden transforms match.
- TrueType quadratic contours use implied on-curve midpoints between consecutive
  off-curve points; contours may start on an off-curve point.
- Composite glyphs: `ARGS_ARE_XY_VALUES`, `WE_HAVE_A_SCALE` / `X_AND_Y_SCALE` / `2x2`,
  and `USE_MY_METRICS` all appear in real fonts. Roboto exercises most of this.
- Edge coloring must process contours/edges in the same order as C++ or colors (and thus
  channels) won't match goldens. Port the seed/PRNG behavior of `edgeColoringSimple`
  exactly.
- Error correction is not optional: without it, corner artifacts appear precisely on the
  glyphs that make MSDF worth using.
- **FMA contraction in the reference build was a real bug source, now closed — revisit only
  after eyeballing real rendering.** clang on Apple Silicon fuses expressions like
  `a.x*b.x+a.y*b.y` into one rounded FMA instruction by default (`-ffp-contract=on`); JS never
  does (always two sequential roundings). At exact geometric ties (90° corners, axis-aligned
  serifs, symmetric curve endpoints) this flips which edge wins a tiebreak, diverging from our
  port by a real amount at a single texel. `tools/setup-reference.sh` now builds the reference
  binary with `-ffp-contract=off` so it matches plain sequential IEEE754 (what JS does) instead
  of chasing this compiler's specific codegen — that fix is committed and `gate:m3` is fully
  green on it. Do NOT reintroduce FMA-emulation helpers (a Veltkamp-Dekker split named
  `_sqDistFMA` briefly existed in `segments.ts` to match the old FMA-on reference at one call
  site; it was removed once the reference build stopped needing it) — matching one compiler's
  contraction choices is an unbounded, non-portable chase, not a spec. If a fresh golden diff
  ever surfaces a single-texel, large-magnitude mismatch at a symmetric/degenerate corner, this
  is the first thing to suspect. Revisit this decision once M5's actual rendering is visible:
  confirm a lone flipped texel at a degenerate corner is genuinely imperceptible after AA/media
  reconstruction before considering any other approach.
  Note: `crossFMA` in `src/math/scalar.ts` (used by `shape/normalize.ts`'s deconverge logic) is
  a *different*, pre-existing FMA-contraction emulation that predates this decision and was
  deliberately left alone — gate:m2/m3 are green with it in place against the FMA-off reference,
  so it isn't causing the problem this note describes. Don't treat its existence as license to
  add more; if it ever needs touching, apply the same "suspect FMA, verify by toggling the
  reference build flag" diagnostic before changing it.
- create files per-milestone as needed; never pre-scaffold future milestones
