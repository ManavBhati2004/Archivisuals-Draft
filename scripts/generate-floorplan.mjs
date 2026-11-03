#!/usr/bin/env node
/** Generates the placeholder 2D floor plan (plan-sample.avif/.webp) as black linework on white. */
import sharp from "sharp";
import { resolve } from "node:path";

const OUT = resolve(process.argv[2] ?? "public/media/placeholder");
const W = 1200;
const H = 1500;

// Rooms: [x, y, w, h, label]
const rooms = [
  [100, 100, 560, 520, "LIVING"],
  [660, 100, 440, 340, "KITCHEN"],
  [660, 440, 440, 180, "DINING"],
  [100, 620, 420, 420, "BEDROOM 1"],
  [520, 620, 260, 220, "BATH"],
  [780, 620, 320, 420, "BEDROOM 2"],
  [520, 840, 260, 200, "HALL"],
  [100, 1040, 500, 360, "BEDROOM 3"],
  [600, 1040, 500, 360, "DECK"],
];

const text = (x, y, s) =>
  `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="26" letter-spacing="4" text-anchor="middle" fill="#000">${s}</text>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="#fff"/>
  <g fill="none" stroke="#000" stroke-width="6">
    ${rooms.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join("")}
  </g>
  <g stroke="#fff" stroke-width="10">
    <line x1="300" y1="620" x2="380" y2="620"/>
    <line x1="660" y1="250" x2="660" y2="330"/>
    <line x1="560" y1="840" x2="640" y2="840"/>
    <line x1="780" y1="900" x2="780" y2="980"/>
    <line x1="520" y1="900" x2="520" y2="980"/>
    <line x1="300" y1="1040" x2="380" y2="1040"/>
    <line x1="700" y1="1040" x2="860" y2="1040"/>
  </g>
  <g fill="none" stroke="#000" stroke-width="2">
    <path d="M300 620 A80 80 0 0 1 380 700"/>
    <path d="M660 250 A80 80 0 0 0 740 330"/>
    <path d="M560 840 A80 80 0 0 1 640 920"/>
  </g>
  ${rooms.map(([x, y, w, h, l]) => text(x + w / 2, y + h / 2 + 9, l)).join("")}
  ${text(W / 2, 60, "PLACEHOLDER FLOOR PLAN — NOT TO SCALE")}
</svg>`;

const img = sharp(Buffer.from(svg));
await img.clone().avif({ quality: 60 }).toFile(`${OUT}/plan-sample.avif`);
await img.clone().webp({ quality: 85 }).toFile(`${OUT}/plan-sample.webp`);
console.log("plan-sample written");
