/**
 * Gate 4a — shelf packer properties.
 *
 * Property tests over a deterministic (seeded) run of glyph-like rects:
 * no overlap, everything in bounds, occupancy > 70% on a 500-rect fill,
 * and atlas dimensions stay powers of two after growth.
 */

import { describe, it, expect } from "vitest";
import { ShelfPacker, type PackRect } from "../../src/atlas/packer";

/** Small deterministic PRNG (mulberry32) so the property test is reproducible. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return function (): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function overlaps(a: PackRect, b: PackRect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

describe("ShelfPacker", () => {
  it("packs 500 glyph-like rects with no overlap, all in bounds, >70% occupancy", () => {
    const rand = mulberry32(42);
    const packer = new ShelfPacker(256, 256);
    const rects: PackRect[] = [];
    // Width varies with glyph tightness; height stays close to the cell size
    // (bounded by ascent+descent), matching real glyph-atlas cell variance —
    // not independent wide-range noise, which is harder than any real usage.
    for (let i = 0; i < 500; i++) {
      const w = 30 + Math.floor(rand() * 18); // 30..47 px
      const h = 42 + Math.floor(rand() * 6); // 42..47 px
      rects.push(packer.pack(w, h));
    }

    for (const r of rects) {
      expect(r.x).toBeGreaterThanOrEqual(0);
      expect(r.y).toBeGreaterThanOrEqual(0);
      expect(r.x + r.w).toBeLessThanOrEqual(packer.width);
      expect(r.y + r.h).toBeLessThanOrEqual(packer.height);
    }

    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        expect(overlaps(rects[i]!, rects[j]!)).toBe(false);
      }
    }

    const usedArea = rects.reduce((sum, r) => sum + r.w * r.h, 0);
    const occupancy = usedArea / (packer.width * packer.height);
    expect(occupancy).toBeGreaterThan(0.7);
  });

  it("grows dimensions as powers of two", () => {
    const packer = new ShelfPacker(16, 16);
    for (let i = 0; i < 50; i++) packer.pack(10, 10);
    expect(Number.isInteger(Math.log2(packer.width))).toBe(true);
    expect(Number.isInteger(Math.log2(packer.height))).toBe(true);
  });

  it("never moves a previously packed rect when the atlas grows", () => {
    const packer = new ShelfPacker(32, 32);
    const first = packer.pack(20, 20);
    const before = { ...first };
    for (let i = 0; i < 20; i++) packer.pack(20, 20);
    expect(first).toEqual(before);
  });

  it("grows width to accommodate a rect wider than the initial atlas", () => {
    const packer = new ShelfPacker(16, 16);
    const rect = packer.pack(30, 10);
    expect(packer.width).toBeGreaterThanOrEqual(30);
    expect(rect.w).toBe(30);
  });
});
