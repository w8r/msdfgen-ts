/**
 * Reusable dev-server + headless-Chromium screenshot tool.
 *
 * Spins up an isolated Vite dev server on a dedicated port (so it never
 * conflicts with a `npm run dev` you already have open), navigates
 * Playwright's Chromium to a given path, waits for the page to signal
 * readiness (a `data-ready` attribute on #root — see demo/canvas/main.ts and
 * demo/webgpu/main.ts),
 * captures console/page errors and WebGPU adapter availability, and
 * writes a full-page screenshot.
 *
 * Usage:
 *   npx tsx tools/screenshot.ts <path> [--out <file>] [--width N] [--height N]
 *
 * Examples:
 *   npx tsx tools/screenshot.ts /demo/canvas/index.html
 *   npx tsx tools/screenshot.ts /demo/webgpu/index.html --out /tmp/gpu.png
 *
 * Extra Chromium launch args (e.g. WebGPU CI flags) can be passed via the
 * SCREENSHOT_CHROMIUM_ARGS env var, space-separated:
 *   SCREENSHOT_CHROMIUM_ARGS="--enable-unsafe-webgpu --enable-features=Vulkan" \
 *     npx tsx tools/screenshot.ts /demo/webgpu/index.html
 *
 * First-time setup: `npm run screenshot:setup` (downloads Chromium for
 * Playwright — not automatic on `npm install`, same philosophy as
 * setup-reference.sh being a manual, explicit step).
 *
 * Exits non-zero if the page threw any console/page error, so this can
 * also be used as a smoke check, not just for eyeballing.
 */
import { spawn } from "child_process";
import { mkdirSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "tools/screenshot-out");
mkdirSync(OUT_DIR, { recursive: true });

const PORT = 5199; // dedicated port, isolated from any `npm run dev` already running

const args = process.argv.slice(2);
const urlPath = args[0];
if (!urlPath || urlPath.startsWith("--")) {
  console.error(
    "Usage: npx tsx tools/screenshot.ts <path> [--out <file>] [--width N] [--height N]",
  );
  process.exit(1);
}
const outIdx = args.indexOf("--out");
const outFile =
  (outIdx >= 0 ? args[outIdx + 1] : undefined) ??
  resolve(OUT_DIR, `${basename(urlPath, ".html")}.png`);
const widthIdx = args.indexOf("--width");
const width = widthIdx >= 0 ? Number(args[widthIdx + 1]) : 1000;
const heightIdx = args.indexOf("--height");
const height = heightIdx >= 0 ? Number(args[heightIdx + 1]) : 600;

/** Polls `http://localhost:{port}` until it responds or `timeoutMs` elapses. */
async function waitForPort(port: number, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  for (;;) {
    try {
      await fetch(`http://localhost:${port}`);
      return;
    } catch {
      if (Date.now() - start > timeoutMs) throw new Error("dev server did not start in time");
      await new Promise((r) => setTimeout(r, 300));
    }
  }
}

/** True if something already answers HTTP on `port`. */
async function isListening(port: number): Promise<boolean> {
  try {
    await fetch(`http://localhost:${port}`);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  // --strictPort makes our Vite exit if the port is taken, but waitForPort
  // would then happily screenshot whatever other server owns it.
  if (await isListening(PORT)) {
    console.error(`Port ${PORT} is already in use by another server. Stop it, or change PORT.`);
    process.exit(1);
  }
  const vite = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let viteOutput = "";
  vite.stdout.on("data", (d) => (viteOutput += String(d)));
  vite.stderr.on("data", (d) => (viteOutput += String(d)));

  try {
    await waitForPort(PORT);

    const chromiumArgs = (process.env.SCREENSHOT_CHROMIUM_ARGS ?? "").split(" ").filter(Boolean);
    const browser = await chromium.launch({ args: chromiumArgs });
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
    });

    const url = `http://localhost:${PORT}${urlPath}`;
    await page.goto(url, { waitUntil: "networkidle" });
    try {
      await page.waitForSelector("#root[data-ready]", { timeout: 10000 });
    } catch {
      errors.push("timeout: #root never got a data-ready attribute (see demo/*/main.ts)");
    }

    const rootText = await page.textContent("#root").catch(() => null);
    const gpuInfo = await page
      .evaluate(async () => {
        if (!("gpu" in navigator)) return { hasGpuObject: false, hasAdapter: false };
        const adapter = await navigator.gpu.requestAdapter().catch(() => null);
        return { hasGpuObject: true, hasAdapter: !!adapter };
      })
      .catch(() => ({ hasGpuObject: false, hasAdapter: false }));

    await page.screenshot({ path: outFile, fullPage: true });
    await browser.close();

    console.log(JSON.stringify({ url, outFile, rootText, gpuInfo, errors }, null, 2));
    if (errors.length > 0) process.exitCode = 1;
  } finally {
    vite.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
