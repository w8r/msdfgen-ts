// Minimal types for webgl-sdf-generator 1.1.1 (ships none) — only what
// tools/compare-sdf uses.
declare module "webgl-sdf-generator" {
  type GenerateFn = (
    sdfWidth: number,
    sdfHeight: number,
    path: string,
    viewBox: [number, number, number, number],
    maxDistance: number,
    sdfExponent?: number,
  ) => Uint8Array;
  interface SDFGenerator {
    generate: GenerateFn;
    javascript: { generate: GenerateFn };
    webgl: { generate: GenerateFn; isSupported(): boolean };
  }
  export default function createSDFGenerator(): SDFGenerator;
}
