import { BinaryReader } from "./reader";

/** Maps a 4-char tag to its byte range within the font buffer. */
export interface TableRecord {
  offset: number;
  length: number;
}

/** Parsed SFNT table directory. */
export type TableMap = Map<string, TableRecord>;

/**
 * Parses the SFNT table directory from a font buffer.
 *
 * Handles:
 *  - TrueType (.ttf): sfntVersion = 0x00010000 or 0x74727565 ('true')
 *  - CFF/OTF (.otf):  sfntVersion = 0x4F54544F ('OTTO') — table map still usable,
 *    but `glyf` table won't be present
 *  - TTC (.ttc): magic = 0x74746366 ('ttcf') — picks font at index 0
 *
 * @param buffer Full font file bytes.
 * @returns Map of 4-char tag → {offset, length}.
 */
export function parseSfnt(buffer: ArrayBuffer): TableMap {
  const r = new BinaryReader(buffer);
  const tag = r.u32();

  if (tag === 0x74746366) {
    // TTC — TrueType Collection
    r.skip(4); // majorVersion (u16) + minorVersion (u16)
    const numFonts = r.u32();
    if (numFonts === 0) throw new Error("TTC contains no fonts");
    const font0Offset = r.u32(); // offset to first SFNT table directory
    r.seek(font0Offset);
  } else {
    // Single SFNT — rewind and re-read the sfntVersion from pos 0
    r.seek(0);
  }

  return _parseTableDirectory(buffer, r);
}

/** @internal */
function _parseTableDirectory(buffer: ArrayBuffer, r: BinaryReader): TableMap {
  r.skip(4); // sfntVersion: 0x00010000, 'true', or 'OTTO'
  const numTables = r.u16();
  r.skip(6); // searchRange, entrySelector, rangeShift

  const tables = new Map<string, TableRecord>();
  for (let i = 0; i < numTables; i++) {
    const tag = String.fromCharCode(r.u8(), r.u8(), r.u8(), r.u8());
    r.skip(4); // checksum
    const offset = r.u32();
    const length = r.u32();
    tables.set(tag, { offset, length });
  }
  return tables;
}
