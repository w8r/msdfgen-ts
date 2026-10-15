/**
 * SVG input: parser unit tests, plus a live diff against the reference binary
 * for the cubic / evenodd paths that TrueType goldens never exercise.
 *
 * The reference can't read SVG (core-only build), so both sides consume the
 * same shapedesc: parseSvg → serializeShape → (C++ `msdf -shapedesc`) vs
 * (parseShapeDesc → generateShapeMSDF).
 */

import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import { execFileSync } from "child_process";
import { describe, it, expect } from "vitest";
import { parseSvg } from "../../src/svg/svg";
import { type Contour } from "../../src/shape/contour";
import { generateShapeMSDF } from "../../src/msdf/shape-msdf";
import { CUBIC, LINEAR } from "../../src/shape/segments";
import { parseShapeDesc, serializeShape } from "../utils/shapedesc";
import { compareBitmaps, fl32FromBuffer } from "../utils/compare";

const BINARY = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../tools/msdfgen-ref/build/msdfgen",
);
const svg = (d: string, extra = ""): string =>
  `<svg viewBox="0 0 24 24"${extra}><path d="${d}"/></svg>`;

/** Hand-drawn test icons covering every path command family. */
const ICONS: Record<string, string> = {
  // C with a degenerate first control point (p1 == p0) + arcs.
  heart: svg("M12 21C12 21 2 14.5 2 8.5A5 5 0 0 1 12 6A5 5 0 0 1 22 8.5C22 14.5 12 21 12 21Z"),
  // Two same-direction circles: a ring only under evenodd (→ orientContours).
  ring: svg(
    "M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0zM7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0z",
    ' fill-rule="evenodd"',
  ),
  // Q/T + H/V + S.
  // Even-odd triangle hole: sharp corners need correctly oriented contours.
  play: svg("M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM10 8v8l6-4z", ' fill-rule="evenodd"'),
  wave: svg("M2 12Q7 2 12 12T22 12V22H2ZM4 4h4c2 0 3 1 3 2s-1 2-3 2h-4z"),
};

describe("parseSvg", () => {
  it("normalizes to viewBox-height units, y-up, closing open subpaths", () => {
    const { contours } = parseSvg(`<svg viewBox="0 0 10 10"><path d="M0 0H10V10H0"/></svg>`);
    expect(contours).toHaveLength(1);
    const c = contours[0]!;
    expect(c.map((s) => s.type)).toEqual([LINEAR, LINEAR, LINEAR, LINEAR]);
    expect([c[0]!.p0x, c[0]!.p0y, c[0]!.p1x, c[0]!.p1y]).toEqual([0, 1, 1, 1]);
    expect([c[3]!.p1x, c[3]!.p1y]).toEqual([0, 1]); // implicit close back to start
  });

  it("handles relative commands, implicit lineto and compact arc flags", () => {
    const a = parseSvg(svg("m1 1 2 0 0 2z")).contours[0]!;
    const b = parseSvg(svg("M1 1L3 1L3 3Z")).contours[0]!;
    expect(a).toEqual(b);
    const arc = parseSvg(svg("M0 0a1 1 0 011 1z")).contours[0]!;
    expect(arc[0]!.type).toBe(CUBIC);
    expect([arc[0]!.p3x * 24, 24 - arc[0]!.p3y * 24]).toEqual([1, 1]);
  });

  it("approximates arcs with cubics whose points lie on the circle", () => {
    const [c] = parseSvg(svg("M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0z")).contours;
    for (const s of c!) {
      expect(Math.hypot(s.p3x - 0.5, s.p3y - 0.5)).toBeCloseTo(10 / 24, 12);
    }
  });

  it("skips fill='none' paths", () => {
    expect(parseSvg(svg("M0 0H1V1Z", ' fill="none"')).contours).toHaveLength(0);
  });

  it("orients even-odd holes against their outer contour, nonzero paths untouched", () => {
    // Shoelace area over segment endpoints: sign = winding direction.
    const area = (c: Contour): number =>
      c.reduce((a, s) => a + s.p0x * s.endY() - s.endX() * s.p0y, 0);
    const [outer, hole] = parseSvg(ICONS.ring!).contours.map(area);
    expect(Math.sign(outer!)).toBe(-Math.sign(hole!));
    const plain = parseSvg(ICONS.ring!.replace(' fill-rule="evenodd"', "")).contours.map(area);
    expect(Math.sign(plain[0]!)).toBe(Math.sign(plain[1]!));
  });
});

describe("generateShapeMSDF on SVG input — reference diff", () => {
  if (!existsSync(BINARY)) {
    if (process.env.CI) {
      it("msdfgen binary present in CI", () =>
        expect.fail(`msdfgen binary not found at ${BINARY}`));
      return;
    }
    console.warn(`\n⚠  SKIPPING SVG reference diff: no msdfgen binary at ${BINARY}\n`);
    it.skip("msdfgen binary not found — run: npm run setup-reference", () => {});
    return;
  }

  const tmp = mkdtempSync(resolve(tmpdir(), "msdfgen-ts-svg-"));
  for (const [name, src] of Object.entries(ICONS)) {
    it(name, () => {
      const desc = serializeShape(parseSvg(src));
      const { shape } = parseShapeDesc(desc);
      const r = generateShapeMSDF(shape, 32, 4)!;

      const shapePath = resolve(tmp, `${name}.txt`);
      const outPath = resolve(tmp, `${name}.fl32`);
      writeFileSync(shapePath, desc);
      // prettier-ignore
      execFileSync(BINARY, [
        "msdf", "-shapedesc", shapePath, "-o", outPath, "-format", "fl32",
        "-dimensions", String(r.w), String(r.h), "-pxrange", "4", "-scale", "32",
        "-translate", String(-r.planeLeft), String(-r.planeBottom), "-scanline",
      ]);
      const raw = readFileSync(outPath);
      const ref = fl32FromBuffer(
        raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer,
      );
      const result = compareBitmaps(ref.data, r.msdf, r.w, r.h, 3);
      expect(result.maxAbsDiff).toBeLessThanOrEqual(1e-4);
    });
  }
});
