"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { scrollTo } from "@/lib/lenis";

type Chapter = { id: string; label: string; index: string; at: number; el: HTMLElement };

/**
 * A thin scrubber fixed to the right edge. One marker per [data-chapter] section,
 * a playhead that follows scroll, labels on hover, click to jump.
 */
export function ChapterRail() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [current, setCurrent] = useState(0);
  const head = useRef<HTMLSpanElement>(null);
  const list = useRef<Chapter[]>([]);

  useEffect(() => {
    const collect = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const els = Array.from(document.querySelectorAll<HTMLElement>("main [data-chapter]"));
      list.current = els.map((el, i) => {
          const top = el.getBoundingClientRect().top + window.scrollY;
          return {
            id: el.id || `chapter-${i}`,
            label: el.dataset.chapter ?? "",
            index: String(i + 1).padStart(2, "0"),
            at: Math.min(1, Math.max(0, top / max)),
            el,
          };
      });
      setChapters(list.current);
      onScroll();
    };
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = window.scrollY / max;
      if (head.current) head.current.style.transform = `translateY(${p * 100}cqh)`;
      let c = 0;
      list.current.forEach((ch, i) => {
        if (p + 0.002 >= ch.at) c = i;
      });
      setCurrent(c);
    };
    collect();
    window.addEventListener("av:route", collect);
    ScrollTrigger.addEventListener("refresh", collect);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("av:route", collect);
      ScrollTrigger.removeEventListener("refresh", collect);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (chapters.length < 2) return null;

  return (
    <nav
      aria-label="Page chapters"
      className="fixed right-[clamp(10px,1.4vw,28px)] top-1/2 z-50 hidden h-[44vh] -translate-y-1/2 md:block"
    >
      <div className="relative h-full w-px bg-fg-20 [container-type:size]">
        <span ref={head} aria-hidden className="absolute -left-[3px] top-0 block h-px w-[7px] bg-fg will-change-transform" />
        <ol>
          {chapters.map((ch, i) => (
            <li key={ch.id} className="absolute -left-[9px]" style={{ top: `${ch.at * 100}%` }}>
              <button
                type="button"
                onClick={() => scrollTo(ch.el)}
                className="group relative -translate-y-1/2 flex h-5 w-5 items-center justify-center"
                aria-label={`${ch.index} — ${ch.label}`}
                aria-current={current === i ? "step" : undefined}
              >
                <span
                  className={`block h-[5px] w-[5px] transition-transform duration-300 ${current === i ? "scale-125 bg-fg" : "bg-fg-40 group-hover:bg-fg"}`}
                />
                <span className="t-label pointer-events-none absolute right-6 whitespace-nowrap text-[10px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="t-num mr-2">{ch.index}</span>
                  {ch.label}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
