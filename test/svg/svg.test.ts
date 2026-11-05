/**
 * SVG input: parser unit tests, regression tests on real Noto emoji (noto/,
 * from googlefonts/noto-emoji 2D/svg at 99701e07, license in noto/LICENSE),
 * plus a live diff against the reference binary for the cubic / evenodd paths
 * that TrueType goldens never exercise.
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
import { parseSvg, parseSvgLayers } from "../../src/svg/svg";
import { type Contour } from "../../src/shape/contour";
import { type SvgGradient, type SvgLayer } from "../../src/svg/svg";
import { generateShapeMSDF, shapeBounds, type ShapeMSDF } from "../../src/msdf/shape-msdf";
import { type Shape } from "../../src/shape/shape";
import { CUBIC, LINEAR, type SignedDistanceResult } from "../../src/shape/segments";
import { Scanline, computeShapeScanline } from "../../src/shape/scanline";
import { parseShapeDesc, serializeShape } from "../utils/shapedesc";
import { compareBitmaps, fl32FromBuffer } from "../utils/compare";

const BINARY = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../tools/msdfgen-ref/build/msdfgen",
);
const NOTO = resolve(dirname(fileURLToPath(import.meta.url)), "noto");
const svg = (d: string, extra = ""): string =>
  `<svg viewBox="0 0 24 24"${extra}><path d="${d}"/></svg>`;

/** Bounds of a shape, rounded to 1e-9 (shape units). */
const box = (shape: Shape): number[] => {
  const b = shapeBounds(shape);
  return [b.minX, b.minY, b.maxX, b.maxY].map((v) => Math.round(v * 1e9) / 1e9);
};

/** Nonzero winding of `shape` at the centres of an n×n grid over [0, 1]², row-major. */
function windings(shape: Shape, n: number): Int32Array {
  const out = new Int32Array(n * n);
  const line = new Scanline();
  for (let j = 0; j < n; j++) {
    computeShapeScanline(shape, (j + 0.5) / n, line);
    for (let i = 0; i < n; i++) out[j * n + i] = line.sumIntersections((i + 0.5) / n);
  }
  return out;
}

/** Smallest distance from (x, y) to an edge of any of `shapes`. */
function edgeDistance(shapes: Shape[], x: number, y: number): number {
  const sd: SignedDistanceResult = { distance: 0, dot: 0, param: 0 };
  let d = Infinity;
  for (const e of shapes.flatMap((s) => s.contours.flat())) {
    e.signedDistance(x, y, sd);
    d = Math.min(d, Math.abs(sd.distance));
  }
  return d;
}

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

describe("parseSvgLayers", () => {
  // Shape-space point → gradient parameter t.
  const t = (layer: SvgLayer, x: number, y: number): number => {
    const {
      radial,
      matrix: [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0],
    } = layer.gradient!;
    const [gx, gy] = [a * x + c * y + e, b * x + d * y + f];
    return radial ? Math.hypot(gx, gy) : gx;
  };
  const { layers, width } = parseSvgLayers(`<svg viewBox="0 0 20 10">
    <defs>
      <linearGradient id="h"><stop offset="0" stop-color="red"/><stop offset="100%" style="stop-color:blue"/></linearGradient>
      <radialGradient id="r" gradientUnits="userSpaceOnUse" cx="15" cy="5" r="5" xlink:href="#h"/>
      <clipPath id="c"><path d="M0 0H1V1Z"/></clipPath>
    </defs>
    <path fill="url(#h)" d="M2 2H8V8H2Z"/>
    <path style="fill:url(#r);opacity:.5" fill-opacity="0.5" d="M10 0H20V10H10Z"/>
    <path fill="#0f0" d="M0 0H1V1Z"/>
  </svg>`);

  it("keeps one layer per drawn path, in order, with its paint", () => {
    expect(width).toBe(2);
    expect(layers.map((l) => l.color)).toEqual(["url(#h)", "url(#r)", "#0f0"]);
    expect(layers.map((l) => l.opacity)).toEqual([1, 0.25, 1]);
    expect(layers[1]!.gradient!.stops.map((s) => s.color)).toEqual(["red", "blue"]); // via href
    expect(layers[2]!.gradient).toBeNull();
  });

  it("maps gradients to shape space: bounding box (linear) and user space (radial)", () => {
    // Square spans x 2..8 of a 10-high viewBox → shape x 0.2..0.8.
    expect(t(layers[0]!, 0.2, 0.5)).toBeCloseTo(0, 12);
    expect(t(layers[0]!, 0.8, 0.5)).toBeCloseTo(1, 12);
    expect(t(layers[1]!, 1.5, 0.5)).toBeCloseTo(0, 12); // centre (15, 5)
    expect(t(layers[1]!, 1.5, 1.0)).toBeCloseTo(1, 12); // r = 5 above it
  });
});

