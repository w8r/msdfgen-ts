import { BinaryReader } from "../reader.js";

export interface MaxpTable {
  numGlyphs: number;
}

/**
 * Parses the `maxp` table (version 0.5 and 1.0).
 *
 * @param buffer Full font buffer.
 * @param offset Byte offset of the maxp table.
 */
export function parseMaxp(buffer: ArrayBuffer, offset: number): MaxpTable {
  const r = new BinaryReader(buffer, offset);
  r.skip(4); // version (Fixed)
  const numGlyphs = r.u16();
  return { numGlyphs };
}
