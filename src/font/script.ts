/**
 * Unicode script itemization: splits text into the same script runs Chrome
 * shapes separately, so kerning never crosses a run boundary (Chrome does not
 * kern Latin "T" against a following Cyrillic "о") and each run selects its
 * own OpenType script.
 *
 * port of Chromium third_party/blink/renderer/platform/fonts/
 * script_run_iterator.cc: ScriptRunIterator + ICUScriptData::GetScripts.
 *
 * Script data comes from the JS engine's own Unicode tables through regex
 * property escapes (`\p{Script=…}`, `\p{Script_Extensions=…}`), so no Unicode
 * data ships in the bundle; in Chrome that is the same ICU data Blink uses.
 * Results are cached per codepoint. Module-scope state: single-threaded, like
 * the rest of the library.
 */

/** ISO 15924 codes indexed by ICU `UScriptCode` (the order Blink compares). */
const ICU_CODES =
  "ZyyyZinhArabArmnBengBopoCherCoptCyrlDsrtDevaEthiGeorGothGrekGujrGuruHaniHangHebrHiraKndaKanaKhmr" +
  "LaooLatnMlymMongMymrOgamItalOryaRunrSinhSyrcTamlTeluThaaThaiTibtCansYiiiTglgHanoBuhdTagbBraiCprt" +
  "LimbLinbOsmaShawTaleUgarHrktBugiGlagKharSyloTaluTfngXpeoBaliBatkBlisBrahChamCirtCyrsEgydEgyhEgyp" +
  "GeokHansHantHmngHungIndsJavaKaliLatfLatgLepcLinaMandMayaMeroNkooOrkhPermPhagPhnxPlrdRoroSaraSyre" +
  "SyrjSyrnTengVaiiVispXsuxZxxxZzzzCariJpanLanaLyciLydiOlckRjngSaurSgnwSundMoonMteiArmiAvstCakmKore" +
  "KthiManiPhliPhlpPhlvPrtiSamrTavtZmthZsymBamuLisuNkgbSarbBassDuplElbaGranKpelLomaMendMercNarbNbat" +
  "PalmSindWaraAfakJurcMrooNshuShrdSoraTakrTangWoleHluwKhojTirhAghbMahjAhomHatrModiMultPaucSiddAdlm" +
  "BhksMarcNewaOsgeHanbJamoZsyeGonmSoyoZanbDogrGongMakaMedfRohgSogdSogoElymHmnpNandWchoChrsDiakKits" +
  "YeziCpmnOugrTnsaTotoVithKawiNagmAranGaraGukhKraiOnaoSunuTodrTutgBerfSidtTayoTols";
/** Number of ICU script codes (script codes are `0 … SCRIPT_COUNT - 1`). */
export const SCRIPT_COUNT = ICU_CODES.length / 4;

/** `USCRIPT_COMMON` */
export const COMMON = 0;
/** `USCRIPT_INHERITED` */
export const INHERITED = 1;
const LATIN = 25;
const CYRILLIC = 8;
const GREEK = 14;

/**
 * ISO 15924 code of an ICU script code.
 *
 * @param code ICU script code (as {@link itemize} returns).
 * @returns The 4-letter code, e.g. "Latn".
 */
export function iso(code: number): string {
  return ICU_CODES.substring(code * 4, code * 4 + 4);
}

// ── per-script regexes, built on first use (null = unknown to this engine) ──

const _sc: (RegExp | null | undefined)[] = [];
const _scx: (RegExp | null | undefined)[] = [];

/** `\p{Script=…}` (`ext` false) or `\p{Script_Extensions=…}` regex, or null. */
function _re(code: number, ext: boolean): RegExp | null {
  const cache = ext ? _scx : _sc;
  let re = cache[code];
  if (re === undefined) {
    try {
      re = new RegExp(`^\\p{${ext ? "scx" : "sc"}=${iso(code)}}$`, "u");
    } catch {
      re = null; // not a Unicode script (e.g. Blis), or newer than this engine
    }
    cache[code] = re;
  }
  return re;
}