describe("parseSvgLayers: document structure", () => {
  it("composes group transforms, converts basic shapes, applies CSS classes and mixed quotes", () => {
    const { layers } = parseSvgLayers(`<svg viewBox="0 0 10 10">
      <style>.a, .b { fill: red } .b { fill: blue }</style>
      <!-- <path d="M0 0H9V9Z"/> comments are not drawn -->
      <g transform="translate(5 0)" fill="green">
        <rect width="2" height="2"/>
        <circle class="a b" cx="1" cy="5" r="1"/>
      </g>
      <polygon points="0,8 2,8 2,10" style="font-family:'X Y';fill:#123"/>
    </svg>`);
    expect(layers.map((l) => l.color)).toEqual(["green", "blue", "#123"]);
    expect(box(layers[0]!.shape)).toEqual([0.5, 0.8, 0.7, 1]); // rect x 5..7, y 0..2 (y-up: 0.8..1)
    expect(box(layers[1]!.shape)).toEqual([0.5, 0.4, 0.7, 0.6]); // circle centre (6, 5), r 1
  });
});

describe("parseSvgLayers: clip paths and the viewport", () => {
  const layers = (src: string): SvgLayer[] => parseSvgLayers(src).layers;

  it("clips by clip-path from a style or attribute, through groups, in the element's user space", () => {
    const ls = layers(`<svg viewBox="0 0 10 10">
      <defs><rect id="r" width="4" height="10"/></defs>
      <clipPath id="left"><use xlink:href="#r" x="1"/></clipPath>
      <clipPath id="top"><rect width="10" height="5"/></clipPath>
      <clipPath id="narrow"><rect width="3" height="10"/></clipPath>
      <g style="clip-path: url(#left)">
        <rect width="10" height="10"/>
        <rect width="10" height="10" clip-path="url(#top)"/>
      </g>
      <rect transform="translate(2 0)" width="8" height="10" clip-path="url('#narrow')"/>
      <rect width="10" height="10" clip-path="url(#missing)"/>
    </svg>`);
    expect(ls.map((l) => box(l.shape))).toEqual([
      [0.1, 0, 0.5, 1], // <use> of a rect, translated by its x
      [0.1, 0.5, 0.5, 1], // nested clips intersect (y-up: SVG's top half is 0.5..1)
      [0.2, 0, 0.5, 1], // clip coordinates follow the element's own transform
      [0, 0, 1, 1], // a missing clip path is ignored
    ]);
  });

  it("unions clipPath children, honours clip-rule, and drops what is clipped away", () => {
    const ls = layers(`<svg viewBox="0 0 10 10">
      <clipPath id="two"><path d="M0 0V6H6V0Z"/><path d="M4 4H10V10H4Z"/></clipPath>
      <clipPath id="ring" clip-rule="evenodd"><path d="M1 1H9V9H1ZM3 3H7V7H3Z"/></clipPath>
      <clipPath id="empty"/>
      <rect width="10" height="10" clip-path="url(#two)"/>
      <rect width="10" height="10" clip-path="url(#ring)"/>
      <rect width="10" height="10" clip-path="url(#empty)"/>
      <rect x="20" width="10" height="10"/>
    </svg>`);
    expect(ls).toHaveLength(2); // the empty clip and the off-viewBox rect draw nothing
    const n = 10; // grid centres at x, y = 0.5, 1.5, ... in SVG units
    const at = (w: Int32Array, x: number, y: number): boolean => w[(n - 1 - y) * n + x] !== 0;
    const two = windings(ls[0]!.shape, n);
    expect([at(two, 5, 5), at(two, 1, 1), at(two, 8, 8), at(two, 8, 1)]).toEqual([
      true, // where the children overlap, though they wind opposite ways
      true,
      true,
      false,
    ]);
    const ring = windings(ls[1]!.shape, n);
    expect([at(ring, 5, 5), at(ring, 2, 5), at(ring, 0, 5)]).toEqual([false, true, false]);
  });

  it("clips to the viewBox, leaving shapes inside it untouched", () => {
    const ls = layers(`<svg viewBox="10 10 10 10">
      <rect x="5" y="15" width="10" height="10"/>
      <rect x="12" y="12" width="2" height="2"/>
      <rect x="0" y="0" width="10" height="10"/>
    </svg>`);
    expect(ls.map((l) => box(l.shape))).toEqual([
      [0, 0, 0.5, 0.5],
      [0.2, 0.6, 0.4, 0.8],
    ]);
    expect(ls[1]!.shape.contours[0]!.map((e) => e.type)).toEqual([LINEAR, LINEAR, LINEAR, LINEAR]);
  });

  it("spans bounding-box gradients over the whole element, not its clipped part", () => {
    const [layer] = layers(`<svg viewBox="0 0 10 10">
      <linearGradient id="g"><stop offset="0"/><stop offset="1"/></linearGradient>
      <clipPath id="c"><rect width="5" height="10"/></clipPath>
      <rect width="10" height="10" fill="url(#g)" clip-path="url(#c)"/>
    </svg>`);
    expect(box(layer!.shape)).toEqual([0, 0, 0.5, 1]);
    const [a = 0, , c = 0, , e = 0] = layer!.gradient!.matrix;
    expect(a * 0.5 + c * 0.5 + e).toBeCloseTo(0.5, 12);
  });
});

