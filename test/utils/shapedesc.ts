/**
 * Parser and serializer for msdfgen's shapedesc text format.
 *
 * Used only in tests (Gate 2a) to verify that our normalized Shape matches
 * the -exportshape fixtures produced by the reference C++ binary.
 *
 * Format reference: core/shape-description.cpp: writeShapeDescription / readShapeDescription
 * msdfgen © Viktor Chlumský — MIT licence.
 */

import { EdgeSegment, LINEAR, QUADRATIC, CUBIC } from "../../src/shape/segments.js";
import { type Contour } from "../../src/shape/contour.js";
import { type Shape } from "../../src/shape/shape.js";

// ── Parser ───────────────────────────────────────────────────────────────────

/** Minimal stateful cursor over a shapedesc string. */
class ShapeDescReader {
  private pos = 0;
  constructor(private readonly text: string) {}

  /** Advance past all whitespace characters. */
  skipWS(): void {
    const t = this.text;
    while (this.pos < t.length) {
      const c = t[this.pos]!;
      if (c === " " || c === "\t" || c === "\r" || c === "\n") this.pos++;
      else break;
    }
  }

  /** Read the next non-whitespace character (advances past it). EOF = ''. */
  readChar(): string {
    this.skipWS();
    return this.pos < this.text.length ? this.text[this.pos++]! : "";
  }

  /** Peek the next non-whitespace character (does NOT advance). EOF = ''. */
  peekChar(): string {
    this.skipWS();
    return this.pos < this.text.length ? this.text[this.pos]! : "";
  }

  /**
   * Try to read a numeric coordinate pair "x, y".
   * Advances pos on success; leaves pos unchanged on failure.
   * @returns [x, y] on success or null on failure.
   */
  readCoord(): [number, number] | null {
    this.skipWS();
    const saved = this.pos;
    const t = this.text;
    // Attempt to parse a floating-point number
    let i = this.pos;
    if (i < t.length && t[i] === "-") i++;
    const start = i;
    while (i < t.length && ((t[i]! >= "0" && t[i]! <= "9") || t[i] === ".")) i++;
    if (i === start) {
      this.pos = saved;
      return null;
    } // no digits
    if (i < t.length && (t[i] === "e" || t[i] === "E")) {
      i++;
      if (i < t.length && (t[i] === "+" || t[i] === "-")) i++;
      while (i < t.length && t[i]! >= "0" && t[i]! <= "9") i++;
    }
    const x = parseFloat(t.slice(this.pos, i));
    this.pos = i;
    this.skipWS();
    if (this.pos >= t.length || t[this.pos] !== ",") {
      this.pos = saved;
      return null;
    }
    this.pos++; // consume ','
    this.skipWS();
    let j = this.pos;
    if (j < t.length && t[j] === "-") j++;
    const start2 = j;
    while (j < t.length && ((t[j]! >= "0" && t[j]! <= "9") || t[j] === ".")) j++;
    if (j === start2) {
      this.pos = saved;
      return null;
    }
    if (j < t.length && (t[j] === "e" || t[j] === "E")) {
      j++;
      if (j < t.length && (t[j] === "+" || t[j] === "-")) j++;
      while (j < t.length && t[j]! >= "0" && t[j]! <= "9") j++;
    }
    const y = parseFloat(t.slice(this.pos, j));
    this.pos = j;
    return [x, y];
  }
}

/**
 * Parses a single contour from a shapedesc stream.
 * Precondition: the '{' has already been consumed.
 * Postcondition: the matching '}' has been consumed.
 * port of core/shape-description.cpp: readContour (FILE template)
 *
 * @param r Reader positioned after '{'.
 * @returns Object with edge segments and whether any color letters were found.
 */
