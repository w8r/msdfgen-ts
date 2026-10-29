/**
 * PixiJS v8 adapter: feeds the msdfgen-ts atlas into Pixi's own MSDF
 * BitmapFont path, so BitmapText renders with Pixi's shader and no custom
 * shader here. Depends only on pixi.js and the public msdfgen-ts API.
 *
 * Pixi's `distanceField.range` is in texels at `baseRenderedFontSize`. Our
 * atlas is generated at `pixelsPerEm` with a `pxrange` texel range, so the
 * two match with baseRenderedFontSize = pixelsPerEm, range = pxrange.
 */
import {
  BitmapFont,
  BitmapFontManager,
  BitmapText,
  BufferImageSource,
  Cache,
  Texture,
} from "pixi.js";
import { Atlas } from "../../src/index";
import type { AtlasOptions, Font } from "../../src/index";

type BitmapFontData = ConstructorParameters<typeof BitmapFont>[0]["data"];

/**
 * One msdfgen-ts font exposed as a Pixi bitmap font named `name`. Rebuilds the
 * whole Pixi font when the character set or the atlas changes, then re-lays
 * out every text created through {@link MSDFBitmapFont.createText}.
 */
export class MSDFBitmapFont {
  readonly atlas: Atlas;
  readonly name: string;
  private readonly _font: Font;
  private readonly _ppem: number;
  private readonly _pxrange: number;
  private readonly _cps = new Set<number>();
  private readonly _texts = new Set<BitmapText>();
  private _pixiFont: BitmapFont | null = null;

  /**
   * @param name - Pixi font family name (used as `fontFamily` on BitmapText)
   * @param font - parsed TrueType font
   * @param opts - atlas options (pixelsPerEm, pxrange)
   */
  constructor(name: string, font: Font, opts: AtlasOptions = {}) {
    this.name = name;
    this._font = font;
    this._ppem = opts.pixelsPerEm ?? 40;
    this._pxrange = opts.pxrange ?? 4;
    this.atlas = new Atlas(font, opts);
    // ponytail: seed one glyph so the atlas is never zero-sized before the first text.
    this._cps.add(0x4d); // "M"
  }

  /**
   * Creates a BitmapText that uses this font. Generates glyphs for `text` and
   * installs the Pixi font first, so the first render has metrics.
   *
   * @param text - initial text
   * @param fontSize - size in Pixi pixels (world units)
   * @returns the new BitmapText, tracked for re-layout on repack
   */
  createText(text: string, fontSize: number): BitmapText {
    this.ensure(text);
    const node = new BitmapText({ text, style: { fontFamily: this.name, fontSize } });
    this._texts.add(node);
    return node;
  }

  /**
   * Changes the text of a node created by {@link MSDFBitmapFont.createText}.
   * Generates any new glyphs before the text is set, so layout never sees a
   * missing character.
   *
   * @param node - text node from createText
   * @param text - new text
   */
  setText(node: BitmapText, text: string): void {
    this.ensure(text);
    node.text = text;
  }

  /**
   * Stops tracking a node. Call before destroying it, so a later rebuild does
   * not touch a dead object.
   *
   * @param node - text node from createText
   */
  forget(node: BitmapText): void {
    this._texts.delete(node);
  }

  /**
   * Adds any characters in `text` not yet in the font, then rebuilds the Pixi
   * font if that happened. No-op when every character is already installed.
   *
   * @param text - text about to be displayed
   */
  ensure(text: string): void {
    let fresh = false;
    for (const ch of text) {
      const cp = ch.codePointAt(0)!;
      if (!this._cps.has(cp)) {
        this._cps.add(cp);
        fresh = true;
      }
    }
    if (fresh || this._pixiFont === null) this._rebuild();
  }

  /** Destroys the installed Pixi font and its GPU texture. Dead texts are not re-laid out. */
  dispose(): void {
    this._pixiFont?.pages.pop();
    this._pixiFont?.destroy();
    this._pixiFont = null;
    this._texts.clear();
  }

  /**
   * Builds a fresh Pixi BitmapFont from the current atlas and installs it
   * under `${name}-bitmap`, the key Pixi looks up for a style's fontFamily.
   * Then it clears Pixi's measure cache and re-lays out every tracked text.
   */
  private _rebuild(): void {
    const cps = [...this._cps];
    const glyphs = this.atlas.glyphs(cps); // one repack for any new glyphs
    const { width, height } = this.atlas;

    const source = new BufferImageSource({
      resource: this.atlas.texture,
      width,
      height,
      format: "rgba8unorm",
    });
    const page = new Texture({ source });

    const upe = this._font.metrics.unitsPerEm;
    const ppem = this._ppem;
    const gids = cps.map((cp) => this._font.glyphId(cp));
    const chars: BitmapFontData["chars"] = {};
    cps.forEach((cp, i) => {
      const g = glyphs[i]!;
      const kerning: Record<string, number> = {};
      cps.forEach((prev, j) => {
        const k = this._font.kerning(gids[j]!, gids[i]!);
        if (k) kerning[String.fromCodePoint(prev)] = (k / upe) * ppem;
      });
      chars[String.fromCodePoint(cp)] = {
        id: cp,
        letter: String.fromCodePoint(cp),
        page: 0,
        x: g.x,
        y: g.y,
        width: g.w,
        height: g.h,
        // Pixi draws each texture at (baseline + yOffset), so yOffset is the top of the glyph cell above the baseline.
        xOffset: g.planeLeft * ppem,
        yOffset: -g.planeTop * ppem,
        xAdvance: g.advance * ppem,
        kerning,
      };
    });

    const { ascender, descender, lineGap } = this._font.metrics;
    const data: BitmapFontData = {
      pages: [{ id: 0, file: this.name }],
      chars,
      fontSize: ppem,
      baseLineOffset: (ascender / upe) * ppem,
      lineHeight: ((ascender - descender + lineGap) / upe) * ppem,
      fontFamily: this.name,
      distanceField: { type: "msdf", range: this._pxrange },
    };

    // Detach the old page before destroy(): BitmapFont.destroy() would free the
    // source while batches still bind it. Pixi's texture GC reclaims it later.
    this._pixiFont?.pages.pop();
    this._pixiFont?.destroy();
    this._pixiFont = new BitmapFont({ data, textures: [page] });
    // Pixi's Cache warns on overwrite and also aliases "<key>-bitmap", so remove first.
    const key = `${this.name}-bitmap`;
    if (Cache.has(key)) Cache.remove(key);
    Cache.set(key, this._pixiFont);

    // Layout is cached by text + style, not by font identity, so clear it or a
    // text measured before a character existed keeps its zero-width layout.
    BitmapFontManager.measureCache.clear();
    for (const node of this._texts) node.onViewUpdate();
  }
}