describe("parseSvgLayers: gradient href", () => {
  it("inherits every attribute a gradient doesn't set down the href chain", () => {
    const { layers } = parseSvgLayers(`<svg viewBox="0 0 30 10">
      <linearGradient id="base" gradientUnits="userSpaceOnUse" x1="0" x2="10" gradientTransform="translate(5 0)">
        <stop offset="0" stop-color="red"/><stop offset="1" stop-color="blue"/>
      </linearGradient>
      <linearGradient id="mid" href="#base" x2="20"/>
      <linearGradient id="top" xlink:href="#mid" x1="5"/>
      <radialGradient id="a" href="#b"/><radialGradient id="b" href="#a"/>
      <rect width="30" height="10" fill="url(#top)"/>
      <rect width="30" height="10" fill="url(#a)"/>
    </svg>`);
    // x1 = 5 (own), x2 = 20 (mid), user space and translate(5 0) (base): t = 0 at x = 10, 1 at 25.
    const g = layers[0]!.gradient!;
    const [a = 0, , c = 0, , e = 0] = g.matrix;
    expect(a * 1.0 + c * 0.5 + e).toBeCloseTo(0, 12);
    expect(a * 2.5 + c * 0.5 + e).toBeCloseTo(1, 12);
    expect(g.stops.map((s) => s.color)).toEqual(["red", "blue"]);
    expect(layers[1]!.gradient!.stops).toEqual([]); // a reference cycle ends the chain
  });
});

/** Gradient parameter t of `g` at shape-space point (x, y), before clamping. */
function gradT(g: SvgGradient, x: number, y: number): number {
  const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] = g.matrix;
  const [gx, gy] = [a * x + c * y + e, b * x + d * y + f];
  return g.radial ? Math.hypot(gx, gy) : gx;
}

