/**
 * Minimal SVG → Shape parser: the `svg/` twin of `font/`. No DOM.
 *
 * Supported: `<path>` (all commands, arcs converted to cubics) and the basic
 * shapes (`<rect>` incl. rounded, `<circle>`, `<ellipse>`, `<polygon>`,
 * `<polyline>`); `transform` on any element, composed through `<g>`; `fill`,
 * `fill-rule`, `fill-opacity` (inherited) and `opacity` from attributes, CSS
 * class rules in `<style>` (`.name` selectors only) or inline `style`; linear/
 * radial gradient fills (`gradientUnits`, `gradientTransform`, stops via
 * `href`; pad only, focal point ignored); the root `viewBox` (or `width`/
 * `height`). `fill-rule="evenodd"` shapes are re-oriented so nonzero gives the
 * same fill (msdfgen's orientContours; self-intersecting even-odd paths are
 * approximate, as in msdfgen without Skia).
 * Not supported: strokes, clip paths, masks, filters, `<use>`, `<text>`,
 * nested `<svg>`. `<defs>`, `<clipPath>`, `<mask>`, `<symbol>`, `<pattern>`
 * and `<marker>` contents are not drawn.
 */

import { EdgeSegment, LINEAR, QUADRATIC, CUBIC, type SegmentType } from "../shape/segments";
import { type Contour } from "../shape/contour";
import { type Shape } from "../shape/shape";
import { emNormalizeShape, orientContours } from "../shape/normalize";
import { shapeBounds } from "../msdf/shape-msdf";

/** A gradient fill, ready for a shader. Colours are raw CSS strings. */
export interface SvgGradient {
  /** Linear: t = x'. Radial: t = length(x', y'). Clamped to [0, 1] (pad). */
  radial: boolean;
  /** Affine `[a, b, c, d, e, f]` (SVG `matrix()` order) from shape space
   *  to gradient space: x' = a·x + c·y + e, y' = b·x + d·y + f. */
  matrix: number[];
  stops: { offset: number; color: string; opacity: number }[];
}

/** One filled `<path>`: its own shape (same space as {@link parseSvg}) and paint. */
export interface SvgLayer {
  shape: Shape;
  /** CSS colour of `fill`; unused when `gradient` is set. */
  color: string;
  /** `opacity × fill-opacity`. */
  opacity: number;
  gradient: SvgGradient | null;
}

/** Reads attribute `name` from one tag's source text (the value may hold the other quote). */
function _attr(tag: string, name: string): string | undefined {
  return new RegExp(`\\s${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`).exec(tag)?.[2];
}

/**
 * Reads presentation property `name` of one tag, in CSS precedence: inline
 * `style`, then the rules for its `class`es, then the attribute. Within CSS,
 * the last declaration wins.
 */
