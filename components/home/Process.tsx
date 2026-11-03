"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/a11y";
import { home } from "@/content/home";
import { RollingDigits } from "@/components/type/RollingDigits";
import { Slate } from "@/components/type/Slate";

/**
 * 06 — THE PROCESS (white). A sticky giant step number on the left rolls 01 → 04 as the
 * steps scroll on the right, while a vertical hairline draws down like the logo's stroke.
 */
export function Process() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      q(".step").forEach((el: Element, i: number) => {
        gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setStep(i) },
        });
      });
      if (prefersReducedMotion()) return;
      gsap.fromTo(q(".process-line"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".steps")[0], start: "top 60%", end: "bottom 60%", scrub: true } });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="process" data-chapter="Process" data-theme-section="light" className="section">
      <div className="wrap grid-12 gap-y-12">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-[18vh]">
            <Slate index="06">The process</Slate>
            <p className="mt-8 leading-[0.8] max-md:hidden" style={{ fontSize: "clamp(8rem, 22vw, 22rem)" }}>
              <RollingDigits value={step + 1} />
            </p>
          </div>
        </div>

        <ol className="steps relative col-span-12 md:col-span-6 md:col-start-7">
          <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-fg-14" />
          <span aria-hidden className="process-line absolute bottom-0 left-0 top-0 w-px origin-top bg-fg" />
          {home.process.map((s, i) => (
            <li key={s.title} className="step py-[clamp(48px,12vh,140px)] pl-[clamp(24px,4vw,64px)] first:pt-0 last:pb-0">
              <p className="t-num text-fg-40">{String(i + 1).padStart(2, "0")}</p>
              <h3
                className="t-h3 mt-3 transition-opacity duration-500"
                style={{ opacity: i === step ? 1 : 0.35, fontSize: "clamp(1.75rem, 3vw, 3rem)" }}
              >
                {s.title}
              </h3>
              <p className="t-body mt-4">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