/** Whether `shape` is filled (nonzero) at shape-space point (x, y). */
function filledAt(shape: Shape, x: number, y: number): boolean {
  const line = new Scanline();
  computeShapeScanline(shape, y, line);
  return line.sumIntersections(x) !== 0;
}

describe("parseSvgLayers: CSS class rules", () => {
  it("applies class rules in stylesheet order, whatever the order of the class names", () => {
    const { layers } = parseSvgLayers(`<svg viewBox="0 0 10 10">
      <style>.a { fill: red } .b { fill: blue }</style>
      <rect class="b a" width="5" height="5"/>
      <rect class="a b" width="5" height="5"/>
    </svg>`);
    expect(layers.map((l) => l.color)).toEqual(["blue", "blue"]);
  });

  it("applies class rules to gradient stops", () => {
    const [layer] = parseSvgLayers(`<svg viewBox="0 0 10 10">
      <style>.s { stop-color: red; stop-opacity: .25 }</style>
      <linearGradient id="g"><stop class="s" offset="0"/><stop offset="1" stop-color="blue"/></linearGradient>
      <rect width="10" height="10" fill="url(#g)"/>
    </svg>`).layers;
    expect(layer!.gradient!.stops.map((s) => [s.color, s.opacity])).toEqual([
      ["red", 0.25],
      ["blue", 1],
    ]);
  });
});

describe("parseSvgLayers: group opacity", () => {
  // Two overlapping squares; (0.5, 0.5) lies in both, (0.2, 0.8) only in the first.
  const pair = (group: string, extra = ""): SvgLayer[] =>
    parseSvgLayers(`<svg viewBox="0 0 10 10"><g ${group}>
      <rect width="6" height="6"${extra}/><rect x="4" y="4" width="6" height="6" fill="red"/>
    </g></svg>`).layers;

  it("draws an opaque group's members without overlap, each at the group's opacity", () => {
    const [back, front] = pair('opacity=".5"');
    expect([back!.opacity, front!.opacity]).toEqual([0.5, 0.5]);
    expect(filledAt(back!.shape, 0.5, 0.5)).toBe(false); // cut away under the front square
    expect(filledAt(back!.shape, 0.2, 0.8)).toBe(true);
    expect(filledAt(front!.shape, 0.5, 0.5)).toBe(true);
  });

  it("leaves translucent content and ungrouped opacity as it is", () => {
    const keeps = (layers: SvgLayer[]): boolean => filledAt(layers[0]!.shape, 0.5, 0.5);
    expect(keeps(pair('opacity=".5"', ' fill-opacity=".5"'))).toBe(true); // can't be exact
    expect(keeps(pair('opacity=".5"', ' opacity=".5"'))).toBe(true);
    expect(keeps(pair(""))).toBe(true); // no group opacity: overlap is just paint order
    const nested = parseSvgLayers(`<svg viewBox="0 0 10 10"><g opacity=".5">
      <rect width="6" height="6"/><g opacity=".5"><rect x="4" y="4" width="6" height="6"/></g>
    </g></svg>`).layers;
    expect(keeps(nested)).toBe(true);
  });
});

