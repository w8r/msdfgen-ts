# MSDF Algorithm — Diagrams

Three diagrams covering the algorithm at different levels of detail.

---

## 1 — Font to Bitmap Pipeline

Seven stages from a raw TrueType file to a GPU-ready multi-channel signed-distance atlas.
Each stage operates on a well-typed data boundary; the hot path runs through
**MSDF Generation** and **Error Correction**.

![Font-to-bitmap pipeline](01-pipeline.svg)

| Node | Role | Output type |
|---|---|---|
| Font File | External input | `ArrayBuffer` |
| TT Parser | `sfnt` + table readers | glyph tables |
| Glyph Shape | Resolved composite contours | `Shape` |
| Edge Coloring | `edgeColoringSimple` | colored `Shape` |
| **MSDF Generate** | Per-pixel signed-distance loop | `Float32Array` |
| Error Correct | `protectCorners` → `findErrors` → `apply` | corrected bitmap |
| Atlas | Shelf packer + texture upload | `rgba8unorm` |

---

## 2 — Per-Pixel Generation Loop

For each texel in the output bitmap, the generator iterates every colored edge,
accumulates the nearest signed distance per channel (R/G/B), then normalises the
result. A second full-bitmap pass corrects corner artifacts.

![Per-pixel generation loop flowchart](02-per-pixel-loop.svg)

Key implementation notes:

- **Projection** — pixel `(x, y)` is mapped to em-space via `(x + 0.5 - tx) / scale`,
  `(y + 0.5 - ty) / scale` (texel-center sampling, y-up).
- **Distance computation** — `signedDistance` returns an orthogonal distance plus a
  perpendicular-distance refinement for out-of-range parameters (`distanceToPerpendicularDistance`).
- **Channel assignment** — each edge's color bitmask (`RED=1`, `GREEN=2`, `BLUE=4`) determines
  which channel it contributes to; the minimum over all edges in the contour wins.
- **OverlappingContourCombiner** — merges per-contour results and selects the nearest contour
  before normalising to `[0, 1]` via `d * invRange + 0.5`.
- **Error correction** — a post-pass detects and repairs single-texel artifacts at corners
  and edges without blurring the bitmap.

---

## 3 — Data Abstraction Layers

Seven levels from raw font bytes (most concrete, bottom) to a sampled GPU texture
(most abstract, top). The **MSDF Bitmap** layer (L3) is the pay-rent boundary where
distance math becomes pixel colour.

![Data abstraction layer stack](03-data-layers.svg)

| Layer | Boundary contract |
|---|---|
| L1 GPU Sampler | `rgba8unorm` texture bound to WGSL `texture_2d<f32>`; median of three channels in shader |
| L2 Atlas Texture | Shelf-packed `Float32Array` → `Uint8Array` (`clamp(v*256, 0, 255) \| 0`); grows as power-of-two |
| L3 **MSDF Bitmap** | `Float32Array` of shape `width × height × 3`; numerically matches C++ msdfgen ≤ 1×10⁻⁴ |
| L4 Colored Shape | `Shape` with `EdgeSegment.color` bitmask set per edge by `edgeColoringSimple` |
| L5 Normalized Shape | Contours with consistent winding; scanline sign-correction applied |
| L6 Font Outline | Quadratic splines from `glyf`; composite components resolved and transformed |
| L7 Binary Font | Raw TTF/OTF `ArrayBuffer` read via zero-copy `DataView` cursor |
