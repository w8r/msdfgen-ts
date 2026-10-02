# msdf-ts — CLAUDE.md

TypeScript port of [Chlumsky/msdfgen](https://github.com/Chlumsky/msdfgen) (core only) with a
minimal built-in TrueType parser, runtime atlas generation, and a WebGPU text rendering demo.

## Mission

A near-zero-dependency TypeScript library that, at runtime in the browser:

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
- `tools/gen-golden.ts` produces fixtures: for each (font, glyph, size, pxrange) case it
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
  A thin optional worker wrapper (`atlas-worker.ts` + `atlas-gen.ts` accepting a
  `generator: (job) => Promise<Result> | Result`) makes the worker path a drop-in.
  Gates run the sync path; M5's tier regeneration uses the worker path.
- **Runtime dependency exception — potpack:** `potpack` (MIT, ~40 lines, rectangle
  bin-packer) is an approved `dependencies` entry, used by `atlas-gen.ts` for glyph
  packing. Rectangle packing is solved, well-tested, and not worth re-owning — this is
  the one deliberate exception to "zero-dependency." Do not add any other runtime
  dependency without the same explicit sign-off; `opentype.js` stays devDependencies-only
  (see Working agreement).
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
- **CI:** GitHub Actions from M0. Every PR runs `npm run gate:all` (chains every green
  milestone gate, m0 … up to the highest green milestone). The PR job builds (and caches)
  the reference msdfgen binary, because gate:m2b/m3 diff against it live; with `CI` set, a
  missing binary fails those suites instead of skipping them. The separate
  `verify-golden-regen` job (push to main + manual dispatch) regenerates every bitmap from
  the committed fonts and runs `tools/check-golden-regen.ts`: `shape.txt` must match
  exactly, bitmaps within the 1e-4 golden tolerance, **not** byte-identical. Fixtures are
  generated on macOS (clang + Apple libm) and CI regenerates them on Linux (gcc + glibc);
  msdfgen's cubic solver calls `acos`/`cos`, whose last-ulp results differ between the two
  libms. 1e-4 still catches genuinely stale fixtures (the FMA-on leftovers were off by up
  to 5.18). A gate that was green may never go red on main.

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
  atlas-gen.ts         # Atlas class: glyph cache + potpack packing + MSDF generation, in one file
  index.ts             # explicit named exports — this file defines the public API surface
demo/
  webgpu/              # instanced quads, WGSL median shader, screenPxRange uniform
test/
  golden/              # committed fixtures from C++ msdfgen — READ ONLY for Claude
  parser/              # font parsing tests (metrics vs opentype.js, devDependency only)
  diff.test.ts         # golden bitmap comparison
  e2e.test.ts          # SSIM vs OffscreenCanvas rasterization
tools/
  setup-reference.sh  gen-golden.ts  bench.ts
```

## Milestones — work on exactly ONE at a time

Each milestone has a **gate**: a command that must exit 0. Do not start milestone N+1
until the gate for N is green. Do not refactor previous milestones unless a test is red.
When a gate passes, stop and report; the human reviews before continuing.

### M0 — Test infrastructure first

Reference binary builds in CI; `gen-golden.ts` produces fixtures for an initial corpus:
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
(a) e2e SSIM: render "Hello Привет 123 @#&" via the atlas path (reconstructText, see
test/utils/reconstruct.ts — the same per-pixel math the demos' shaders implement),
compare with the SAME font rasterized natively (`OffscreenCanvas.fillText`, headless
Chromium via Playwright), SSIM >= 0.90 (lowered from an initial 0.98 target — measured
0.93-0.94 on visually-indistinguishable renders, stable across window/stride/image-size
tuning; the gap is browser `fillText` likely blending gamma-aware at glyph edges vs our
reconstruction's plain-linear blend, which deliberately matches msdfgen's C++ reference
blend exactly — chasing 0.98 would mean diverging reconstruction math from the ground
truth for a demo-quality metric, not worth it; 0.90 keeps real margin below the measured
floor so a genuine regression still fails it);
(b) zoom-quality test: render the letter "R" at atlas resolutions 24/120/240/480px/em
(NOT literal 1×/10×/100×/1000× of a fixed base as originally written here — `Atlas`
generates a full per-glyph cell at whatever pixelsPerEm you ask for, regenerated from the
vector outline rather than upscaled; "1000× of a 48px base" means a 48,000px/em cell for
one glyph, ~500M texels, minutes to generate — not test-suite material. True unbounded
zoom needs viewport-relative/tiled generation, computing the MSDF only for the crop window
actually on screen; that doesn't exist in this codebase and isn't scaffolded here — it's
real feature work for a future milestone. The four resolutions above are the
generation-feasible stand-in: each compared against a native 1:1-resolution rasterization
of the same glyph, SSIM >= 0.90 (lowered from an initial 0.95 — same story as gate (a):
measured 0.976/0.983/0.991/0.9995 locally on macOS/CoreText, but CI's Linux headless-
Chromium font rasterizer has different AA/hinting characteristics, measured 0.9288 at the
smallest/most AA-sensitive size there; 0.90 clears both platforms' floors with real
margin) at every level, and — the actual point of tiering — quality visibly rising with
resolution. This proves tier switching's actual mechanism (regen at higher resolution =
crisper) within what `Atlas` can do today;
(c) interaction is manual-QA'd with a written checklist (60 fps pan/zoom on M-series,
no visible pop except tier swap fade) — see docs/m5-qa-checklist.md; human-run, not
automatable, no CI check for it.

### M6 — Size + perf budget

**Gate:** `npm run gate:m6` — minified+gzip size < 50 KB asserted in CI;
`tools/bench.ts`: median glyph gen (48px, pxrange 4) < 3 ms on the CI machine,
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
7. **Hoist pixel-independent work out of the pixel loop.** `generate.ts`'s per-edge
   perpendicular-distance setup (`point()`/`direction()` calls + normalization feeding the
   `add`/`bdd` blend) was being recomputed identically on every pixel — pure per-edge
   geometry, none of it reads `px`/`py` — before a precompute pass moved it to run once per
   edge per `generateMSDF` call instead (module-scope `_e*` `Float64Array`s, same
   grow-once-reuse-forever pattern as `_cTD`/`_cNeg`/etc., indexed by a flat global edge
   index). ~1270x reduction on that block in isolation, real ~1.4-3.2x on full glyph
   generation depending on edge count (see `docs/m6-perf-investigation.md`). Verified
   bit-exact against the pre-hoist output (not just within `1e-4` — a pure hoist changes
   nothing about the arithmetic, so it shouldn't change the result at all, and didn't).
   When adding to or reviewing `generate.ts`'s pixel loop: before adding anything to the
   per-edge inner loop, ask whether it depends on `px`/`py` — if it doesn't, it belongs in
   a precompute pass, not the pixel loop, however small it looks per-call.

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
- Never add a runtime dependency beyond the approved `potpack` exception (see Stack
  decisions). `opentype.js` is `devDependencies` only and must not be imported outside
  `test/`.
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
  Note: a second emulation, `crossFMA` (Dekker two-product, used by `emNormalizeShape`'s
  degenerate-quadratic check), was removed too. It had looked green against the FMA-off reference
  only because the committed fixtures were still from the FMA-on build. Once they were regenerated,
  `gate:m2a` failed on exactly the 6 glyphs with collinear quadratic control points, and plain
  `cross` fixed them. Lesson: after changing the reference build, regenerate the fixtures before
  trusting any "green against the new reference" claim.
- **Numerical method substitution is allowed where porting the reference's exact method
  isn't the right tool for this runtime — match the _output_, not necessarily the
  _method_.** `src/shape/segments.ts`'s QUADRATIC `signedDistance` finds real roots of a
  cubic via `cubicRoots` (`src/math/cubic.ts`: bracketed Newton with bisection fallback,
  no transcendentals) instead of msdfgen's own `solveCubicNormed` (trig-based, Viète's
  substitution: `Math.acos` + 3×`Math.cos` per call — see `src/math/scalar.ts`). Both
  solve the same well-defined problem (real roots of a cubic on a bounded domain);
  msdfgen's C++ build pays little for the trig calls, V8 pays roughly 10-15x more per
  call for the identical math — a straight port would have been correct but wrong for
  this runtime. `cubicRoots` is ~8.8x faster in isolation, ~1.4-1.8x end-to-end on
  curve-heavy glyphs (see `docs/m6-perf-investigation.md` for the M6 budget investigation
  that motivated this). This is _not_ the "cleverness diverges from the reference" trap
  the Working agreement warns about — that rule is about porting msdfgen's own algorithm
  faithfully; this is a deliberate substitution of a different, independently-verified
  algorithm for the same math, not an unverified shortcut. The bar for this kind of
  substitution: verify against the _entire_ golden corpus (not a spot check — `gate:m3`,
  1158 cases) plus targeted synthetic stress tests (random, degenerate/collinear control
  points, near-curve query points — the numerically hardest region), comparing final
  output values (not intermediate parameters) against the existing port, with margin well
  inside the `1e-4` golden tolerance. `cubicRoots` cleared all of that
  (`docs/m6-perf-investigation.md` has the exact numbers) before being adopted. Applying
  this precedent elsewhere in the hot path needs the same verification depth, not just
  "the math should be equivalent."
- create files per-milestone as needed; never pre-scaffold future milestones
