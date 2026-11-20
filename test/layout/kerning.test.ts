/**
 * Kerning parity with Chrome.
 *
 * (1) Live: every font in the corpus lays out a text containing EVERY
 *     ordered pair of the characters it covers (Latin, Latin-1, Latin
 *     Extended-A, Greek, Cyrillic, punctuation, Unicode spaces), plus
 *     mixed-script and edge-case strings. Chrome lays out the same text in
 *     the DOM, and the caret position of every character must match ours.
 *     Chrome shapes with HarfBuzz, so this checks the whole chain this
 *     library ports: Blink's script runs, GPOS (or the legacy `kern` table)
 *     and HarfBuzz's handling of default ignorables and missing spaces.
 *
 *     Font size = unitsPerEm px, so 1 px = 1 font unit, and Chrome's layout
 *     units are 1/64 px: positions must agree to POSITION_TOLERANCE (a single
 *     kern value is at least 1 unit). Carets are compared (cumulative
 *     advances), because that is what the DOM exposes; for the legacy `kern`
 *     table HarfBuzz puts half of each kern into the second glyph's offset
 *     (caret halfway, drawing unchanged), and we must match that split too.
 *     Ligatures are off on Chrome's side (`font-variant-ligatures: none`):
 *     GSUB is not implemented yet. `lang="en"` keeps the machine's locale out
 *     of it (a French locale makes Chrome apply Roboto's FRA `locl` GSUB).
 *
 * (2) Offline: a handful of Chrome-measured values for the behaviours (1)
 *     covers, runnable without a browser.
 *
 * Browser: Playwright's full Chromium (not its headless shell, which rounds
 * advances to whole pixels on Linux), else the installed Google Chrome; without
 * either, (1) is skipped with a loud warning (and fails under CI).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { chromium, type Browser } from "playwright";
import { Atlas, Font } from "../../src/index";
import { shapeText } from "../../src/font/shaper";
import { run } from "../../src/font/glyph-run";

const FONTS_DIR = resolve(__dirname, "../fonts");
const FONTS = [
  "Roboto.ttf",
  "NotoSans.ttf",
  "PTSerif-Regular.ttf",
  "PTSerif-Bold.ttf",
  "Arvo-Regular.ttf",
];
/** Font units; Chrome positions are multiples of 1/64. */
const POSITION_TOLERANCE = 1 / 16;
/**
 * Characters per DOM line (consecutive lines overlap by one, so no pair is lost).
 * Short, because Chrome on Linux measures each advance of a 1000-unit font
 * ~1/800 px short at this size (Skia's FreeType metrics, a fixed-point scale;
 * macOS and 2048-unit fonts are exact): over 24 characters that stays under
 * 0.05 px, inside POSITION_TOLERANCE, where 96 drifted 5/64 px past it.
 */
const LINE_LENGTH = 24;

const RANGES: [number, number][] = [
  [0x20, 0x7e],
  [0xa1, 0xff],
  [0x100, 0x17f],
  [0x391, 0x3c9],
  [0x400, 0x45f],
  [0x2000, 0x200a],
  [0x2013, 0x2014],
  [0x2018, 0x201e],
  [0x2026, 0x2026],
  [0x202f, 0x202f],
  [0x205f, 0x205f],
  [0x20ac, 0x20ac],
  [0x2116, 0x2116],
];

/** Spaces HarfBuzz draws with the U+0020 glyph when the font lacks them. */
const isFallbackSpace = (c: number): boolean =>
  (c >= 0x2000 && c <= 0x200a) || c === 0x202f || c === 0x205f;

/** Mixed scripts, brackets, quotes, default ignorables, spaces. */
const EXTRA = [
  "Hello Привет 123 @#&",
  'Т "T"',
  "Т(Ty)",
  "(Т)T",
  "AVA",
  "To Tо Тo То",
  "1T T1",
  "«Т» „T“",
  "Привет (Hello) мир",
  "a(b[c{d}e]f)g",
  "Т (Ty) Ту",
  "T·Т Т·T П·",
  "(((Т)))T",
  "A­V A​V A⁠V T﻿o",
  "A‌V T‌o",
  "T A A V",
  "x x V A T A V A 1 T Y A Y A Y A",
  "12\u202f345,67", // U+202F alone sets the run's script (Mongolian)
  "\u00ab\u202fTo\u202f\u00bb ,\u202f.",
];

function loadFont(file: string): { font: Font; bytes: Buffer } {
  const bytes = readFileSync(resolve(FONTS_DIR, file));
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  return { font: new Font(buf as ArrayBuffer), bytes };
}

/** The corpus characters `font` can draw (or HarfBuzz substitutes). */
function corpus(font: Font): number[] {
  const out: number[] = [];
  for (const [a, b] of RANGES) {
    for (let c = a; c <= b; c++) {
      if (c === 0xad || /\p{Mn}|\p{Cc}|\p{Cf}/u.test(String.fromCodePoint(c))) continue;
      if (font.glyphId(c) || isFallbackSpace(c)) out.push(c);
    }
  }
  return out;
}

