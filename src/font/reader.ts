/**
 * BinaryReader — a stateful big-endian DataView cursor.
 *
 * All multi-byte reads use big-endian byte order (OpenType/TrueType spec).
 * Scalar fields are plain numbers; there are no allocations per read.
 */
export class BinaryReader {
  /** @type {DataView} */
  private _view: DataView;
  /** Current read position in bytes. */
  private _pos: number;

  /**
   * @param buffer Source buffer (the full font file).
   * @param byteOffset Starting position (default 0).
   */
  constructor(buffer: ArrayBuffer, byteOffset = 0) {
    this._view = new DataView(buffer);
    this._pos = byteOffset;
  }

  /** Current byte position. */
  get pos(): number {
    return this._pos;
  }

  /** Move to an absolute byte position. */
  seek(n: number): void {
    this._pos = n;
  }

  /** Advance position by `n` bytes without reading. */
  skip(n: number): void {
    this._pos += n;
  }

  /** Read uint8 (1 byte). */
  u8(): number {
    return this._view.getUint8(this._pos++);
  }

  /** Read uint16 big-endian (2 bytes). */
  u16(): number {
    const v = this._view.getUint16(this._pos, false);
    this._pos += 2;
    return v;
  }

  /** Read int16 big-endian (2 bytes). */
  i16(): number {
    const v = this._view.getInt16(this._pos, false);
    this._pos += 2;
    return v;
  }

  /** Read uint32 big-endian (4 bytes). */
  u32(): number {
    const v = this._view.getUint32(this._pos, false);
    this._pos += 4;
    return v;
  }

  /** Read int32 big-endian (4 bytes). */
  i32(): number {
    const v = this._view.getInt32(this._pos, false);
    this._pos += 4;
    return v;
  }

  /**
   * Read F2Dot14 (2 bytes): 2-bit signed integer + 14-bit fraction.
   * Used for 2×2 scale components in composite glyphs.
   * @returns Value in [-2, 2).
   */
  f2dot14(): number {
    return this.i16() / 16384;
  }

  /**
   * Read a 16-bit offset (uint16). Alias for u16(), documents intent.
   * @returns Byte offset relative to some base (caller's responsibility).
   */
  offset16(): number {
    return this.u16();
  }

  /**
   * Read a 32-bit offset (uint32). Alias for u32(), documents intent.
   * @returns Byte offset relative to some base (caller's responsibility).
   */
  offset32(): number {
    return this.u32();
  }

  // ── peek helpers (non-advancing reads at absolute positions) ──────────────

  /** Read uint16 big-endian at an absolute byte offset without moving pos. */
  peekU16(at: number): number {
    return this._view.getUint16(at, false);
  }

  /** Read uint32 big-endian at an absolute byte offset without moving pos. */
  peekU32(at: number): number {
    return this._view.getUint32(at, false);
  }

  /** Read int16 big-endian at an absolute byte offset without moving pos. */
  peekI16(at: number): number {
    return this._view.getInt16(at, false);
  }
}
