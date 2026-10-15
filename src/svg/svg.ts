/**
 * Minimal SVG → Shape parser: the `svg/` twin of `font/`. No DOM.
 *
 * Supported: every `<path d>` (all commands, arcs converted to cubics), the
 * root `viewBox` (or `width`/`height`), `fill="none"` (path is skipped) and
 * `fill-rule="evenodd"` (that path's contours are re-oriented so nonzero
 * gives the same fill — msdfgen's orientContours; self-intersecting even-odd
 * paths are approximate, as in msdfgen without Skia). Paths are unioned.
 * Not supported: strokes, transforms, `<g>`/CSS styling, basic shapes
 * (`<circle>`, `<rect>`, …), per-path colours — everything is one filled shape.
 */

import { EdgeSegment, LINEAR, QUADRATIC, CUBIC, type SegmentType } from "../shape/segments";
import { type Contour } from "../shape/contour";
import { type Shape } from "../shape/shape";
import { emNormalizeShape, orientContours } from "../shape/normalize";

/** Reads attribute `name` from one tag's source text. */
function _attr(tag: string, name: string): string | undefined {
  return new RegExp(`\\s${name}\\s*=\\s*["']([^"']*)["']`).exec(tag)?.[1];
}

/**
 * Parses an SVG document into one filled {@link Shape}: y-up, origin at the
 * viewBox's bottom-left, 1 unit = the viewBox height.
 *
 * @param svg SVG source text.
 * @returns The shape, ready for `Atlas.shapes` or `generateShapeMSDF`.
 */
export function parseSvg(svg: string): Shape {
  const root = /<svg\b[^>]*>/.exec(svg)?.[0] ?? "";
  const box = (_attr(root, "viewBox") ?? `0 0 ${_attr(root, "width")} ${_attr(root, "height")}`)
    .trim()
    .split(/[\s,]+/)
    .map(parseFloat);
  const [x0 = 0, y0 = 0, , h = NaN] = box;
  if (!(h > 0)) throw new Error("parseSvg: needs a viewBox or width/height");

  const shape: Shape = { contours: [], inverseYAxis: false };
  for (const [tag] of svg.matchAll(/<path\b[^>]*>/g)) {
    if ((_attr(tag, "fill") ?? _attr(root, "fill")) === "none") continue;
    const contours: Contour[] = [];
    _parsePath(_attr(tag, "d") ?? "", x0, y0 + h, contours);
    if ((_attr(tag, "fill-rule") ?? _attr(root, "fill-rule")) === "evenodd")
      orientContours(contours);
    shape.contours.push(...contours);
  }
  emNormalizeShape(shape, h);
  return shape;
}

const _NUM = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;

/**
 * Appends the closed contours of path data `d` to `out`, in SVG user units
 * translated to (`ox`, `oy`) and y-flipped (SVG is y-down, Shape is y-up).
 */
