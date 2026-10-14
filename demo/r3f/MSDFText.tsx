/**
 * react-three-fiber wrapper over the three.js adapter in ../three/MSDFText.
 * No logic lives here beyond mapping props onto the mesh: prop changes call
 * `update()`, which rebuilds geometry only, and unmount disposes the mesh.
 *
 * Do not wrap in <StrictMode>: its double mount would dispose the mesh
 * before the second mount re-registers it. Demo pages don't use it.
 */
import { useEffect, useLayoutEffect, useMemo } from "react";
import type { ThreeElements } from "@react-three/fiber";
import { MSDFText as MSDFTextMesh } from "../three/MSDFText";
import type { MSDFFont, MSDFTextProps } from "../three/MSDFText";

export interface MSDFTextR3FProps
  extends Omit<ThreeElements["primitive"], "object">, Partial<Omit<MSDFTextProps, "text">> {
  /** Shared font from {@link useMSDFFont}. */
  font: MSDFFont;
  text: string;
}

/**
 * Renders a run of MSDF text as a mesh in the R3F scene graph. Pointer
 * props (`onClick`, `onPointerOver`, ...) and transforms pass straight through
 * to the mesh.
 *
 * @param props - text, font and any MSDFText or primitive props
 * @returns the mesh, as a `<primitive>`
 */
export function MSDFText({
  font,
  text,
  fontSize = 1,
  color = 0xffffff,
  anchorX = 0,
  anchorY = 0,
  maxWidth,
  ...rest
}: MSDFTextR3FProps) {
  // Built once per font. Prop changes flow through update() below.
  const mesh = useMemo(
    () => new MSDFTextMesh(font, { text, fontSize, color, anchorX, anchorY, maxWidth }),
    [font],
  );

  useLayoutEffect(() => {
    mesh.update({ text, fontSize, color, anchorX, anchorY, maxWidth });
  }, [mesh, text, fontSize, color, anchorX, anchorY, maxWidth]);

  useEffect(() => () => mesh.dispose(), [mesh]);

  return <primitive object={mesh} {...rest} />;
}
