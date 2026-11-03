"use client";

/** Lets the hero wait for the first-visit preloader before playing its entrance. */
const KEY = "av-pre";
let done = false;
const waiting = new Set<() => void>();

export const preloadSeen = () => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

export function markPreloaded() {
  done = true;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
  document.documentElement.classList.add("preloaded");
  waiting.forEach((cb) => cb());
  waiting.clear();
}

/** Runs `cb` once the preloader has finished (immediately if it already has or was skipped). */
export function whenPreloaded(cb: () => void) {
  if (done || document.documentElement.classList.contains("preloaded")) {
    cb();
    return () => {};
  }
  waiting.add(cb);
  return () => waiting.delete(cb);
}
