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

- [ ] **60fps pan** — drag continuously across the canvas at a middling zoom
      (auto tier on). No stutter, no dropped-frame feel.
- [ ] **60fps zoom** — wheel/pinch zoom continuously in then out across the full
      range. No stutter during the zoom gesture itself (regen happens on a tier
      crossing — see next row for what THAT should look like).
- [ ] **Tier swap has no visible pop, only the intended fade/instant swap** — watch
      the glyphs closely while zooming slowly through a tier boundary (readout's
      "atlas Npx/em" value changes). Sync regen (current implementation, see
      demo/webgpu-zoom/main.ts's docstring) swaps instantly — confirm that instant
      swap doesn't read as a jarring pop (a sub-frame resolution change is expected
      to be imperceptible at 60fps; flag if it visibly flickers or the glyph shape
      jumps).
- [ ] **No visible softening within a tier's comfortable range** — zoom to just
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

## If anything fails

- Stutter during pan/zoom (not just at a tier boundary): likely a rendering-path
  issue, not tiering — check WebGPU vs WebGL2 in isolation first.
- Visible pop/flicker exactly at a tier boundary: check `TIER_UP_MARGIN` /
  `TIER_DOWN_MARGIN` in demo/webgpu-zoom/main.ts — might need more hysteresis.
- Multi-second stalls on longer text: this is the signal to build the worker path
  (CLAUDE.md's M5 spec, `atlas-worker.ts` — deferred per this milestone's decision
  log, not scaffolded yet).
