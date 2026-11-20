/**
 * The glyph buffer text layout works on: HarfBuzz's `hb_buffer_t` info +
 * position arrays, as flat typed arrays reused across calls (grow-once, like
 * the MSDF generator's scratch). Module-scope state: the library is
 * synchronous and single-threaded per worker.
 *
 * Positions are font units: `_xa` advance, `_xo`/`_yo` drawing offset from
 * the pen (y-up, as in HarfBuzz).
 */

/** Glyph property bits, HarfBuzz's HB_OT_LAYOUT_GLYPH_PROPS_* (mark
 *  attachment class in bits 8-15), plus two default-ignorable flags. */
/** Skipped by lookups looking for a pair or context partner. */
export const PROP_IGNORABLE = 0x01;
export const PROP_BASE = 0x02;
export const PROP_LIGATURE = 0x04;
export const PROP_MARK = 0x08;
/** Default ignorable: no advance, nothing drawn (HarfBuzz hides it). */
export const PROP_HIDDEN = 0x10;

/** Shared glyph buffer; call {@link reserveRun} before writing `n` glyphs. */
export const run = {
  /** Unicode codepoint per glyph. */
  _cp: new Int32Array(64),
  /** Glyph index per glyph. */
  _gid: new Uint16Array(64),
  /** PROP_* bits per glyph. */
  _gp: new Uint16Array(64),
  /** x advance, font units. */
  _xa: new Float64Array(64),
  /** x offset, font units. */
  _xo: new Float64Array(64),
  /** y offset, font units (y-up). */
  _yo: new Float64Array(64),
  /** Script-run end indices and ICU script codes (see script.ts: itemize). */
  _runEnd: new Int32Array(64),
  _runScript: new Int32Array(64),
};

/**
 * Whether a lookup with flags `lp` (and mark filtering set `set`) sees glyph
 * `g` with props `gp`. port of harfbuzz hb-ot-layout-gsubgpos.hh:
 * hb_ot_apply_context_t::check_glyph_property + match_properties_mark.
 */
export function checkProps(gp: number, g: number, lp: number, set: Uint16Array | null): boolean {
  if (gp & lp & 0x0e) return false; // IgnoreBaseGlyphs | IgnoreLigatures | IgnoreMarks
  if (gp & PROP_MARK) {
    if (lp & 0x10) return set !== null && g < set.length && set[g] !== 0xffff; // UseMarkFilteringSet
    if (lp & 0xff00) return (lp & 0xff00) === (gp & 0xff00); // MarkAttachmentType
  }
  return true;
}

/**
 * Next glyph after `i` (before `end`) a lookup can pair with, or −1: skips
 * glyphs the lookup flags ignore and default ignorables. port of
 * skipping_iterator_t::next with no match function, as GPOS uses it.
 */
export function nextGlyph(i: number, end: number, lp: number, set: Uint16Array | null): number {
  const gp = run._gp;
  const gid = run._gid;
  for (let j = i + 1; j < end; j++) {
    const p = gp[j]!;
    if (!(p & PROP_IGNORABLE) && checkProps(p, gid[j]!, lp, set)) return j;
  }
  return -1;
}

/** Grows every {@link run} array to hold at least `n` glyphs (contents are not kept). */
export function reserveRun(n: number): void {
  if (run._gid.length >= n) return;
  let size = run._gid.length;
  while (size < n) size *= 2;
  run._cp = new Int32Array(size);
  run._gid = new Uint16Array(size);
  run._gp = new Uint16Array(size);
  run._xa = new Float64Array(size);
  run._xo = new Float64Array(size);
  run._yo = new Float64Array(size);
  run._runEnd = new Int32Array(size);
  run._runScript = new Int32Array(size);
}
