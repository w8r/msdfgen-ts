import { checkProps, nextGlyph, PROP_IGNORABLE, PROP_MARK, run } from "../glyph-run";
import { tag } from "../script";
import type { Gdef } from "./gdef";
import { decodeClassDef, decodeCoverage, NOT_COVERED } from "./otl";

/**
 * GPOS glyph positioning, as HarfBuzz's default shaper applies it: kerning
 * (`kern`) and the other default-on positioning features, through SinglePos,
 * PairPos, contextual and chained-contextual lookups (types 1, 2, 7, 8 and
 * 9 = extension).
 *
 * port of harfbuzz src/hb-ot-layout-gpos-table.hh (SinglePos, PairPos,
 * ValueFormat::apply_value), hb-ot-layout-gsubgpos.hh (Context,
 * ChainContext, match_input/backtrack/lookahead, apply_lookup), hb-ot-map.cc
 * (feature → lookup collection) and hb-ot-layout.cc (script selection,
 * apply_forward).
 *
 * Not ported: mark and cursive attachment (lookup types 3-6), which only
 * move combining marks / cursive joins; device tables (hinting and variable
 * font deltas: zero at the default instance this library renders); GPOS 1.1
 * FeatureVariations; language systems other than the script's default.
 */

const MAX_NESTING = 64; // HB_MAX_NESTING_LEVEL
const MAX_CONTEXT = 64; // HB_MAX_CONTEXT_LENGTH

/** GPOS features hb-ot-shape.cc enables by default for horizontal text. */
const FEATURES = ["abvm", "blwm", "mark", "mkmk", "curs", "dist", "kern"].map(tag);
const KERN = tag("kern");
const DFLT = [tag("DFLT"), tag("dflt"), tag("latn")];

// Context rule item kinds.
const BY_GLYPH = 0;
const BY_CLASS = 1;
const BY_COVERAGE = 2;

const EMPTY = new Uint16Array(0);
const EMPTY_I16 = new Int16Array(0);
const EMPTY_U32 = new Uint32Array(0);

/** One decoded positioning subtable (extension resolved). All fields always set. */
class Sub {
  /** Lookup type (1, 2, 7 or 8). */
  _type: number;
  /** Subtable format. */
  _fmt: number;
  /** Absolute byte offset of the subtable. */
  _off: number;
  /** Coverage of the first glyph. */
  _cov: Uint16Array;
  /** PairPos 2: classDef1/2 · Context 2: input · ChainContext 2: backtrack/input/lookahead. */
  _cd1: Uint16Array;
  _cd2: Uint16Array;
  _cd3: Uint16Array;
  /** ValueFormats and their record sizes in bytes. */
  _vf1: number;
  _vf2: number;
  _len1: number;
  _len2: number;
  /** PairPos 2: class1Count, class2Count. */
  _n1: number;
  _n2: number;
  /** PairPos whose values are a first-glyph XAdvance only (plain kerning):
   *  decoded into the typed arrays below instead of read from the font. */
  _simple: boolean;
  /** XAdvance per pair: fmt 1 by record, fmt 2 by class1 × class2Count + class2. */
  _kx: Int16Array;
  /** PairPos 1: first record index per pair set (pairSetCount + 1 entries). */
  _ps: Uint32Array;
  /** PairPos 1: second glyph per record. */
  _sg: Uint16Array;

  constructor(type: number, fmt: number, off: number, cov: Uint16Array) {
    this._type = type;
    this._fmt = fmt;
    this._off = off;
    this._cov = cov;
    this._cd1 = EMPTY;
    this._cd2 = EMPTY;
    this._cd3 = EMPTY;
    this._vf1 = 0;
    this._vf2 = 0;
    this._len1 = 0;
    this._len2 = 0;
    this._n1 = 0;
    this._n2 = 0;
    this._simple = false;
    this._kx = EMPTY_I16;
    this._ps = EMPTY_U32;
    this._sg = EMPTY;
  }
}

/** One decoded lookup. */
class Lookup {
  /** LookupFlag. */
  _props: number;
  /** Mark filtering set coverage (UseMarkFilteringSet), else null. */
  _set: Uint16Array | null;
  _subs: Sub[];
  /** Nonzero for glyphs some subtable's first-glyph coverage includes. */
  _any: Uint8Array;
  /** Every subtable is a plain-kerning PairPos (see {@link Sub._simple}). */
  _pairs: boolean;

