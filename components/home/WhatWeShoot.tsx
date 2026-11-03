"use client";

import { useState } from "react";
import { useFinePointer } from "@/lib/a11y";
import { services } from "@/content/services";
import { Video } from "@/components/media/Video";
import { Slate } from "@/components/type/Slate";
import { SplitLines } from "@/components/type/SplitLines";

/**
 * 04 — WHAT WE SHOOT. Numbered full-width rows. Hover (desktop) or tap opens a row:
 * a two-line description, deliverables, and a looping clip that blooms from mono to colour.
 */
export function WhatWeShoot() {
  const [open, setOpen] = useState<number | null>(null);
  const fine = useFinePointer();

  return (
    <section id="services" data-chapter="What we shoot" className="section">
      <div className="wrap">
        <div className="grid-12 items-end gap-y-8 border-b border-fg-14 pb-8">
          <div className="col-span-12 md:col-span-4">
            <Slate index="04">What we shoot</Slate>
          </div>
          <SplitLines className="t-display-sm col-span-12 md:col-span-8">One visit. Everything the listing needs.</SplitLines>
        </div>

        <ul onMouseLeave={() => fine && setOpen(null)}>
          {services.map((s, i) => {
            const on = open === i;
            const panelId = `service-${s.id}`;
            return (
              <li key={s.id} className="border-b border-fg-14" onMouseEnter={() => fine && setOpen(i)}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={panelId}
                    onClick={() => setOpen(on ? null : i)}
                    className="group grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-[clamp(20px,3.4vh,36px)] text-left md:grid-cols-[6rem_1fr_auto]"
                  >
                    <span className="t-num text-fg-40">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className="uppercase transition-[--wdth,opacity] duration-500 ease-[var(--ease-out)]"
                      style={{
                        fontSize: "clamp(1.6rem, 4.2vw, 4.25rem)",
                        lineHeight: 1,
                        letterSpacing: "-0.015em",
                        ["--wght" as string]: 700,
                        ["--wdth" as string]: on ? 125 : 100,
                        opacity: open === null || on ? 1 : 0.35,
                      }}
                    >
                      {s.title}
                    </span>
                    <span aria-hidden className="relative block h-3 w-3 self-center">
                      <span className="absolute left-0 top-1/2 block h-px w-full bg-current" />
                      <span className={`absolute left-0 top-1/2 block h-px w-full bg-current transition-transform duration-500 ${on ? "rotate-0" : "rotate-90"}`} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-label={s.title}
                  className="grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out)]"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                  inert={!on}
                >
                  <div className="overflow-hidden">
                    <div className="grid-12 gap-y-8 pb-[clamp(28px,5vh,56px)]">
                      <div className="col-span-12 md:col-span-5 md:col-start-2">
                        <p className="t-body">{s.description}</p>
                        <ul className="mt-6">
                          {s.deliverables.map((d) => (
                            <li key={d} className="t-label flex gap-3 border-t border-fg-14 py-3 text-fg-60">
                              <span aria-hidden>—</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-span-12 md:col-span-5 md:col-start-8">
                        <div className={s.clip.aspect === "9/16" ? "mx-auto w-[42%] min-w-[160px]" : ""}>
                          <Video media={s.clip} mode="active" active={on} mono className={on ? "is-active" : ""} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
