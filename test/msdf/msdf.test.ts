/**
 * Gate 3 — MSDF golden comparison.
 *
 * For every golden fixture in test/golden/:
 *   1. Call the msdfgen reference binary with `msdf -shapedesc shape.txt -scanline`
 *      and the projection params from meta.json → 3-channel FL32.
 *   2. Parse shape.txt → normalizeShape → edgeColoringSimple.
 *   3. generateMSDF → distanceSignCorrection → msdfErrorCorrection.
 *   4. compareBitmaps(ref, ours, width, height, 3): maxAbsDiff <= 1e-4.
 *
 * NEVER modify test/golden/** — only the human regenerates fixtures.
 */

import { readFileSync, readdirSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import { execFileSync } from "child_process";
import { describe, it, expect, beforeAll } from "vitest";
import { generateMSDF } from "../../src/msdf/generate.js";
import { edgeColoringSimple } from "../../src/msdf/edge-coloring.js";
import { distanceSignCorrection, msdfErrorCorrection } from "../../src/msdf/error-correction.js";
import { normalizeShape } from "../../src/shape/normalize.js";
import { parseShapeDesc } from "../utils/shapedesc.js";
import { compareBitmaps, fl32FromBuffer } from "../utils/compare.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GOLDEN_DIR = resolve(__dirname, "../golden");
const BINARY = resolve(__dirname, "../../tools/msdfgen-ref/build/msdfgen");
const TMP_DIR = resolve(tmpdir(), "msdfgen-ts-msdf-test");

// ── Types ────────────────────────────────────────────────────────────────────

interface MsdfFixture {
  fontId: string;
  glyphKey: string;
  width: number;
  height: number;
  pxrange: number;
  scale: number;
  tx: number;
  ty: number;
  shapePath: string;
}

// ── Fixture loading ──────────────────────────────────────────────────────────

function loadFixtures(): MsdfFixture[] {
  const fixtures: MsdfFixture[] = [];

  for (const fontId of readdirSync(GOLDEN_DIR)) {
    const fontDir = resolve(GOLDEN_DIR, fontId);
    let subDirs: string[];
    try {
      subDirs = readdirSync(fontDir);
    } catch {
      continue;
    }

    for (const glyphKey of subDirs) {
      const fixDir = resolve(fontDir, glyphKey);
      const metaPath = resolve(fixDir, "meta.json");
      const shapePath = resolve(fixDir, "shape.txt");
      if (!existsSync(metaPath) || !existsSync(shapePath)) continue;
      if (!/_\d+px$/.test(glyphKey)) continue;

      const meta = JSON.parse(readFileSync(metaPath, "utf8")) as {
        width: number;
        height: number;
        pxrange: number;
        scale: number;
        tx: number;
        ty: number;
      };

      fixtures.push({
        fontId,
        glyphKey,
        width: meta.width,
        height: meta.height,
        pxrange: meta.pxrange,
        scale: meta.scale,
        tx: meta.tx,
        ty: meta.ty,
        shapePath,
      });
    }
  }

  return fixtures;
}

// ── Reference MSDF via binary ─────────────────────────────────────────────────

/**
 * Runs the msdfgen binary with `msdf -shapedesc -scanline` to produce a 3-channel
 * MSDF reference bitmap.
 *
 * @returns Flat Float32Array of length width*height*3 (3 channels, y-up).
 */
function referenceMSDF(
  shapePath: string,
  width: number,
  height: number,
  pxrange: number,
  scale: number,
  tx: number,
  ty: number,
  outPath: string,
): Float32Array {
  execFileSync(
    BINARY,
    [
      "msdf",
      "-shapedesc",
      shapePath,
      "-o",
      outPath,
      "-format",
      "fl32",
      "-dimensions",
      String(width),
      String(height),
      "-pxrange",
      String(pxrange),
      "-scale",
      String(scale),
      "-translate",
      tx.toFixed(6),
      ty.toFixed(6),
      "-scanline",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  const raw = readFileSync(outPath);
  const fl32 = fl32FromBuffer(
    raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer,
  );
  if (fl32.channels !== 3) {
    throw new Error(`Expected 3-channel MSDF output, got ${fl32.channels} channels (${outPath})`);
  }
  return fl32.data;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("generateMSDF — golden comparison", () => {
  beforeAll(() => {
    mkdirSync(TMP_DIR, { recursive: true });
  });

  if (!existsSync(BINARY)) {
    it.skip("msdfgen binary not found — run: npm run setup-reference", () => {});
    return;
  }

  if (!existsSync(GOLDEN_DIR)) {
    it.skip("test/golden/ not found — run: npm run gen-golden", () => {});
    return;
  }

  const fixtures = loadFixtures();
  if (fixtures.length === 0) {
    it.skip("no fixtures found in test/golden/", () => {});
    return;
  }

  for (const fix of fixtures) {
    it(`${fix.fontId}/${fix.glyphKey}`, () => {
      const tmpOut = resolve(TMP_DIR, `${fix.fontId}_${fix.glyphKey}.fl32`);

      let refData: Float32Array;
      try {
        refData = referenceMSDF(
          fix.shapePath,
          fix.width,
          fix.height,
          fix.pxrange,
          fix.scale,
          fix.tx,
          fix.ty,
          tmpOut,
        );
      } finally {
        try {
          unlinkSync(tmpOut);
        } catch {
          /* ignore */
        }
      }

      const shapeText = readFileSync(fix.shapePath, "utf8");
      const { shape, colorsSpecified } = parseShapeDesc(shapeText);
      normalizeShape(shape);
      if (!colorsSpecified) edgeColoringSimple(shape, 3.0, 0n);

      // Use the same 6-decimal tx/ty precision as the C++ reference binary CLI call,
      // so that floating-point coordinates match exactly and edge tiebreakers agree.
      const tx6 = parseFloat(fix.tx.toFixed(6));
      const ty6 = parseFloat(fix.ty.toFixed(6));

      const out = new Float32Array(fix.width * fix.height * 3);
      generateMSDF(shape, fix.width, fix.height, fix.scale, tx6, ty6, fix.pxrange, out);
      distanceSignCorrection(out, shape, fix.width, fix.height, fix.scale, tx6, ty6);
      msdfErrorCorrection(out, shape, fix.width, fix.height, fix.scale, tx6, ty6, fix.pxrange);

      const result = compareBitmaps(refData!, out, fix.width, fix.height, 3);
      if (!result.pass) {
        const t = result.worstTexel;
        expect.fail(
          `[${fix.fontId}/${fix.glyphKey}] maxAbsDiff=${result.maxAbsDiff.toFixed(6)} > 1e-4` +
            (t ? ` worst at (${t.x},${t.y}) ch${t.channel}` : ""),
        );
      }
    });
  }
});
