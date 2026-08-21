# M6 perf investigation: generateMSDF is ~2-11x over budget

**Status:** open — needs someone with strong numerical-methods intuition to find
a real fix. Written up after an initial profiling pass hit a wall on the
obvious mitigation (bounding-box pruning) turning out to be unsound as first
conceived. Nothing in this doc has been implemented; `src/msdf/generate.ts`
and `src/math/scalar.ts` are unmodified.

## The gate

CLAUDE.md, M6:

> `tools/bench.mjs`: median glyph gen (48px, pxrange 4) < 3 ms on the CI
> machine, zero allocations in the per-pixel loop verified by a heap-delta
> assertion around a 1000-glyph run (allowed delta: the output buffers only).

Two independent checks. **The allocation check passes cleanly** — heap delta
of 8.8 KB over 1000 iterations of the hot loop (`generateMSDF` +
`distanceSignCorrection` + `msdfErrorCorrection`, reused output buffer,
forced GC before/after). No leak, no per-pixel `new`. That part of the
codebase's performance discipline (CLAUDE.md's "Performance rules") is
working as designed.

**The timing check fails, broadly:**

```
'A': median 2.957ms   (39×43 texels)
'o': median 6.578ms   (32×35 texels)
'e': median 5.775ms   (30×35 texels)
'g': median 10.561ms  (30×44 texels)
'@': median 32.398ms  (47×53 texels)
'M': median 3.498ms   (42×43 texels)
'W': median 5.237ms   (49×43 texels)
'%': median 15.312ms  (39×44 texels)
'&': median 12.352ms  (36×44 texels)
```

Roboto.ttf, 48px/em, pxrange 4, median of 25 uncached generations per glyph
(fresh `Atlas` per iteration, warmup discarded). Even the simplest glyph
(`A`) sits right at the 3ms line; everything with real curve complexity is
2-11x over. This is not one pathological character — it's the whole
architecture's constant factor being too high for the budget as written.

## Where the time goes

Full per-glyph pipeline breakdown for `@` (2 contours, 85 edges: 6 LINEAR +
79 QUADRATIC), first iteration excluded (JIT warmup), steady state:

```
shape parse:        0.05ms
em-normalize:        0.01ms
bounds sampling:     0.06ms
normalizeShape:      0.02ms
edgeColoringSimple:  0.03ms
generateMSDF:       31-34ms   <-- everything else is noise by comparison
distanceSignCorrect: 0.1-1.1ms
msdfErrorCorrect:    1.1-2.4ms
```

`generateMSDF` (`src/msdf/generate.ts:225`) is the entire problem. Its
structure is already correct per CLAUDE.md's performance rules — pure
scalar loop, module-scope `Float64Array`/`Int32Array` scratch reused
across calls (`src/msdf/generate.ts:39-55`), no allocation inside the
pixel loop (confirmed by the allocation bench). The cost is real compute,
not GC pressure or bad code shape.

### The dominant cost: `EdgeSegment.signedDistance` for QUADRATIC edges

Isolated microbenchmark: `signedDistance()` on a QUADRATIC segment costs
**~0.075µs/call**. `generateMSDF` calls it once per edge per pixel — no
spatial acceleration, brute force, same as msdfgen's C++ reference. For
`@`'s image: 47×53 pixels × 85 edges = **211,735 calls**, at 0.075µs each
= **~16ms** — roughly half the observed 32ms total (the rest is the
direction()/point() calls for the perpendicular-distance pass, described
below, plus the OverlappingContourCombiner merge/select logic, all likewise
O(pixels × contours × edges)).

The QUADRATIC case (`src/shape/segments.ts:484-562`) computes the minimum
distance from a point to a quadratic Bézier by finding the roots of a cubic
polynomial (the derivative of squared distance to a quadratic curve is
cubic in `t`) — `solveCubic(_roots, a, b, c, d)` at
`src/shape/segments.ts:501`. That routes to `solveCubicNormed`
(`src/math/scalar.ts:185`), whose dominant branch (three real roots, the
common case for a query point near a curve) is:

```ts
// src/math/scalar.ts:185-206
if (r2 < q3) {
  let t = r / Math.sqrt(q3);
  if (t < -1) t = -1;
  if (t > 1) t = 1;
  t = Math.acos(t);
  const sqQ = -2 * Math.sqrt(q);
  x[0] = sqQ * Math.cos((1 / 3) * t) - a3;
  x[1] = sqQ * Math.cos((1 / 3) * (t + 2 * Math.PI)) - a3;
  x[2] = sqQ * Math.cos((1 / 3) * (t - 2 * Math.PI)) - a3;
  return 3;
}
```