describe("parseSvgLayers: percentages and gradient units", () => {
  it("resolves percentage lengths against the viewport", () => {
    const { layers } = parseSvgLayers(`<svg viewBox="0 0 24 12">
      <rect width="100%" height="100%"/>
      <rect x="25%" y="50%" width="50%" height="25%" rx="10%"/>
    </svg>`);
    expect(box(layers[0]!.shape)).toEqual([0, 0, 2, 1]);
    expect(box(layers[1]!.shape)).toEqual([0.5, 0.25, 1.5, 0.5]);
    // r: a percentage of sqrt((w² + h²) / 2); 30 × 40 → 35.355…, so 20% ≈ 7.07 of 40.
    const [circle] = parseSvgLayers(
      `<svg viewBox="0 0 30 40"><circle cx="50%" cy="50%" r="20%"/></svg>`,
    ).layers;
    const b = shapeBounds(circle!.shape);
    expect((b.maxY - b.minY) / 2).toBeCloseTo((0.2 * Math.sqrt(1250)) / 40, 3);
  });

  it("resolves userSpaceOnUse percentages and defaults against the viewport", () => {
    const { layers } = parseSvgLayers(`<svg viewBox="0 0 20 10">
      <linearGradient id="d" gradientUnits="userSpaceOnUse"/>
      <linearGradient id="p" gradientUnits="userSpaceOnUse" x1="25%" x2="50%"/>
      <rect width="20" height="10" fill="url(#d)"/>
      <rect width="20" height="10" fill="url(#p)"/>
    </svg>`);
    // Shape x = user x / 10. Default x2 = 100% of the width (20), not 1.
    expect(gradT(layers[0]!.gradient!, 0, 0.5)).toBeCloseTo(0, 12);
    expect(gradT(layers[0]!.gradient!, 2, 0.5)).toBeCloseTo(1, 12);
    expect(gradT(layers[1]!.gradient!, 0.5, 0.5)).toBeCloseTo(0, 12);
    expect(gradT(layers[1]!.gradient!, 1, 0.5)).toBeCloseTo(1, 12);
  });

  it("measures a rotated element's bounding box in its own user space", () => {
    // A 10×10 square rotated 45° about its centre: the gradient runs from its own
    // left edge (t = 0) to its right edge (t = 1), not across its rotated extent.
    const [layer] = parseSvgLayers(`<svg viewBox="0 0 20 20">
      <linearGradient id="g"><stop offset="0"/><stop offset="1"/></linearGradient>
      <rect x="5" y="5" width="10" height="10" transform="rotate(45 10 10)" fill="url(#g)"/>
    </svg>`).layers;
    // Local (x, y) → user space → shape space (÷ 20, y flipped).
    const at = (x: number, y: number): number => {
      const [c, s] = [Math.SQRT1_2, Math.SQRT1_2];
      const [ux, uy] = [10 + c * (x - 10) - s * (y - 10), 10 + s * (x - 10) + c * (y - 10)];
      return gradT(layer!.gradient!, ux / 20, 1 - uy / 20);
    };
    expect(at(5, 10)).toBeCloseTo(0, 9);
    expect(at(15, 10)).toBeCloseTo(1, 9);
    expect(at(10, 5)).toBeCloseTo(0.5, 9);
  });
});