  constructor(props: number, set: Uint16Array | null, subs: Sub[]) {
    this._props = props;
    this._set = set;
    this._subs = subs;
    let max = 0;
    for (const sub of subs) max = Math.max(max, sub._cov.length);
    const any = new Uint8Array(max);
    for (const sub of subs) {
      const cov = sub._cov;
      for (let g = 0; g < cov.length; g++) if (cov[g] !== NOT_COVERED) any[g] = 1;
    }
    this._any = any;
    this._pairs = subs.length > 0 && subs.every((sub) => sub._simple);
  }
}

/** The lookups one script run applies (hb_ot_map_t, GPOS half). */
export class GposPlan {
  /** Lookup indices, ascending (HarfBuzz applies a stage's lookups in index order). */
  readonly _lookups: number[];
  /** Whether the selected script lists a `kern` feature (else the `kern` table applies). */
  readonly _kern: boolean;

  constructor(lookups: number[], kern: boolean) {
    this._lookups = lookups;
    this._kern = kern;
  }
}

// ── per-call state (module scope: single-threaded) ──────────────────────────

let _dv: DataView = new DataView(new ArrayBuffer(0));
let _start = 0;
let _end = 0;
let _ops = 0;
/** Current lookup's flags and mark filtering set. */
let _lp = 0;
let _set: Uint16Array | null = null;
/** Context match positions, MAX_CONTEXT per nesting level. */
const _mpos = new Int32Array(MAX_NESTING * MAX_CONTEXT);

/** Applies a ValueRecord at `at` with format `vf` to glyph `i` (horizontal). */
function _value(at: number, vf: number, i: number): void {
  let p = at;
  if (vf & 1) {
    run._xo[i] = run._xo[i]! + _dv.getInt16(p);
    p += 2;
  }
  if (vf & 2) {
    run._yo[i] = run._yo[i]! + _dv.getInt16(p);
    p += 2;
  }
  if (vf & 4) run._xa[i] = run._xa[i]! + _dv.getInt16(p);
}

/**
 * {@link Gpos._position} for a lookup of plain-kerning PairPos subtables only
 * (most `kern` lookups): the same apply_forward + PairPos semantics, with the
 * pair partner found once per glyph and the subtables tried inline.
 */
function _kernLookup(lk: Lookup, start: number, end: number): void {
  const gid = run._gid;
  const gp = run._gp;
  const xa = run._xa;
  const any = lk._any;
  const subs = lk._subs;
  const lp = lk._props;
  const set = lk._set;
  for (let i = start; i < end; i++) {
    const g = gid[i]!;
    if (g >= any.length || !any[g]) continue;
    const p = gp[i]!;
    if (p & lp & 0x0e || (p & PROP_MARK && !checkProps(p, g, lp, set))) continue;
    let j = i + 1;
    if (j >= end) break;
    const pj = gp[j]!;
    if (pj & (PROP_IGNORABLE | PROP_MARK) || pj & lp & 0x0e) {
      j = nextGlyph(i, end, lp, set);
      if (j < 0) continue;
    }
    const second = gid[j]!;
    for (let k = 0; k < subs.length; k++) {
      const s = subs[k]!;
      const cov = s._cov;
      const ci = g < cov.length ? cov[g]! : NOT_COVERED;
      if (ci === NOT_COVERED) continue;
      let v = -1; // record index into s._kx
      if (s._fmt === 1) {
        if (ci >= s._ps.length - 1) continue;
        const sg = s._sg;
        let lo = s._ps[ci]!;
        let hi = s._ps[ci + 1]! - 1;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          const gg = sg[mid]!;
          if (gg < second) lo = mid + 1;
          else if (gg > second) hi = mid - 1;
          else {
            v = mid;
            break;
          }
        }
      } else {
        const k1 = g < s._cd1.length ? s._cd1[g]! : 0;
        const k2 = second < s._cd2.length ? s._cd2[second]! : 0;
        if (k1 < s._n1 && k2 < s._n2) v = k1 * s._n2 + k2;
      }
      if (v < 0) continue;
      xa[i] = xa[i]! + s._kx[v]!;
      i = j - 1; // applied: continue from the second glyph
      break;
    }
  }
}

/** Byte size of a ValueRecord. */
function _recordSize(vf: number): number {
  let n = 0;
  for (let b = vf & 0xff; b; b &= b - 1) n++;
  return n * 2;
}