One `Math.acos` + three `Math.cos` + two `Math.sqrt` per call. This is the
textbook trigonometric method for solving a depressed cubic with three real
roots (Viète's substitution) — it's exactly what msdfgen's C++ reference
does too (`core/equation-solver.cpp: solveCubicNormed`, same algorithm,
matched deliberately — see this file's port comment). The cost is
*inherent to the algorithm as ported*, not a JS-specific inefficiency in
how it's written. What's JS-specific is the constant factor: V8's
`Math.acos`/`Math.cos` vs. glibc's, plus general interpreted/JIT overhead
vs. native machine code, land this port at roughly 10-15x the per-call cost
a straightforward C++ build would have for the identical math.

## What doesn't obviously fix it: bounding-box pruning

The natural first idea — skip the expensive per-edge work when the edge is
clearly too far from the query pixel to matter — turns out to be unsound
as simply conceived. Recording the reasoning here so it doesn't get
re-derived (or re-attempted) from scratch.

**The part that's safe:** `dist(point, curve) ≥ dist(point, curve's bbox)`
always holds (the curve is a subset of its bounding box, so the nearest
point of the box is never farther than the nearest point of the curve). So
if an edge's bbox lower-bound distance already exceeds the current best
known `|trueDistance|` for every channel that edge could win, the edge
*cannot* become the new true-distance minimum — its `signedDistance()` call
could be skipped for the purposes of `_cTD` (the per-channel true-distance
tracking, `src/msdf/generate.ts:319-346`).

**The part that isn't:** `generateMSDF` doesn't only track true distance.
It also runs a *perpendicular-distance* refinement per edge
(`src/msdf/generate.ts:393-438`, the `add`/`bdd` blocks), which computes:

```
perp = crossProduct(point - edge.endpoint, unit_tangent_at_endpoint)
```

— the perpendicular offset from the query point to the **infinite line**
through the edge's endpoint, in its tangent direction. This is not bounded
by the edge's bounding box at all: a query point can be arbitrarily far
from an edge's bbox while still landing almost exactly on that edge's
tangent line extended, giving a tiny `perp`. There is no bbox-based upper
bound on how small `|perp|` can get for a bbox-far point — it's a genuine
projection onto an infinite line, not a bounded local quantity.

That value directly feeds the final output: `_computeFromState`
(`src/msdf/generate.ts:177-194`) uses `_cNeg`/`_cPos` (built by
accumulating `perp` across *every* edge in the contour, not just the
true-distance winner) as its **primary** candidate —
`minDist = td < 0 ? neg : pos` — before even considering the specific
near-edge refinement. So `_cNeg`/`_cPos` genuinely need every edge's
contribution, not just nearby edges', to be correct.

Worse: the gate for whether `perp` is even considered is
`Math.abs(perp) < absDist`, where `absDist` is the edge's own *exact* true
distance — the very value we'd be trying to avoid computing. There's no
cheap, valid substitute: using the bbox lower bound in place of `absDist`
in that comparison is a *stricter* test than the real one (bbox bound ≤
true distance), so it would silently reject some `perp` updates the exact
algorithm would have accepted — a real correctness divergence, not just a
performance approximation.

**Net assessment:** true-distance-only pruning is sound but only avoids the
expensive `signedDistance()` call in cases we can't yet cleanly separate
from needing `absDist` for the perpendicular gate anyway — and the
perpendicular pass itself (point()/direction() calls, no cubic solve) is
cheap relative to `signedDistance()`, so skipping *only* the safe part
might not move the needle much. Separately: this codebase's glyphs are
tightly cropped per-atlas-cell (`Atlas._generate`,
`src/atlas-gen.ts:149-198`, crops each glyph to its own bbox + pxrange
margin) — so most edges of a 1-2 contour glyph already sit within the same
small pixel neighborhood as every query pixel. Bbox pruning is most
valuable when query points and geometry are spread out; here they're not,
so even a fully sound version of this optimization may prune little in
practice.

## Constraints worth keeping in view

- **Golden-exactness, not visual approximation.** `test/msdf/msdf.test.ts`
  (1158 cases) and `test/msdf/sdf.test.ts` compare **float** bitmap values
  to the C++ reference at `maxAbsDiff <= 1e-4` — not the byte-quantized /
  visually-rendered output. Any fix has to preserve exact per-texel float
  values, not just "look right." In particular: the eventual byte
  quantization saturates distances outside `±pxrange` to the same output
  byte regardless of exact float value, but that saturation happens
  *after* the float comparison the tests actually check — it doesn't
  create any safe wiggle room for approximating far-edge distances.
- **Match msdfgen's structure, don't out-clever it.** CLAUDE.md's working
  agreement is explicit: "Cleverness that diverges from the reference is a
  bug farm — match first, optimize inside the gate later." M6 is
  "optimize inside the gate" time, but the standing warning about FMA
  contraction (CLAUDE.md's "Reference notes" section) is a real precedent
  here — this port has already been burned once by a subtle floating-point
  divergence from a well-intentioned low-level change. Any numerical
  restructuring of `solveCubicNormed`/`signedDistance` needs to be checked
  against the *full* golden corpus, not a spot check, before being trusted.
- **What a real fix might look like** (unexplored, for whoever picks this
  up):
  - A genuinely valid spatial-pruning bound that accounts for the
    perpendicular-line case too — e.g., a bound derived from the edge's
    *control polygon* (a quadratic Bézier's curve lies within the convex
    hull of `{p0, p1, p2}` — a cheap, exact, valid bbox with no sampling
    needed) combined with some argument about how far the tangent-line
    projection can meaningfully extend before `ts_a`/`ts_b`'s sign
    condition (`src/msdf/generate.ts:396`, `:420`) rules it out. This is
    the promising-but-unproven direction — needs someone to either find
    the bound or find the counterexample that kills it.
  - A faster real-root cubic solver that avoids `acos`/`cos` for the
    common 3-real-root case (e.g., a well-conditioned iterative refinement
    seeded from a cheap initial guess) — numerically delicate to keep
    within `1e-4` of the reference's trig-based result, but avoids the
    geometric-pruning correctness trap entirely since it doesn't change
    *which* edges get evaluated, only *how* each evaluation is computed.
  - Revisiting whether 3ms was calibrated with this architecture's real
    constant factor in mind at all — not something to change unilaterally
    (CLAUDE.md: never modify gate criteria without discussion), but worth
    an explicit conversation given the gap is consistent and large, not a
    one-off outlier.

## Reproducing

```bash
npx tsx --expose-gc tools/bench.mjs
```

Prints median/min/max timing and the allocation heap delta, exits non-zero
on either budget miss. `test/size.test.ts` (the other M6 gate half, size
budget) passes independently and is unaffected by any of this.
