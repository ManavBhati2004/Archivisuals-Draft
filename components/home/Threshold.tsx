"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/a11y";
import { home } from "@/content/home";
import { Logo } from "@/components/brand/Logo";
import { Slate } from "@/components/type/Slate";

/**
 * 02 — THRESHOLD (white). The name, read word by word: each word fills from 20% to 100%
 * opacity with scroll while the logo draws itself alongside.
 */
export function Threshold() {
  const ref = useRef<HTMLElement>(null);
  const { threshold } = home;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(ref);
      gsap.fromTo(
        q(".th-word"),
        { opacity: 0.2 },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: q(".th-statement")[0], start: "top 78%", end: "bottom 45%", scrub: true } },
      );
      gsap.fromTo(
        q(".logo-stroke"),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: q(".th-logo")[0], start: "top 85%", end: "bottom 40%", scrub: true } },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="threshold" data-chapter="The name" data-theme-section="light" className="section">
      <div className="wrap grid-12 gap-y-16">
        <div className="col-span-12 border-b border-fg-14 pb-6">
          <Slate index="02">{threshold.label}</Slate>
        </div>

        <p
          className="th-statement col-span-12 md:col-span-8"
          style={{ fontSize: "clamp(1.75rem, 3.7vw, 4.25rem)", lineHeight: 1.08, letterSpacing: "-0.015em", ["--wdth" as string]: 112, ["--wght" as string]: 600 }}
        >
          {threshold.statement.split(" ").map((w, i) => (
            <span key={i} className="th-word">
              {w}{" "}
            </span>
          ))}
        </p>

        <figure className="th-logo col-span-8 col-start-3 self-end md:col-span-3 md:col-start-10">
          <Logo className="h-auto w-full overflow-visible" strokeWidth={4} title="Archivisuals mark" style={{ strokeDasharray: 1 }} />
          <figcaption className="t-label mt-8 leading-relaxed text-fg-60">{threshold.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