/** Parsed GPOS table. Lookups are decoded on first use. */
export class Gpos {
  /** @type {DataView} */
  private _view: DataView;
  private _scripts: number;
  private _features: number;
  private _lookupList: number;
  private _gdef: Gdef | null;
  private _lookupCache: (Lookup | undefined)[] = [];
  private _planCache: (GposPlan | undefined)[] = [];
  private _covCache = new Map<number, Uint16Array>();
  private _cdCache = new Map<number, Uint16Array>();

  /**
   * @param buffer Full font buffer.
   * @param offset Byte offset of the GPOS table.
   * @param gdef The font's GDEF (mark filtering sets), or null.
   */
  constructor(buffer: ArrayBuffer, offset: number, gdef: Gdef | null) {
    const dv = new DataView(buffer);
    this._view = dv;
    this._scripts = offset + dv.getUint16(offset + 4);
    this._features = offset + dv.getUint16(offset + 6);
    this._lookupList = offset + dv.getUint16(offset + 8);
    this._gdef = gdef;
  }

  /** Coverage at `base + rel` (offset 0 = HarfBuzz's Null coverage). */
  private _cov(base: number, rel: number): Uint16Array {
    if (!rel) return EMPTY;
    let t = this._covCache.get(base + rel);
    if (!t) {
      t = decodeCoverage(this._view, base + rel);
      this._covCache.set(base + rel, t);
    }
    return t;
  }

  /** ClassDef at `base + rel` (offset 0 = every glyph class 0). */
  private _cd(base: number, rel: number): Uint16Array {
    if (!rel) return EMPTY;
    let t = this._cdCache.get(base + rel);
    if (!t) {
      t = decodeClassDef(this._view, base + rel);
      this._cdCache.set(base + rel, t);
    }
    return t;
  }

  /** Absolute offset of the Script table tagged `t`, or 0. */
  private _script(t: number): number {
    const dv = this._view;
    const sl = this._scripts;
    for (let i = 0, n = dv.getUint16(sl); i < n; i++) {
      if (dv.getUint32(sl + 2 + 6 * i) === t) return sl + dv.getUint16(sl + 6 + 6 * i);
    }
    return 0;
  }

  /**
   * The lookups to apply to a run whose OpenType script tags (most
   * preferred first) are `tags`, cached under ICU script code `code`.
   * port of hb-ot-layout.cc: hb_ot_layout_table_select_script (falls back to
   * DFLT, dflt, then latn) + hb-ot-map.cc: hb_ot_map_builder_t::compile.
   */
  _plan(code: number, tags: readonly number[]): GposPlan {
    let plan = this._planCache[code];
    if (plan) return plan;
    const dv = this._view;
    let script = 0;
    for (let i = 0; i < tags.length && !script; i++) script = this._script(tags[i]!);
    for (let i = 0; i < DFLT.length && !script; i++) script = this._script(DFLT[i]!);
    const lookups: number[] = [];
    let kern = false;
    const langSys = script ? dv.getUint16(script) : 0;
    if (langSys) {
      const ls = script + langSys;
      const req = dv.getUint16(ls + 2);
      const fl = this._features;
      const nFeatures = dv.getUint16(fl);
      const count = dv.getUint16(ls + 4);
      for (let k = -1; k < count; k++) {
        const fi = k < 0 ? req : dv.getUint16(ls + 6 + 2 * k);
        if (fi >= nFeatures) continue; // also skips "no required feature" (0xFFFF)
        const ft = dv.getUint32(fl + 2 + 6 * fi);
        if (k >= 0 && FEATURES.indexOf(ft) < 0) continue;
        if (ft === KERN) kern = true;
        const f = fl + dv.getUint16(fl + 6 + 6 * fi);
        for (let j = 0, n = dv.getUint16(f + 2); j < n; j++) {
          const li = dv.getUint16(f + 4 + 2 * j);
          if (lookups.indexOf(li) < 0) lookups.push(li);
        }
      }
    }
    lookups.sort((a, b) => a - b);
    plan = new GposPlan(lookups, kern);
    this._planCache[code] = plan;
    return plan;
  }