function parseContour(r: ShapeDescReader): { edges: EdgeSegment[]; colorsSpecified: boolean } {
  const edges: EdgeSegment[] = [];
  let colorsSpecified = false;

  // Read the start point of the first edge.
  const firstCoord = r.readCoord();
  if (firstCoord === null) {
    // Empty contour — consume '}'
    if (r.peekChar() === "}") r.readChar();
    return edges;
  }

  let p0x = firstCoord[0];
  let p0y = firstCoord[1];
  const startX = p0x;
  const startY = p0y;

  // Control-point scratch (at most 2 control points per edge)
  let c1x = 0,
    c1y = 0,
    c2x = 0,
    c2y = 0;

  // Main loop: each iteration consumes one ';' + edge descriptor + endpoint.
  // Matches the C++ while((c = readChar) != '}') loop.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // The loop starts expecting a ';' separator.
    const sep = r.readChar();
    if (sep === "}" || sep === "") break; // end of contour or stream
    if (sep !== ";") break; // malformed — just exit

    // After the ';', try to read a coordinate directly (LINEAR edge with no descriptor).
    const directCoord = r.readCoord();
    if (directCoord !== null) {
      // LINEAR edge with no explicit descriptor.
      edges.push(new EdgeSegment(LINEAR, p0x, p0y, directCoord[0], directCoord[1], 0, 0, 0, 0));
      p0x = directCoord[0];
      p0y = directCoord[1];
      continue;
    }

    // Not a coordinate: read the edge descriptor character (color, '#', or '(').
    const dc = r.readChar();
    if (dc === "}" || dc === "") break;

    if (dc === "#") {
      // Close edge: p[0] → start, LINEAR.
      const closeEdge = new EdgeSegment(LINEAR, p0x, p0y, startX, startY, 0, 0, 0, 0);
      edges.push(closeEdge);
      p0x = startX;
      p0y = startY;
      continue;
    }

    // At this point dc is a color letter (c/m/y/w) or '('.
    // Read the color letter and map to EdgeColor bitmask.
    // port of core/shape-description.cpp: readContour — color letter handling
    let edgeColor = 7; // WHITE = default
    let controlPoints = 0;

    let nextC = dc;
    if (dc === "c" || dc === "C") {
      edgeColor = 6;
      colorsSpecified = true;
      nextC = r.readChar();
    } // CYAN
    else if (dc === "m" || dc === "M") {
      edgeColor = 5;
      colorsSpecified = true;
      nextC = r.readChar();
    } // MAGENTA
    else if (dc === "y" || dc === "Y") {
      edgeColor = 3;
      colorsSpecified = true;
      nextC = r.readChar();
    } // YELLOW
    else if (dc === "w" || dc === "W") {
      edgeColor = 7;
      colorsSpecified = true;
      nextC = r.readChar();
    } // WHITE

    if (nextC === ";") {
      // Color letter followed directly by ';': no control points, go to end.
      goto_finish_edge: {
        const ep = r.readCoord();
        if (ep !== null) {
          const fwdEdge = new EdgeSegment(LINEAR, p0x, p0y, ep[0], ep[1], 0, 0, 0, 0);
          fwdEdge.color = edgeColor;
          edges.push(fwdEdge);
          p0x = ep[0];
          p0y = ep[1];
          break goto_finish_edge;
        }
        // readCoord failed: might be '#'
        const ec = r.readChar();
        if (ec === "#") {
          const closeEdge2 = new EdgeSegment(LINEAR, p0x, p0y, startX, startY, 0, 0, 0, 0);
          closeEdge2.color = edgeColor;
          edges.push(closeEdge2);
          p0x = startX;
          p0y = startY;
        }
      }
      continue;
    }

    if (nextC === "(") {
      // Read control points.
      const ctrl1 = r.readCoord();
      if (ctrl1 !== null) {
        c1x = ctrl1[0];
        c1y = ctrl1[1];
        controlPoints = 1;
        const after = r.peekChar();
        if (after === ";") {
          r.readChar(); // consume ';'
          const ctrl2 = r.readCoord();
          if (ctrl2 !== null) {
            c2x = ctrl2[0];
            c2y = ctrl2[1];
            controlPoints = 2;
          }
        }
      }
      // Consume ')'
      if (r.peekChar() === ")") r.readChar();
    }

    // Read ';' separator before the destination.
    const sep2 = r.readChar();
    // (if sep2 !== ';', we'll just try to read the endpoint anyway)

    // FINISH_EDGE: read endpoint coordinate or '#'.
    const ep = r.readCoord();
    let epx: number, epy: number;
    if (ep !== null) {
      epx = ep[0];
      epy = ep[1];
    } else {
      const ec = r.readChar();
      if (ec === "#") {
        epx = startX;
        epy = startY;
      } else {
        break; // malformed
      }
    }

    // Create edge based on number of control points, preserving the color letter.
    let newEdge: EdgeSegment;
    switch (controlPoints) {
      case 0:
        newEdge = new EdgeSegment(LINEAR, p0x, p0y, epx, epy, 0, 0, 0, 0);
        break;
      case 1:
        newEdge = new EdgeSegment(QUADRATIC, p0x, p0y, c1x, c1y, epx, epy, 0, 0);
        break;
      default:
        newEdge = new EdgeSegment(CUBIC, p0x, p0y, c1x, c1y, c2x, c2y, epx, epy);
        break;
    }
    newEdge.color = edgeColor;
    edges.push(newEdge);
    p0x = epx;
    p0y = epy;

    // If endpoint is the start, close the contour.
    if (epx === startX && epy === startY && ep === null) {
      // Already closed via '#'
      // The outer loop will consume '}' on the next ';' read when sep == '}'
    }

    void sep2; // suppress unused warning
  }

  return { edges, colorsSpecified };
}

