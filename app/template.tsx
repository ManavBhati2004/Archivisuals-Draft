"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollTo } from "@/lib/lenis";
import { reveal } from "@/lib/transition";
import { duration } from "@/lib/motion";

/**
 * Re-mounts on every navigation. Resets scroll, wires the scroll-driven theme switch for
 * this page, refreshes ScrollTrigger, then reveals the page from under the transition layer.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      scrollTo(0, { immediate: true });
      const body = document.body;
      body.dataset.theme = "dark";

      // Theme islands: while a [data-theme-section] crosses the middle of the viewport,
      // the whole page (body, header, cursor, rail) adopts its theme.
      const active = new Set<HTMLElement>();
      const apply = () => {
        const last = [...active].pop();
        body.dataset.theme = last?.dataset.themeSection ?? "dark";
      };
      ref.current?.querySelectorAll<HTMLElement>("[data-theme-section]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) active.add(el);
            else active.delete(el);
            apply();
          },
        });
      });

      const raf = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event("av:route"));
        reveal();
      });

      // Media changes layout height as it loads; refresh once things settle.
      const late = window.setTimeout(() => ScrollTrigger.refresh(), duration.transition * 1000);

      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(late);
        body.dataset.theme = "dark";
      };
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