  /** Lookup `li`, decoded on first use; null if out of range. */
  private _lookup(li: number): Lookup | null {
    const cached = this._lookupCache[li];
    if (cached) return cached;
    const dv = this._view;
    const ll = this._lookupList;
    if (li >= dv.getUint16(ll)) return null;
    const lo = ll + dv.getUint16(ll + 2 + 2 * li);
    const type = dv.getUint16(lo);
    const flag = dv.getUint16(lo + 2);
    const n = dv.getUint16(lo + 4);
    let set: Uint16Array | null = null;
    if (flag & 0x10) {
      set = this._gdef ? this._gdef._markSet(dv.getUint16(lo + 6 + 2 * n)) : EMPTY;
    }
    const subs: Sub[] = [];
    for (let k = 0; k < n; k++) {
      let so = lo + dv.getUint16(lo + 6 + 2 * k);
      let t = type;
      if (t === 9) {
        t = dv.getUint16(so + 2);
        so += dv.getUint32(so + 4);
      }
      const sub = this._sub(t, so);
      if (sub) subs.push(sub);
    }
    const lookup = new Lookup(flag, set, subs);
    this._lookupCache[li] = lookup;
    return lookup;
  }

  /** Decodes one subtable; null for unsupported types/formats. */
  private _sub(type: number, so: number): Sub | null {
    const dv = this._view;
    const fmt = dv.getUint16(so);
    if (type === 1 || type === 2) {
      if (fmt !== 1 && fmt !== 2) return null;
      const s = new Sub(type, fmt, so, this._cov(so, dv.getUint16(so + 2)));
      s._vf1 = dv.getUint16(so + 4);
      s._len1 = _recordSize(s._vf1);
      if (type === 2) {
        s._vf2 = dv.getUint16(so + 6);
        s._len2 = _recordSize(s._vf2);
        if (fmt === 2) {
          s._cd1 = this._cd(so, dv.getUint16(so + 8));
          s._cd2 = this._cd(so, dv.getUint16(so + 10));
          s._n1 = dv.getUint16(so + 12);
          s._n2 = dv.getUint16(so + 14);
        }
        if ((s._vf1 & 0x0f) === 4 && s._vf2 === 0) this._decodePairs(s);
      }
      return s;
    }
    if (type === 7) {
      if (fmt === 3) return new Sub(type, fmt, so, this._cov(so, dv.getUint16(so + 6)));
      if (fmt !== 1 && fmt !== 2) return null;
      const s = new Sub(type, fmt, so, this._cov(so, dv.getUint16(so + 2)));
      if (fmt === 2) s._cd1 = this._cd(so, dv.getUint16(so + 4));
      return s;
    }
    if (type === 8) {
      if (fmt === 3) {
        const bc = dv.getUint16(so + 2);
        return new Sub(type, fmt, so, this._cov(so, dv.getUint16(so + 6 + 2 * bc)));
      }
      if (fmt !== 1 && fmt !== 2) return null;
      const s = new Sub(type, fmt, so, this._cov(so, dv.getUint16(so + 2)));
      if (fmt === 2) {
        s._cd1 = this._cd(so, dv.getUint16(so + 4));
        s._cd2 = this._cd(so, dv.getUint16(so + 6));
        s._cd3 = this._cd(so, dv.getUint16(so + 8));
      }
      return s;
    }
    return null; // 3-6: attachment, not ported
  }

  /** Decodes a plain-kerning PairPos (XAdvance of the first glyph only) into typed arrays. */
  private _decodePairs(s: Sub): void {
    const dv = this._view;
    const so = s._off;
    const size = s._len1; // vf2 = 0: records hold the first value only
    s._simple = true;
    if (s._fmt === 2) {
      const n = s._n1 * s._n2;
      const kx = new Int16Array(n);
      for (let k = 0; k < n; k++) kx[k] = dv.getInt16(so + 16 + k * size);
      s._kx = kx;
      return;
    }
    const sets = dv.getUint16(so + 8);
    const ps = new Uint32Array(sets + 1);
    let total = 0;
    for (let k = 0; k < sets; k++) {
      ps[k] = total;
      total += dv.getUint16(so + dv.getUint16(so + 10 + 2 * k));
    }
    ps[sets] = total;
    const sg = new Uint16Array(total);
    const kx = new Int16Array(total);
    for (let k = 0; k < sets; k++) {
      const set = so + dv.getUint16(so + 10 + 2 * k);
      for (let r = 0, n = ps[k + 1]! - ps[k]!; r < n; r++) {
        const at = set + 2 + r * (2 + size);
        sg[ps[k]! + r] = dv.getUint16(at);
        kx[ps[k]! + r] = dv.getInt16(at + 2);
      }
    }
    s._ps = ps;
    s._sg = sg;
    s._kx = kx;
  }

