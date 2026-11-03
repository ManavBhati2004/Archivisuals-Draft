"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/a11y";
import { projects, typeLabel } from "@/content/projects";
import { Video } from "@/components/media/Video";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Slate } from "@/components/type/Slate";
import { SplitLines } from "@/components/type/SplitLines";

const LISTINGS = projects.slice(3, 8);

/**
 * 05 — RECENT LISTINGS, the "file pile". Cards are CSS position: sticky with stepped tops,
 * so each earlier card's header peeks out like a file tab. GSAP only scrubs the card being
 * covered (scale down, dim, slight zoom) — the stacking itself is pure CSS, no pin spacers.
 */
export function RecentListings() {
  const ref = useRef<HTMLElement>(null);
  const [top, setTop] = useState(0);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".pile-card", ref.current);
      const reduced = prefersReducedMotion();
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        // Which card is on top drives colour and playback (in-flow positions; cards are 12vh apart).
        gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 60%",
            end: () => `bottom+=${window.innerHeight * 0.12} 60%`,
            onToggle: (self) => self.isActive && setTop(i),
          },
        });
        if (!next || reduced) return;
        const n = cards.length;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: next, start: "top bottom", end: () => `top ${window.innerHeight * 0.12 + (i + 1) * (window.innerWidth < 768 ? 10 : 18)}px`, scrub: true },
          })
          // Deeper cards end slightly smaller, so the pile reads as stacked paper.
          .to(card.querySelector(".pile-inner"), { scale: 0.94 - (n - 2 - i) * 0.006 }, 0)
          .to(card.querySelector(".pile-dim"), { opacity: 0.5 }, 0)
          .to(card.querySelector(".pile-media"), { scale: 1.06 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="listings" data-chapter="Recent listings" className="section">
      <div className="wrap">
        <div className="grid-12 items-end gap-y-8 pb-[clamp(40px,8vh,96px)]">
          <div className="col-span-12 md:col-span-4">
            <Slate index="05">Recent listings</Slate>
          </div>
          <SplitLines className="t-display-sm col-span-12 md:col-span-8">On the market now.</SplitLines>
        </div>

        <ol className="relative">
          {LISTINGS.map((p, i) => {
            const on = i === top;
            return (
              <li
                key={p.slug}
                className="pile-card sticky mb-[12vh] last:mb-0 [--step:18px] max-md:[--step:10px]"
                style={{ top: `calc(12vh + ${i} * var(--step))` }}
              >
                <article className="pile-inner origin-top border border-fg-14 bg-bg will-change-transform">
                  <header className="t-label grid grid-cols-[auto_auto_1fr] items-center gap-x-6 gap-y-1 border-b border-fg-14 px-[clamp(14px,2vw,28px)] py-3 md:grid-cols-[10rem_4rem_1fr_auto]">
                    <span className="text-fg-60">{typeLabel(p.types[0])}</span>
                    <span className="t-num">{String(LISTINGS.length - i).padStart(2, "0")}</span>
                    <span className="truncate">{p.title}</span>
                    <span className="col-span-3 truncate text-fg-40 md:col-span-1">{p.deliverables.join(" · ")}</span>
                  </header>
                  <TransitionLink href={`/work/${p.slug}`} className="group block" data-cursor="play" aria-label={`${p.title}, ${p.suburb} — view project`}>
                    <div className="relative h-[calc(80vh-9rem)] overflow-hidden max-md:h-[calc(70vh-8rem)]">
                      <div className="pile-media absolute inset-0 will-change-transform">
                        <Video media={p.hero} mode="active" active={on} mono fill />
                      </div>
                      <div aria-hidden className="pile-dim pointer-events-none absolute inset-0 bg-black opacity-0" />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 px-[clamp(14px,2vw,28px)] py-4">
                      <p className="text-fg-60">
                        {p.line} <span className="text-fg-40">— {p.suburb}</span>
                      </p>
                      <span className="t-label group-stretch">View project →</span>
                    </div>
                  </TransitionLink>
                </article>
              </li>
            );
          })}
        </ol>

        <div className="mt-[clamp(48px,10vh,120px)] flex justify-center">
          <TransitionLink href="/work" className="stretch t-label border-b border-fg py-3">
            See all work
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
