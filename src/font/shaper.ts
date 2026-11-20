import type { Font } from "./font";
import { PROP_BASE, PROP_HIDDEN, PROP_IGNORABLE, PROP_MARK, reserveRun, run } from "./glyph-run";
import { COMMON, itemize, otScriptTags } from "./script";

/**
 * Text → positioned glyphs, the way Chrome positions them: Blink's script
 * runs, then per run HarfBuzz's default shaper restricted to positioning —
 * one glyph per codepoint (no GSUB yet, so no ligatures), `hmtx` advances,
 * GPOS (or, without GPOS kerning for the script, the legacy `kern` table),
 * mark and default-ignorable zeroing.
 *
 * port of harfbuzz src/hb-ot-shape.cc: hb_ot_shape_plan_t::init0 (who does
 * kerning), hb_ot_position / hb_ot_position_complex, zero_mark_widths_by_gdef,
 * hb_ot_zero_width_default_ignorables, hb_synthesize_glyph_classes.
 *
 * Results land in the shared {@link run} buffer (font units).
 */

/** port of hb-unicode.hh: hb_unicode_funcs_t::is_default_ignorable. */
export function isDefaultIgnorable(cp: number): boolean {
  if (cp < 0xad) return false;
  if (cp < 0x10000) {
    switch (cp >> 8) {
      case 0x00:
        return cp === 0xad;
      case 0x03:
        return cp === 0x34f;
      case 0x06:
        return cp === 0x61c;
      case 0x17:
        return cp >= 0x17b4 && cp <= 0x17b5;
      case 0x18:
        return cp >= 0x180b && cp <= 0x180e;
      case 0x20:
        return (
          (cp >= 0x200b && cp <= 0x200f) ||
          (cp >= 0x202a && cp <= 0x202e) ||
          (cp >= 0x2060 && cp <= 0x206f)
        );
      case 0xfe:
        return (cp >= 0xfe00 && cp <= 0xfe0f) || cp === 0xfeff;
      case 0xff:
        return cp >= 0xfff0 && cp <= 0xfff8;
    }
    return false;
  }
  return (cp >= 0x1d173 && cp <= 0x1d17a) || (cp >= 0xe0000 && cp <= 0xe0fff);
}

/**
 * Advance of a space character the font has no glyph for, drawn (and kerned)
 * as its U+0020 glyph: −1 if `cp` gets no such fallback. port of
 * hb-unicode.hh: space_fallback_type + hb-ot-shape-fallback.cc:
 * _hb_ot_shape_fallback_spaces.
 */
function _fallbackSpace(font: Font, cp: number, space: number): number {
  const upem = font.metrics.unitsPerEm;
  switch (cp) {
    case 0xa0:
      return font.advance(space);
    case 0x2001:
    case 0x2003:
    case 0x3000:
      return upem;
    case 0x2000:
    case 0x2002:
      return upem / 2;
    case 0x2004:
      return upem / 3;
    case 0x2005:
      return upem / 4;
    case 0x2006:
      return upem / 6;
    case 0x2009:
      return upem / 5;
    case 0x200a:
      return upem / 16;
    case 0x205f:
      return (upem * 4) / 18;
    case 0x202f:
      return font.advance(space) / 2;
    case 0x2007: {
      for (let d = 0x30; d <= 0x39; d++) {
        const g = font.glyphId(d);
        if (g) return font.advance(g);
      }
      return font.advance(space);
    }
    case 0x2008: {
      const g = font.glyphId(0x2e) || font.glyphId(0x2c);
      return font.advance(g || space);
    }
  }
  return -1;
}

let _mnRe: RegExp | null = null;
const _mn = new Map<number, boolean>();

/** General_Category = Nonspacing_Mark (for fonts without GDEF glyph classes). */
function _isMn(cp: number): boolean {
  if (cp < 0x300) return false;
  let v = _mn.get(cp);
  if (v === undefined) {
    if (!_mnRe) _mnRe = /^\p{Mn}$/u;
    v = _mnRe.test(String.fromCodePoint(cp));
    _mn.set(cp, v);
  }
  return v;
}

/**
 * Lays out `text` (one line) into {@link run}: glyph id, advance and offset
 * per codepoint, in font units. Returns the glyph count (= codepoint count).
 * Default-ignorable characters get zero advance and the PROP_HIDDEN flag
 * (HarfBuzz hides them).
 */