/** Matches any character whose Script_Extensions differ from {Script}. */
let _hasExt: RegExp | null = null;

/** Primary-script probe order: the scripts this library is mostly fed first. */
const PROBE_FIRST = [LATIN, COMMON, INHERITED, CYRILLIC, GREEK];

// Unique script sets, and the per-codepoint cache of indices into it.
const _sets: number[][] = [[COMMON], [LATIN]];
const _setIndex = new Map<string, number>();
let _bmp: Uint16Array | null = null; // codepoint → set index + 1 (0 = not cached)
const _astral = new Map<number, number>();

/**
 * Blink's ordered script set for `cp` (ICUScriptData::GetScripts): the
 * Script_Extensions, with the primary script (or Common/Inherited) first.
 * Shared and immutable — callers copy before mutating.
 */
export function scriptSet(cp: number): number[] {
  if (cp < 0x80) {
    return _sets[(cp >= 0x41 && cp <= 0x5a) || (cp >= 0x61 && cp <= 0x7a) ? 1 : 0]!;
  }
  let idx: number | undefined;
  if (cp < 0x10000) {
    if (!_bmp) _bmp = new Uint16Array(0x10000);
    const v = _bmp[cp]!;
    if (v) return _sets[v - 1]!;
    idx = _computeSet(cp);
    _bmp[cp] = idx + 1;
  } else {
    idx = _astral.get(cp);
    if (idx === undefined) {
      idx = _computeSet(cp);
      _astral.set(cp, idx);
    }
  }
  return _sets[idx]!;
}

/** Computes (and interns) the script set of a non-ASCII codepoint. */
function _computeSet(cp: number): number {
  const ch = String.fromCodePoint(cp);
  let primary = 103; // USCRIPT_UNKNOWN (Zzzz)
  for (let k = 0; k < PROBE_FIRST.length + SCRIPT_COUNT; k++) {
    const code = k < PROBE_FIRST.length ? PROBE_FIRST[k]! : k - PROBE_FIRST.length;
    const re = _re(code, false);
    if (re && re.test(ch)) {
      primary = code;
      break;
    }
  }
  let dst = [primary];
  if (!_hasExt) {
    // (?!\p{sc=X})\p{scx=X} for every X: has an extension script besides its own.
    let src = "";
    for (let c = 0; c < SCRIPT_COUNT; c++) {
      if (_re(c, false) && _re(c, true))
        src += `${src ? "|" : ""}(?!\\p{sc=${iso(c)}})\\p{scx=${iso(c)}}`;
    }
    _hasExt = new RegExp(`^(?:${src})$`, "u");
  }
  if (_hasExt.test(ch)) {
    // uscript_getScriptExtensions: ascending script code.
    const ext: number[] = [];
    for (let c = 0; c < SCRIPT_COUNT; c++) {
      const re = _re(c, true);
      if (re && re.test(ch)) ext.push(c);
    }
    if (ext.length) dst = _order(primary, ext);
  }
  const key = dst.join(",");
  let idx = _setIndex.get(key);
  if (idx === undefined) {
    idx = _sets.length;
    _sets.push(dst);
    _setIndex.set(key, idx);
  }
  return idx;
}