function _prop(tag: string, name: string, classes?: Map<string, string>): string | undefined {
  const re = new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]+)`, "g");
  const last = (css: string): string | undefined => [...css.matchAll(re)].pop()?.[1]?.trim();
  const rules = (_attr(tag, "class") ?? "").split(/\s+/).map((c) => classes?.get(c) ?? "");
  return last(_attr(tag, "style") ?? "") ?? last(rules.join(";")) ?? _attr(tag, name);
}

/** Parses a number or percentage (`50%` → 0.5); `def` when absent. */
function _num(v: string | undefined, def: number): number {
  return v === undefined ? def : parseFloat(v) / (v.trim().endsWith("%") ? 100 : 1);
}

/**
 * Parses an SVG document into one filled {@link Shape}: y-up, origin at the
 * viewBox's bottom-left, 1 unit = the viewBox height. All paths are unioned.
 *
 * @param svg SVG source text.
 * @returns The shape, ready for `Atlas.shapes` or `generateShapeMSDF`.
 */
export function parseSvg(svg: string): Shape {
  const contours = parseSvgLayers(svg).layers.flatMap((l) => l.shape.contours);
  return { contours, inverseYAxis: false };
}

/**
 * Parses an SVG document into one {@link SvgLayer} per filled path, in paint
 * order (back to front), for drawing with real colours and gradients.
 *
 * @param svg SVG source text.
 * @returns The layers, plus the viewBox width (shape units; height is 1).
 */
export function parseSvgLayers(svg: string): { layers: SvgLayer[]; width: number } {
  svg = svg.replace(/<!--[\s\S]*?-->/g, ""); // comments may contain tags
  const root = /<svg\b[^>]*>/.exec(svg)?.[0] ?? "";
  const box = (_attr(root, "viewBox") ?? `0 0 ${_attr(root, "width")} ${_attr(root, "height")}`)
    .trim()
    .split(/[\s,]+/)
    .map(parseFloat);
  const [x0 = 0, y0 = 0, w = NaN, h = NaN] = box;
  if (!(h > 0)) throw new Error("parseSvg: needs a viewBox or width/height");
  const toUser = [h, 0, 0, -h, x0, y0 + h]; // shape space → SVG user space
  const flip = [1, 0, 0, -1, -x0, y0 + h]; // user space → shape space, before ÷ h

  const gradients = new Map<string, string[]>(); // id → [kind, attributes, body]
  const gradientRe = /<(linear|radial)Gradient\b([^>]*?)(?:\/>|>([\s\S]*?)<\/\1Gradient>)/g;
  for (const [, kind = "", attrs = "", body = ""] of svg.matchAll(gradientRe)) {
    gradients.set(_attr(attrs, "id") ?? "", [kind, attrs, body]);
  }
  // CSS class rules from <style> blocks (".a, .b { … }"), concatenated in source order.
  const classes = new Map<string, string>();
  for (const [, css = ""] of svg.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) {
    for (const [, selectors = "", decls = ""] of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
      for (const sel of selectors.split(",")) {
        const name = /^\s*\.([\w-]+)\s*$/.exec(sel)?.[1];
        if (name) classes.set(name, `${classes.get(name) ?? ""};${decls}`);
      }
    }
  }

  // Walk the tags in paint order, keeping each open element's inherited state.
  const layers: SvgLayer[] = [];
  const stack = [
    { m: [1, 0, 0, 1, 0, 0], fill: "black", rule: "nonzero", fillOpacity: 1, opacity: 1 },
  ];
  let hidden = 0; // depth inside containers that are never drawn
  for (const [, close, name = "", attrs = "", selfClose] of svg.matchAll(
    /<(\/?)([\w:-]+)([^>]*?)(\/?)>/g,
  )) {
    if (hidden > 0 || /^(defs|clipPath|mask|symbol|pattern|marker|style)$/.test(name)) {
      if (close) hidden--;
      else if (!selfClose) hidden++;
      continue;
    }
    if (close) {
      stack.pop();
      continue;
    }
    const parent = stack[stack.length - 1]!;
    const prop = (key: string): string | undefined => _prop(attrs, key, classes);
    const state = {
      m: _mul(parent.m, _transform(_attr(attrs, "transform") ?? "")),
      fill: prop("fill") ?? parent.fill,
      rule: prop("fill-rule") ?? parent.rule,
      fillOpacity: _num(prop("fill-opacity"), parent.fillOpacity),
      opacity: parent.opacity * _num(prop("opacity"), 1),
    };
    if (!selfClose) stack.push(state);
    const d = _outline(name, attrs);
    if (d === undefined || state.fill === "none") continue;

    const contours: Contour[] = [];
    _parsePath(d, _mul(flip, state.m), contours);
    if (state.rule === "evenodd") orientContours(contours);
    const shape: Shape = { contours, inverseYAxis: false };
    emNormalizeShape(shape, h);
    const ref = gradients.get(/url\(\s*['"]?#([^)'"\s]+)/.exec(state.fill)?.[1] ?? "");
    const toLocal = _mul(_invert(state.m), toUser); // shape space → this element's user space
    layers.push({
      shape,
      color: state.fill,
      opacity: state.opacity * state.fillOpacity,
      gradient: ref ? _gradient(ref, gradients, toLocal, shape) : null,
    });
  }
  return { layers, width: w / h };
}

/** A drawable element's outline as path data (basic shapes converted), or undefined. */
function _outline(name: string, attrs: string): string | undefined {
  const n = (key: string): number => _num(_attr(attrs, key), 0);
  const [x, y, w, h, cx, cy] = [n("x"), n("y"), n("width"), n("height"), n("cx"), n("cy")];
  switch (name) {
    case "path":
      return _attr(attrs, "d") ?? "";
    case "polygon":
    case "polyline": // filled as if closed, like a path
      return `M${_attr(attrs, "points") ?? "0 0"}`;
    case "circle":
    case "ellipse": {
      const [rx, ry] = name === "circle" ? [n("r"), n("r")] : [n("rx"), n("ry")];
      const arc = `A${rx} ${ry} 0 1 0`;
      return `M${cx - rx} ${cy}${arc} ${cx + rx} ${cy}${arc} ${cx - rx} ${cy}Z`;
    }
    case "rect": {
      // A missing rx/ry copies the other; both clamp to half the size. 0 radius arcs are skipped.
      const rx = Math.min(_num(_attr(attrs, "rx") ?? _attr(attrs, "ry"), 0), w / 2);
      const ry = Math.min(_num(_attr(attrs, "ry") ?? _attr(attrs, "rx"), 0), h / 2);
      const arc = `A${rx} ${ry} 0 0 1`;
      return (
        `M${x + rx} ${y}H${x + w - rx}${arc} ${x + w} ${y + ry}V${y + h - ry}` +
        `${arc} ${x + w - rx} ${y + h}H${x + rx}${arc} ${x} ${y + h - ry}V${y + ry}${arc} ${x + rx} ${y}Z`
      );
    }
    default:
      return undefined;
  }
}

/** Resolves one gradient element to a shape-space → gradient-space matrix + stops. */
function _gradient(
  [kind, attrs = "", body = ""]: string[],
  gradients: Map<string, string[]>,
  toLocal: number[],
  shape: Shape,
): SvgGradient {
  const n = (name: string, def: number): number => _num(_attr(attrs, name), def);
  // Gradient → the element's user space: [bounding box ·] gradientTransform.
  let m = _transform(_attr(attrs, "gradientTransform") ?? "");
  if (_attr(attrs, "gradientUnits") !== "userSpaceOnUse") {
    // Unit square → the element's bounding box (exact unless the element is rotated).
    const b = shapeBounds(shape);
    const corners = [b.minX, b.minY, b.maxX, b.minY, b.minX, b.maxY, b.maxX, b.maxY];
    const xs: number[] = [];
    const ys: number[] = [];
    for (let k = 0; k < 8; k += 2) {
      const [px, py] = _apply(toLocal, corners[k]!, corners[k + 1]!);
      xs.push(px);
      ys.push(py);
    }
    const [lx, ly] = [Math.min(...xs), Math.min(...ys)];
    m = _mul([Math.max(...xs) - lx, 0, 0, Math.max(...ys) - ly, lx, ly], m);
  }
  // Gradient space → normalized: linear p1→0, p2→1 along x; radial centre→0, r→1.
  const radial = kind === "radial";
  const [x1, y1, dx, dy] = [
    n("x1", 0),
    n("y1", 0),
    n("x2", 1) - n("x1", 0),
    n("y2", 0) - n("y1", 0),
  ];
  const [cx, cy, r] = [n("cx", 0.5), n("cy", 0.5), n("r", 0.5)];
  const len2 = dx * dx + dy * dy || 1;
  const norm = radial
    ? [1 / r, 0, 0, 1 / r, -cx / r, -cy / r]
    : [dx / len2, 0, dy / len2, 0, -(x1 * dx + y1 * dy) / len2, 0];

  // Stops live here, or on the gradient this one links to (Inkscape style).
  const href = _attr(attrs, "(?:xlink:)?href")?.slice(1) ?? "";
  const stopSrc = /<stop\b/.test(body) ? body : (gradients.get(href)?.[2] ?? "");
  const stops = [...stopSrc.matchAll(/<stop\b[^>]*>/g)].map(([stop]) => ({
    offset: _num(_attr(stop, "offset"), 0),
    color: _prop(stop, "stop-color") ?? "black",
    opacity: _num(_prop(stop, "stop-opacity"), 1),
  }));
  return { radial, matrix: _mul(norm, _mul(_invert(m), toLocal)), stops };
}

/** Composes affine matrices (SVG `matrix()` order): `m · n` (n applied first). */
function _mul(m: number[], n: number[]): number[] {
  const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] = m;
  const [na = 0, nb = 0, nc = 0, nd = 0, ne = 0, nf = 0] = n;
  return [
    a * na + c * nb,
    b * na + d * nb,
    a * nc + c * nd,
    b * nc + d * nd,
    a * ne + c * nf + e,
    b * ne + d * nf + f,
  ];
}

/** Applies an affine matrix (SVG `matrix()` order) to a point. */
function _apply(
  [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]: number[],
  x: number,
  y: number,
): [number, number] {
  return [a * x + c * y + e, b * x + d * y + f];
}

/** Inverts an affine matrix (SVG `matrix()` order). */
function _invert([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]: number[]): number[] {
  const det = a * d - b * c;
  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
}

/** Parses an SVG `transform` list into one affine matrix. */
function _transform(src: string): number[] {
  let m = [1, 0, 0, 1, 0, 0];
  for (const [, fn, args = ""] of src.matchAll(/(\w+)\s*\(([^)]*)\)/g)) {
    const [a = 0, b, c, d = 0, e = 0, f = 0] = args
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat);
    const rad = (a * Math.PI) / 180;
    const [cos, sin] = [Math.cos(rad), Math.sin(rad)];
    const [px, py] = [b ?? 0, c ?? 0]; // rotate(angle, px, py) pivot
    m = _mul(
      m,
      fn === "matrix"
        ? [a, b ?? 0, c ?? 0, d, e, f]
        : fn === "translate"
          ? [1, 0, 0, 1, a, b ?? 0]
          : fn === "scale"
            ? [a, 0, 0, b ?? a, 0, 0]
            : fn === "rotate"
              ? [cos, sin, -sin, cos, px - cos * px + sin * py, py - sin * px - cos * py]
              : fn === "skewX"
                ? [1, 0, Math.tan(rad), 1, 0, 0]
                : [1, Math.tan(rad), 0, 1, 0, 0], // skewY
    );
  }
  return m;
}

const _NUM = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;

/**
 * Appends the closed contours of path data `d` to `out`, every point mapped by
 * `xf` (the element's transform, then the y-flip into shape space).
 */
function _parsePath(d: string, xf: number[], out: Contour[]): void {
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
  // mapped by `xf` (exact for curves: affine maps keep Béziers Béziers); unused fields stay 0.
  const seg = (type: SegmentType, ...p: number[]): void => {
    const q = [cx, cy, ...p];
    const t: number[] = [];
    for (let k = 0; k < q.length; k += 2) t.push(..._apply(xf, q[k]!, q[k + 1]!));
    const [p0x = 0, p0y = 0, p1x = 0, p1y = 0, p2x = 0, p2y = 0, p3x = 0, p3y = 0] = t;
    contour.push(new EdgeSegment(type, p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y));
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
