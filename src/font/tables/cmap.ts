import { BinaryReader } from "../reader";

/**
 * A compiled codepoint-to-glyph-ID lookup function.
 * Returns 0 (the .notdef glyph) when the codepoint is not found.
 */
export type CmapLookup = (codepoint: number) => number;

/**
 * Parses the `cmap` table and returns a fast lookup function.
 *
 * Subtable selection priority (higher = preferred):
 *   1. Platform 3, Encoding 10, Format 12 — Windows Unicode full repertoire (UCS-4)
 *   2. Platform 0, Encoding 6,  Format 12 — Unicode full repertoire
 *   3. Platform 0, Encoding 4,  Format 12 — Unicode 2.0+ full
 *   4. Platform 3, Encoding 1,  Format 4  — Windows Unicode BMP
 *   5. Platform 0, Encoding ≤3, Format 4  — Unicode BMP
 *
 * If no supported format is found, returns a no-op lookup (always 0).
 *
 * @param buffer Full font buffer.
 * @param offset Byte offset of the cmap table.
 */
export function parseCmap(buffer: ArrayBuffer, offset: number): CmapLookup {
  const r = new BinaryReader(buffer, offset);
  r.skip(2); // version (always 0)
  const numTables = r.u16();

  interface CandidateSubtable {
    priority: number;
    subtableAbsOffset: number;
  }
  let best: CandidateSubtable | null = null;

  for (let i = 0; i < numTables; i++) {
    const platformID = r.u16();
    const encodingID = r.u16();
    const subtableRelOffset = r.u32();
    const subtableAbsOffset = offset + subtableRelOffset;
    const format = r.peekU16(subtableAbsOffset);

    let priority = -1;
    if (platformID === 3 && encodingID === 10 && format === 12) priority = 5;
    else if (platformID === 0 && encodingID === 6 && format === 12) priority = 4;
    else if (platformID === 0 && encodingID === 4 && format === 12) priority = 3;
    else if (platformID === 3 && encodingID === 1 && format === 4) priority = 2;
    else if (platformID === 0 && encodingID <= 3 && format === 4) priority = 1;

    if (priority > (best?.priority ?? -1)) {
      best = { priority, subtableAbsOffset };
    }
  }

  if (!best) return () => 0;

  const fmt = r.peekU16(best.subtableAbsOffset);
  if (fmt === 12) return _parseCmapFormat12(buffer, best.subtableAbsOffset);
  if (fmt === 4) return _parseCmapFormat4(buffer, best.subtableAbsOffset);
  return () => 0;
}

// ── Format 12: Sequential Map Groups ─────────────────────────────────────────

/** @internal */
function _parseCmapFormat12(buffer: ArrayBuffer, offset: number): CmapLookup {
  // port of: OpenType spec §Format 12: Segmented coverage
  const r = new BinaryReader(buffer, offset);
  r.skip(2); // format (12)
  r.skip(2); // reserved
  r.skip(4); // length
  r.skip(4); // language
  const numGroups = r.u32();

  // Packed as three flat arrays for cache efficiency — no object allocation per group.
  const startCodes = new Uint32Array(numGroups);
  const endCodes = new Uint32Array(numGroups);
  const startGlyphs = new Uint32Array(numGroups);

  for (let i = 0; i < numGroups; i++) {
    startCodes[i] = r.u32();
    endCodes[i] = r.u32();
    startGlyphs[i] = r.u32();
  }

  return (codepoint: number): number => {
    // Binary search over sorted group array.
    let lo = 0,
      hi = numGroups - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const start = startCodes[mid] ?? 0;
      const end = endCodes[mid] ?? 0;
      if (codepoint < start) hi = mid - 1;
      else if (codepoint > end) lo = mid + 1;
      else return (startGlyphs[mid] ?? 0) + (codepoint - start);
    }
    return 0;
  };
}

// ── Format 4: Segment mapping to delta values ─────────────────────────────────

/** @internal */
function _parseCmapFormat4(buffer: ArrayBuffer, offset: number): CmapLookup {
  // port of: OpenType spec §Format 4: Segment mapping to delta values
  const r = new BinaryReader(buffer, offset);
  r.skip(2); // format
  r.skip(2); // length
  r.skip(2); // language
  const segCountX2 = r.u16();
  const segCount = segCountX2 >>> 1;
  r.skip(6); // searchRange, entrySelector, rangeShift

  const endCodes = new Uint16Array(segCount);
  for (let i = 0; i < segCount; i++) endCodes[i] = r.u16();
  r.skip(2); // reservedPad

  const startCodes = new Uint16Array(segCount);
  for (let i = 0; i < segCount; i++) startCodes[i] = r.u16();

  const idDeltas = new Int16Array(segCount);
  for (let i = 0; i < segCount; i++) idDeltas[i] = r.i16();

  // Record the absolute file position of each idRangeOffset entry — needed to
  // resolve the indirect glyphId lookup (spec §Format 4, idRangeOffset).
  const idRangeOffsetPos = new Int32Array(segCount);
  const idRangeOffsets = new Uint16Array(segCount);
  for (let i = 0; i < segCount; i++) {
    idRangeOffsetPos[i] = r.pos;
    idRangeOffsets[i] = r.u16();
  }

  const view = new DataView(buffer);

  return (codepoint: number): number => {
    if (codepoint > 0xffff) return 0; // Format 4 covers BMP only

    // Binary search for the segment whose endCode >= codepoint.
    let lo = 0,
      hi = segCount - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const end = endCodes[mid] ?? 0;
      if (codepoint > end) {
        lo = mid + 1;
      } else if (codepoint < (startCodes[mid] ?? 0)) {
        hi = mid - 1;
      } else {
        // Segment found at `mid`.
        const end2 = endCodes[mid] ?? 0;
        if (end2 === 0xffff) return 0; // terminator segment

        const rangeOffset = idRangeOffsets[mid] ?? 0;
        const delta = idDeltas[mid] ?? 0;
        const start = startCodes[mid] ?? 0;

        if (rangeOffset === 0) {
          return (codepoint + delta) & 0xffff;
        }
        // Indirect lookup: idRangeOffset is relative to its own file position.
        // glyphId position = idRangeOffsetPos + rangeOffset + (cp - startCode) * 2
        const glyphIdPos = (idRangeOffsetPos[mid] ?? 0) + rangeOffset + (codepoint - start) * 2;
        const glyphId = view.getUint16(glyphIdPos, false);
        if (glyphId === 0) return 0;
        return (glyphId + delta) & 0xffff;
      }
    }
    return 0;
  };
}
