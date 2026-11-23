import { nextGlyph, PROP_MARK, run } from "../glyph-run";

/** Per glyph: 1 where a cross-stream reset cut the attachment chain (module scratch, grown once). */
let _cut = new Uint8Array(64);

/**
 * The legacy `kern` table, applied the way HarfBuzz does when a font has no
 * GPOS kerning for the run's script: every format-0 horizontal subtable in
 * turn (values accumulate), marks skipped, each pair's kern split half onto
 * each glyph (same drawing positions, caret halfway).
 *
 * port of harfbuzz src/hb-ot-kern-table.hh (OT and AAT `kern` headers),
 * hb-aat-layout-kerx-table.hh: KerxSubTableFormat0 / KerxTable::apply, and
 * hb-kern.hh: hb_kern_machine_t::kern. Formats 1-3 (state machines, class
 * tables) are not ported.
 */
export class KernTable {
  /** @type {DataView} */
  private _dv: DataView;
  /** Per usable subtable: absolute offset of its first pair, pair count, cross-stream flag. */
  private _pairs: number[] = [];
  private _counts: number[] = [];
  private _cross: boolean[] = [];
  /** Any subtable at all (hb_ot_layout_has_kerning). */
  readonly _hasData: boolean;
  /** Any state-machine subtable (hb_ot_layout_has_machine_kerning). */
  readonly _hasMachine: boolean;
  /** Any cross-stream subtable (hb_ot_layout_has_cross_kerning). */
  readonly _hasCross: boolean;

  /**
   * @param buffer Full font buffer.
   * @param offset Byte offset of the kern table.
   */
  constructor(buffer: ArrayBuffer, offset: number) {
    const dv = new DataView(buffer);
    this._dv = dv;
    const aat = dv.getUint16(offset) === 1; // Apple: u32 version 0x00010000
    const count = aat ? dv.getUint32(offset + 4) : dv.getUint16(offset + 2);
    let p = offset + (aat ? 8 : 4);
    let machine = false;
    let cross = false;
    for (let t = 0; t < count && p + 8 <= dv.byteLength; t++) {
      let length: number;
      let format: number;
      let horizontal: boolean;
      let crossStream: boolean;
      let skip = false;
      let data: number;
      if (aat) {
        length = dv.getUint32(p);
        const coverage = dv.getUint8(p + 4);
        format = dv.getUint8(p + 5);
        horizontal = !(coverage & 0x80);
        crossStream = !!(coverage & 0x40);
        skip = !!(coverage & 0x20); // variation
        data = p + 8;
      } else {
        length = dv.getUint16(p + 2);
        format = dv.getUint8(p + 4);
        const coverage = dv.getUint8(p + 5);
        horizontal = !!(coverage & 0x01);
        crossStream = !!(coverage & 0x04);
        data = p + 6;
      }
      if (format === 1) machine = true;
      if (crossStream) cross = true;
      if (format === 0 && horizontal && !skip) {
        this._pairs.push(data + 8);
        this._counts.push(dv.getUint16(data));
        this._cross.push(crossStream);
      }
      if (length < 6) break;
      p += length;
    }
    this._hasData = count > 0;
    this._hasMachine = machine;
    this._hasCross = cross;
  }

  /** Kern value of subtable `s` for a pair, 0 if not listed (binary search, like HarfBuzz). */
  private _get(s: number, left: number, right: number): number {
    const dv = this._dv;
    const base = this._pairs[s]!;
    const key = ((left << 16) | right) >>> 0;
    let lo = 0;
    let hi = this._counts[s]! - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const k = dv.getUint32(base + 6 * mid);
      if (k < key) lo = mid + 1;
      else if (k > key) hi = mid - 1;
      else return dv.getInt16(base + 6 * mid + 4);
    }
    return 0;
  }

  /** Kerns `run[start, end)`. */
  _apply(start: number, end: number): void {
    const gid = run._gid;
    const xa = run._xa;
    const xo = run._xo;
    const yo = run._yo;
    let chained = false; // KerxTable::apply: seenCrossStream
    let attached = false; // HB_BUFFER_SCRATCH_FLAG_HAS_GPOS_ATTACHMENT
    for (let s = 0; s < this._pairs.length; s++) {
      const cross = this._cross[s]!;
      if (cross && !chained) {
        // The first cross-stream subtable chains every glyph to the one before it.
        chained = true;
        if (_cut.length < end) _cut = new Uint8Array(end * 2);
        _cut.fill(0, start, end);
      }
      for (let i = start; i < end;) {
        const j = nextGlyph(i, end, PROP_MARK, null); // LookupFlag::IgnoreMarks
        if (j < 0) {
          i++;
          continue;
        }
        const kern = this._get(s, gid[i]!, gid[j]!);
        if (kern) {
          if (cross) {
            if (kern === -0x8000) {
              // hb-kern.hh: the reset marker detaches the glyph from the chain.
              _cut[j] = 1;
              yo[j] = 0;
            } else {
              yo[j] = kern;
              attached = true;
            }
          } else {
            const half = kern / 2;
            xa[i] = xa[i]! + half;
            xa[j] = xa[j]! + kern - half;
            xo[j] = xo[j]! + kern - half;
          }
        }
        i = j;
      }
    }
    // port of GPOS.hh: position_finish_offsets / propagate_attachment_offsets
    // (cursive chain, forward direction): each chained glyph adds the y offset
    // of the glyph before it, so a cross-stream shift carries on down the run.
    if (attached) for (let i = start + 1; i < end; i++) if (!_cut[i]) yo[i] = yo[i]! + yo[i - 1]!;
  }
}
