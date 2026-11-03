"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { duration, ease, stagger } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/a11y";
import { revealDelay } from "@/lib/transition";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Start immediately (e.g. page heroes) instead of on scroll-in. */
  immediate?: boolean;
  delay?: number;
};

/** Heading whose lines slide up from 110% inside overflow masks as it enters. */
export function SplitLines({ as: Tag = "h2", children, className = "", id, immediate = false, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: revealDelay() });
        return;
      }
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: duration.reveal,
            ease: ease.reveal,
            stagger: stagger.lines,
            delay: delay + revealDelay(),
            scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={`split-pending ${className}`}>
      {children}
    </Tag>
  );
}
