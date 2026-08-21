import { describe, expect, it } from "vitest";
import { rgbaToGray, ssim } from "./ssim";

/** Deterministic pseudo-random pixel pattern (LCG) — same shape every run. */
function makeGray(width: number, height: number, seed: number): Float64Array {
  const out = new Float64Array(width * height);
  let s = seed;
  for (let i = 0; i < out.length; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out[i] = s % 256;
  }
  return out;
}

describe("ssim", () => {
  it("is 1.0 (within float slop) comparing an image against itself", () => {
    const img = makeGray(32, 32, 1);
    expect(ssim(img, img, 32, 32)).toBeCloseTo(1, 6);
  });

  it("drops noticeably for a heavily perturbed copy", () => {
    const a = makeGray(32, 32, 1);
    const b = new Float64Array(a);
    // Flip every other pixel's luminance hard (0 <-> 255).
    for (let i = 0; i < b.length; i += 2) b[i] = 255 - b[i]!;
    const score = ssim(a, b, 32, 32);
    expect(score).toBeLessThan(0.5);
  });

  it("is close to 1.0 for a barely-perturbed copy (small uniform offset)", () => {
    const a = makeGray(32, 32, 1);
    const b = new Float64Array(a);
    for (let i = 0; i < b.length; i++) b[i] = Math.min(255, b[i]! + 2);
    const score = ssim(a, b, 32, 32);
    expect(score).toBeGreaterThan(0.95);
  });

  it("throws on mismatched buffer length", () => {
    const a = makeGray(32, 32, 1);
    const b = makeGray(16, 16, 1);
    expect(() => ssim(a, b, 32, 32)).toThrow();
  });

  it("rgbaToGray applies BT.601 luma weights", () => {
    // Pure red, green, blue, white pixels.
    const rgba = new Uint8Array([
      255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 255,
    ]);
    const gray = rgbaToGray(rgba, 4, 1);
    expect(gray[0]).toBeCloseTo(255 * 0.299, 5);
    expect(gray[1]).toBeCloseTo(255 * 0.587, 5);
    expect(gray[2]).toBeCloseTo(255 * 0.114, 5);
    expect(gray[3]).toBeCloseTo(255, 5);
  });
});
