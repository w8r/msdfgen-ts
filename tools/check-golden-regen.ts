/**
 * tools/check-golden-regen.ts
 *
 * Verifies that freshly regenerated golden fixtures still agree with the
 * committed ones (CI's verify-golden-regen job). Usage:
 *
 *   npx tsx tools/check-golden-regen.ts <committed-golden-dir> <regenerated-golden-dir>
 *
 * - shape.txt: must match exactly. It is the reference's font import +
 *   normalization + edge coloring, all integer-sourced geometry and IEEE
 *   arithmetic (no FMA, see tools/setup-reference.sh) — platform-independent.
 * - bitmap.fl32: must match within the golden tolerance (1e-4), not
 *   byte-for-byte. The committed fixtures are generated on macOS (clang +
 *   Apple libm), CI regenerates on Linux (gcc + glibc), and msdfgen's cubic
 *   solver calls acos/cos, whose last-ulp results differ between libms.
 *   1e-4 is the same tolerance every golden comparison uses, so this still
 *   catches stale fixtures (e.g. the FMA-on bitmaps that were off by up to
 *   5.18) while ignoring libm noise.
 * - meta.json is not compared: it records the generating machine's absolute
 *   paths.
 *
 * Exits non-zero on any missing fixture, shape mismatch, or bitmap outside
 * tolerance.
 */
import { existsSync, readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import { compareBitmaps, fl32FromBuffer, TOLERANCE } from "../test/utils/compare";

const [committedDir, regenDir] = process.argv.slice(2);
if (!committedDir || !regenDir) {
  console.error(
    "Usage: tsx tools/check-golden-regen.ts <committed-golden-dir> <regenerated-golden-dir>",
  );
  process.exit(2);
}

function loadFl32(path: string) {
  const raw = readFileSync(path);
  return fl32FromBuffer(
    raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer,
  );
}

const failures: string[] = [];
let checked = 0;
let worst = 0;

for (const fontId of readdirSync(committedDir)) {
  for (const key of readdirSync(resolve(committedDir, fontId))) {
    const a = resolve(committedDir, fontId, key);
    const b = resolve(regenDir, fontId, key);
    const id = `${fontId}/${key}`;
    if (!existsSync(resolve(a, "bitmap.fl32"))) continue;
    if (!existsSync(resolve(b, "bitmap.fl32"))) {
      failures.push(`${id}: not regenerated`);
      continue;
    }
    if (
      readFileSync(resolve(a, "shape.txt"), "utf8") !==
      readFileSync(resolve(b, "shape.txt"), "utf8")
    ) {
      failures.push(`${id}: shape.txt differs`);
    }
    const ref = loadFl32(resolve(a, "bitmap.fl32"));
    const regen = loadFl32(resolve(b, "bitmap.fl32"));
    if (
      ref.width !== regen.width ||
      ref.height !== regen.height ||
      ref.channels !== regen.channels
    ) {
      failures.push(`${id}: dimensions differ`);
      continue;
    }
    const r = compareBitmaps(ref.data, regen.data, ref.width, ref.height, ref.channels);
    if (r.maxAbsDiff > worst) worst = r.maxAbsDiff;
    if (!r.pass) failures.push(`${id}: bitmap maxAbsDiff ${r.maxAbsDiff} > ${TOLERANCE}`);
    checked++;
  }
}

console.log(`Checked ${checked} fixtures; worst bitmap maxAbsDiff ${worst}.`);
if (checked === 0) failures.push("no fixtures found in committed dir");
if (failures.length > 0) {
  console.error(`FAIL: ${failures.length} problem(s):\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(
  "OK: regenerated fixtures match committed (shape.txt exact, bitmaps within tolerance).",
);
