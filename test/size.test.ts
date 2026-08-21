/**
 * M6 size budget: `dist/msdfgen-ts.iife.js`, minified + gzip, must stay
 * under 50 KB (CLAUDE.md M6 gate). Runs an actual `vite build` via Vite's
 * JS API (same `vite.config.ts` `npm run build`/`npm run size` use) so this
 * test measures the real shipped artifact, not an approximation — a
 * regression here is a regression a consumer would actually download.
 *
 * gzip uses Node's zlib default level (6), matching `npm run size`'s
 * `gzip -c | wc -c` (gzip(1)'s own default is also 6) — same number either
 * way, so this test and the manual `npm run size` check never disagree.
 *
 * Only the main entry is budgeted, per CLAUDE.md's M6 gate text — the
 * `msdfgen-ts/worker` entry (`dist/atlas-worker.js`, `vite.worker.config.ts`)
 * is a separate, opt-in chunk a consumer only pays for if they import it;
 * see docs/m5-qa-checklist.md's findings log for that decision.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { gzipSync } from "zlib";
import { build } from "vite";

const ROOT = resolve(__dirname, "..");
const MAX_GZIP_BYTES = 50 * 1024;

describe("M6: size budget", () => {
  it(`dist/msdfgen-ts.iife.js gzips under ${MAX_GZIP_BYTES / 1024} KB`, async () => {
    await build({ root: ROOT, configFile: resolve(ROOT, "vite.config.ts"), logLevel: "silent" });
    const bundle = readFileSync(resolve(ROOT, "dist/msdfgen-ts.iife.js"));
    const gzipped = gzipSync(bundle);
    expect(gzipped.byteLength).toBeLessThan(MAX_GZIP_BYTES);
  }, 30000);
});
