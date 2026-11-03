"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { wdth } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/a11y";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "scroll" scrubs as the heading enters; "load" plays once on mount (page heroes). */
  trigger?: "scroll" | "load";
};

/**
 * Signature width morph: the heading enters condensed (wdth 62) and expands to
 * Expanded (wdth 125). Lines should be explicit (<br />) so wrapping stays stable.
 */
export function WidthMorph({ as: Tag = "h2", children, className = "", trigger = "scroll" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const from = { "--wdth": wdth.narrow, opacity: 0.2 };
      const to = { "--wdth": wdth.expanded, opacity: 1, ease: "none" };
      if (trigger === "load") {
        gsap.fromTo(el, from, { ...to, duration: 1.6, ease: "expo.out", delay: 0.2 });
      } else {
        gsap.fromTo(el, from, { ...to, scrollTrigger: { trigger: el, start: "top 95%", end: "top 45%", scrub: true } });
      }
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`whitespace-nowrap ${className}`} style={{ ["--wdth" as string]: wdth.expanded }}>
      {children}
    </Tag>
  );
}