/** A sequence containing every ordered pair of `sym` (Eulerian circuit). */
function allPairs(sym: number[]): number[] {
  const n = sym.length;
  const next = new Int32Array(n);
  const stack = [0];
  const path: number[] = [];
  while (stack.length) {
    const v = stack[stack.length - 1]!;
    if (next[v]! < n) stack.push(next[v]!++);
    else path.push(stack.pop()!);
  }
  return path.reverse().map((i) => sym[i]!);
}

/** Our caret positions (cumulative advances) plus the total, font units. */
function ourCarets(font: Font, text: string): number[] {
  const n = shapeText(font, text);
  const out: number[] = [];
  let pen = 0;
  for (let i = 0; i < n; i++) {
    out.push(pen);
    pen += run._xa[i]!;
  }
  out.push(pen);
  return out;
}

/** Chrome's caret positions of every character, plus the text width (px). */
async function chromeCarets(
  browser: Browser,
  bytes: Buffer,
  upem: number,
  texts: string[],
): Promise<number[][]> {
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  const result = await page.evaluate(
    async ({ b64, upem, texts }) => {
      const data = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const face = new FontFace("KerningTest", data.buffer);
      await face.load();
      document.fonts.add(face);
      const out: number[][] = [];
      for (const text of texts) {
        const div = document.createElement("div");
        div.lang = "en";
        div.style.cssText =
          `font-family:KerningTest;font-size:${upem}px;white-space:pre;position:absolute;` +
          "left:0;top:0;font-variant-ligatures:none;";
        div.textContent = text;
        document.body.appendChild(div);
        const node = div.firstChild!;
        const range = document.createRange();
        const left = div.getBoundingClientRect().left;
        const xs: number[] = [];
        let i = 0;
        for (const ch of text) {
          range.setStart(node, i);
          range.setEnd(node, i + ch.length);
          xs.push(range.getBoundingClientRect().left - left);
          i += ch.length;
        }
        range.setStart(node, 0);
        range.setEnd(node, text.length);
        xs.push(range.getBoundingClientRect().width);
        out.push(xs);
        div.remove();
      }
      return out;
    },
    { b64: bytes.toString("base64"), upem, texts },
  );
  await context.close();
  return result;
}

/**
 * Playwright's full Chromium, else Google Chrome, else null (loud; fails under CI).
 *
 * Not `chromium.launch()`'s default headless shell: on Linux it lays text out
 * without subpixel positioning, rounding every glyph advance to a whole pixel
 * (Roboto's U+205F is 4/18 em = 455.11 units; the shell says 455, full
 * Chromium 455.125). That is the screen's pixel grid, not the font's layout.
 */
async function launchOrSkip(): Promise<Browser | null> {
  try {
    return await chromium.launch({ channel: "chromium" });
  } catch {
    try {
      return await chromium.launch({ channel: "chrome" });
    } catch (err) {
      if (process.env.CI) throw err;
      console.warn(
        "\n⚠️  test/layout/kerning.test.ts: Chrome parity SKIPPED — no Chromium or Chrome " +
          `(${(err as Error).message.split("\n")[0]}).\n` +
          "   Run `npm run screenshot:setup` to install it. This check did NOT run.\n",
      );
      return null;
    }
  }
}

describe("kerning: parity with Chrome (live)", () => {
  it("every corpus pair, mixed scripts and edge cases land where Chrome puts them", async () => {
    const browser = await launchOrSkip();
    if (!browser) return;
    // Every font is checked before failing, so one run reports all of them.
    const failures: string[] = [];
    try {
      for (const file of FONTS) {
        const { font, bytes } = loadFont(file);
        const upem = font.metrics.unitsPerEm;
        const sym = corpus(font);
        const seq = allPairs(sym);
        const texts: string[] = [];
        for (let i = 0; i + 1 < seq.length; i += LINE_LENGTH - 1) {
          texts.push(String.fromCodePoint(...seq.slice(i, i + LINE_LENGTH)));
        }
        const covered = new Set(sym);
        for (const text of EXTRA) {
          // Chrome draws characters the font lacks with a fallback font.
          const ok = [...text].every((ch) => {
            const c = ch.codePointAt(0)!;
            return covered.has(c) || font.glyphId(c) || /\p{Cf}/u.test(ch);
          });
          if (ok) texts.push(text);
        }
        const chrome = await chromeCarets(browser, bytes, upem, texts);
        let compared = 0;
        let differ = 0;
        texts.forEach((text, t) => {
          const chars = [...text];
          const ours = ourCarets(font, text);
          const theirs = chrome[t]!;
          for (let i = 0; i < theirs.length; i++) {
            // Chrome attributes a cluster's width to its last character:
            // compare where clusters start (and the total width).
            if (i < chars.length && /\p{Grapheme_Extend}/u.test(chars[i]!)) continue;
            compared++;
            const d = ours[i]! - theirs[i]!;
            if (Math.abs(d) > POSITION_TOLERANCE && differ++ < 10) {
              const at = JSON.stringify(chars.slice(Math.max(0, i - 2), i + 1).join(""));
              failures.push(
                `${file} line ${t} char ${i} ${at}: ours ${ours[i]} vs Chrome ${theirs[i]}`,
              );
            }
          }
        });
        if (differ > 10) failures.push(`${file}: ${differ - 10} more positions differ`);
        expect(compared, file).toBeGreaterThan(sym.length * sym.length);
      }
    } finally {
      await browser.close();
    }
    expect(failures, "positions differ from Chrome").toEqual([]);
  }, 180_000);
});

