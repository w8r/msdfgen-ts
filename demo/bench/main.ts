/**
 * Live, in-browser perf report — companion to tools/bench.ts and
 * tools/bench-atlas-text.ts (Node scripts), same methodology, run in
 * whatever browser/JS engine actually loads this page. Not a gate:
 * gate:m6 (Node, tools/bench.ts) is the pass/fail authority — see
 * docs/m6-perf-investigation.md for the full writeup this page's numbers
 * get checked against. This page exists so a real number is one click
 * away instead of trusted secondhand from CI or a different machine.
 *
 * Iteration counts are lower than the Node tools' (tools/bench.ts runs
 * 200 iterations/glyph; this runs 15) — enough for a stable median without
 * freezing the tab for tens of seconds, even over the wider glyph range
 * this page covers (~150 glyphs vs. bench.ts's single worst-case one).
 * Not directly comparable sample-size-for-sample-size, but the methodology
 * (fresh Atlas per iteration, so every generation is genuinely uncached)
 * is identical.
 */
import { Font, Atlas } from "../../src/index";

// See demo/canvas/main.ts for why this isn't a hardcoded leading-slash path.
const ROBOTO_URL = `${import.meta.env.BASE_URL}test/fonts/Roboto.ttf`;
const PTSERIF_URL = `${import.meta.env.BASE_URL}test/fonts/PTSerif-Regular.ttf`;

// Matches tools/bench.ts's budget (CLAUDE.md M6 gate).
const GLYPH_BUDGET_MS = 3;
const GLYPH_PIXELS_PER_EM = 48;
const GLYPH_PXRANGE = 4;
// Wide, representative range rather than a handful of curated cases: full
// Latin upper/lowercase + digits + common punctuation + a Cyrillic sample
// — matches CLAUDE.md M0's corpus scope (Latin + Cyrillic + punctuation).
const GLYPH_CHARS = [
  ...new Set(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
      ".,!?;:'\"()-+=/@#&%*" +
      "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя",
  ),
];
const GLYPH_WARMUP = 3;
const GLYPH_ITERATIONS = 15;

// Matches tools/bench-atlas-text.ts — the two zoom demos' real TEXT/params.
interface TextBenchCase {
  name: string;
  pixelsPerEm: number;
  pxrange: number;
  text: string;
}
const TEXT_CASES: TextBenchCase[] = [
  {
    name: "webgpu-zoom",
    pixelsPerEm: 40,
    pxrange: 5,
    text: "Hello Привет 123 @#& *º savagery",
  },
  { name: "webgl-zoom", pixelsPerEm: 40, pxrange: 5, text: "*%#`²Hello Привет 123 @#&" },
];
const TEXT_WARMUP = 3;
const TEXT_ITERATIONS = 15;

/** Yields one tick so the browser can repaint the status line and stay
 *  responsive between benchmark cases — this file's loops are otherwise
 *  synchronous, matching the Node tools' methodology exactly. */
function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

function uniqueCodepoints(text: string): number {
  const seen = new Set<number>();
  for (const ch of text) seen.add(ch.codePointAt(0)!);
  return seen.size;
}

async function main(): Promise<void> {
  const root = document.getElementById("root")!;
  const runButton = document.getElementById("run") as HTMLButtonElement;
  const status = document.getElementById("status")!;
  const glyphSummary = document.getElementById("glyph-summary")!;
  const glyphTbody = document.getElementById("glyph-tbody")!;
  const textTbody = document.getElementById("text-tbody")!;

  async function run(): Promise<void> {
    runButton.disabled = true;
    status.textContent = "Loading fonts…";
    await tick();

    const [robotoBuf, ptSerifBuf] = await Promise.all([
      fetch(ROBOTO_URL).then((r) => r.arrayBuffer()),
      fetch(PTSERIF_URL).then((r) => r.arrayBuffer()),
    ]);
    const roboto = new Font(robotoBuf);
    const ptSerif = new Font(ptSerifBuf);

    // ── Per-glyph section ──────────────────────────────────────────────
    glyphTbody.innerHTML = "";
    let underCount = 0;
    const allMedians: number[] = [];
    for (const ch of GLYPH_CHARS) {
      status.textContent = `Benchmarking '${ch}'…`;
      await tick();

      const cp = ch.codePointAt(0)!;
      const times: number[] = [];
      for (let i = 0; i < GLYPH_WARMUP + GLYPH_ITERATIONS; i++) {
        const atlas = new Atlas(roboto, {
          pixelsPerEm: GLYPH_PIXELS_PER_EM,
          pxrange: GLYPH_PXRANGE,
        });
        const t0 = performance.now();
        atlas.glyph(cp);
        const dt = performance.now() - t0;
        if (i >= GLYPH_WARMUP) times.push(dt);
      }
      const med = median(times);
      const min = Math.min(...times);
      const max = Math.max(...times);
      const under = med < GLYPH_BUDGET_MS;
      if (under) underCount++;
      allMedians.push(med);

      const row = document.createElement("tr");
      row.innerHTML =
        `<td>'${ch}'</td>` +
        `<td class="${under ? "under" : "over"}">${med.toFixed(2)}ms</td>` +
        `<td>${min.toFixed(2)}ms</td>` +
        `<td>${max.toFixed(2)}ms</td>` +
        `<td class="${under ? "under" : "over"}">${under ? "under" : (med / GLYPH_BUDGET_MS).toFixed(1) + "x over"}</td>`;
      glyphTbody.appendChild(row);
    }
    glyphSummary.textContent =
      `${underCount}/${GLYPH_CHARS.length} glyphs under the ${GLYPH_BUDGET_MS}ms budget — ` +
      `overall median ${median(allMedians).toFixed(2)}ms, ` +
      `worst ${Math.max(...allMedians).toFixed(2)}ms, best ${Math.min(...allMedians).toFixed(2)}ms`;

    // ── Whole-string section ───────────────────────────────────────────
    textTbody.innerHTML = "";
    for (const tc of TEXT_CASES) {
      status.textContent = `Benchmarking '${tc.name}'…`;
      await tick();

      const times: number[] = [];
      for (let i = 0; i < TEXT_WARMUP + TEXT_ITERATIONS; i++) {
        const atlas = new Atlas(ptSerif, { pixelsPerEm: tc.pixelsPerEm, pxrange: tc.pxrange });
        const t0 = performance.now();
        atlas.layoutMultiline(tc.text);
        const dt = performance.now() - t0;
        if (i >= TEXT_WARMUP) times.push(dt);
      }
      const med = median(times);
      const min = Math.min(...times);
      const max = Math.max(...times);

      const row = document.createElement("tr");
      row.innerHTML =
        `<td>${tc.name}</td>` +
        `<td>${med.toFixed(1)}ms</td>` +
        `<td>${min.toFixed(1)}ms</td>` +
        `<td>${max.toFixed(1)}ms</td>` +
        `<td>${uniqueCodepoints(tc.text)}</td>`;
      textTbody.appendChild(row);
    }

    status.textContent = `Done — ${navigator.userAgent}`;
    runButton.disabled = false;
    root.dataset.ready = "true"; // signal for tools/screenshot.ts
  }

  runButton.addEventListener("click", () => void run());
  await run(); // auto-run once on load
}

main().catch((err: unknown) => {
  const root = document.getElementById("root")!;
  root.textContent = `Error: ${String(err)}`;
  root.dataset.ready = "true";
  throw err;
});
