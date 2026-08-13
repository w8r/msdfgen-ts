/**
 * Shelf bin packer for the glyph atlas.
 *
 * Rects are packed left-to-right into horizontal shelves, choosing the
 * shelf whose height is the closest fit (best-height-fit) to minimize
 * wasted vertical space; a new shelf opens when no existing one fits.
 * The atlas grows by doubling a dimension (power-of-two) when a rect or
 * shelf no longer fits — width growth changes every row's stride, so the
 * caller (`Atlas`) must reflow its pixel buffer whenever `width` changes;
 * height growth only appends rows and needs no reflow.
 *
 * Not a port of C++ msdfgen (msdfgen ships no atlas packer) — this is our
 * own runtime atlas component.
 */

/** A packed rectangle's position and size, in atlas texel space. */
export interface PackRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A horizontal strip of the atlas that rects are packed into left-to-right. */
interface Shelf {
  y: number;
  height: number;
  usedWidth: number;
}

/**
 * Incremental shelf packer with power-of-two growth.
 *
 * Designed for glyph atlases: rects are packed one at a time as new glyphs
 * are discovered (no upfront sort/batch step), and already-packed rects
 * never move — growth only ever adds capacity.
 */
export class ShelfPacker {
  private _width: number;
  private _height: number;
  private _shelves: Shelf[] = [];
  private _nextY = 0;

  /**
   * @param width Initial atlas width in texels (should be a power of two).
   * @param height Initial atlas height in texels (should be a power of two).
   */
  constructor(width = 512, height = 512) {
    this._width = width;
    this._height = height;
  }

  /** Current atlas width in texels. */
  get width(): number {
    return this._width;
  }

  /** Current atlas height in texels. */
  get height(): number {
    return this._height;
  }

  /**
   * Packs one rect of size `w`×`h`, growing the atlas as needed.
   * Existing packed rects never move.
   *
   * @param w Rect width in texels.
   * @param h Rect height in texels.
   * @returns The rect's placement in atlas texel space.
   */
  pack(w: number, h: number): PackRect {
    while (w > this._width) this._growWidth();

    let bestIndex = -1;
    let bestHeight = Infinity;
    for (let i = 0; i < this._shelves.length; i++) {
      const shelf = this._shelves[i]!;
      if (h <= shelf.height && shelf.usedWidth + w <= this._width && shelf.height < bestHeight) {
        bestIndex = i;
        bestHeight = shelf.height;
      }
    }

    if (bestIndex >= 0) {
      const shelf = this._shelves[bestIndex]!;
      const rect: PackRect = { x: shelf.usedWidth, y: shelf.y, w, h };
      shelf.usedWidth += w;
      return rect;
    }

    while (this._nextY + h > this._height) this._growHeight();

    const shelf: Shelf = { y: this._nextY, height: h, usedWidth: w };
    this._shelves.push(shelf);
    this._nextY += h;
    return { x: 0, y: shelf.y, w, h };
  }

  private _growWidth(): void {
    this._width *= 2;
  }

  private _growHeight(): void {
    this._height *= 2;
  }
}