/** port of script_run_iterator.cc: ICUScriptData::GetScripts (ordering). */
function _order(primary: number, dst: number[]): number[] {
  if (primary === dst[0]) return dst;
  if (primary !== INHERITED && primary !== COMMON) {
    const at = dst.indexOf(primary, 1);
    if (at < 0) {
      dst.push(primary);
      const t = dst[0]!;
      dst[0] = primary;
      dst[dst.length - 1] = t;
    } else {
      dst[at] = dst[0]!;
      dst[0] = primary;
    }
    return dst;
  }
  if (primary === COMMON) {
    if (dst.length === 1) return [COMMON, dst[0]!];
    for (let i = 1; i < dst.length; i++) {
      if (dst[0] === LATIN || dst[i]! < dst[0]!) {
        const t = dst[0]!;
        dst[0] = dst[i]!;
        dst[i] = t;
      }
    }
    return dst;
  }
  // Inherited with extensions: [Inherited, preferred, others…].
  dst.push(dst[0]!);
  dst[0] = primary;
  for (let i = 2; i < dst.length; i++) {
    if (dst[1] === LATIN || dst[i]! < dst[1]!) {
      const t = dst[1]!;
      dst[1] = dst[i]!;
      dst[i] = t;
    }
  }
  return dst;
}

// ── paired brackets (Unicode BidiBrackets.txt: u_getBidiPairedBracket) ──────

/** Opening/closing pairs, flattened. */
const BRACKETS = [
  0x28, 0x29, 0x5b, 0x5d, 0x7b, 0x7d, 0xf3a, 0xf3b, 0xf3c, 0xf3d, 0x169b, 0x169c, 0x2045, 0x2046,
  0x207d, 0x207e, 0x208d, 0x208e, 0x2308, 0x2309, 0x230a, 0x230b, 0x2329, 0x232a, 0x2768, 0x2769,
  0x276a, 0x276b, 0x276c, 0x276d, 0x276e, 0x276f, 0x2770, 0x2771, 0x2772, 0x2773, 0x2774, 0x2775,
  0x27c5, 0x27c6, 0x27e6, 0x27e7, 0x27e8, 0x27e9, 0x27ea, 0x27eb, 0x27ec, 0x27ed, 0x27ee, 0x27ef,
  0x2983, 0x2984, 0x2985, 0x2986, 0x2987, 0x2988, 0x2989, 0x298a, 0x298b, 0x298c, 0x298d, 0x2990,
  0x298f, 0x298e, 0x2991, 0x2992, 0x2993, 0x2994, 0x2995, 0x2996, 0x2997, 0x2998, 0x29d8, 0x29d9,
  0x29da, 0x29db, 0x29fc, 0x29fd, 0x2e22, 0x2e23, 0x2e24, 0x2e25, 0x2e26, 0x2e27, 0x2e28, 0x2e29,
  0x2e55, 0x2e56, 0x2e57, 0x2e58, 0x2e59, 0x2e5a, 0x2e5b, 0x2e5c, 0x3008, 0x3009, 0x300a, 0x300b,
  0x300c, 0x300d, 0x300e, 0x300f, 0x3010, 0x3011, 0x3014, 0x3015, 0x3016, 0x3017, 0x3018, 0x3019,
  0x301a, 0x301b, 0xfe59, 0xfe5a, 0xfe5b, 0xfe5c, 0xfe5d, 0xfe5e, 0xff08, 0xff09, 0xff3b, 0xff3d,
  0xff5b, 0xff5d, 0xff5f, 0xff60, 0xff62, 0xff63,
];

/** codepoint → +pair (opening bracket) / −pair (closing bracket). */
let _bracket: Map<number, number> | null = null;

/** >0: opening bracket, returns its pair; <0: closing, −pair; 0: neither. */
function _pairedBracket(cp: number): number {
  if (cp < 0x28 || (cp > 0x7d && cp < 0xf3a)) return 0;
  if (!_bracket) {
    _bracket = new Map();
    for (let i = 0; i < BRACKETS.length; i += 2) {
      _bracket.set(BRACKETS[i]!, BRACKETS[i + 1]!);
      _bracket.set(BRACKETS[i + 1]!, -BRACKETS[i]!);
    }
  }
  return _bracket.get(cp) ?? 0;
}

// ── ScriptRunIterator ────────────────────────────────────────────────────────

