#!/usr/bin/env node
/**
 * Placeholder media pipeline.
 *   node scripts/encode-media.mjs <rawDir> [outDir] [--only=id,id]
 *
 * For each clip in CLIPS: trims a loop, encodes H.264 MP4 + VP9 WebM (no audio, ≤1920w,
 * bitrate-capped to stay under ~6MB), and writes an AVIF + WebP poster.
 * For each entry in STILLS: grabs a frame from a raw clip and writes AVIF + WebP.
 * Uses ffmpeg-static so no system ffmpeg is needed.
 */
import { execFile } from "node:child_process";
import { mkdir, rm, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const run = promisify(execFile);
const [, , rawArg, outArg = "public/media/placeholder"] = process.argv.filter((a) => !a.startsWith("--"));
/** --only=id,id limits the run to those clip/still ids. */
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
const pick = (id) => !only || only.includes(id);
if (!rawArg) {
  console.error("Usage: node scripts/encode-media.mjs <rawDir> [outDir] [--only=id,id]");
  process.exit(1);
}
const RAW = resolve(rawArg);
const OUT = resolve(outArg);
const TMP = join(OUT, ".tmp");

/** id → { src (raw basename), start (s), dur (s), crop?: 'vertical', poster (s into loop) } */
const CLIPS = {
  "hero-dusk": { src: "hero-dusk", start: 2, dur: 12, poster: 1 },
  "aerial-pullback": { src: "aerial-pullback", start: 0, dur: 12, poster: 2 },
  "interior-walk": { src: "interior-walk", start: 4, dur: 12, poster: 2 },
  "kitchen-pan": { src: "kitchen-pan", start: 2, dur: 12, poster: 3 },
  "pool-twilight": { src: "pool-twilight", start: 2, dur: 12, poster: 3 },
  "exterior-day": { src: "exterior-day", start: 1, dur: 12, poster: 2 },
  "living-light": { src: "living-light", start: 2, dur: 12, poster: 3 },
  "reel-vertical": { src: "interior-walk", start: 10, dur: 12, poster: 3, crop: "vertical" },
  bts: { src: "bts", start: 2, dur: 10, poster: 3 },
  hallway: { src: "hallway", start: 0, dur: 10, poster: 2 },
  "reel-pool": { src: "pool-twilight", start: 1, dur: 9, poster: 3, crop: "vertical" },
  "reel-room": { src: "kitchen-pan", start: 4, dur: 10, poster: 3, crop: "vertical" },
  "reel-light": { src: "living-light", start: 0, dur: 8, poster: 3, crop: "vertical" },
};

/** still id → { src, at (s), crop?: 'portrait' } */
const STILLS = {
  "still-facade": { src: "exterior-day", at: 3 },
  "still-lounge": { src: "living-light", at: 5 },
  "still-kitchen": { src: "kitchen-pan", at: 6 },
  "still-dining": { src: "kitchen-pan", at: 14 },
  "still-bedroom": { src: "interior-walk", at: 20 },
  "still-bathroom": { src: "interior-walk", at: 40 },
  "still-stair": { src: "hallway", at: 4, crop: "portrait" },
  "still-deck": { src: "interior-walk", at: 30 },
  "still-twilight": { src: "hero-dusk", at: 8 },
  "still-aerial": { src: "aerial-pullback", at: 6 },
  "still-detail": { src: "living-light", at: 7, crop: "portrait" },
  "still-pool": { src: "pool-twilight", at: 8 },
  "still-apartment": { src: "interior-walk", at: 44 },
  "still-townhouse": { src: "exterior-day", at: 9 },
};

const VCROP = "crop=trunc(ih*9/16/2)*2:ih";
const PCROP = "crop=trunc(ih*4/5/2)*2:ih";
const scale = (crop) =>
  [crop === "vertical" ? VCROP : crop === "portrait" ? PCROP : null, "scale='min(1920,iw)':-2"]
    .filter(Boolean)
    .join(",");

const ff = (args) => run(ffmpegPath, ["-y", "-loglevel", "error", ...args], { maxBuffer: 1 << 26 });

async function images(png, base, width) {
  const img = sharp(png).resize({ width, withoutEnlargement: true });
  await img.clone().avif({ quality: 52, effort: 5 }).toFile(`${base}.avif`);
  await img.clone().webp({ quality: 74 }).toFile(`${base}.webp`);
}

const mb = async (p) => ((await stat(p)).size / 1e6).toFixed(2);

await mkdir(TMP, { recursive: true });

for (const [id, c] of Object.entries(CLIPS)) {
  if (!pick(id)) continue;
  const input = join(RAW, `${c.src}.mp4`);
  const vf = scale(c.crop);
  const trim = ["-ss", String(c.start), "-t", String(c.dur), "-i", input];
  const mp4 = join(OUT, `${id}.mp4`);
  const webm = join(OUT, `${id}.webm`);
  await ff([...trim, "-vf", vf, "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
    "-maxrate", "3.2M", "-bufsize", "6M", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
  await ff([...trim, "-vf", vf, "-an", "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "2.6M",
    "-deadline", "good", "-cpu-used", "5", "-row-mt", "1", webm]);
  const png = join(TMP, `${id}.png`);
  await ff(["-ss", String(c.poster), "-i", mp4, "-frames:v", "1", png]);
  await images(png, join(OUT, id), c.crop === "vertical" ? 1080 : 1920);
  console.log(`clip  ${id.padEnd(16)} mp4 ${await mb(mp4)}MB  webm ${await mb(webm)}MB`);
}

for (const [id, s] of Object.entries(STILLS)) {
  if (!pick(id)) continue;
  const png = join(TMP, `${id}.png`);
  await ff(["-ss", String(s.at), "-i", join(RAW, `${s.src}.mp4`), "-frames:v", "1", "-vf", scale(s.crop), png]);
  await images(png, join(OUT, id), s.crop === "portrait" ? 1200 : 2000);
  console.log(`still ${id}`);
}

await rm(TMP, { recursive: true, force: true });
console.log("done");
