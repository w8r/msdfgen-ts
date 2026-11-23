import { PROP_BASE, PROP_LIGATURE, PROP_MARK } from "../glyph-run";
import { decodeClassDef, decodeCoverage } from "./otl";

/**
 * GDEF: glyph classes (base / ligature / mark + mark attachment class) and
 * mark glyph sets, the inputs of GPOS lookup flags.
 *
 * port of harfbuzz src/hb-ot-layout-gdef-table.hh: GDEF::get_glyph_props,
 * MarkGlyphSets::covers.
 */
export class Gdef {
  /** Glyph props per glyph (PROP_* | attachClass << 8); null without a glyph ClassDef. */
  readonly _props: Uint16Array | null;
  /** @type {DataView} */
  private _dv: DataView;
  /** Absolute offset of MarkGlyphSetsDef, 0 if absent. */
  private _sets: number;
  /** Decoded mark glyph set coverages, by set index. */
  private _setCache: (Uint16Array | undefined)[] = [];

  /**
   * @param buffer Full font buffer.
   * @param offset Byte offset of the GDEF table.
   * @param numGlyphs `maxp.numGlyphs`.
   */
  constructor(buffer: ArrayBuffer, offset: number, numGlyphs: number) {
    const dv = new DataView(buffer);
    this._dv = dv;
    const minor = dv.getUint16(offset + 2);
    const classOff = dv.getUint16(offset + 4);
    const attachOff = dv.getUint16(offset + 10);
    const setsOff = minor >= 2 ? dv.getUint16(offset + 12) : 0;
    this._sets = setsOff ? offset + setsOff : 0;
    if (!classOff) {
      this._props = null;
      return;
    }
    const classes = decodeClassDef(dv, offset + classOff);
    const attach = attachOff ? decodeClassDef(dv, offset + attachOff) : new Uint16Array(0);
    const props = new Uint16Array(numGlyphs);
    for (let g = 0; g < numGlyphs && g < classes.length; g++) {
      switch (classes[g]) {
        case 1:
          props[g] = PROP_BASE;
          break;
        case 2:
          props[g] = PROP_LIGATURE;
          break;
        case 3:
          props[g] = PROP_MARK | ((attach[g] ?? 0) << 8);
          break;
      }
    }
    this._props = props;
  }

  /** Coverage of mark glyph set `index` (empty if the font has none). */
  _markSet(index: number): Uint16Array {
    let t = this._setCache[index];
    if (!t) {
      const dv = this._dv;
      const base = this._sets;
      t =
        base && index < dv.getUint16(base + 2)
          ? decodeCoverage(dv, base + dv.getUint32(base + 4 + 4 * index))
          : new Uint16Array(0);
      this._setCache[index] = t;
    }
    return t;
  }
}