describe("kerning: Chrome-measured behaviours (offline)", () => {
  const roboto = loadFont("Roboto.ttf").font;
  const noto = loadFont("NotoSans.ttf").font;
  const ptSerif = loadFont("PTSerif-Regular.ttf").font;
  const arvo = loadFont("Arvo-Regular.ttf").font;

  it("kerns GPOS-only fonts (Roboto, Noto Sans) — the legacy table is absent", () => {
    expect(ourCarets(roboto, "AVA")).toEqual([0, 1249, 2478, 3814]);
    expect(ourCarets(roboto, "To")).toEqual([0, 1123, 2291]);
    expect(ourCarets(roboto, "Привет")).toEqual([0, 1461, 2611, 3793, 4964, 6039, 7024]);
    const a = noto.glyphId(0x41);
    const v = noto.glyphId(0x56);
    expect(noto.kerning(a, v)).toBeLessThan(0);
  });

  it("kerns through GPOS when the font also has a legacy kern table (PT Serif)", () => {
    expect(ourCarets(ptSerif, "AV")).toEqual([0, 580, 1264]);
    expect(ourCarets(ptSerif, "ДУ")).toEqual([0, 661, 1321]);
    expect(ptSerif.kerning(ptSerif.glyphId(0x2a), ptSerif.glyphId(0x41))).toBe(-49); // *A
    // After a Cyrillic letter, "*" belongs to the Cyrillic run: no kern with the Latin A.
    expect(ourCarets(ptSerif, "Z*A")).toEqual([0, 610, 1026, 1709]);
    expect(ourCarets(ptSerif, "Я*A")).toEqual([0, 636, 1101, 1784]);
  });

  it("splits legacy kern-table values half/half like HarfBuzz (Arvo)", () => {
    // Caret halfway (as Chrome's DOM reports it), drawing position unchanged.
    expect(ourCarets(arvo, "AV")).toEqual([0, 1491, 2925]);
    const atlas = new Atlas(arvo, { pixelsPerEm: 8, pxrange: 2 });
    const { glyphs, widthEm } = atlas.layout("AV");
    expect(glyphs[1]!.penX * 2048).toBeCloseTo(1542 - 102, 9);
    expect(widthEm * 2048).toBeCloseTo(2925, 9);
  });

  it("skips the legacy kern table where HarfBuzz's run shaper does (Arvo)", () => {
    // U+202F's Script_Extensions are Latin, Mongolian, Phags-pa: with no letter
    // to settle it the run is Mongolian, which HarfBuzz shapes with the Universal
    // Shaping Engine (Arvo has no GSUB script sending it back to the default
    // shaper), and that shaper never applies `kern` (comma + U+202F is −236 there).
    expect(ourCarets(arvo, ",\u202f")).toEqual([0, 569, 793]);
    expect(ourCarets(arvo, "x,\u202f")).toEqual([0, 1090, 1541, 1647]); // Latin run: kerned
    // PT Serif's GSUB lists `latn`, so the same run keeps the default shaper.
    expect(ourCarets(ptSerif, ",\u202f")).toEqual([0, 243, 364.5]);
  });

  it("never kerns across a script change; Common characters join their neighbours' run", () => {
    expect(ourCarets(roboto, "Tо")).toEqual([0, 1222, 2390]); // Latin T + Cyrillic о
    expect(ourCarets(roboto, "Тo")).toEqual([0, 1222, 2390]); // Cyrillic Т + Latin o
    expect(ourCarets(roboto, "То")).toEqual([0, 1123, 2291]); // both Cyrillic
    // The space joins the Cyrillic run, so Т+space is kerned; " and T are not.
    expect(ourCarets(roboto, 'Т "T"')).toEqual([0, 1182, 1690, 2346, 3568, 4224]);
  });

  it("skips default ignorables but not ZWNJ, and hides both", () => {
    expect(ourCarets(roboto, "A­V")).toEqual([0, 1249, 1249, 2553]);
    expect(ourCarets(roboto, "A​V")).toEqual([0, 1249, 1249, 2553]);
    expect(ourCarets(roboto, "A‌V")).toEqual([0, 1336, 1336, 2640]);
  });

  it("draws spaces the font lacks as its space glyph, HarfBuzz widths, kerned as a space", () => {
    expect(ourCarets(ptSerif, " ")).toEqual([0, 200]);
    expect(ourCarets(ptSerif, "V A")).toEqual([0, 655, 836, 1519]);
    expect(ourCarets(roboto, " ")).toEqual([0, 254]);
    expect(ourCarets(roboto, " ")[1]).toBeCloseTo((2048 * 4) / 18, 9);
  });
});
