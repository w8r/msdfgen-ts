import { defineConfig } from "vite";
import { resolve } from "path";

/**
 * Separate build config for deploying the demo/ pages as a static site (GH
 * Pages), kept apart from vite.config.ts (which builds the npm library
 * package only — reusing one config for both would leak demo HTML/assets
 * into the published dist/ output).
 *
 * root is demo/ so the site is flat (demo/index.html -> demo-dist/index.html,
 * demo/canvas/index.html -> demo-dist/canvas/index.html, ...) instead of
 * mirroring the repo's directory structure.
 *
 * publicDir (demo/public/) mirrors the *paths* the demo pages fetch fonts
 * from (demo/public/test/fonts/X.ttf -> served at /test/fonts/X.ttf) so no
 * demo/*\/main.ts FONT_URL needs to change between dev (served straight
 * from the repo's real test/fonts/) and this production build — only the
 * handful of fonts actually used by a demo are duplicated here rather than
 * publishing all of test/ (test/golden/ alone is ~34 MB of fixture data
 * that has no business on a deployed site).
 */
export default defineConfig({
  root: resolve(__dirname, "demo"),
  base: "/msdfgen-ts/",
  publicDir: resolve(__dirname, "demo/public"),
  build: {
    outDir: resolve(__dirname, "demo-dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "demo/index.html"),
        canvas: resolve(__dirname, "demo/canvas/index.html"),
        webgpu: resolve(__dirname, "demo/webgpu/index.html"),
        webgl: resolve(__dirname, "demo/webgl/index.html"),
        webglZoom: resolve(__dirname, "demo/webgl-zoom/index.html"),
        debug: resolve(__dirname, "demo/debug/index.html"),
      },
    },
  },
});
