"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { prefersReducedMotion } from "@/lib/a11y";

/**
 * Lenis drives smooth scroll from gsap.ticker and feeds ScrollTrigger on every scroll.
 * Skipped entirely under prefers-reduced-motion (native scroll, no smoothing).
 */
export function SmoothScroll() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    // Refresh once webfonts have swapped in, then again when everything has loaded.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });

    return () => {
      window.removeEventListener("load", refresh);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
