import { BinaryReader } from "../reader.js";

/**
 * Kerning pair map: key = `(leftGlyphId << 16) | rightGlyphId`, value = kern value in font units.
 * Returns 0 for unknown pairs.
 */
export type KernMap = (left: number, right: number) => number;

/**
 * Parses the `kern` table (format 0 horizontal kerning pairs only).
 *
 * Silently skips sub-tables with unsupported formats (vertical kerning,
 * cross-stream, format 2, etc.). Returns a no-op lookup if the table is
 * absent or contains no usable format-0 horizontal pairs.
 *
 * @param buffer Full font buffer.
 * @param offset Byte offset of the kern table (from TableMap).
 * @returns Kern lookup function.
 */
export function parseKern(buffer: ArrayBuffer, offset: number): KernMap {
  // kern table layout (OpenType §Table: kern):
  //   u16  version (0 for TrueType kern)
  //   u16  nTables

  const r = new BinaryReader(buffer, offset);
  const version = r.u16();
  if (version !== 0) {
    // AAT-style kern (version 1) or unknown — skip gracefully
    return _noKern;
  }
  const nTables = r.u16();

  // Accumulate all format-0 horizontal pairs across sub-tables.
  const pairs = new Map<number, number>();

  for (let t = 0; t < nTables; t++) {
    // Sub-table header (6 bytes):
    //   u16  version   (always 0)
    //   u16  length    (total sub-table length in bytes)
    //   u16  coverage  (format + flags)
    const subStart = r.pos;
    r.skip(2); // sub-table version
    const subLength = r.u16();
    const coverage = r.u16();

    const format = (coverage >> 8) & 0xff;
    const horizontal = !(coverage & 0x02); // bit 1 set → vertical
    const minimum = !!(coverage & 0x04); // bit 2 set → minimum-kern table

    if (format !== 0 || !horizontal || minimum) {
      // Skip sub-tables we don't support
      r.seek(subStart + subLength);
      continue;
    }

    // Format 0 sub-table:
    //   u16  nPairs
    //   u16  searchRange, entrySelector, rangeShift  (skip)
    const nPairs = r.u16();
    r.skip(6); // searchRange, entrySelector, rangeShift

    for (let p = 0; p < nPairs; p++) {
      const left = r.u16();
      const right = r.u16();
      const value = r.i16();
      const key = ((left & 0xffff) << 16) | (right & 0xffff);
      // Last sub-table with a given pair wins (matches msdfgen / browser behaviour)
      pairs.set(key, value);
    }

    r.seek(subStart + subLength);
  }

  if (pairs.size === 0) return _noKern;

  return (left: number, right: number): number => {
    const key = ((left & 0xffff) << 16) | (right & 0xffff);
    return pairs.get(key) ?? 0;
  };
}

/** Zero-kern fallback used when the table is absent or unsupported. */
const _noKern: KernMap = () => 0;
