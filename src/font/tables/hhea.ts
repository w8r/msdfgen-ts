import { BinaryReader } from "../reader.js";

export interface HheaTable {
  ascender: number;
  descender: number;
  lineGap: number;
  numberOfHMetrics: number;
}

/**
 * Parses the `hhea` table.
 *
 * hhea layout (OpenType spec §Table: hhea):
 *   u16  majorVersion
 *   u16  minorVersion
 *   i16  ascender
 *   i16  descender
 *   i16  lineGap
 *   u16  advanceWidthMax
 *   i16  minLeftSideBearing
 *   i16  minRightSideBearing
 *   i16  xMaxExtent
 *   i16  caretSlopeRise
 *   i16  caretSlopeRun
 *   i16  caretOffset
 *   i16  reserved × 4
 *   i16  metricDataFormat
 *   u16  numberOfHMetrics
 *
 * @param buffer Full font buffer.
 * @param offset Byte offset of the hhea table.
 */
export function parseHhea(buffer: ArrayBuffer, offset: number): HheaTable {
  const r = new BinaryReader(buffer, offset);
  r.skip(4); // majorVersion + minorVersion
  const ascender = r.i16();
  const descender = r.i16();
  const lineGap = r.i16();
  r.skip(2); // advanceWidthMax
  r.skip(2); // minLeftSideBearing
  r.skip(2); // minRightSideBearing
  r.skip(2); // xMaxExtent
  r.skip(2); // caretSlopeRise
  r.skip(2); // caretSlopeRun
  r.skip(2); // caretOffset
  r.skip(8); // reserved (4 × i16)
  r.skip(2); // metricDataFormat
  const numberOfHMetrics = r.u16();
  return { ascender, descender, lineGap, numberOfHMetrics };
}
