import { BinaryReader } from "../reader";

/**
 * Parses the `loca` table.
 *
 * Returns byte offsets into the `glyf` table for each glyph.
 * Length of the returned array is `numGlyphs + 1`; the size of glyph `i`
 * in the glyf table is `offsets[i+1] - offsets[i]`.
 * A zero-size entry (offsets[i] === offsets[i+1]) means the glyph has no
 * outline (e.g. space).
 *
 * Short format (indexToLocFormat === 0): entries are uint16, multiply by 2.
 * Long format  (indexToLocFormat === 1): entries are uint32, use directly.
 *
 * @param buffer Full font buffer.
 * @param offset Byte offset of the loca table.
 * @param numGlyphs Total glyph count from maxp.
 * @param indexToLocFormat 0 or 1, from head table.
 * @returns Array of byte offsets, length = numGlyphs + 1.
 */
export function parseLoca(
  buffer: ArrayBuffer,
  offset: number,
  numGlyphs: number,
  indexToLocFormat: number,
): number[] {
  const r = new BinaryReader(buffer, offset);
  const count = numGlyphs + 1;
  const offsets: number[] = [];

  if (indexToLocFormat === 0) {
    for (let i = 0; i < count; i++) offsets[i] = r.u16() * 2;
  } else {
    for (let i = 0; i < count; i++) offsets[i] = r.u32();
  }

  return offsets;
}
