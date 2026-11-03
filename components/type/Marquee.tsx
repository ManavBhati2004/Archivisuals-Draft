"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/a11y";

/**
 * Slow infinite marquee in Archivo Expanded, alternating solid and outlined words.
 * Speed picks up with scroll velocity and eases back. Reduced motion: static, wrapped list.
 */
export function Marquee({ words, label }: { words: readonly string[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const track = el?.querySelector<HTMLElement>(".mq-track");
      if (!el || !track || prefersReducedMotion()) return;
      const half = () => track.scrollWidth / 2;
      let x = 0;
      let boost = 0;
      const BASE = 0.6; // px per frame at 60fps
      const st = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top" });
      const tick = (_t: number, dt: number) => {
        if (!st.isActive) return; // idle while off screen
        const v = Math.abs(st.getVelocity());
        boost += (Math.min(v / 120, 14) - boost) * 0.08;
        x -= (BASE + boost) * (dt / 16.67);
        const w = half();
        if (w > 0 && -x >= w) x += w;
        gsap.set(track, { x });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: ref },
  );

  const row = (dup: boolean) =>
    words.map((w, i) => (
      <span key={`${dup}-${w}`} aria-hidden={dup || undefined} className="flex shrink-0 items-center">
        <span
          className="whitespace-nowrap uppercase"
          style={i % 2 ? { color: "transparent", WebkitTextStroke: "1px var(--fg)" } : undefined}
        >
          {w}
        </span>
        <span aria-hidden className="mx-[0.5em] text-fg-40">·</span>
      </span>
    ));

  return (
    <div ref={ref} className="overflow-hidden" role="region" aria-label={label}>
      <div
        className="mq-track flex w-max will-change-transform motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:px-[var(--gutter)]"
        style={{ fontSize: "clamp(2.5rem, 7vw, 7.5rem)", lineHeight: 1.05, letterSpacing: "-0.02em", ["--wdth" as string]: 125, ["--wght" as string]: 750 }}
      >
        {row(false)}
        <span className="contents motion-reduce:hidden">{row(true)}</span>
      </div>
    </div>
  );
}
