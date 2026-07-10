/**
 * Bitmap comparison utilities for msdfgen golden-diff tests.
 * Pure functions over Float32Array — no I/O, no DOM, no dependencies.
 */

/** Per-texel absolute tolerance matching the msdfgen golden comparison rule. */
export const TOLERANCE = 1e-4;

/** Result of comparing two float MSDF bitmaps sample-by-sample. */
export interface BitmapCompareResult {
  /** True when maxAbsDiff <= TOLERANCE (1e-4). */
  pass: boolean;
  /** Largest absolute per-sample difference found. */
  maxAbsDiff: number;
  /**
   * Zero-based location of the worst difference.
   * Null only when both bitmaps are byte-for-byte identical (maxAbsDiff === 0).
   */
  worstTexel: { x: number; y: number; channel: number } | null;
}

/**
 * Compares two flat Float32Array MSDF bitmaps sample-by-sample.
 *
 * Promotion note: float32 values are promoted to float64 before subtraction
 * (standard JS arithmetic). A value stored as float32(x + 1e-4) may decode to
 * a float64 slightly above x + 1e-4 (≈ +5.9e-7 at magnitudes near 0.5), so
 * callers must not assume the exact float32 boundary coincides with TOLERANCE.
 *
 * Layout: index = (y * width + x) * channels + channel, row-major, y-up
 * (matching msdfgen's FL32 output convention — row 0 is the bottom row).
 *
 * @param a First bitmap (reference).
 * @param b Second bitmap (candidate).
 * @param width Bitmap width in texels.
 * @param height Bitmap height in texels.
 * @param channels Samples per texel (3 for MSDF, 4 for MTSDF).
 * @returns Comparison result with pass/fail, maxAbsDiff, and worst-texel location.
 */
export function compareBitmaps(
  a: Float32Array,
  b: Float32Array,
  width: number,
  height: number,
  channels: number,
): BitmapCompareResult {
  const expected = width * height * channels;
  if (a.length !== expected || b.length !== expected) {
    throw new Error(
      `Bitmap size mismatch: expected ${expected} samples ` +
        `(${width}×${height}×${channels}), got a=${a.length} b=${b.length}`,
    );
  }

  let maxAbsDiff = 0;
  let worstTexel: BitmapCompareResult["worstTexel"] = null;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const base = (y * width + x) * channels;
      for (let c = 0; c < channels; c++) {
        // noUncheckedIndexedAccess: ?? 0 satisfies the compiler;
        // bounds are guaranteed by the size check above.
        const diff = Math.abs((a[base + c] ?? 0) - (b[base + c] ?? 0));
        if (diff > maxAbsDiff) {
          maxAbsDiff = diff;
          worstTexel = { x, y, channel: c };
        }
      }
    }
  }

  return { pass: maxAbsDiff <= TOLERANCE, maxAbsDiff, worstTexel };
}

// ── FL32 file format ──────────────────────────────────────────────────────────

/**
 * Parsed contents of an msdfgen FL32 file.
 *
 * Row order: **y-up** — `data` row 0 is the *bottom* row of the bitmap,
 * matching msdfgen's internal convention and OpenGL texture coordinates.
 *
 * Empirically confirmed with PT Serif period '.' at 32×32px
 * (gen params: scale=24, ty≈0.417 → baseline at row 10):
 *   rows  0– 7: 0.000  (below the dot — fully outside)
 *   rows  8–14: 0.172…0.859  (the dot — inside/edge MSDF values)
 *   rows 15–31: 0.000  (above the dot — fully outside)
 * In y-down storage rows 18–24 would hold the ink instead; those rows are 0.000,
 * conclusively ruling out y-down.
 */
export interface Fl32File {
  /** Raw pixel data, row-major, y-up, channels interleaved. */
  data: Float32Array;
  /** Bitmap width in texels, from file header. */
  width: number;
  /** Bitmap height in texels, from file header. */
  height: number;
  /** Channels per texel (3 = MSDF, 4 = MTSDF), from file header. */
  channels: number;
}

/** FL32 header size in bytes: magic(4) + width(4) + height(4) + channels(4). */
const FL32_HEADER_BYTES = 16;

/** Magic bytes: ASCII "FL32" = 0x46 0x4C 0x33 0x32. */
const FL32_MAGIC = [0x46, 0x4c, 0x33, 0x32] as const;

/**
 * Parses an msdfgen FL32 file buffer into an {@link Fl32File}.
 *
 * FL32 header (16 bytes, all fields little-endian):
 *   bytes  0– 3: magic "FL32"
 *   bytes  4– 7: width     (uint32)
 *   bytes  8–11: height    (uint32)
 *   bytes 12–15: channels  (uint32)
 * Followed by `width × height × channels` IEEE 754 single-precision LE floats.
 *
 * @param buffer Raw bytes of a .fl32 file (including the 16-byte header).
 * @returns Parsed dimensions and a zero-copy Float32Array of pixel data.
 * @throws If the magic bytes do not match "FL32".
 */
export function fl32FromBuffer(buffer: ArrayBuffer): Fl32File {
  const header = new Uint8Array(buffer, 0, 4);
  for (let i = 0; i < 4; i++) {
    if ((header[i] ?? 0) !== FL32_MAGIC[i]) {
      throw new Error(`Not a valid FL32 file: expected magic bytes "FL32" at offset 0`);
    }
  }
  const dv = new DataView(buffer);
  const width = dv.getUint32(4, true);
  const height = dv.getUint32(8, true);
  const channels = dv.getUint32(12, true);
  const data = new Float32Array(buffer, FL32_HEADER_BYTES);
  return { data, width, height, channels };
}
