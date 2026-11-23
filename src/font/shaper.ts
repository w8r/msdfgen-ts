import type { Font } from "./font";
import { PROP_BASE, PROP_HIDDEN, PROP_IGNORABLE, PROP_MARK, reserveRun, run } from "./glyph-run";
import { COMMON, iso, itemize, otScriptTags, tag } from "./script";

/**
 * Text → positioned glyphs, the way Chrome positions them: Blink's script
 * runs, then per run HarfBuzz's shaping restricted to positioning — one
 * glyph per codepoint (no GSUB yet, so no ligatures), `hmtx` advances, GPOS
 * (or, without GPOS kerning for the script, the legacy `kern` table, if the
 * run's shaper applies it), mark and default-ignorable zeroing.
 *
 * port of harfbuzz src/hb-ot-shape.cc: hb_ot_shape_plan_t::init0 (who does
 * kerning), hb_ot_position / hb_ot_position_plan, zero_mark_widths_by_gdef,
 * hb_ot_zero_width_default_ignorables, hb_synthesize_glyph_classes;
 * hb-ot-shaper.hh: hb_ot_shaper_categorize (shaper flags only).
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
        return cp >= 0x180b && cp <= 0x180f;
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
  let props = 0; // every glyph's props OR-ed: is there any mark to zero?
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
    props |= p;
    cps[n] = c;
    gid[n] = g;
    gp[n] = p;
    xa[n] = advance >= 0 ? advance : g < advances.length ? advances[g]! : lastAdvance;
    xo[n] = 0;
    yo[n] = 0;
    n++;
  }
  const runs = itemize(cps, n, run._runEnd, run._runScript);
  const marks = (props & PROP_MARK) !== 0;
  let start = 0;
  for (let r = 0; r < runs; r++) {
    const end = run._runEnd[r]!;
    positionRun(font, start, end, run._runScript[r]!, marks);
    start = end;
  }
  if (hidden) {
    for (let i = 0; i < n; i++) if (gp[i]! & PROP_HIDDEN) xa[i] = xo[i] = yo[i] = 0;
  }
  return n;
}

// ── HarfBuzz's shaper choice, reduced to what it changes in positioning ─────
// The shapers differ in GSUB work (not ported) and in two positioning fields:
// when mark widths are zeroed, and whether the legacy `kern` table applies.

/** hb_ot_shaper_t.zero_width_marks (bits 0-1): never, before GPOS, after GPOS. */
const ZERO_NONE = 0;
const ZERO_EARLY = 1;
const ZERO_LATE = 2;
const ZERO_MASK = 3;
/** hb_ot_shaper_t.fallback_position: the shaper applies the legacy `kern` table. */
const KERN_TABLE = 4;

/** default, arabic and hebrew shapers. */
const SHAPER_DEFAULT = ZERO_LATE | KERN_TABLE;
const SHAPER_HANGUL = ZERO_NONE | KERN_TABLE;
const SHAPER_THAI = ZERO_LATE;
/** indic and khmer shapers. */
const SHAPER_INDIC = ZERO_NONE;
/** Universal Shaping Engine and myanmar shaper. */
const SHAPER_USE = ZERO_EARLY;

/** Indic scripts: the indic shaper, or USE for a third-generation GSUB tag. */
const INDIC_SCRIPTS = "BengDevaGujrGuruKndaMlymOryaTamlTelu";
/** Scripts sent to the Universal Shaping Engine (hb-ot-shaper.hh, HarfBuzz main, Nov 2026). */
const USE_SCRIPTS =
  "TibtMongSinhBuhdHanoTglgTagbLimbTaleBugiKharSyloTfngBaliNkooPhagChamKaliLepcRjngSaurSund" +
  "EgypJavaKthiMteiLanaTavtBatkBrahMandCakmPlrdShrdTakrDuplGranKhojSindMahjManiModiHmngPhlp" +
  "SiddTirhAhomMultAdlmBhksMarcNewaGonmSoyoZanbDogrGongRohgMakaMedfSogoSogdElymNandHmnpWcho" +
  "ChrsDiakKitsYeziCpmnOugrTnsaTotoVithKawiNagmGaraGukhKraiOnaoSunuTodrTutgBerfSidtTayoTols" +
  "JurcPcunSeal";

const TAG_DFLT = tag("DFLT");
const TAG_LATN = tag("latn");
const TAG_MYMR = tag("mymr");
/** hb_ot_layout_table_select_script's fallbacks after the script's own tags. */
const DEFAULT_SCRIPTS = [TAG_DFLT, tag("dflt"), TAG_LATN];

