// Exact fma(x,y,z) = round_to_double(x*y + z), single rounding.
// Implemented via BigInt on the exact bit expansions.
function decompose(d: number): { neg: boolean; mant: bigint; exp: number } {
  const buf = new ArrayBuffer(8);
  new Float64Array(buf)[0] = d;
  const bits = new BigUint64Array(buf)[0]!;
  const neg = (bits >> 63n) === 1n;
  const rawExp = Number((bits >> 52n) & 0x7ffn);
  const rawMant = bits & 0xfffffffffffffn;
  if (rawExp === 0) {
    // subnormal
    return { neg, mant: rawMant, exp: -1074 };
  }
  return { neg, mant: rawMant | 0x10000000000000n, exp: rawExp - 1075 };
}

// exact value of a double as (sign * mant * 2^exp) with integer mant
function toExact(d: number): { sign: bigint; num: bigint; exp: number } {
  if (d === 0) return { sign: 0n, num: 0n, exp: 0 };
  const { neg, mant, exp } = decompose(d);
  return { sign: neg ? -1n : 1n, num: mant, exp };
}

// Round an exact rational value (n / 2^s) to nearest double (ties to even).
function roundToDouble(sign: bigint, n: bigint, s: number): number {
  if (n === 0n) return 0;
  // normalize so that n has 53 bits: find bit length
  let bl = n.toString(2).length;
  // We want mantissa with 53 bits. Represent value = n * 2^(-s).
  // Find exponent e such that mantissa in [2^52, 2^53).
  let shift = bl - 53;
  let mant: bigint;
  let exp2 = -s + shift;
  if (shift > 0) {
    const rem = n & ((1n << BigInt(shift)) - 1n);
    mant = n >> BigInt(shift);
    const half = 1n << BigInt(shift - 1);
    if (rem > half || (rem === half && (mant & 1n) === 1n)) {
      mant += 1n;
      if (mant >= (1n << 53n)) { mant >>= 1n; exp2 += 1; }
    }
  } else {
    mant = n << BigInt(-shift);
  }
  const val = Number(mant) * 2 ** exp2;
  return sign < 0n ? -val : val;
}

function fma(x: number, y: number, z: number): number {
  const ax = toExact(x), ay = toExact(y), az = toExact(z);
  // product x*y = (ax.sign*ay.sign) * (ax.num*ay.num) * 2^(ax.exp+ay.exp)
  const psign = ax.sign * ay.sign;
  const pnum = ax.num * ay.num;
  const pexp = ax.exp + ay.exp;
  // add z: bring to common exponent
  let sign: bigint, num: bigint, exp: number;
  if (az.num === 0n) {
    sign = psign; num = pnum; exp = pexp;
  } else {
    const commonExp = Math.min(pexp, az.exp);
    const pShifted = (psign < 0n ? -pnum : pnum) << BigInt(pexp - commonExp);
    const zShifted = (az.sign < 0n ? -az.num : az.num) << BigInt(az.exp - commonExp);
    let sum = pShifted + zShifted;
    exp = commonExp;
    if (sum === 0n) return 0;
    sign = sum < 0n ? -1n : 1n;
    num = sum < 0n ? -sum : sum;
  }
  return roundToDouble(sign, num, -exp);
}

const inv = 1 / 1000;
const p0x = 43 * inv, p0y = 450 * inv;
const p1x = 29 * inv, p1y = 455 * inv;
const p2x = 15 * inv, p2y = 460 * inv;
const ax = p1x - p0x, ay = p1y - p0y;
const bx = p2x - p1x, by = p2y - p1y;

console.log("naive cross =", ax * by - ay * bx);
// crossProduct(a,b) = a.x*b.y - a.y*b.x
// Clang contraction option A: fma(a.x, b.y, -(a.y*b.x))
console.log("fma A =", fma(ax, by, -(ay * bx)));
// option B: fma(-a.y, b.x, a.x*b.y)
console.log("fma B =", fma(-ay, bx, ax * by));
// sanity: fma(2,3,4)=10
console.log("fma sanity", fma(2, 3, 4), fma(0.1, 0.1, -0.01));
