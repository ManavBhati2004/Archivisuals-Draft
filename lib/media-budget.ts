"use client";

/**
 * Never more than MAX videos playing at once. Asking to play a third pauses the
 * one that started earliest (unless it's pinned, e.g. the reel lightbox).
 */
const MAX = 2;
const playing: HTMLVideoElement[] = [];

export function requestPlay(video: HTMLVideoElement) {
  const i = playing.indexOf(video);
  if (i !== -1) playing.splice(i, 1);
  playing.push(video);
  while (playing.length > MAX) {
    const oldest = playing.find((v) => v.dataset.pinned !== "true" && v !== video);
    if (!oldest) break;
    oldest.pause();
    playing.splice(playing.indexOf(oldest), 1);
  }
  const p = video.play();
  if (p) p.catch(() => release(video));
}

export function release(video: HTMLVideoElement) {
  const i = playing.indexOf(video);
  if (i !== -1) playing.splice(i, 1);
  if (!video.paused) video.pause();
}