/**
 * The GSUB script HarfBuzz settles on for a run, 0 (HB_TAG_NONE) if none.
 * port of hb-ot-layout.cc: hb_ot_layout_table_select_script (chosen_script).
 */
function chosenGsubScript(scripts: Uint32Array | null, tags: readonly number[]): number {
  if (!scripts) return 0;
  for (let i = 0; i < tags.length; i++) if (scripts.indexOf(tags[i]!) >= 0) return tags[i]!;
  for (let i = 0; i < 3; i++)
    if (scripts.indexOf(DEFAULT_SCRIPTS[i]!) >= 0) return DEFAULT_SCRIPTS[i]!;
  return 0;
}

/**
 * The shaper flags HarfBuzz uses for a horizontal run of script `s` (ISO
 * 15924) when the font's GSUB settled on script tag `gsub`.
 * port of hb-ot-shaper.hh: hb_ot_shaper_categorize. The arabic and hebrew
 * shapers position like the default one, so they need no case here.
 */
function categorize(s: string, gsub: number): number {
  const designedForDefault = gsub === TAG_DFLT || gsub === TAG_LATN;
  if (s === "Thai" || s === "Laoo") return SHAPER_THAI;
  if (s === "Hang") return SHAPER_HANGUL;
  if (s === "Khmr") return SHAPER_INDIC;
  if (s === "Mymr") return designedForDefault || gsub === TAG_MYMR ? SHAPER_DEFAULT : SHAPER_USE;
  // Codes are one capital + three lowercase letters, so any match is aligned.
  if (INDIC_SCRIPTS.indexOf(s) >= 0) {
    if (designedForDefault) return SHAPER_DEFAULT;
    return (gsub & 0xff) === 0x33 ? SHAPER_USE : SHAPER_INDIC; // 'dev3' → USE
  }
  if (USE_SCRIPTS.indexOf(s) >= 0) return designedForDefault ? SHAPER_DEFAULT : SHAPER_USE;
  return SHAPER_DEFAULT;
}

/** {@link categorize} for `font` and ICU script code `script`, cached per font. */
function shaperOf(font: Font, script: number): number {
  const cache = font._shaperCache();
  let s = cache[script]!;
  if (s < 0) {
    s = categorize(iso(script), chosenGsubScript(font._gsubScriptTags(), otScriptTags(script)));
    cache[script] = s;
  }
  return s;
}

/** port of hb-ot-shape.cc: zero_mark_widths_by_gdef (+ adjust_mark_offsets). */
function zeroMarkWidths(start: number, end: number, adjustOffsets: boolean): void {
  const gp = run._gp;
  const xa = run._xa;
  const xo = run._xo;
  for (let i = start; i < end; i++) {
    if (gp[i]! & PROP_MARK) {
      if (adjustOffsets) xo[i] = xo[i]! - xa[i]!;
      xa[i] = 0;
    }
  }
}

/**
 * Positions `run[start, end)` — one HarfBuzz buffer of ICU script `script`
 * whose glyph ids, props and default advances are already set.
 *
 * port of hb-ot-shape.cc: hb_ot_shape_plan_t::init0 (who kerns, zero_marks,
 * adjust_mark_positioning_when_zeroing) + hb_ot_position_plan (the order:
 * early zeroing, GPOS, `kern` table, late zeroing).
 *
 * @param marks Whether any glyph is a mark: if none, there is nothing to
 *   zero (positioning never turns a glyph into a mark), so skip the pass.
 */
export function positionRun(
  font: Font,
  start: number,
  end: number,
  script: number,
  marks: boolean,
): void {
  const shaper = shaperOf(font, script);
  const gpos = font._gposTable();
  const kern = font._kernTable();
  const plan = gpos ? gpos._plan(script, otScriptTags(script)) : null;
  // GPOS kerning wins; the `kern` table only with a shaper that applies it.
  const applyKern =
    kern !== null && kern._hasData && !(plan && plan._kern) && (shaper & KERN_TABLE) !== 0;
  const zero = !marks || (applyKern && kern._hasMachine) ? ZERO_NONE : shaper & ZERO_MASK;
  const adjust = !gpos && (!applyKern || !kern._hasCross);
  if (zero === ZERO_EARLY) zeroMarkWidths(start, end, adjust);
  if (plan) gpos!._position(plan, start, end);
  if (applyKern) kern._apply(start, end);
  if (zero === ZERO_LATE) zeroMarkWidths(start, end, adjust);
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
  positionRun(font, 0, 2, COMMON, ((run._gp[0]! | run._gp[1]!) & PROP_MARK) !== 0);
  return run._xa[0]! + run._xa[1]! - a - b;
}
