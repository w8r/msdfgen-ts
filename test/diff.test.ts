import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { type Fl32File, TOLERANCE, compareBitmaps, fl32FromBuffer } from "./utils/compare";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GOLDEN_DIR = resolve(__dirname, "golden");

// ---------------------------------------------------------------------------
// Comparator unit tests — synthetic data, no fixtures required
// ---------------------------------------------------------------------------

describe("compareBitmaps — unit", () => {
  it("identity: same Float32Array reference passes with maxAbsDiff=0", () => {
    const bmp = new Float32Array([0.1, 0.5, 0.9, 0.0, 1.0, 0.5, 0.3, 0.7, 0.2]);
    const r = compareBitmaps(bmp, bmp, 3, 1, 3);
    expect(r.pass).toBe(true);
    expect(r.maxAbsDiff).toBe(0);
    expect(r.worstTexel).toBeNull();
  });

  it("identical copies pass", () => {
    const a = new Float32Array([0.2, 0.4, 0.6]);
    const b = new Float32Array([0.2, 0.4, 0.6]);
    expect(compareBitmaps(a, b, 1, 1, 3).pass).toBe(true);
  });

  // Note: float32 values are promoted to float64 before the diff (JS semantics).
  // float32(x + TOLERANCE) may decode as x + TOLERANCE + ε (ε ≈ 5.9e-7 near 0.5)
  // because 1e-4 is not exactly representable in float32 and the nearest float32
  // rounds UP. Do not test the exact boundary; use clearly-inside / clearly-outside.

  it("clearly inside tolerance (0.5×TOLERANCE) passes", () => {
    // 0.5×TOLERANCE = 5e-5; safely below the float32 rounding margin.
    const a = new Float32Array([0.5]);
    const b = new Float32Array([0.5 + TOLERANCE * 0.5]);
    expect(compareBitmaps(a, b, 1, 1, 1).pass).toBe(true);
  });

  it("clearly outside tolerance (2×TOLERANCE) fails", () => {
    // 2×TOLERANCE = 2e-4; safely above the float32 rounding margin.
    const a = new Float32Array([0.5]);
    const b = new Float32Array([0.5 + TOLERANCE * 2]);
    const r = compareBitmaps(a, b, 1, 1, 1);
    expect(r.pass).toBe(false);
    expect(r.maxAbsDiff).toBeGreaterThan(TOLERANCE);
  });

  it("1-pixel-shifted 4×4 MSDF bitmap fails", () => {
    const W = 4,
      H = 4,
      CH = 3;
    // Fill with a non-constant pattern so any shift creates real differences.
    const a = Float32Array.from({ length: W * H * CH }, (_, i) => (i % 17) / 17);
    const b = new Float32Array(W * H * CH);
    // Shift every row one texel to the right (wrap).
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const src = (y * W + x) * CH;
        const dst = (y * W + ((x + 1) % W)) * CH;
        for (let c = 0; c < CH; c++) b[dst + c] = a[src + c] ?? 0;
      }
    }
    expect(compareBitmaps(a, b, W, H, CH).pass).toBe(false);
  });

  it("reports correct worst-texel coordinates", () => {
    // 2×1 bitmap, 3 channels: worst difference at x=1, channel=1
    const a = new Float32Array([0, 0, 0, 0, 0, 0]);
    const b = new Float32Array([0, 0, 0, 0, 0.9, 0]);
    const r = compareBitmaps(a, b, 2, 1, 3);
    expect(r.pass).toBe(false);
    expect(r.worstTexel).toEqual({ x: 1, y: 0, channel: 1 });
  });

  it("throws when bitmap lengths do not match declared dimensions", () => {
    expect(() => compareBitmaps(new Float32Array(9), new Float32Array(6), 3, 1, 3)).toThrow(
      /size mismatch/,
    );
  });

  it("fl32FromBuffer: parses FL32 header — dimensions and pixel data", () => {
    // Construct a minimal well-formed FL32 buffer: 16-byte header + 2×1×3 floats.
    const pixels = new Float32Array([0.1, 0.5, 0.9, 0.2, 0.4, 0.8]);
    const buf = new ArrayBuffer(16 + pixels.byteLength);
    const dv = new DataView(buf);
    dv.setUint8(0, 0x46);
    dv.setUint8(1, 0x4c);
    dv.setUint8(2, 0x33);
    dv.setUint8(3, 0x32); // "FL32"
    dv.setUint32(4, 2, true); // width  = 2
    dv.setUint32(8, 1, true); // height = 1
    dv.setUint32(12, 3, true); // channels = 3
    new Float32Array(buf, 16).set(pixels);

    const f: Fl32File = fl32FromBuffer(buf);
    expect(f.width).toBe(2);
    expect(f.height).toBe(1);
    expect(f.channels).toBe(3);
    expect(f.data.length).toBe(6);
    for (let i = 0; i < 6; i++) expect(f.data[i]).toBe(pixels[i]);
  });

  it("fl32FromBuffer: throws on invalid magic", () => {
    const buf = new ArrayBuffer(16); // all zeros — magic mismatch
    expect(() => fl32FromBuffer(buf)).toThrow(/FL32/);
  });
});

