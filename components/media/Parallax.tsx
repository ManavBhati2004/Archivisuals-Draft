"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { parallax } from "@/lib/motion";
import { isFinePointer, prefersReducedMotion } from "@/lib/a11y";

/**
 * Media drifts ~10% slower than the page inside its frame (halved on touch).
 * The inner layer is oversized so its edges never show.
 */
export function Parallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const amount = parallax.amount * (isFinePointer() ? 1 : parallax.touchFactor) * 100;
      gsap.fromTo(
        el.firstElementChild,
        { yPercent: -amount },
        { yPercent: amount, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden ${className}`}>
      <div className="absolute inset-x-0 -inset-y-[12%] will-change-transform">{children}</div>
    </div>
  );
}
