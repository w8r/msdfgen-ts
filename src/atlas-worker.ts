/// <reference lib="webworker" />
/**
 * Optional worker wrapper around {@link Atlas} — off-main-thread atlas builds.
 *
 * Runs the exact same synchronous `Atlas.layout()` pipeline as the main-thread
 * path in `atlas-gen.ts` — just inside a dedicated Worker, so a build (e.g. a
 * resolution-tier regen during zoom) never blocks the render thread (see
 * CLAUDE.md's M5 "Stack decisions": "a thin optional worker wrapper... makes
 * the worker path a drop-in"). This is the pragmatic form of that wrapper: it
 * reruns the whole `Atlas` build per request rather than exposing a generic
 * per-glyph `(job) => Promise<Result> | Result` injection point on `Atlas`
 * itself — nothing in this codebase yet needs more than one generation
 * backend (main-thread sync vs. worker sync), so that fuller abstraction
 * stays undone; `atlas-gen.ts`'s `Atlas` class is unmodified by this file.
 *
 * Published as a second entry point (`msdfgen-ts/worker`) — see
 * `package.json`'s `exports` and `vite.worker.config.ts` — separate from the
 * main `msdfgen-ts` entry so it costs nothing in the M6 size budget unless a
 * consumer actually imports it. This file has no DOM dependency: font bytes
 * come in as a transferred `ArrayBuffer` (caller's responsibility to load
 * them, however — `fetch`, filesystem, drag-drop), not fetched by this file.
 *
 * Usage from a consumer (mirrors `demo/webgpu-zoom/main.ts`):
 * ```ts
 * const worker = new Worker(new URL("msdfgen-ts/worker", import.meta.url), { type: "module" });
 * const fontBytes = await fetch(fontUrl).then((r) => r.arrayBuffer());
 * worker.postMessage(
 *   { type: "build", id: 1, fontKey: fontUrl, font: fontBytes, pixelsPerEm: 48, pxrange: 6, text: "Hello" },
 *   [fontBytes], // transferred — don't reuse fontBytes after this call
 * );
 * worker.onmessage = (ev) => { ... };
 * ```
 *
 * Message protocol (structured clone in, one transferable `ArrayBuffer` out):
 *   in:  {@link BuildRequest}
 *   out: {@link BuiltResponse} | {@link ErrorResponse}
 *
 * `id` is caller-assigned; the caller is responsible for ignoring replies to
 * requests it has since superseded (see `workerBuildId` in the demo).
 */
import { Font } from "./font/font";
import { Atlas, type AtlasGlyph } from "./atlas-gen";

/**
 * Requests one atlas build.
 *
 * `fontKey` is a caller-chosen cache key (a font URL is a natural choice) —
 * the worker parses+caches one `Font` per key across every request it sees.
 * `font` is required on the FIRST request for a given `fontKey`; omit it on
 * later requests reusing that key to skip re-sending + re-parsing the font.
 * `font` is transferred, not copied — do not reuse that `ArrayBuffer` after
 * posting (it will be detached).
 */
export interface BuildRequest {
  type: "build";
  id: number;
  fontKey: string;
  font?: ArrayBuffer;
  pixelsPerEm: number;
  pxrange: number;
  text: string;
}

/** One glyph in a built response — {@link AtlasGlyph} plus its laid-out pen
 *  position, flattened into one plain object for structured clone. */
export interface BuiltGlyph extends AtlasGlyph {
  penX: number;
}

/** Successful build result. `texture` is transferred, not copied. */
export interface BuiltResponse {
  type: "built";
  id: number;
  pixelsPerEm: number;
  pxrange: number;
  pxrangeEm: number;
  width: number;
  height: number;
  texture: ArrayBuffer;
  glyphs: BuiltGlyph[];
  widthEm: number;
  /** Wall-clock time spent generating + packing this tier's atlas (ms). */
  genMs: number;
}

/** Build failure — `message` is `String(error)`, not the original object
 *  (errors don't structured-clone reliably across the worker boundary). */
export interface ErrorResponse {
  type: "error";
  id: number;
  message: string;
}

/** One parsed `Font` per `fontKey`, reused across every build request. */
const _fonts = new Map<string, Font>();

self.onmessage = (ev: MessageEvent<BuildRequest>): void => {
  const req = ev.data;
  if (req.type !== "build") return;
  try {
    let font = _fonts.get(req.fontKey);
    if (!font) {
      if (!req.font) {
        throw new Error(
          `atlas-worker: no cached font for fontKey "${req.fontKey}" and no ` +
            `\`font\` bytes provided on this request`,
        );
      }
      font = new Font(req.font);
      _fonts.set(req.fontKey, font);
    }
    const genStart = performance.now();
    const atlas = new Atlas(font, { pixelsPerEm: req.pixelsPerEm, pxrange: req.pxrange });
    const { glyphs, widthEm } = atlas.layout(req.text);
    const genMs = performance.now() - genStart;
    const glyphsOut: BuiltGlyph[] = glyphs.map(({ glyph, penX }) => ({ ...glyph, penX }));
    // .slice() copies out of Atlas's internal buffer into a fresh,
    // exactly-sized ArrayBuffer we're free to transfer (detach) below.
    const texture = atlas.texture.slice().buffer;
    const response: BuiltResponse = {
      type: "built",
      id: req.id,
      pixelsPerEm: req.pixelsPerEm,
      pxrange: req.pxrange,
      pxrangeEm: atlas.pxrangeEm,
      width: atlas.width,
      height: atlas.height,
      texture,
      glyphs: glyphsOut,
      widthEm,
      genMs,
    };
    self.postMessage(response, [texture]);
  } catch (err: unknown) {
    const response: ErrorResponse = { type: "error", id: req.id, message: String(err) };
    self.postMessage(response);
  }
};
