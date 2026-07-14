// Rasterize the extension icon (same design as shared/assets/icons/icon.svg)
// to a 128×128 PNG for Chrome, with no external dependencies.
//
// Run via:  node scripts/generate-icon.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SIZE = 128;
const OUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "packages/shared/assets/icons/icon.png"
);

const GRAD_A = [255, 217, 77]; // #ffd94d
const GRAD_B = [245, 166, 35]; // #f5a623
const INK = [43, 32, 19]; // #2b2013

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const mix = (a, b, t) => a + (b - a) * t;

function roundedRectSDF(x, y) {
  const r = 28;
  const half = SIZE / 2;
  const dx = Math.abs(x - half + 0.5) - (half - r);
  const dy = Math.abs(y - half + 0.5) - (half - r);
  const ax = Math.max(dx, 0);
  const ay = Math.max(dy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(dx, dy), 0) - r;
}

function circleSDF(x, y, cx, cy, r) {
  return Math.hypot(x - cx, y - cy) - r;
}

// Distance to the smile stroke: quadratic bezier (40,78) → (64,100) → (88,78),
// stroke width 8, approximated by sampling the curve.
const smilePoints = [];
for (let i = 0; i <= 64; i++) {
  const t = i / 64;
  const x = mix(mix(40, 64, t), mix(64, 88, t), t);
  const y = mix(mix(78, 100, t), mix(100, 78, t), t);
  smilePoints.push([x, y]);
}

function smileSDF(x, y) {
  let min = Infinity;
  for (const [px, py] of smilePoints) {
    const d = Math.hypot(x - px, y - py);
    if (d < min) min = d;
  }
  return min - 4;
}

function pixel(x, y) {
  const shape = clamp01(0.5 - roundedRectSDF(x, y));
  if (shape === 0) return [0, 0, 0, 0];

  const t = (x + y) / (2 * (SIZE - 1));
  let rgb = GRAD_A.map((a, i) => mix(a, GRAD_B[i], t));

  const ink = clamp01(
    Math.max(
      0.5 - circleSDF(x + 0.5, y + 0.5, 45, 52, 8),
      0.5 - circleSDF(x + 0.5, y + 0.5, 83, 52, 8),
      0.5 - smileSDF(x + 0.5, y + 0.5)
    )
  );
  rgb = rgb.map((c, i) => mix(c, INK[i], ink));

  return [...rgb.map(Math.round), Math.round(shape * 255)];
}

// --- Minimal PNG encoder (RGBA, 8-bit, no interlace) ---
const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y++) {
  const row = y * (SIZE * 4 + 1);
  raw[row] = 0; // filter: none
  for (let x = 0; x < SIZE; x++) {
    const [r, g, b, a] = pixel(x, y);
    raw.set([r, g, b, a], row + 1 + x * 4);
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr.set([8, 6, 0, 0, 0], 8); // 8-bit RGBA

writeFileSync(
  OUT,
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ])
);
console.log(`Wrote ${OUT}`);
