/**
 * Diagnostic (non-gating) text-layout benchmark: font load time, warm
 * `Atlas.layout` throughput (every glyph already generated, so only layout +
 * kerning is timed) and `Font.kerning` pair lookups, per corpus font.
 *
 * Public API only, so the same script measures any revision of the library —
 * run it before and after a layout change and compare.
 *
 * Usage: npx tsx tools/bench-layout.ts
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Font } from "../src/font/font";
import { Atlas } from "../src/atlas-gen";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS = ["Roboto.ttf", "NotoSans.ttf", "PTSerif-Regular.ttf", "Arvo-Regular.ttf"];

const LATIN =
  'AVATAR Type, Wolf. Tr. Yo. LT VA "quoted" (paren) The quick brown fox jumps over the lazy dog. ';
const CYRILLIC = "Съешь же ещё этих мягких французских булок, да выпей чаю. ТУРБО Привет ";
const PARAGRAPH_REPEATS = 24; // ~4000 characters

function load(file: string): ArrayBuffer {
  const b = readFileSync(resolve(__dirname, "../test/fonts", file));
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

/** Best (lowest) of 7 rounds' median of `runs` timings of `fn`, after
 *  `warmup` untimed calls, in ms — the min filters out machine noise. */
function time(fn: () => void, runs: number, warmup: number): number {
  for (let i = 0; i < warmup; i++) fn();
  let best = Infinity;
  for (let round = 0; round < 7; round++) {
    const t: number[] = [];
    for (let i = 0; i < runs; i++) {
      const t0 = performance.now();
      fn();
      t.push(performance.now() - t0);
    }
    best = Math.min(best, median(t));
  }
  return best;
}

let sink = 0;
console.log("font                 load ms   layout ns/char   kerning() ns/pair   width em");
for (const file of FONTS) {
  const buf = load(file);
  const loadMs = time(() => void new Font(buf), 40, 10);

  const font = new Font(buf);
  // Arvo has no Cyrillic: lay out only what the font covers.
  const hasCyrillic = font.glyphId(0x0416) !== 0;
  const paragraph = (LATIN + (hasCyrillic ? CYRILLIC : "")).repeat(PARAGRAPH_REPEATS);
  const chars = [...paragraph].length;
  const atlas = new Atlas(font, { pixelsPerEm: 8, pxrange: 2 });
  const width = atlas.layout(paragraph).widthEm; // generates + packs every glyph once
  const layoutMs = time(() => void (sink += atlas.layout(paragraph).widthEm), 60, 20);

  const gids = [...paragraph].map((ch) => font.glyphId(ch.codePointAt(0)!));
  const PAIRS = 200_000;
  const kernMs = time(
    () => {
      for (let i = 0; i < PAIRS; i++) {
        sink += font.kerning(gids[i % (gids.length - 1)]!, gids[(i % (gids.length - 1)) + 1]!);
      }
    },
    15,
    5,
  );

  console.log(
    `${file.padEnd(20)} ${loadMs.toFixed(3).padStart(7)}   ${((layoutMs * 1e6) / chars)
      .toFixed(1)
      .padStart(14)}   ${((kernMs * 1e6) / PAIRS).toFixed(1).padStart(17)}   ${width.toFixed(3)}`,
  );
}
if (sink === 42) console.log(""); // keep results observable
