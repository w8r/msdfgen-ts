/**
 * three.js adapter for msdfgen-ts: one shared MSDF atlas per font, one
 * `MSDFText` mesh per text run. Self-contained so it can later move into a
 * `msdfgen-ts/three` subpath export unchanged. Depends only on `three` and
 * the public msdfgen-ts API.
 */
import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  DoubleSide,
  LinearFilter,
  Mesh,
  NoColorSpace,
  RGBAFormat,
  ShaderMaterial,
  UnsignedByteType,
  ClampToEdgeWrapping,
  Vector2,
  Color,
} from "three";
import { Atlas, Font } from "../../src/index";
import type { AtlasOptions } from "../../src/index";

/** Anchor fractions: x 0 = left, 0.5 = centre, 1 = right; y 0 = top, 0.5 = middle, 1 = bottom. */
export interface MSDFTextProps {
  text: string;
  /** World units per em (the height of one em). */
  fontSize: number;
  color: string | number;
  anchorX: number;
  anchorY: number;
  /** Greedy word wrap width in world units. Omit for no wrapping. */
  maxWidth?: number | undefined;
}

const VERT = /* glsl */ `
attribute vec3 aColor;
varying vec2 vUv;
varying vec3 vColor;
void main() {
  vUv = uv;
  vColor = aColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform vec2 uAtlasSize;
uniform float uPxRange;
varying vec2 vUv;
varying vec3 vColor;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

// Screen-pixel distance range from the UV derivative, so the edge stays
// one pixel wide at any perspective distance.
float screenPxRange() {
  vec2 unitRange = vec2(uPxRange) / uAtlasSize;
  vec2 screenTexSize = vec2(1.0) / fwidth(vUv);
  return max(0.5 * dot(unitRange, screenTexSize), 1.0);
}

void main() {
  vec3 s = texture2D(uMap, vUv).rgb;
  float sd = median(s.r, s.g, s.b);
  float alpha = clamp(screenPxRange() * (sd - 0.5) + 0.5, 0.0, 1.0);
  if (alpha < 0.001) discard;
  gl_FragColor = vec4(vColor, alpha);
}`;

/**
 * One font's atlas, GPU texture and shared material. Every `MSDFText` using
 * the font registers in `users`. Adding glyphs repacks the atlas, which
 * invalidates every user's UVs, so the texture is recreated and every user
 * rebuilds its geometry.
 */
export class MSDFFont {
  readonly atlas: Atlas;
  readonly material: ShaderMaterial;
  private readonly _pxrange: number;
  private _texture: DataTexture;
  private readonly _users = new Set<MSDFText>();

  /**
   * @param font - parsed TrueType font
   * @param opts - atlas options (pixelsPerEm, pxrange)
   */
  constructor(font: Font, opts: AtlasOptions = {}) {
    this.atlas = new Atlas(font, opts);
    this._pxrange = opts.pxrange ?? 4;
    this._texture = this._upload();
    this.material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uMap: { value: this._texture },
        uAtlasSize: { value: new Vector2(this.atlas.width, this.atlas.height) },
        uPxRange: { value: this._pxrange },
      },
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
    });
  }

  /**
   * Generates any missing glyphs for `text`. If that repacked the atlas,
   * re-uploads the texture and rebuilds every mesh using this font.
   *
   * @param text - characters that will be laid out next
   */
  ensure(text: string): void {
    const before = this.atlas.texture;
    this.atlas.glyphs(Array.from(text, (ch) => ch.codePointAt(0)!));
    if (this.atlas.texture === before) return;

    this._texture.dispose();
    this._texture = this._upload();
    this.material.uniforms.uMap!.value = this._texture;
    this.material.uniforms.uAtlasSize!.value.set(this.atlas.width, this.atlas.height);
    for (const user of this._users) user.rebuild();
  }

  /** @internal */
  _register(mesh: MSDFText): void {
    this._users.add(mesh);
  }

  /** @internal */
  _unregister(mesh: MSDFText): void {
    this._users.delete(mesh);
  }

  /** Frees the GPU texture and material. Call only after every mesh is disposed. */
  dispose(): void {
    this._texture.dispose();
    this.material.dispose();
  }

  private _upload(): DataTexture {
    const { texture, width, height } = this.atlas;
    const tex = new DataTexture(texture, width, height, RGBAFormat, UnsignedByteType);
    // Holds distance data, not colour: no sRGB decode, no mipmaps.
    // flipY stays false, so v=0 is the first row (y-down), matching hello-webgl.
    tex.minFilter = LinearFilter;
    tex.magFilter = LinearFilter;
    tex.generateMipmaps = false;
    tex.wrapS = ClampToEdgeWrapping;
    tex.wrapT = ClampToEdgeWrapping;
    tex.colorSpace = NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  }
}

const _cache = new Map<string, Promise<MSDFFont>>();

/**
 * Loads a TrueType font from `url` and returns its shared {@link MSDFFont}.
 * The same URL always resolves to the same instance.
 *
 * @param url - URL of a TrueType (`glyf`) font file
 * @param opts - atlas options, used only on first load
 * @returns the shared font atlas
 */