const MAX_BRACKETS = 32; // ScriptRunIterator::kMaxBrackets
const _brCh: number[] = [];
const _brSc: number[] = [];
let _fixupDepth = 0;
let _commonPreferred = COMMON;
/** The run's script set so far (private, mutated in place). */
const _cur: number[] = [];
/** The current and the following character's sets: shared, never mutated. */
let _next: readonly number[] = [];
let _ahead: readonly number[] = [];
/** Shared one-script sets. */
const _singles: (readonly number[] | undefined)[] = [];

/** The shared set {code}. */
function _single(code: number): readonly number[] {
  let s = _singles[code];
  if (!s) _singles[code] = s = [code];
  return s;
}

/** Script of the run so far (ScriptRunIterator::ResolveCurrentScript). */
function _resolve(): number {
  const r = _cur[0]!;
  return r === COMMON ? _commonPreferred : r;
}

/** port of ScriptRunIterator::FixupStack. */
function _fixup(resolved: number, excludeLast: boolean): void {
  let count = _fixupDepth;
  if (count <= 0) return;
  if (count > _brCh.length) count = _brCh.length;
  let k = _brCh.length - 1;
  if (excludeLast) {
    k--;
    count--;
    _fixupDepth = 1;
  } else {
    _fixupDepth = 0;
  }
  for (; count > 0; k--, count--) _brSc[k] = resolved;
}

/** port of ScriptRunIterator::MergeSets. */
function _merge(): boolean {
  const next = _next;
  const cur = _cur;
  if (next.length === 0 || cur.length === 0) return false;
  if (next.length === 1 && cur.length === 1) {
    // Fast path (almost every character): one script on each side.
    const x = next[0]!;
    if (x <= INHERITED) return true;
    if (cur[0]! <= INHERITED) {
      cur[0] = x;
      return true;
    }
    return cur[0] === x;
  }
  let ci = 0;
  let priority = cur[ci++]!;
  if (next[0]! <= INHERITED) {
    if (next.length === 2 && priority <= INHERITED && _commonPreferred === COMMON) {
      _commonPreferred = next[1]!;
    }
    return true;
  }
  if (priority <= INHERITED) {
    _copy(_cur, next);
    return true;
  }
  let havePriority = next.indexOf(priority) >= 0;
  if (ci === cur.length) return havePriority;
  let ni = 0;
  if (!havePriority) {
    priority = next[ni++]!;
    havePriority = cur.indexOf(priority, ci) >= 0;
  }
  let w = 0;
  if (havePriority) cur[w++] = priority;
  if (ni !== next.length) {
    for (; ci < cur.length; ci++) if (next.indexOf(cur[ci]!, ni) >= 0) cur[w++] = cur[ci]!;
  }
  if (w > 0) {
    cur.length = w;
    return true;
  }
  return false;
}

/** Overwrites `dst` with the contents of `src`. */
function _copy(dst: number[], src: readonly number[]): void {
  dst.length = src.length;
  for (let i = 0; i < src.length; i++) dst[i] = src[i]!;
}

/**
 * Splits `cps[0..n)` into script runs, exactly like Blink's
 * ScriptRunIterator. Writes each run's end index (exclusive) and ICU script
 * code; returns the run count. `runEnd`/`runScript` need room for `n` runs.
 */