// ---------------------------------------------------------------------------
// Golden fixture checks — require `npm run gen-golden` to have been run first
// ---------------------------------------------------------------------------

describe("golden fixtures", () => {
  it("test/golden/ exists and is non-empty", () => {
    if (!existsSync(GOLDEN_DIR)) {
      throw new Error(
        "test/golden/ not found.\n" +
          "Run `bash tools/setup-reference.sh && npm run gen-golden` first.",
      );
    }
    const entries = readdirSync(GOLDEN_DIR).filter((e) =>
      statSync(resolve(GOLDEN_DIR, e)).isDirectory(),
    );
    if (entries.length === 0) {
      throw new Error(
        "test/golden/ is empty.\n" +
          "Run `bash tools/setup-reference.sh && npm run gen-golden` first.",
      );
    }
  });

  it("every fixture bitmap compares equal to itself (sanity)", () => {
    if (!existsSync(GOLDEN_DIR)) return; // covered by the test above

    let checked = 0;
    const fontDirs = readdirSync(GOLDEN_DIR).filter((e) =>
      statSync(resolve(GOLDEN_DIR, e)).isDirectory(),
    );

    for (const fontId of fontDirs) {
      const fontDir = resolve(GOLDEN_DIR, fontId);
      const glyphDirs = readdirSync(fontDir).filter((e) =>
        statSync(resolve(fontDir, e)).isDirectory(),
      );

      for (const glyphId of glyphDirs) {
        const glyphDir = resolve(fontDir, glyphId);
        const fl32Path = resolve(glyphDir, "bitmap.fl32");
        const metaPath = resolve(glyphDir, "meta.json");
        if (!existsSync(fl32Path) || !existsSync(metaPath)) continue;

        const meta = JSON.parse(readFileSync(metaPath, "utf8")) as {
          width: number;
          height: number;
          channels: number;
        };

        const raw = readFileSync(fl32Path);
        const fl32 = fl32FromBuffer(
          raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer,
        );

        // Header dimensions must match the manifest written at generation time.
        expect(fl32.width, `${fontId}/${glyphId} header width`).toBe(meta.width);
        expect(fl32.height, `${fontId}/${glyphId} header height`).toBe(meta.height);
        expect(fl32.channels, `${fontId}/${glyphId} header channels`).toBe(meta.channels);

        const r = compareBitmaps(fl32.data, fl32.data, fl32.width, fl32.height, fl32.channels);
        expect(r.pass, `${fontId}/${glyphId} self-comparison`).toBe(true);
        checked++;
      }
    }

    // If golden/ exists but has no valid fixtures, flag it.
    expect(checked, "no valid fixtures found in test/golden/").toBeGreaterThan(0);
  });

  it("FL32 row order is y-up: period dot occupies bottom rows, not top", () => {
    // Empirical row-order determination using PT Serif period '.' at 32×32px.
    //
    // Generation params: scale=24, ty≈0.417 → baseline at ty×scale ≈ 10 px from bottom.
    // PT Serif period is a round dot sitting on the baseline (~0.08 em tall):
    //   expected ink rows (y-up): ≈ 8–14.
    //
    // Measured row maxima (see tools/gen-golden.mjs run output):
    //   rows  0– 7 → 0.000  (below the dot, outside pxrange=4)
    //   rows  8–14 → 0.172…0.859  (period dot — inside / edge)
    //   rows 15–31 → 0.000  (above the dot, outside)
    //
    // If FL32 were stored y-down (row 0 = top), the dot would appear in rows 18–24
    // (corresponding to y = 31–18..31–24 = 7..13 from bottom), but those rows
    // are all 0.000 — conclusively ruling out y-down storage.

    const key = "U002E_32px"; // period '.'
    const fixtureDir = resolve(GOLDEN_DIR, "ptserif", key);
    if (!existsSync(fixtureDir)) {
      console.warn(`Fixture ptserif/${key} not found — skipping row-order test.`);
      return;
    }

    const raw = readFileSync(resolve(fixtureDir, "bitmap.fl32"));
    const fl32 = fl32FromBuffer(
      raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer,
    );
    const { data, width, channels } = fl32;

    /** Max channel value across an entire row (0-based from data start = bottom). */
    const rowMax = (rowIdx: number): number => {
      let m = 0;
      const base = rowIdx * width * channels;
      for (let i = 0; i < width * channels; i++) m = Math.max(m, data[base + i] ?? 0);
      return m;
    };

    // Rows 8–14 (y-up: near baseline) must contain the period ink.
    const maxInDotZone = Math.max(...Array.from({ length: 7 }, (_, i) => rowMax(8 + i)));
    // Rows 18–24 (y-down interpretation of the dot zone) must be zero.
    const maxInYDownZone = Math.max(...Array.from({ length: 7 }, (_, i) => rowMax(18 + i)));

    expect(maxInDotZone, "dot zone (rows 8–14) must have MSDF values > 0.5").toBeGreaterThan(0.5);
    expect(maxInYDownZone, "y-down zone (rows 18–24) must be 0.000").toBeLessThan(0.01);
  });
});
