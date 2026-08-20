/**
 * Structural similarity (SSIM) between two equal-size grayscale images.
 * Windowed box-filter variant (Wang et al. 2004), 8x8 windows, stride 4 —
 * a regression-grade approximation (not perceptual-metric-grade), sufficient
 * for the A/B thresholds `gate:m5` asserts against (0.95 / 0.98).
 *
 * Not a port of any msdfgen C++ code — this is test-only tooling.
 */

const WINDOW = 8;
const STRIDE = 4;
/** Stabilization constants for 8-bit luminance range, per the SSIM paper. */
const C1 = (0.01 * 255) ** 2;
const C2 = (0.03 * 255) ** 2;

/**
 * Converts interleaved RGBA (or opaque RGB with a stride of 4) pixel data
 * to a flat grayscale buffer using ITU-R BT.601 luma weights.
 * @param rgba Interleaved 8-bit pixel data, 4 bytes/pixel.
 * @param width Image width in pixels.
 * @param height Image height in pixels.
 * @returns Flat grayscale buffer, one value per pixel, range [0, 255].
 */
export function rgbaToGray(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
): Float64Array {
  const n = width * height;
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    out[i] = 0.299 * rgba[o]! + 0.587 * rgba[o + 1]! + 0.114 * rgba[o + 2]!;
  }
  return out;
}

/**
 * Mean SSIM over two equal-size grayscale images, computed over 8x8 windows
 * at stride 4 (windows are averaged, not overlapped-and-weighted like the
 * original Gaussian-window formulation — a documented simplification).
 * @param a First grayscale image, row-major, length width*height.
 * @param b Second grayscale image, same shape as `a`.
 * @param width Image width in pixels.
 * @param height Image height in pixels.
 * @returns Mean SSIM in [-1, 1]; 1 = identical.
 */
export function ssim(a: Float64Array, b: Float64Array, width: number, height: number): number {
  if (a.length !== width * height || b.length !== width * height) {
    throw new Error("ssim: buffer length does not match width*height");
  }
  if (width < WINDOW || height < WINDOW) {
    throw new Error(`ssim: image must be at least ${WINDOW}x${WINDOW}`);
  }

  let sum = 0;
  let count = 0;
  for (let wy = 0; wy + WINDOW <= height; wy += STRIDE) {
    for (let wx = 0; wx + WINDOW <= width; wx += STRIDE) {
      sum += _windowSSIM(a, b, width, wx, wy);
      count++;
    }
  }
  return count > 0 ? sum / count : 1;
}

/** SSIM over one WINDOW x WINDOW block starting at (wx, wy). */
function _windowSSIM(
  a: Float64Array,
  b: Float64Array,
  width: number,
  wx: number,
  wy: number,
): number {
  const n = WINDOW * WINDOW;
  let sumA = 0;
  let sumB = 0;
  for (let y = 0; y < WINDOW; y++) {
    const row = (wy + y) * width + wx;
    for (let x = 0; x < WINDOW; x++) {
      sumA += a[row + x]!;
      sumB += b[row + x]!;
    }
  }
  const meanA = sumA / n;
  const meanB = sumB / n;

  let varA = 0;
  let varB = 0;
  let covAB = 0;
  for (let y = 0; y < WINDOW; y++) {
    const row = (wy + y) * width + wx;
    for (let x = 0; x < WINDOW; x++) {
      const da = a[row + x]! - meanA;
      const db = b[row + x]! - meanB;
      varA += da * da;
      varB += db * db;
      covAB += da * db;
    }
  }
  varA /= n - 1;
  varB /= n - 1;
  covAB /= n - 1;

  const numerator = (2 * meanA * meanB + C1) * (2 * covAB + C2);
  const denominator = (meanA * meanA + meanB * meanB + C1) * (varA + varB + C2);
  return numerator / denominator;
}
