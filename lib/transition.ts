"use client";

import { gsap } from "./gsap";
import { duration, ease, triangle } from "./motion";
import { prefersReducedMotion } from "./a11y";

/**
 * Page-transition controller. A fixed black layer whose clip-path is the logo triangle:
 * cover() grows it from the centre to fill the screen; reveal() shrinks it away again.
 * TransitionLink calls cover() before router.push; app/template.tsx calls reveal().
 */
type State = "idle" | "covering" | "covered" | "revealing";

let layer: HTMLElement | null = null;
let state: State = "idle";
let revealEndsAt = 0;

export const registerLayer = (el: HTMLElement | null) => {
  layer = el;
};

export const transitionState = () => state;

/** Seconds until the current reveal finishes (0 if none) — lets entrance animations wait. */
export const revealDelay = () => Math.max(0, (revealEndsAt - performance.now()) / 1000);

export function cover(): Promise<void> {
  if (!layer) return Promise.resolve();
  state = "covering";
  const reduced = prefersReducedMotion();
  return new Promise((resolve) => {
    gsap.killTweensOf(layer);
    gsap.set(layer, { visibility: "visible", pointerEvents: "auto" });
    const tween = reduced
      ? gsap.fromTo(layer, { opacity: 0, clipPath: triangle.open }, { opacity: 1, duration: 0.3, ease: "none" })
      : gsap.fromTo(
          layer,
          { opacity: 1, clipPath: triangle.point },
          { clipPath: triangle.open, duration: duration.transition * 0.55, ease: ease.transition },
        );
    tween.eventCallback("onComplete", () => {
      state = "covered";
      resolve();
    });
  });
}

export function reveal() {
  if (!layer || state === "idle") return;
  state = "revealing";
  const reduced = prefersReducedMotion();
  const d = reduced ? 0.3 : duration.transition * 0.6;
  revealEndsAt = performance.now() + d * 600; // entrance animations can start halfway through
  const done = () => {
    state = "idle";
    gsap.set(layer, { visibility: "hidden", pointerEvents: "none" });
  };
  if (reduced) {
    gsap.to(layer, { opacity: 0, duration: d, ease: "none", onComplete: done });
  } else {
    gsap.to(layer, { clipPath: triangle.point, duration: d, ease: ease.transition, delay: 0.08, onComplete: done });
  }
}
