/**
 * tools/gen-golden.ts
 *
 * Downloads corpus fonts and generates msdfgen golden fixtures.
 * Output: test/golden/<fontId>/<key>/bitmap.fl32 + meta.json + shape.txt
 *
 * Prerequisites:
 *   bash tools/setup-reference.sh   (builds the msdfgen binary)
 *
 * Fonts are downloaded once to test/fonts/ and committed to the repo.
 * Re-run this only when you intentionally want to regenerate fixtures
 * (bump the corpus or the pinned msdfgen commit).
 *
 * DO NOT run this from CI for normal gate checks — fixtures are committed.
 */

import { execFileSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, relative, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FONTS_DIR = resolve(ROOT, "test/fonts");
const GOLDEN_DIR = resolve(ROOT, "test/golden");
const BINARY = resolve(__dirname, "msdfgen-ref/build/msdfgen");

// ── corpus configuration ─────────────────────────────────────────────────────

type FontType = "text" | "icon";

interface CorpusFont {
  id: string;
  file: string;
  type: FontType;
  url: string;
  /** Zip release: the TTF inside it to extract. */
  zipEntry?: string;
}

/** Text + icon fonts to generate fixtures for. */
const FONTS: CorpusFont[] = [
  {
    id: "roboto",
    file: "Roboto.ttf",
    type: "text",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/Roboto%5Bwdth%2Cwght%5D.ttf",
  },
  {
    id: "notosans",
    file: "NotoSans.ttf",
    type: "text",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/NotoSans%5Bwdth%2Cwght%5D.ttf",
  },
  {
    id: "ptserif",
    file: "PTSerif-Regular.ttf",
    type: "text",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/ptserif/PT_Serif-Web-Regular.ttf",
  },
  {
    id: "lucide",
    file: "Lucide.ttf",
    type: "icon",
    url: "https://github.com/lucide-icons/lucide/releases/download/1.24.0/lucide-font-1.24.0.zip",
    zipEntry: "lucide.ttf",
  },
];

/**
 * Unique codepoints sampled from two pangrams + digits + punctuation + diacritics.
 *
 * English pangram "The quick brown fox jumps over the lazy dog." covers all 26
 * Latin letters. Russian pangram adds Cyrillic coverage.  Diacritics exercise
 * composite-glyph resolution (needed for M1 parser gate).
 */
const TEXT_CODEPOINTS = [
  ...new Set(
    [
      // English pangram — all 26 lowercase + uppercase + space + punctuation
      ..."The quick brown fox jumps over the lazy dog.",
      ..."THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
      // Digits
      ..."0123456789",
      // Common punctuation
      ..."!?,.:;()@#&-'\"",
      // Russian pangram — broad Cyrillic coverage
      ..."Привет, мир! Съешь же ещё этих мягких французских булок, да выпей чаю.",
      ..."ПРИВЕТ МИР СЪЕШЬ ЕЩЁ",
      // Basic Latin diacritics — exercise composite glyphs in M1
      ..."àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ",
      ..."ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ",
    ].map((c) => c.codePointAt(0) ?? 0),
  ),
].filter((cp) => cp > 32); // drop control chars + space

/** Bitmap sizes (pixels) to generate for each glyph. */
const SIZES = [32, 48];

/** Pixel range (pxrange) passed to msdfgen. */
const PXRANGE = 4;

/**
 * Number of icon-font glyph indices (1-based) to sample.
 * We use glyph-index mode (`g<n>`) since icon font PUA codepoints vary by version.
 */
const ICON_GLYPH_COUNT = 30;

// ── parameter helpers ─────────────────────────────────────────────────────────

/**
 * Returns the msdfgen -scale and -translate values for a given bitmap size.
 *
 * All fonts use -emnormalize, so shape coordinates are in em units [0, 1].
 *
 * For text fonts the em-box baseline sits at translate_y so that:
 *   - pxrange pixels of padding exist below the descender (~0.25 em below baseline)
 *   - pxrange pixels of padding exist above the ascender (~0.75 em above baseline)
 *
 * For icon fonts the entire em-box is the glyph, so equal padding on all sides.
 *
 * @param size - Bitmap size in pixels.
 * @param type - Font type.
 */
function getParams(size: number, type: FontType): { scale: number; tx: number; ty: number } {
  // scale such that 1 em = (size - 2*pxrange) pixels
  const scale = size - 2 * PXRANGE;
  if (type === "icon") {
    const t = PXRANGE / scale;
    return { scale, tx: t, ty: t };
  }
  // text: baseline must be above the bottom pxrange margin AND the descender depth
  // typical descender ≈ 0.25 em below baseline → need at least 0.25 + pxrange/scale em from bottom
  const ty = PXRANGE / scale + 0.25;
  const tx = PXRANGE / scale;
  return { scale, tx, ty };
}

// ── download helpers ──────────────────────────────────────────────────────────

/** Fetches a URL to a local path using the built-in fetch API (Node 18+). */
async function download(url: string, dest: string): Promise<void> {
  console.log(`  Downloading ${url} → ${dest}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const buf = await res.arrayBuffer();
  writeFileSync(dest, Buffer.from(buf));
}

/**
 * Downloads and extracts a single TTF file from a zip archive.
 * Uses the system `unzip` command (available on macOS and Ubuntu by default).
 *
 * @param zipUrl  - URL of the zip file.
 * @param entry   - Path inside the zip to extract (e.g. "lucide.ttf").
 * @param destTtf - Where to write the extracted TTF.
 */
async function downloadFromZip(zipUrl: string, entry: string, destTtf: string): Promise<void> {
  const zipPath = `${destTtf}.download.zip`;
  await download(zipUrl, zipPath);

  // List contents to find the actual entry path (handles subdirectory prefixes).
  let actualEntry = entry;
  try {
    const listing = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" });
    const lines = listing
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const match = lines.find((l) => l.endsWith(`/${entry}`) || l === entry);
    if (match) actualEntry = match;
  } catch {
    // fall through to the known entry name
  }

  console.log(`  Extracting ${actualEntry} from zip...`);
  const extracted = execFileSync("unzip", ["-p", zipPath, actualEntry]);
  writeFileSync(destTtf, extracted);

  // Clean up the zip.
  try {
    execFileSync("rm", [zipPath]);
  } catch {
    /* ignore */
  }
}

// ── msdfgen invocation ────────────────────────────────────────────────────────

interface FixtureJob {
  /** Absolute path to the TTF. */
  fontPath: string;
  /** Codepoint (number) or `g<index>` string for glyph-index mode. */
  charSpec: string | number;
  /** Bitmap dimension (square). */
  size: number;
  /** Pixel range. */
  pxrange: number;
  /** Shape-units-to-pixels scale (em-normalised). */
  scale: number;
  /** X translate in em units. */
  tx: number;
  /** Y translate in em units. */
  ty: number;
  /** Directory to write bitmap.fl32, meta.json, shape.txt. */
  outDir: string;
}

/** Runs msdfgen to produce a single fixture. Returns false if the glyph doesn't exist. */
function runMsdfgen({
  fontPath,
  charSpec,
  size,
  pxrange,
  scale,
  tx,
  ty,
  outDir,
}: FixtureJob): boolean {
  mkdirSync(outDir, { recursive: true });
  const bitmapPath = resolve(outDir, "bitmap.fl32");
  const shapePath = resolve(outDir, "shape.txt");

  // charSpec is either a decimal codepoint or a "g<index>" string.
  const charArg = String(charSpec);

  // Paths are passed (and recorded in meta.json) relative to the repo root,
  // with the binary run from there — committed fixtures must not embed the
  // generating machine's absolute paths, and `cli` stays runnable from ROOT.
  const rel = (p: string): string => relative(ROOT, p);

  const args = [
    "msdf",
    "-font",
    rel(fontPath),
    charArg,
    "-o",
    rel(bitmapPath),
    "-format",
    "fl32",
    "-dimensions",
    String(size),
    String(size),
    "-pxrange",
    String(pxrange),
    "-scale",
    String(scale),
    "-translate",
    String(tx.toFixed(6)),
    String(ty.toFixed(6)),
    "-emnormalize",
    "-exportshape",
    rel(shapePath),
    "-scanline", // non-Skia scanline sign correction (matches our future port)
  ];

  try {
    execFileSync(BINARY, args, { cwd: ROOT, stdio: ["ignore", "ignore", "pipe"] });
  } catch (err) {
    // msdfgen exits non-zero for glyphs not in the font — skip silently.
    const stderr = (err as { stderr?: Buffer }).stderr?.toString() ?? "";
    if (stderr.includes("no glyph") || stderr.includes("not found") || stderr.includes("missing")) {
      return false;
    }
    throw err;
  }

  // Write metadata alongside the bitmap so diff.test.ts can read dimensions.
  const meta = {
    font: rel(fontPath),
    charSpec: charArg,
    size,
    width: size,
    height: size,
    channels: 3,
    pxrange,
    scale,
    tx,
    ty,
    cli: [rel(BINARY), ...args].join(" "),
  };
  writeFileSync(resolve(outDir, "meta.json"), JSON.stringify(meta, null, 2));
  return true;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!existsSync(BINARY)) {
    console.error(`msdfgen binary not found at:\n  ${BINARY}\nRun: bash tools/setup-reference.sh`);
    process.exit(1);
  }

  mkdirSync(FONTS_DIR, { recursive: true });
  mkdirSync(GOLDEN_DIR, { recursive: true });

  // ── download fonts ────────────────────────────────────────────────────────
  console.log("\n=== Downloading fonts ===");
  for (const font of FONTS) {
    const dest = resolve(FONTS_DIR, font.file);
    if (existsSync(dest)) {
      console.log(`  ${font.file} already present — skipping download.`);
      continue;
    }
    if (font.zipEntry) {
      await downloadFromZip(font.url, font.zipEntry, dest);
    } else {
      await download(font.url, dest);
    }
  }

  // ── generate fixtures ─────────────────────────────────────────────────────
  console.log("\n=== Generating fixtures ===");
  let total = 0;
  let skipped = 0;

  for (const font of FONTS) {
    const fontPath = resolve(FONTS_DIR, font.file);
    if (!existsSync(fontPath)) {
      console.warn(`  WARN: ${font.file} missing, skipping.`);
      continue;
    }

    const codepoints =
      font.type === "icon"
        ? Array.from({ length: ICON_GLYPH_COUNT }, (_, i) => `g${i + 1}`)
        : TEXT_CODEPOINTS;

    for (const charSpec of codepoints) {
      for (const size of SIZES) {
        const { scale, tx, ty } = getParams(size, font.type);
        // Key: for text fonts use 'U+<hex>'; for icons use 'g<index>'.
        const key =
          typeof charSpec === "number"
            ? `U${charSpec.toString(16).padStart(4, "0").toUpperCase()}_${size}px`
            : `${charSpec}_${size}px`;
        const outDir = resolve(GOLDEN_DIR, font.id, key);

        if (existsSync(resolve(outDir, "bitmap.fl32"))) {
          skipped++;
          continue;
        }

        const ok = runMsdfgen({
          fontPath,
          charSpec,
          size,
          pxrange: PXRANGE,
          scale,
          tx,
          ty,
          outDir,
        });
        if (ok) total++;
      }
    }
    console.log(`  ${font.id}: done`);
  }

  console.log(`\nDone. Generated ${total} fixtures, skipped ${skipped} existing.`);
  console.log(`Fixtures in: ${GOLDEN_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