  /**
   * Applies `plan` to `run[start, end)`, one HarfBuzz buffer (a script run).
   * port of hb-ot-layout.cc: apply_forward, for each lookup in turn.
   */
  _position(plan: GposPlan, start: number, end: number): void {
    _dv = this._view;
    _start = start;
    _end = end;
    _ops = Math.max((end - start) * 64, 16384); // HB_BUFFER_MAX_OPS_{FACTOR,MIN}
    const lookups = plan._lookups;
    for (let k = 0; k < lookups.length; k++) {
      const lk = this._lookup(lookups[k]!);
      if (!lk || !lk._subs.length) continue;
      _lp = lk._props;
      _set = lk._set;
      if (lk._pairs) {
        _kernLookup(lk, start, end);
        continue;
      }
      const gp = run._gp;
      const gid = run._gid;
      const any = lk._any;
      for (let i = start; i < end;) {
        const g = gid[i]!;
        if (g < any.length && any[g] && checkProps(gp[i]!, g, _lp, _set)) {
          const next = this._applyAt(lk, i, 0);
          if (next >= 0) {
            i = next;
            continue;
          }
        }
        i++;
      }
    }
  }

  /** First subtable of `lk` that applies at `i`: returns the next index, or −1. */
  private _applyAt(lk: Lookup, i: number, depth: number): number {
    const subs = lk._subs;
    for (let k = 0; k < subs.length; k++) {
      const next = this._applySub(subs[k]!, i, depth);
      if (next >= 0) return next;
    }
    return -1;
  }