function _parsePath(d: string, ox: number, oy: number, out: Contour[]): void {
  let i = 0;
  let cx = 0; // current point (SVG coordinates)
  let cy = 0;
  let sx = 0; // subpath start
  let sy = 0;
  let qx = 0; // last control point, for S/T reflection
  let qy = 0;
  let cmd = "";
  let prev = "";
  let contour: Contour = [];

  const skip = (): void => {
    while (i < d.length && " \t\r\n,".includes(d[i]!)) i++;
  };
  const num = (): number => {
    skip();
    _NUM.lastIndex = i;
    const m = _NUM.exec(d);
    if (!m) throw new Error(`parseSvg: expected a number at ${i} in path "${d}"`);
    i = _NUM.lastIndex;
    return parseFloat(m[0]);
  };
  const flag = (): number => {
    skip();
    return d[i++] === "1" ? 1 : 0;
  };
  // Segment from the current point through control/end points `p` (x, y pairs),
  // mapped to shape space (translated, y-flipped); unused fields stay 0.
  const seg = (type: SegmentType, ...p: number[]): void => {
    const [a = 0, b = 0, c = 0, e = 0, f = 0, g = 0] = p.map((v, k) => (k & 1 ? oy - v : v - ox));
    contour.push(new EdgeSegment(type, cx - ox, oy - cy, a, b, c, e, f, g));
    cx = p[p.length - 2]!;
    cy = p[p.length - 1]!;
  };
  const close = (): void => {
    if (contour.length > 0) {
      if (cx !== sx || cy !== sy) seg(LINEAR, sx, sy);
      out.push(contour);
      contour = [];
    }
    cx = sx;
    cy = sy;
  };

  for (skip(); i < d.length; skip()) {
    if (/[a-zA-Z]/.test(d[i]!)) cmd = d[i++]!;
    else if (!cmd) throw new Error(`parseSvg: expected a command at ${i} in path "${d}"`);
    const C = cmd.toUpperCase();
    const rx = cmd === C ? 0 : cx; // relative offset
    const ry = cmd === C ? 0 : cy;
    // S/T reflect the previous curve's last control point, else use the current point.
    const reflect = (C === "S" && "CS".includes(prev)) || (C === "T" && "QT".includes(prev));
    const kx = reflect ? 2 * cx - qx : cx;
    const ky = reflect ? 2 * cy - qy : cy;
    switch (C) {
      case "M": {
        const x = rx + num();
        const y = ry + num();
        close();
        cx = sx = x;
        cy = sy = y;
        cmd = cmd === "M" ? "L" : "l"; // extra pairs are implicit lineto
        break;
      }
      case "L":
        seg(LINEAR, rx + num(), ry + num());
        break;
      case "H":
        seg(LINEAR, rx + num(), cy);
        break;
      case "V":
        seg(LINEAR, cx, ry + num());
        break;
      case "C":
      case "S": {
        const x1 = C === "C" ? rx + num() : kx;
        const y1 = C === "C" ? ry + num() : ky;
        qx = rx + num();
        qy = ry + num();
        seg(CUBIC, x1, y1, qx, qy, rx + num(), ry + num());
        break;
      }
      case "Q":
      case "T":
        qx = C === "Q" ? rx + num() : kx;
        qy = C === "Q" ? ry + num() : ky;
        seg(QUADRATIC, qx, qy, rx + num(), ry + num());
        break;
      case "A": {
        const arx = num();
        const ary = num();
        const rot = num();
        const large = flag();
        const sweep = flag();
        _arc(seg, cx, cy, arx, ary, rot, large, sweep, rx + num(), ry + num());
        break;
      }
      case "Z":
        close();
        cmd = ""; // Z takes no arguments
        break;
      default:
        throw new Error(`parseSvg: unknown path command "${cmd}"`);
    }
    prev = C;
  }
  close();
}

/**
 * SVG elliptical arc (endpoint parameterization) as ≤ 90° cubic pieces —
 * SVG spec, implementation notes F.6.5 (endpoint → center conversion).
 */
function _arc(
  seg: (type: SegmentType, ...p: number[]) => void,
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  rotDeg: number,
  large: number,
  sweep: number,
  x2: number,
  y2: number,
): void {
  if (x1 === x2 && y1 === y2) return;
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  if (rx === 0 || ry === 0) return seg(LINEAR, x2, y2);
  const cos = Math.cos((rotDeg * Math.PI) / 180);
  const sin = Math.sin((rotDeg * Math.PI) / 180);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const xp = cos * dx + sin * dy;
  const yp = -sin * dx + cos * dy;
  const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }
  const rr = rx * rx * yp * yp + ry * ry * xp * xp;
  const k = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, (rx * rx * ry * ry - rr) / rr));
  const cxp = (k * rx * yp) / ry;
  const cyp = (-k * ry * xp) / rx;
  const ccx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const ccy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const t1 = Math.atan2((yp - cyp) / ry, (xp - cxp) / rx);
  let dt = Math.atan2((-yp - cyp) / ry, (-xp - cxp) / rx) - t1;
  if (sweep && dt < 0) dt += 2 * Math.PI;
  else if (!sweep && dt > 0) dt -= 2 * Math.PI;

  const n = Math.max(1, Math.ceil(Math.abs(dt) / (Math.PI / 2) - 1e-9));
  const step = dt / n;
  const a = (4 / 3) * Math.tan(step / 4); // control-arm length on the unit circle
  // Unit-circle point (u, v) → ellipse → rotated → translated.
  const X = (u: number, v: number): number => ccx + rx * u * cos - ry * v * sin;
  const Y = (u: number, v: number): number => ccy + rx * u * sin + ry * v * cos;
  for (let j = 0; j < n; j++) {
    const c0 = Math.cos(t1 + j * step);
    const s0 = Math.sin(t1 + j * step);
    const c1 = Math.cos(t1 + (j + 1) * step);
    const s1 = Math.sin(t1 + (j + 1) * step);
    const last = j === n - 1; // land exactly on the endpoint so contours close
    seg(
      CUBIC,
      X(c0 - a * s0, s0 + a * c0),
      Y(c0 - a * s0, s0 + a * c0),
      X(c1 + a * s1, s1 - a * c1),
      Y(c1 + a * s1, s1 - a * c1),
      last ? x2 : X(c1, s1),
      last ? y2 : Y(c1, s1),
    );
  }
}
