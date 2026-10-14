import { suspend } from "suspend-react";
import { loadMSDFFont } from "../three/MSDFText";
import type { MSDFFont } from "../three/MSDFText";
import type { AtlasOptions } from "../../src/index";

/**
 * Suspense-friendly font loader: throws while the font loads, then returns
 * the shared {@link MSDFFont} for `url`. Wrap the caller in `<Suspense>`.
 *
 * @param url - URL of a TrueType (`glyf`) font file
 * @param opts - atlas options, used only on first load
 * @returns the shared font atlas
 */
export function useMSDFFont(url: string, opts?: AtlasOptions): MSDFFont {
  return suspend(() => loadMSDFFont(url, opts), [url]);
}