/**
 * Parses a shapedesc string (as written by msdfgen -exportshape) into a Shape.
 *
 * Colour codes (c/m/y/w) are read and applied to each EdgeSegment's `color`
 * field, matching C++ readShapeDescription behaviour. When colours are present,
 * the caller should NOT call edgeColoringSimple (set `colorsSpecified` guard).
 *
 * @param text Raw contents of a shape.txt file.
 * @returns `{ shape, colorsSpecified }` — colorsSpecified is true when any
 *   colour letter was found in the file (matching C++ *colorsSpecified out-param).
 */
export function parseShapeDesc(text: string): { shape: Shape; colorsSpecified: boolean } {
  const r = new ShapeDescReader(text);
  const contours: Contour[] = [];
  let inverseYAxis = false;
  let colorsSpecified = false;

  r.skipWS();

  // Optional header: @y-up | @y-down | @invert-y
  if (r.peekChar() === "@") {
    r.readChar(); // consume '@'
    if (text.startsWith("y-down", r["pos"])) {
      inverseYAxis = true;
      r["pos"] += 6;
    } else if (text.startsWith("y-up", r["pos"])) {
      inverseYAxis = false;
      r["pos"] += 4;
    } else if (text.startsWith("invert-y", r["pos"])) {
      inverseYAxis = true;
      r["pos"] += 8;
    }
  }

  // Parse contour blocks { ... }
  while (r.peekChar() === "{") {
    r.readChar(); // consume '{'
    const parsed = parseContour(r);
    contours.push(parsed.edges);
    colorsSpecified = colorsSpecified || parsed.colorsSpecified;
  }

  return { shape: { contours, inverseYAxis }, colorsSpecified };
}

// ── Serializer ───────────────────────────────────────────────────────────────

/**
 * Format a number with up to 12 significant digits, matching C++ %.12g.
 */
function fmtG12(v: number): string {
  if (v === 0) return "0";
  let s = v.toPrecision(12);
  // Strip trailing zeros after decimal point (mimicking %g behaviour)
  if (s.includes(".") && !s.includes("e")) {
    s = s.replace(/\.?0+$/, "");
  }
  return s;
}

/** Format a coordinate pair matching C++: %.12g, %.12g */
function fmtCoord(x: number, y: number): string {
  return `${fmtG12(x)}, ${fmtG12(y)}`;
}

/**
 * Serializes a Shape to msdfgen's shapedesc text format (without colour codes,
 * since edge coloring is not performed in M2).
 * port of core/shape-description.cpp: writeShapeDescription
 *
 * @param shape The normalized Shape to serialize.
 * @returns Shapedesc string.
 */
export function serializeShape(shape: Shape): string {
  const lines: string[] = [];
  lines.push(shape.inverseYAxis ? "@y-down" : "@y-up");

  for (const contour of shape.contours) {
    lines.push("{");
    if (contour.length > 0) {
      for (const seg of contour) {
        lines.push("\t" + fmtCoord(seg.p0x, seg.p0y) + ";");
        switch (seg.type) {
          case LINEAR:
            // No control points written for linear edges.
            break;
          case QUADRATIC:
            lines.push("\t\t(" + fmtCoord(seg.p1x, seg.p1y) + ");");
            break;
          default: // CUBIC
            lines.push(
              "\t\t(" + fmtCoord(seg.p1x, seg.p1y) + "; " + fmtCoord(seg.p2x, seg.p2y) + ");",
            );
            break;
        }
      }
      lines.push("\t#");
    }
    lines.push("}");
  }

  return lines.join("\n") + "\n";
}
