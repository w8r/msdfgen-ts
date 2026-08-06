import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "MsdfgenTs",
      fileName: "msdfgen-ts",
      formats: ["es", "iife"],
    },
    minify: "esbuild",
  },
});
