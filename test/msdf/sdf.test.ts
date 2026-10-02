/**
 * Gate 2b — single-channel SDF golden comparison.
 *
 * For every golden fixture in test/golden/:
 *   1. Call the msdfgen reference binary: `sdf -shapedesc shape.txt`
 *      with the same projection params from meta.json → 1-channel FL32.
 *   2. Parse shape.txt via parseShapeDesc + normalizeShape.
 *   3. Call our generateSDF(shape, params, out).
 *   4. compareBitmaps(ref, ours, width, height, 1): maxAbsDiff <= 1e-4.
 *
 * The shapedesc approach isolates the SDF algorithm from font-parsing
 * differences: the shape is exactly what the reference uses.
 *
 * NEVER modify test/golden/** — only the human regenerates fixtures.
 */

import { readFileSync, readdirSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import { execFileSync } from "child_process";
import { describe, it, expect, beforeAll } from "vitest";
import { generateSDF } from "../../src/msdf/sdf";
import { normalizeShape } from "../../src/shape/normalize";
import { parseShapeDesc } from "../utils/shapedesc";
import { compareBitmaps, fl32FromBuffer } from "../utils/compare";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GOLDEN_DIR = resolve(__dirname, "../golden");
const BINARY = resolve(__dirname, "../../tools/msdfgen-ref/build/msdfgen");
const TMP_DIR = resolve(tmpdir(), "msdfgen-ts-sdf-test");

// ── Types ────────────────────────────────────────────────────────────────────

interface SdfFixture {
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

function loadFixtures(): SdfFixture[] {
  const fixtures: SdfFixture[] = [];

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

      // Extract size from dir name, e.g. "U0021_32px" or "g1_32px".
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

// ── Reference SDF via binary ─────────────────────────────────────────────────

/**
 * Runs the msdfgen binary with `sdf -shapedesc` to produce a 1-channel SDF
 * reference bitmap.  The shape file is already em-normalized (exported by
 * gen-golden), so no -emnormalize flag is needed.
 *
 * @returns Flat Float32Array of length width*height (1 channel, y-up).
 */
function referenceSDFFromShapeDesc(
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
      "sdf",
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
  if (fl32.channels !== 1) {
    throw new Error(`Expected 1-channel SDF output, got ${fl32.channels} channels (${outPath})`);
  }
  return fl32.data;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("generateSDF — golden comparison", () => {
  beforeAll(() => {
    mkdirSync(TMP_DIR, { recursive: true });
  });

  if (!existsSync(BINARY)) {
    // CI builds the binary (see .github/workflows/ci.yml's gate job) — a
    // missing binary there is a broken pipeline, not a reason to skip.
    if (process.env.CI) {
      it("msdfgen binary present in CI", () => {
        expect.fail(`msdfgen binary not found at ${BINARY} — CI must run tools/setup-reference.sh`);
      });
      return;
    }
    it.skip("msdfgen binary not found — run: npm run setup-reference", () => {});
    // eslint-disable-next-line no-useless-return
    return;
  }

  if (!existsSync(GOLDEN_DIR)) {
    it.skip("test/golden/ not found — run: npm run gen-golden", () => {});
    // eslint-disable-next-line no-useless-return
    return;
  }

  const fixtures = loadFixtures();
  if (fixtures.length === 0) {
    it.skip("no fixtures found in test/golden/", () => {});
    // eslint-disable-next-line no-useless-return
    return;
  }

  for (const fix of fixtures) {
    it(`${fix.fontId}/${fix.glyphKey}`, () => {
      const tmpOut = resolve(TMP_DIR, `${fix.fontId}_${fix.glyphKey}.fl32`);

      let refData: Float32Array;
      try {
        refData = referenceSDFFromShapeDesc(
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
          /* ignore — file may not exist if binary failed */
        }
      }

      // Parse shape from shapedesc (already em-normalized) and normalize.
      const shapeText = readFileSync(fix.shapePath, "utf8");
      const { shape } = parseShapeDesc(shapeText);
      normalizeShape(shape);

      // Generate our SDF.
      const out = new Float32Array(fix.width * fix.height);
      generateSDF(
        shape,
        {
          width: fix.width,
          height: fix.height,
          scale: fix.scale,
          tx: fix.tx,
          ty: fix.ty,
          pxrange: fix.pxrange,
        },
        out,
      );

      const result = compareBitmaps(refData!, out, fix.width, fix.height, 1);
      if (!result.pass) {
        const t = result.worstTexel;
        expect.fail(
          `maxAbsDiff=${result.maxAbsDiff.toExponential(3)} ` +
            `at texel (${t?.x ?? "?"},${t?.y ?? "?"}) — tolerance 1e-4`,
        );
      }
      expect(result.pass).toBe(true);
    });
  }
});
