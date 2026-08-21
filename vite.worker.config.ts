import { defineConfig } from "vite";

// Separate build for the optional `msdfgen-ts/worker` entry (src/atlas-worker.ts).
// Kept out of vite.config.ts's lib entry because Vite lib mode's "iife" format
// (needed there for the size gate) only supports a single entry, and this file
// is only ever loaded as a `type: "module"` Worker — "es" is the only format
// that makes sense for it. `emptyOutDir: false` so this build doesn't wipe out
// vite.config.ts's dist/msdfgen-ts.* output (run after it — see package.json's
// `build` script).
export default defineConfig({
  build: {
    lib: {
      entry: "src/atlas-worker.ts",
      fileName: "atlas-worker",
      formats: ["es"],
    },
    outDir: "dist",
    emptyOutDir: false,
    minify: "esbuild",
  },
});