  /** One subtable at glyph `i`: returns the index to continue from, or −1. */
  private _applySub(s: Sub, i: number, depth: number): number {
    const g = run._gid[i]!;
    const cov = s._cov;
    const ci = g < cov.length ? cov[g]! : NOT_COVERED;
    if (ci === NOT_COVERED) return -1;
    const dv = _dv;
    const so = s._off;
    switch (s._type) {
      case 1: {
        // port of SinglePosFormat1/2::apply
        if (s._fmt === 1) {
          _value(so + 6, s._vf1, i);
        } else {
          if (ci >= dv.getUint16(so + 6)) return -1;
          _value(so + 8 + ci * s._len1, s._vf1, i);
        }
        return i + 1;
      }
      case 2: {
        // port of PairPosFormat1::apply + PairSet::apply / PairPosFormat2::apply
        let j = i + 1;
        if (j >= _end) return -1;
        const pj = run._gp[j]!;
        if (pj & (PROP_IGNORABLE | PROP_MARK) || pj & _lp & 0x0e) {
          j = nextGlyph(i, _end, _lp, _set);
          if (j < 0) return -1;
        }
        const second = run._gid[j]!;
        if (s._simple) {
          const kx = s._kx;
          if (s._fmt === 1) {
            if (ci >= s._ps.length - 1) return -1;
            const sg = s._sg;
            let lo = s._ps[ci]!;
            let hi = s._ps[ci + 1]! - 1;
            while (lo <= hi) {
              const mid = (lo + hi) >> 1;
              const gg = sg[mid]!;
              if (gg < second) lo = mid + 1;
              else if (gg > second) hi = mid - 1;
              else {
                run._xa[i] = run._xa[i]! + kx[mid]!;
                return j;
              }
            }
            return -1;
          }
          const k1 = g < s._cd1.length ? s._cd1[g]! : 0;
          const k2 = second < s._cd2.length ? s._cd2[second]! : 0;
          if (k1 >= s._n1 || k2 >= s._n2) return -1;
          run._xa[i] = run._xa[i]! + kx[k1 * s._n2 + k2]!;
          return j;
        }
        let rec: number;
        if (s._fmt === 1) {
          if (ci >= dv.getUint16(so + 8)) return -1;
          const ps = so + dv.getUint16(so + 10 + 2 * ci);
          const size = 2 + s._len1 + s._len2;
          let lo = 0;
          let hi = dv.getUint16(ps) - 1;
          rec = -1;
          while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            const at = ps + 2 + mid * size;
            const gg = dv.getUint16(at);
            if (gg < second) lo = mid + 1;
            else if (gg > second) hi = mid - 1;
            else {
              rec = at + 2;
              break;
            }
          }
          if (rec < 0) return -1;
        } else {
          const k1 = g < s._cd1.length ? s._cd1[g]! : 0;
          const k2 = second < s._cd2.length ? s._cd2[second]! : 0;
          if (k1 >= s._n1 || k2 >= s._n2) return -1;
          rec = so + 16 + (k1 * s._n2 + k2) * (s._len1 + s._len2);
        }
        if (s._vf1) _value(rec, s._vf1, i);
        if (s._vf2) _value(rec + s._len1, s._vf2, j);
        return s._len2 ? j + 1 : j;
      }
      case 7:
        return this._context(s, i, g, ci, depth);
      case 8:
        return this._chain(s, i, g, ci, depth);
    }
    return -1;
  }

  /** port of ContextFormat1/2/3::apply (SequenceContext). */
  private _context(s: Sub, i: number, g: number, ci: number, depth: number): number {
    const dv = _dv;
    const so = s._off;
    if (s._fmt === 3) {
      const count = dv.getUint16(so + 2);
      const end = this._input(i, count, BY_COVERAGE, EMPTY, so + 8, so, depth);
      if (end < 0) return -1;
      this._apply(so + 6 + 2 * count, dv.getUint16(so + 4), count, depth);
      return end;
    }
    let idx = ci;
    let at = so + 4; // ruleSetCount
    let kind = BY_GLYPH;
    if (s._fmt === 2) {
      idx = g < s._cd1.length ? s._cd1[g]! : 0;
      at = so + 6;
      kind = BY_CLASS;
    }
    if (idx >= dv.getUint16(at)) return -1;
    const rsOff = dv.getUint16(at + 2 + 2 * idx);
    if (!rsOff) return -1;
    const rs = so + rsOff;
    for (let r = 0, n = dv.getUint16(rs); r < n; r++) {
      const rule = rs + dv.getUint16(rs + 2 + 2 * r);
      const count = dv.getUint16(rule);
      const end = this._input(i, count, kind, s._cd1, rule + 4, 0, depth);
      if (end < 0) continue;
      this._apply(rule + 4 + 2 * Math.max(count - 1, 0), dv.getUint16(rule + 2), count, depth);
      return end;
    }
    return -1;
  }

  /** port of ChainContextFormat1/2/3::apply (ChainedSequenceContext). */
  private _chain(s: Sub, i: number, g: number, ci: number, depth: number): number {
    const dv = _dv;
    const so = s._off;
    if (s._fmt === 3) {
      let p = so + 2;
      const bc = dv.getUint16(p);
      const back = p + 2;
      p += 2 + 2 * bc;
      const ic = dv.getUint16(p);
      const input = p + 2;
      p += 2 + 2 * ic;
      const lc = dv.getUint16(p);
      const ahead = p + 2;
      p += 2 + 2 * lc;
      const end = this._input(i, ic, BY_COVERAGE, EMPTY, input + 2, so, depth);
      if (end < 0) return -1;
      if (!this._lookahead(end, lc, BY_COVERAGE, EMPTY, ahead, so)) return -1;
      if (!this._backtrack(i, bc, BY_COVERAGE, EMPTY, back, so)) return -1;
      this._apply(p + 2, dv.getUint16(p), ic, depth);
      return end;
    }
    let idx = ci;
    let at = so + 4; // ruleSetCount
    let kind = BY_GLYPH;
    if (s._fmt === 2) {
      idx = g < s._cd2.length ? s._cd2[g]! : 0;
      at = so + 10;
      kind = BY_CLASS;
    }
    if (idx >= dv.getUint16(at)) return -1;
    const rsOff = dv.getUint16(at + 2 + 2 * idx);
    if (!rsOff) return -1;
    const rs = so + rsOff;
    for (let r = 0, n = dv.getUint16(rs); r < n; r++) {
      let p = rs + dv.getUint16(rs + 2 + 2 * r);
      const bc = dv.getUint16(p);
      const back = p + 2;
      p += 2 + 2 * bc;
      const ic = dv.getUint16(p);
      const input = p + 2;
      p += 2 + 2 * Math.max(ic - 1, 0);
      const lc = dv.getUint16(p);
      const ahead = p + 2;
      p += 2 + 2 * lc;
      const end = this._input(i, ic, kind, s._cd2, input, 0, depth);
      if (end < 0) continue;
      if (!this._lookahead(end, lc, kind, s._cd3, ahead, 0)) continue;
      if (!this._backtrack(i, bc, kind, s._cd1, back, 0)) continue;
      this._apply(p + 2, dv.getUint16(p), ic, depth);
      return end;
    }
    return -1;
  }

  /** Whether glyph `g` matches rule item `v` (glyph id, class, or coverage offset from `base`). */
  private _matches(kind: number, cd: Uint16Array, base: number, v: number, g: number): boolean {
    if (kind === BY_GLYPH) return g === v;
    if (kind === BY_CLASS) return (g < cd.length ? cd[g]! : 0) === v;
    const c = this._cov(base, v);
    return g < c.length && c[g] !== NOT_COVERED;
  }

  /**
   * Next glyph after `j` matching item `v`, or −1 (skipping_iterator_t::next
   * with a match function): ignored glyphs are skipped; a default ignorable
   * is skipped unless it matches; any other mismatch fails.
   */
  private _next(j: number, kind: number, cd: Uint16Array, base: number, v: number): number {
    const gp = run._gp;
    const gid = run._gid;
    for (let p = j + 1; p < _end; p++) {
      const props = gp[p]!;
      const g = gid[p]!;
      if (!checkProps(props, g, _lp, _set)) continue;
      if (this._matches(kind, cd, base, v, g)) return p;
      if (props & PROP_IGNORABLE) continue;
      return -1;
    }
    return -1;
  }

  /** skipping_iterator_t::prev counterpart of {@link Gpos._next}. */
  private _prev(j: number, kind: number, cd: Uint16Array, base: number, v: number): number {
    const gp = run._gp;
    const gid = run._gid;
    for (let p = j - 1; p >= _start; p--) {
      const props = gp[p]!;
      const g = gid[p]!;
      if (!checkProps(props, g, _lp, _set)) continue;
      if (this._matches(kind, cd, base, v, g)) return p;
      if (props & PROP_IGNORABLE) continue;
      return -1;
    }
    return -1;
  }

  /**
   * port of match_input: matches input items 1..count−1 (u16 values from
   * `seq`) after glyph `i`; records match positions for this nesting level.
   * Returns the match end (exclusive), or −1.
   */
  private _input(
    i: number,
    count: number,
    kind: number,
    cd: Uint16Array,
    seq: number,
    base: number,
    depth: number,
  ): number {
    if (count > MAX_CONTEXT) return -1;
    const mb = depth * MAX_CONTEXT;
    _mpos[mb] = i;
    let j = i;
    for (let k = 1; k < count; k++) {
      j = this._next(j, kind, cd, base, _dv.getUint16(seq + 2 * (k - 1)));
      if (j < 0) return -1;
      _mpos[mb + k] = j;
    }
    return j + 1;
  }

  /** port of match_lookahead, starting at `end`. */
  private _lookahead(
    end: number,
    count: number,
    kind: number,
    cd: Uint16Array,
    seq: number,
    base: number,
  ): boolean {
    let j = end - 1;
    for (let k = 0; k < count; k++) {
      j = this._next(j, kind, cd, base, _dv.getUint16(seq + 2 * k));
      if (j < 0) return false;
    }
    return true;
  }

  /** port of match_backtrack (item 0 is the glyph right before `i`). */
  private _backtrack(
    i: number,
    count: number,
    kind: number,
    cd: Uint16Array,
    seq: number,
    base: number,
  ): boolean {
    let j = i;
    for (let k = 0; k < count; k++) {
      j = this._prev(j, kind, cd, base, _dv.getUint16(seq + 2 * k));
      if (j < 0) return false;
    }
    return true;
  }

  /**
   * port of apply_lookup (GPOS: the buffer never changes length): applies
   * each SequenceLookupRecord at its matched position, in design order.
   */
  private _apply(recs: number, n: number, count: number, depth: number): void {
    const mb = depth * MAX_CONTEXT;
    for (let r = 0; r < n; r++) {
      const si = _dv.getUint16(recs + 4 * r);
      if (si >= count) continue;
      if (depth + 1 >= MAX_NESTING || _ops-- <= 0) continue;
      const lk = this._lookup(_dv.getUint16(recs + 4 * r + 2));
      if (!lk) continue;
      const lp = _lp;
      const set = _set;
      _lp = lk._props;
      _set = lk._set;
      this._applyAt(lk, _mpos[mb + si]!, depth + 1);
      _lp = lp;
      _set = set;
    }
  }
}