export function loadMSDFFont(url: string, opts?: AtlasOptions): Promise<MSDFFont> {
  let font = _cache.get(url);
  if (!font) {
    font = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buf) => new MSDFFont(new Font(buf), opts));
    _cache.set(url, font);
  }
  return font;
}

/**
 * Plain `THREE.Mesh` that draws one run of MSDF text. The geometry is one
 * indexed quad per glyph, rebuilt only when a prop changes.
 */
export class MSDFText extends Mesh {
  private readonly _font: MSDFFont;
  private _props: MSDFTextProps = {
    text: "",
    fontSize: 1,
    color: 0xffffff,
    anchorX: 0,
    anchorY: 0,
  };

  /**
   * @param font - shared atlas from {@link loadMSDFFont}
   * @param props - initial text properties
   */
  constructor(font: MSDFFont, props: Partial<MSDFTextProps> = {}) {
    super(new BufferGeometry(), font.material);
    this._font = font;
    font._register(this);
    this.update(props);
  }

  /**
   * Applies new props. Only the geometry is rebuilt, and only when a prop
   * actually changed.
   *
   * @param props - any subset of {@link MSDFTextProps}
   */
  update(props: Partial<MSDFTextProps>): void {
    const next = { ...this._props, ...props };
    const changed = (Object.keys(props) as (keyof MSDFTextProps)[]).some(
      (k) => props[k] !== this._props[k],
    );
    this._props = next;
    if (changed) this.rebuild();
  }

  /**
   * Rebuilds the quad geometry from the current props. Called on prop change
   * and by {@link MSDFFont} after the atlas repacks.
   */
  rebuild(): void {
    const { text, fontSize, color, anchorX, anchorY, maxWidth } = this._props;
    const atlas = this._font.atlas;
    // Generate every glyph before measuring or laying out, so this never
    // repacks mid-build.
    this._font.ensure(text);

    const lines =
      maxWidth === undefined ? text.split("\n") : wrap(atlas, text, maxWidth / fontSize);
    const { glyphs, widthEm, heightEm } = atlas.layoutMultiline(lines.join("\n"));
    const ox = -anchorX * widthEm;
    const oy = anchorY * heightEm;

    const c = new Color(color);
    const quads = glyphs.filter(({ glyph }) => glyph.w > 0);
    const pos = new Float32Array(quads.length * 12);
    const uv = new Float32Array(quads.length * 8);
    const col = new Float32Array(quads.length * 12);
    const idx = new Uint32Array(quads.length * 6);
    const W = atlas.width;
    const H = atlas.height;

    quads.forEach(({ glyph: g, penX, penY }, i) => {
      const x0 = (penX + g.planeLeft + ox) * fontSize;
      const x1 = (penX + g.planeRight + ox) * fontSize;
      const y0 = (penY + g.planeBottom + oy) * fontSize;
      const y1 = (penY + g.planeTop + oy) * fontSize;
      const u0 = (g.x + 0.5) / W;
      const u1 = (g.x + g.w - 0.5) / W;
      const vTop = (g.y + 0.5) / H;
      const vBottom = (g.y + g.h - 0.5) / H;
      // Corners: bottom-left, bottom-right, top-left, top-right.
      pos.set([x0, y0, 0, x1, y0, 0, x0, y1, 0, x1, y1, 0], i * 12);
      uv.set([u0, vBottom, u1, vBottom, u0, vTop, u1, vTop], i * 8);
      for (let v = 0; v < 4; v++) col.set([c.r, c.g, c.b], (i * 4 + v) * 3);
      const b = i * 4;
      idx.set([b, b + 1, b + 2, b + 2, b + 1, b + 3], i * 6);
    });

    this.geometry.dispose();
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(pos, 3));
    geometry.setAttribute("uv", new BufferAttribute(uv, 2));
    geometry.setAttribute("aColor", new BufferAttribute(col, 3));
    geometry.setIndex(new BufferAttribute(idx, 1));
    this.geometry = geometry;
  }

  /** Frees geometry and unregisters from the font. The shared material stays alive. */
  override dispose(): void {
    this._font._unregister(this);
    this.geometry.dispose();
    super.dispose();
  }
}

/**
 * Greedy word wrap, measured in em. Words are split on spaces.
 * ponytail: no hyphenation or shaping-aware breaks, add when a demo needs them.
 * Caller must already have generated the glyphs for `text`, so measuring never repacks.
 *
 * @param atlas - atlas that holds every glyph in `text`
 * @param text - input text, may contain `\n`
 * @param maxEm - wrap width in em
 * @returns wrapped lines
 */
function wrap(atlas: Atlas, text: string, maxEm: number): string[] {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(" ")) {
      const candidate = line === "" ? word : `${line} ${word}`;
      if (line !== "" && atlas.layout(candidate).widthEm > maxEm) {
        out.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    out.push(line);
  }
  return out;
}
