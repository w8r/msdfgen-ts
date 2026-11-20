/**
 * OpenType Layout common tables (Coverage, ClassDef), decoded once into
 * dense per-glyph arrays so lookups are a single indexed read.
 *
 * port of harfbuzz src/hb-ot-layout-common.hh: Coverage::get_coverage,
 * ClassDef::get_class (same results, dense instead of binary search).
 */

/** Coverage value for "not covered". */
export const NOT_COVERED = 0xffff;

const EMPTY = new Uint16Array(0);

/**
 * The script tags of a GSUB or GPOS table's ScriptList, in table order.
 *
 * @param dv View of the font buffer.
 * @param table Byte offset of the GSUB or GPOS table.
 * @returns The tags (empty when the table has no ScriptList).
 */
export function scriptListTags(dv: DataView, table: number): Uint32Array {
  const offset = dv.getUint16(table + 4);
  if (!offset) return new Uint32Array(0);
  const list = table + offset;
  const tags = new Uint32Array(dv.getUint16(list));
  for (let i = 0; i < tags.length; i++) tags[i] = dv.getUint32(list + 2 + 6 * i);
  return tags;
}

/**
 * Decodes a Coverage table: `t[glyph]` is the coverage index, or
 * {@link NOT_COVERED}; glyphs past `t.length` are not covered.
 */
export function decodeCoverage(dv: DataView, off: number): Uint16Array {
  const format = dv.getUint16(off);
  const count = dv.getUint16(off + 2);
  let max = -1;
  if (format === 1) {
    for (let i = 0; i < count; i++) max = Math.max(max, dv.getUint16(off + 4 + 2 * i));
    const t = new Uint16Array(max + 1).fill(NOT_COVERED);
    for (let i = count - 1; i >= 0; i--) t[dv.getUint16(off + 4 + 2 * i)] = i;
    return t;
  }
  if (format === 2) {
    for (let i = 0; i < count; i++) max = Math.max(max, dv.getUint16(off + 6 + 6 * i));
    const t = new Uint16Array(max + 1).fill(NOT_COVERED);
    for (let i = count - 1; i >= 0; i--) {
      const r = off + 4 + 6 * i;
      const start = dv.getUint16(r);
      const end = dv.getUint16(r + 2);
      const first = dv.getUint16(r + 4);
      for (let g = start; g <= end; g++) t[g] = first + g - start;
    }
    return t;
  }
  return EMPTY;
}

/**
 * Decodes a ClassDef table: `t[glyph]` is the class; glyphs past `t.length`
 * (and glyphs the table does not list) are class 0.
 */
export function decodeClassDef(dv: DataView, off: number): Uint16Array {
  const format = dv.getUint16(off);
  if (format === 1) {
    const start = dv.getUint16(off + 2);
    const count = dv.getUint16(off + 4);
    const t = new Uint16Array(start + count);
    for (let i = 0; i < count; i++) t[start + i] = dv.getUint16(off + 6 + 2 * i);
    return t;
  }
  if (format === 2) {
    const count = dv.getUint16(off + 2);
    let max = -1;
    for (let i = 0; i < count; i++) max = Math.max(max, dv.getUint16(off + 6 + 6 * i));
    const t = new Uint16Array(max + 1);
    for (let i = count - 1; i >= 0; i--) {
      const r = off + 4 + 6 * i;
      const end = dv.getUint16(r + 2);
      const cls = dv.getUint16(r + 4);
      for (let g = dv.getUint16(r); g <= end; g++) t[g] = cls;
    }
    return t;
  }
  return EMPTY;
}
