#!/usr/bin/env node
/**
 * Dumps a few font atlases to PNG for visual inspection.
 * Dev tooling only — not part of the library, not size/dependency-budgeted.
 * Uses only Node built-ins (zlib for DEFLATE) so it needs no new dependency.
 *
 * Usage: npx tsx tools/atlas-preview.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { deflateSync } from "zlib";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Font } from "../src/font/font";
import { Atlas } from "../src/atlas-gen";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "tools/atlas-preview-out");
mkdirSync(OUT_DIR, { recursive: true });

// ── Minimal PNG encoder (8-bit RGBA, filter 0, zlib via node:zlib) ──────────

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}
function encodePNG(rgba, width, height) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter type 0 (none)
    raw.set(rgba.subarray(y * stride, y * stride + stride), y * (stride + 1) + 1);
  }
  const idat = deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Build atlases ────────────────────────────────────────────────────────────

const jobs = [
  {
    name: "roboto-ascii",
    font: "Roboto.ttf",
    pixelsPerEm: 48,
    pxrange: 4,
    codepoints: range(0x20, 0x7e),
  },
  {
    name: "notosans-mixed",
    font: "NotoSans.ttf",
    pixelsPerEm: 32,
    pxrange: 4,
    codepoints: [...range(0x41, 0x5a), ...range(0x0410, 0x042f)], // Latin + Cyrillic uppercase
  },
  {
    name: "lucide-icons",
    font: "Lucide.ttf",
    pixelsPerEm: 48,
    pxrange: 4,
    codepoints: range(0xe000, 0xe000 + 63),
  },
];

function range(a, b) {
  const out = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

for (const job of jobs) {
  const fontPath = resolve(ROOT, "test/fonts", job.font);
  const buf = readFileSync(fontPath);
  const font = new Font(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const atlas = new Atlas(font, { pixelsPerEm: job.pixelsPerEm, pxrange: job.pxrange });

  let packed = 0;
  const cps = [];
  for (const cp of job.codepoints) {
    if (font.glyphId(cp) === 0) continue; // skip .notdef (not in this font)
    cps.push(cp);
    packed++;
  }
  atlas.glyphs(cps); // one potpack for all glyphs

  const png = encodePNG(atlas.texture, atlas.width, atlas.height);
  const outPath = resolve(OUT_DIR, `${job.name}.png`);
  writeFileSync(outPath, png);

  // Human-viewable companion: median(R,G,B) thresholded at 128, grayscale —
  // this is what the WGSL median shader reconstructs at render time.
  const recon = Buffer.alloc(atlas.texture.length);
  for (let i = 0; i < atlas.texture.length; i += 4) {
    const r = atlas.texture[i],
      g = atlas.texture[i + 1],
      b = atlas.texture[i + 2];
    const median = Math.max(Math.min(r, g), Math.min(Math.max(r, g), b));
    const v = median >= 128 ? 255 : 0;
    recon[i] = recon[i + 1] = recon[i + 2] = v;
    recon[i + 3] = 255;
  }
  const reconPng = encodePNG(recon, atlas.width, atlas.height);
  const reconPath = resolve(OUT_DIR, `${job.name}-reconstructed.png`);
  writeFileSync(reconPath, reconPng);

  console.log(
    `${job.name}: ${packed} glyphs, atlas ${atlas.width}x${atlas.height} -> ${outPath} (+ reconstructed)`,
  );
}