describe("Noto emoji regressions", () => {
  const noto = (u: string): string => readFileSync(resolve(NOTO, `emoji_u${u}.svg`), "utf8");
  const ALL = ["1f4a9", "1f9b1", "1f44c", "1f633", "1f644"];

  /**
   * Layers drawn through a clip-path, each with the layer whose outline is that
   * clip (the clipPath repeats an outline also drawn as a layer): the mouth
   * behind the teeth, the eye whites behind the pupils, the hand behind its shading.
   */
  const CLIPPED: Record<string, [number, number][]> = {
    "1f4a9": [[8, 7]],
    "1f644": [
      [4, 3],
      [7, 6],
    ],
    "1f44c": [1, 2, 3, 4, 5, 6].map((i) => [i, 0]),
  };
  for (const [u, pairs] of Object.entries(CLIPPED)) {
    it(`${u}: clipped layers fill exactly their own fill inside the clip`, () => {
      const src = noto(u);
      const clipped = parseSvgLayers(src).layers;
      const unclipped = parseSvgLayers(src.replace(/clip-path:\s*url\([^)]*\);?/g, "")).layers;
      expect(clipped).toHaveLength(unclipped.length);
      const n = 160;
      const errors: string[] = [];
      for (const [i, j] of pairs) {
        const [own, clip, got] = [unclipped[i]!.shape, clipped[j]!.shape, clipped[i]!.shape];
        const [wOwn, wClip, wGot] = [windings(own, n), windings(clip, n), windings(got, n)];
        for (let k = 0; k < n * n; k++) {
          const [x, y] = [((k % n) + 0.5) / n, (Math.floor(k / n) + 0.5) / n];
          const want = wOwn[k] !== 0 && wClip[k] !== 0;
          if (Math.abs(wGot[k]!) > 1) errors.push(`layer ${i}: overlap at ${x},${y}`);
          if (want !== (wGot[k] !== 0) && edgeDistance([own, clip], x, y) > 1e-4) {
            errors.push(`layer ${i}: fill ${want ? "lost" : "added"} at ${x},${y}`);
          }
        }
      }
      expect(errors).toEqual([]);
    });
  }

  it("1f9b1: only what is inside the viewBox is drawn", () => {
    // The file keeps two more hairstyles and strips of curls beside the canvas.
    const { layers } = parseSvgLayers(noto("1f9b1"));
    expect(layers.map((l) => l.color)).toEqual(["black", "url(#a)", "#3F2720"]);
  });

  it("1f633: the right cheek's gradient (geometry via href) mirrors the left one's", () => {
    const { layers } = parseSvgLayers(noto("1f633"));
    const [left, right] = [layers[2]!.gradient!, layers[3]!.gradient!];
    expect([left.radial, right.radial]).toEqual([true, true]);
    const t = (g: SvgGradient, x: number, y: number): number => {
      const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] = g.matrix;
      return Math.hypot(a * x + c * y + e, b * x + d * y + f);
    };
    // The file's numbers are mirror images to ~1e-6 SVG units; the bug put t near 164.
    for (const [x, y] of [
      [0.1, 0.3],
      [0.3, 0.5],
      [0.4, 0.2],
      [0.2, 0.45],
    ] as const) {
      expect(t(right, 1 - x, y)).toBeCloseTo(t(left, x, y), 6);
    }
    expect(right.stops).toEqual(left.stops);
  });

  it("every layer lies in the viewBox and its MSDF has no cracks", () => {
    for (const u of ALL) {
      for (const [i, { shape }] of parseSvgLayers(noto(u)).layers.entries()) {
        const [x0 = 0, y0 = 0, x1 = 0, y1 = 0] = box(shape);
        expect([u, i, x0 >= 0 && y0 >= 0 && x1 <= 1 && y1 <= 1]).toEqual([u, i, true]);
        // A smooth contour leaves one channel without edges (±Infinity, as in msdfgen),
        // which the median ignores; a non-finite median would be a crack.
        const { msdf } = generateShapeMSDF(shape, 64, 8)!;
        let cracks = 0;
        for (let k = 0; k < msdf.length; k += 3) {
          const [r, g, b] = [msdf[k]!, msdf[k + 1]!, msdf[k + 2]!];
          if (!Number.isFinite(Math.max(Math.min(r, g), Math.min(Math.max(r, g), b)))) cracks++;
        }
        expect([u, i, cracks]).toEqual([u, i, 0]);
      }
    }
  });
});

describe("generateShapeMSDF: overlapping contours", () => {
  // Two rounded rectangles overlapping inside one <path>. Unmerged, the generator
  // leaves -Infinity texels along the overlap, drawn as a crack in the fill.
  const overlapping = svg(
    "M5 3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3z" +
      "M10 6h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3z",
  );
  const shape = (): Shape => parseSvgLayers(overlapping).layers[0]!.shape;
  const nonFinite = (m: ShapeMSDF | null): number =>
    m!.msdf.filter((v) => !Number.isFinite(v)).length;

  it("merges them by default", () => {
    const merged = shape();
    expect(nonFinite(generateShapeMSDF(merged, 64, 8))).toBe(0);
    expect(merged.contours).toHaveLength(1);
  });

  it("keeps them with union = false, as the reference does", () => {
    const kept = shape();
    expect(nonFinite(generateShapeMSDF(kept, 64, 8, false))).toBeGreaterThan(0);
    expect(kept.contours).toHaveLength(2);
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
      const r = generateShapeMSDF(shape, 32, 4, false)!; // msdfgen without Skia

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
