import { BinaryReader } from "../reader";

export interface HMetric {
  advanceWidth: number;
  lsb: number;
}

/**
 * Parses the `hmtx` table.
 *
 * Layout: `numberOfHMetrics` × (advanceWidth u16, lsb i16), then
 * `(numGlyphs - numberOfHMetrics)` × lsb-only i16 entries (all sharing the
 * last advanceWidth).
 *
 * @param buffer Full font buffer.
 * @param offset Byte offset of the hmtx table.
 * @param numGlyphs Total glyph count from maxp.
 * @param numberOfHMetrics Count of full hMetric records from hhea.
 * @returns Array of per-glyph {advanceWidth, lsb}, length = numGlyphs.
 */
export function parseHmtx(
  buffer: ArrayBuffer,
  offset: number,
  numGlyphs: number,
  numberOfHMetrics: number,
): HMetric[] {
  const r = new BinaryReader(buffer, offset);
  const metrics: HMetric[] = new Array<HMetric>(numGlyphs);
  let lastAdvanceWidth = 0;

  for (let i = 0; i < numberOfHMetrics; i++) {
    const advanceWidth = r.u16();
    const lsb = r.i16();
    metrics[i] = { advanceWidth, lsb };
    lastAdvanceWidth = advanceWidth;
  }

  // Monospaced glyphs: share the last advanceWidth
  for (let i = numberOfHMetrics; i < numGlyphs; i++) {
    const lsb = r.i16();
    metrics[i] = { advanceWidth: lastAdvanceWidth, lsb };
  }

  return metrics;
}
