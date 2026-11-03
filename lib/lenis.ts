"use client";

import type Lenis from "lenis";

/** Single Lenis instance shared across the app (null when reduced motion or touch). */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

type ScrollTarget = number | string | HTMLElement;

/** Scroll with Lenis when it's running, otherwise fall back to native scrolling. */
export function scrollTo(target: ScrollTarget, opts: { immediate?: boolean; offset?: number; duration?: number } = {}) {
  if (instance) {
    instance.scrollTo(target, { immediate: opts.immediate, offset: opts.offset ?? 0, duration: opts.duration ?? 1.4 });
    return;
  }
  const behavior: ScrollBehavior = opts.immediate ? "instant" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target + (opts.offset ?? 0), behavior });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
  window.scrollTo({ top, behavior });
}

export const stopScroll = () => instance?.stop();
export const startScroll = () => instance?.start();