export function shapeText(font: Font, text: string): number {
  const len = text.length;
  reserveRun(len);
  const cps = run._cp;
  const gid = run._gid;
  const gp = run._gp;
  const xa = run._xa;
  const xo = run._xo;
  const yo = run._yo;
  const classes = font._glyphProps();
  const advances = font._advances();
  const lastAdvance = advances.length ? advances[advances.length - 1]! : 0;
  const space = font.glyphId(0x20);
  let hidden = false;
  let n = 0;
  for (let i = 0; i < len; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xd800 && c < 0xdc00 && i + 1 < len) {
      const d = text.charCodeAt(i + 1);
      if (d >= 0xdc00 && d < 0xe000) {
        c = ((c - 0xd800) << 10) + (d - 0xdc00) + 0x10000;
        i++;
      }
    }
    let g = font.glyphId(c);
    let advance = -1;
    if (!g && c >= 0xa0 && space) {
      // hb-ot-shape-normalize.cc: decompose_current_character — the two
      // canonical singleton spaces, then the space fallback.
      if (c === 0x2000 || c === 0x2001) g = font.glyphId(c + 2);
      if (!g) {
        advance = _fallbackSpace(font, c, space);
        if (advance >= 0) g = space;
      }
    }
    const ignorable = c >= 0xad && isDefaultIgnorable(c);
    let p: number;
    if (classes) p = g < classes.length ? classes[g]! : 0;
    else p = !ignorable && _isMn(c) ? PROP_MARK : PROP_BASE;
    if (ignorable) {
      // ZWNJ is hidden but, in Chrome, still blocks kerning across it
      // (measured in test/layout/kerning.test.ts); other default ignorables are skipped.
      p |= c === 0x200c ? PROP_HIDDEN : PROP_HIDDEN | PROP_IGNORABLE;
      hidden = true;
    }
    cps[n] = c;
    gid[n] = g;
    gp[n] = p;
    xa[n] = advance >= 0 ? advance : g < advances.length ? advances[g]! : lastAdvance;
    xo[n] = 0;
    yo[n] = 0;
    n++;
  }
  const runs = itemize(cps, n, run._runEnd, run._runScript);
  let start = 0;
  for (let r = 0; r < runs; r++) {
    const end = run._runEnd[r]!;
    positionRun(font, start, end, run._runScript[r]!);
    start = end;
  }
  if (hidden) {
    for (let i = 0; i < n; i++) if (gp[i]! & PROP_HIDDEN) xa[i] = xo[i] = yo[i] = 0;
  }
  return n;
}

/**
 * Positions `run[start, end)` — one HarfBuzz buffer of ICU script `script`
 * whose glyph ids, props and default advances are already set.
 */
export function positionRun(font: Font, start: number, end: number, script: number): void {
  const gpos = font._gposTable();
  const kern = font._kernTable();
  let gposKern = false;
  if (gpos) {
    const plan = gpos._plan(script, otScriptTags(script));
    gposKern = plan._kern;
    gpos._position(plan, start, end);
  }
  const applyKern = !!kern && kern._hasData && !gposKern;
  if (applyKern) kern._apply(start, end);
  // hb-ot-shape.cc: plan.zero_marks / adjust_mark_positioning_when_zeroing
  if (!applyKern || kern._hasMachine) {
    const adjust = !gpos && (!applyKern || !kern._hasCross);
    const gp = run._gp;
    for (let i = start; i < end; i++) {
      if (gp[i]! & PROP_MARK) {
        if (adjust) run._xo[i] = run._xo[i]! - run._xa[i]!;
        run._xa[i] = 0;
      }
    }
  }
}

/**
 * Total advance change from positioning two glyphs as a run of their own
 * (Common script: the font's DFLT, else latn, features), in font units.
 */
export function pairKerning(font: Font, left: number, right: number): number {
  reserveRun(2);
  const classes = font._glyphProps();
  const a = font.advance(left);
  const b = font.advance(right);
  run._gid[0] = left;
  run._gid[1] = right;
  run._gp[0] = classes ? (left < classes.length ? classes[left]! : 0) : PROP_BASE;
  run._gp[1] = classes ? (right < classes.length ? classes[right]! : 0) : PROP_BASE;
  run._xa[0] = a;
  run._xa[1] = b;
  run._xo[0] = run._xo[1] = run._yo[0] = run._yo[1] = 0;
  positionRun(font, 0, 2, COMMON);
  return run._xa[0]! + run._xa[1]! - a - b;
}