export function itemize(
  cps: Int32Array,
  n: number,
  runEnd: Int32Array,
  runScript: Int32Array,
): number {
  if (n === 0) return 0;
  // Fast path: one-script sets only, at most one real script. Blink then
  // yields a single run whatever the brackets do (a closing bracket can only
  // take the run's own script, or Common), resolved to that script.
  let only = COMMON;
  let k = 0;
  for (; k < n; k++) {
    const set = scriptSet(cps[k]!);
    if (set.length !== 1) break;
    const x = set[0]!;
    if (x <= INHERITED || x === only) continue;
    if (only !== COMMON) break;
    only = x;
  }
  if (k === n) {
    runEnd[0] = n;
    runScript[0] = only;
    return 1;
  }
  _brCh.length = 0;
  _brSc.length = 0;
  _fixupDepth = 0;
  _commonPreferred = COMMON;
  _cur.length = 1;
  _cur[0] = COMMON;
  _ahead = scriptSet(cps[0]!);
  let aheadPos = 1;
  let aheadCh = cps[0]!;
  let runs = 0;

  while (_cur.length) {
    let broke = false;
    // Fetch
    while (aheadPos <= n) {
      const pos = aheadPos - 1;
      const ch = aheadCh;
      _next = _ahead;
      if (aheadPos === n) {
        aheadPos++;
      } else {
        aheadCh = cps[aheadPos++]!;
        _ahead = scriptSet(aheadCh);
        if (_ahead[0] === INHERITED && _ahead.length > 1) {
          if (_next[0] === COMMON) _next = _ahead.slice(1);
          _ahead = _single(INHERITED);
        }
      }
      // Consume
      const pair = _pairedBracket(ch);
      if (pair > 0) {
        if (_brCh.length === MAX_BRACKETS) {
          _brCh.shift();
          _brSc.shift();
          if (_fixupDepth === MAX_BRACKETS) _fixupDepth--;
        }
        _fixup(_resolve(), false);
        _brCh.push(ch);
        _brSc.push(COMMON);
        _fixupDepth++;
      } else if (pair < 0) {
        for (let k = _brCh.length - 1; k >= 0; k--) {
          if (_brCh[k] === -pair) {
            const sc = _brSc[k]!;
            if (sc !== COMMON) _next = _single(sc);
            const popped = _brCh.length - 1 - k;
            _brCh.length -= popped;
            _brSc.length -= popped;
            _fixupDepth = Math.max(0, _fixupDepth - popped);
            break;
          }
        }
      }
      if (!_merge()) {
        const script = _resolve();
        _fixup(script, pair > 0);
        runEnd[runs] = pos;
        runScript[runs++] = script;
        _copy(_cur, _next);
        broke = true;
        break;
      }
    }
    if (!broke) {
      runEnd[runs] = n;
      runScript[runs++] = _resolve();
      _cur.length = 0;
    }
  }
  return runs;
}

// ── OpenType script tags (port of harfbuzz hb-ot-tag.cc) ───────────────────

const _tags: (number[] | undefined)[] = [];

/** Packs a 4-character tag into a uint32. */
export function tag(s: string): number {
  return (
    ((s.charCodeAt(0) << 24) |
      (s.charCodeAt(1) << 16) |
      (s.charCodeAt(2) << 8) |
      s.charCodeAt(3)) >>>
    0
  );
}

/** "New" Indic tags (hb_ot_new_tag_from_script): ISO code + tag, 8 chars each. */
const NEW_TAGS = "Bengbng2Devadev2Gujrgjr2Gurugur2Kndaknd2Mlymmlm2Oryaory2Tamltml2Telutel2Mymrmym2";
/** Old-style tags that are not the lowercased ISO code, same layout. */
const OLD_TAGS = "HirakanaLaoolao Yiiiyi  Nkoonko Vaiivai Zmthmath";

/** The tag paired with ISO code `s` in an 8-char-record table, or "". */
function _lookupTag(table: string, s: string): string {
  for (let i = 0; i < table.length; i += 8) {
    if (table.substring(i, i + 4) === s) return table.substring(i + 4, i + 8);
  }
  return "";
}

/**
 * OpenType script tags to try for an ICU script code, most preferred first
 * (port of hb-ot-tag.cc: hb_ot_all_tags_from_script).
 */
export function otScriptTags(code: number): number[] {
  let t = _tags[code];
  if (!t) {
    t = [];
    const s = iso(code);
    const nt = _lookupTag(NEW_TAGS, s);
    if (nt) {
      if (nt !== "mym2") t.push(tag(nt.substring(0, 3) + "3"));
      t.push(tag(nt));
    }
    t.push(tag(_lookupTag(OLD_TAGS, s) || s.toLowerCase()));
    _tags[code] = t;
  }
  return t;
}
