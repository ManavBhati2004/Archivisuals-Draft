"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease, triangle } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/a11y";

/**
 * Reveals its media through the logo triangle: a small centred triangle clip-path opens
 * to the full frame while the media inside settles from 1.15 to 1.
 */
export function TriangleReveal({ children, className = "", start = "top 82%" }: { children: ReactNode; className?: string; start?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.firstElementChild;
      if (prefersReducedMotion()) {
        gsap.from(el, { autoAlpha: 0, duration: 0.6, scrollTrigger: { trigger: el, start, once: true } });
        return;
      }
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start, once: true } });
      tl.fromTo(el, { clipPath: triangle.closed }, { clipPath: triangle.open, duration: duration.reveal * 1.3, ease: ease.transition })
        .fromTo(inner, { scale: 1.15 }, { scale: 1, duration: duration.reveal * 1.6, ease: ease.reveal }, 0)
        .set(el, { clipPath: "none" });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`tri-pending overflow-hidden ${className}`}>
      <div className="h-full w-full will-change-transform">{children}</div>
    </div>
  );
}
