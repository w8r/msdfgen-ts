# M5 interaction QA checklist

Manual-only — automated per CLAUDE.md's M5 gate (c): "interaction is manual-QA'd
with a written checklist (60 fps pan/zoom on M-series, no visible pop except tier
swap fade)." Run against `npm run dev:webgpu-zoom` (primary) and
`npm run dev:webgl-zoom` (secondary, same tiering logic, useful for isolating a
WebGPU-specific bug from a shared logic bug).

Record: date, machine (chip, browser + version), which demo(s), pass/fail per row,
and any FPS numbers pulled from your browser's frame-timing overlay (e.g. Chrome
DevTools' Rendering tab -> "Frame Rendering Stats").

## Checklist

- [x] **60fps pan** — drag continuously across the canvas at a middling zoom
      (auto tier on). No stutter, no dropped-frame feel.
- [x] **60fps zoom** — wheel/pinch zoom continuously in then out across the full
      range. No stutter during the zoom gesture itself (regen happens on a tier
      crossing — see next row for what THAT should look like).
- [x] **Tier swap has no visible pop, only the intended fade/instant swap** — watch
      the glyphs closely while zooming slowly through a tier boundary (readout's
      "atlas Npx/em" value changes). Sync regen (current implementation, see
      demo/webgpu-zoom/main.ts's docstring) swaps instantly — confirm that instant
      swap doesn't read as a jarring pop (a sub-frame resolution change is expected
      to be imperceptible at 60fps; flag if it visibly flickers or the glyph shape
      jumps).
- [x] **No visible softening within a tier's comfortable range** — zoom to just
      under the next tier's threshold; text should still look crisp, not soft.
- [ ] **Expected softening past the top tier (64px/em)** — zoom well past the top
      tier's native resolution (readout shows "atlas 64px/em" and isn't changing
      anymore). Confirm it softens gracefully (blur, not corruption/artifacts) —
      this is documented, expected behavior (see MAX_ZOOM's comment), not a bug.
- [ ] **Auto/manual toggle works cleanly** — uncheck "Auto tier", confirm the
      dropdown becomes usable and pins one tier regardless of zoom; re-check it,
      confirm it immediately snaps back to the zoom-appropriate tier.
- [ ] **"last atlas gen" readout looks sane** — no multi-second stalls on a tier
      switch (would indicate the sync-regen assumption in demo/webgpu-zoom/main.ts's
      docstring needs revisiting — see its note on deferring the worker path until
      M6 bench numbers say otherwise).
- [ ] **Mixed-script text (Cyrillic + Latin + punctuation) reads correctly** at
      every tier — no mis-shaped glyphs, no missing glyphs, kerning looks right.
- [ ] **Repeat the above with a longer pasted-in paragraph** (edit `TEXT` in
      demo/webgpu-zoom/main.ts temporarily) — the shipped demo's ~20-char string is
      fast enough that a real slowdown on longer text wouldn't show up otherwise,
      and that's exactly the case the sync-vs-worker decision cares about.
- [ ] **"Smooth regen (worker)" knob** — check it, zoom slowly through a tier
      boundary: no stutter, previous tier stays crisp-enough on screen for the
      few frames until the worker's result lands (readout's mode suffix flips
      sync -> worker), then swap is clean. Uncheck it: behavior reverts to the
      sync path exactly as before (readout mode suffix back to `sync`).
      Run this row against both demos — webgpu-zoom and webgl-zoom now share
      the identical worker wiring (same src/atlas-worker.ts, same knob).

## If anything fails

- Stutter during pan/zoom (not just at a tier boundary): likely a rendering-path
  issue, not tiering — check WebGPU vs WebGL2 in isolation first.
- Visible pop/flicker exactly at a tier boundary: check `TIER_UP_MARGIN` /
  `TIER_DOWN_MARGIN` in demo/webgpu-zoom/main.ts — might need more hysteresis.
- Multi-second stalls on longer text: try the "Smooth regen (worker)" knob — the
  worker path (`src/atlas-worker.ts`, CLAUDE.md's M5 spec) exists now, see the
  Findings log below.

## Findings log

- **2026-08-21** — user-reported light stutter on px/em tier switch
  (`demo/webgpu-zoom/main.ts`). Root cause confirmed by inspection: `render()`
  calls `buildTier()` (MSDF regen) + `uploadAtlasTexture()` synchronously in the
  same frame as the tier crossing (main.ts:315). Matches the documented sync-regen
  tradeoff (main.ts:10-13) — not a new bug.
  **Follow-up, same day:** rather than flipping the default, added the worker path
  as an opt-in knob — "Smooth regen (worker)" checkbox, off by default. New
  `src/atlas-worker.ts` runs the same `Atlas.layout()` build inside a dedicated
  Worker (structured-clone protocol, transferable texture buffer); the demo keeps
  rendering the current tier, stale, until the worker's result lands, then swaps.
  Sync path is untouched and stays the default — this is additive, not a
  replacement. See the "Smooth regen (worker) knob" checklist row above for
  manual QA; not yet run.
  **User follow-up, same day:** confirmed the worker knob fixed the stutter
  ("almost gone" — remaining blip is `uploadAtlasTexture()`'s GPU
  create+writeTexture call, still on the main thread by design; regen itself
  is what moved off-thread). User then asked to ship the worker as public
  API. Generalized `atlas-worker.ts` from demo-specific (hardcoded
  `fetch(fontUrl)` + fixed `TEXT`) to a public protocol: caller supplies font
  bytes via a transferred `ArrayBuffer` keyed by caller-chosen `fontKey`
  (worker caches the parsed `Font`, no more `fetch` inside the worker — pure
  compute, no DOM/network dependency), arbitrary `text` per request. Published
  as `msdfgen-ts/worker` (`package.json` `exports`, new `vite.worker.config.ts`
  building it as its own ES chunk — `vite build`'s "iife" format used for the
  main entry doesn't support multiple entries, hence the separate config).
  This is a deliberate, explicit exception to CLAUDE.md's "Public API = named
  exports from `src/index.ts` only" — a second, opt-in entry point, not a
  change to the main one. Doesn't affect the M6 size budget (separate chunk,
  confirmed via `npm run size` — unchanged at 13.4 KB gzip). `gate:all` green,
  `build`/`build:demo`/`typecheck`/`oxlint`/`oxfmt` all clean after the change.
  **Follow-up, same day:** ported the identical "Smooth regen (worker)" knob
  + worker wiring to `demo/webgl-zoom/main.ts` (was sync-only) — same
  `AtlasLike`/`Tier`/`tierFromBuilt`/`ensureWorker` shape as webgpu-zoom's,
  adapted only for WebGL2's texture recreate calls
  (`gl.deleteTexture`/`gl.createTexture` in place of WebGPU's
  bind-group-needs-a-fresh-texture-view dance). Vite dedupes
  `src/atlas-worker.ts` into one shared chunk across both demos (confirmed:
  identical chunk hash in `build:demo` output). User also flagged atlas
  generation times as "alarming" while testing longer text per the checklist
  row above — noted as expected and explicitly M6's scope (median glyph gen
  < 3ms budget, `tools/bench.mjs`, not built yet); the readout's `genMs` is
  a whole-string layout total (scales with glyph count), not a per-glyph
  number, so a longer test string reads slower by design — worth remembering
  when M6's bench harness lands, so it measures per-glyph, not per-string.
