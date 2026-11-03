"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/a11y";

/**
 * When a full-width film enters, black bars slide in top and bottom to a 2.39:1 frame,
 * hold for ~1s, then retract.
 */
export function Letterbox({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const bars = el.querySelectorAll(".lb-bar");
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 60%", once: true } })
        .to(bars, { scaleY: 1, duration: 0.9, ease: ease.transition })
        .to(bars, { scaleY: 0, duration: 1, ease: ease.transition }, `+=${duration.letterboxHold}`);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
      {/* Bar height = (frame height − width / 2.39) / 2, expressed via container query units. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [container-type:size]">
        <span className="lb-bar absolute inset-x-0 top-0 block origin-top scale-y-0 bg-black" style={{ height: "max(0px, calc((100cqh - 100cqw / 2.39) / 2))" }} />
        <span className="lb-bar absolute inset-x-0 bottom-0 block origin-bottom scale-y-0 bg-black" style={{ height: "max(0px, calc((100cqh - 100cqw / 2.39) / 2))" }} />
      </div>
    </div>
  );
}
