import { BinaryReader } from "../reader.js";

export interface HeadTable {
  /** Font design units per em-square (typically 1000 or 2048). */
  unitsPerEm: number;
  /** 0 = short loca offsets (uint16 × 2), 1 = long loca offsets (uint32). */
  indexToLocFormat: number;
}

/**
 * Parses the `head` table.
 *
 * head layout (OpenType spec §Table: head):
 *   u16  majorVersion
 *   u16  minorVersion
 *   i32  fontRevision      (Fixed 16.16)
 *   u32  checksumAdjustment
 *   u32  magicNumber       (0x5F0F3CF5)
 *   u16  flags
 *   u16  unitsPerEm
 *   i64  created
 *   i64  modified
 *   i16  xMin, yMin, xMax, yMax
 *   u16  macStyle
 *   u16  lowestRecPPEM
 *   i16  fontDirectionHint
 *   i16  indexToLocFormat
 *   i16  glyphDataFormat
 *
 * @param buffer Full font buffer.
 * @param offset Byte offset of the head table.
 */
export function parseHead(buffer: ArrayBuffer, offset: number): HeadTable {
  const r = new BinaryReader(buffer, offset);
  r.skip(4); // majorVersion + minorVersion
  r.skip(4); // fontRevision
  r.skip(4); // checksumAdjustment
  r.skip(4); // magicNumber
  r.skip(2); // flags
  const unitsPerEm = r.u16();
  r.skip(16); // created (8) + modified (8)
  r.skip(8); // xMin, yMin, xMax, yMax (4 × i16)
  r.skip(2); // macStyle
  r.skip(2); // lowestRecPPEM
  r.skip(2); // fontDirectionHint
  const indexToLocFormat = r.i16();
  return { unitsPerEm, indexToLocFormat };
}
