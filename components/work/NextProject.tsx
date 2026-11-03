"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/a11y";
import { cover, transitionState } from "@/lib/transition";
import type { Project } from "@/content/projects";
import { typeLabel } from "@/content/projects";
import { Video } from "@/components/media/Video";
import { TransitionLink } from "@/components/shell/TransitionLink";

/**
 * Full-width preview of the next project. Keep scrolling and a thin line fills; at 100%
 * the page transition plays and it navigates there. Clicking works too. Reduced motion:
 * click only.
 */
export function NextProject({ project: p }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const router = useRouter();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      let fired = false;
      router.prefetch(`/work/${p.slug}`);
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: async (self) => {
          if (line.current) line.current.style.transform = `scaleX(${self.progress})`;
          if (self.progress > 0.995 && !fired && transitionState() === "idle") {
            fired = true;
            await cover();
            router.push(`/work/${p.slug}`, { scroll: false });
          }
        },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-chapter="Next project" className="relative h-[180svh] motion-reduce:h-svh">
      <div className="sticky top-0 h-svh overflow-hidden">
        <TransitionLink href={`/work/${p.slug}`} className="group block h-full" data-cursor="play" aria-label={`Next project: ${p.title}, ${p.suburb}`}>
          <Video media={p.hero} fill mono className="opacity-60 transition-opacity duration-700 group-hover:opacity-80" />
          <div className="wrap relative flex h-full flex-col justify-end pb-[clamp(32px,8vh,96px)]">
            <p className="t-label text-fg-60">Next project</p>
            <p className="t-display mt-6">{p.title}</p>
            <p className="t-label mt-4 text-fg-60">
              {p.suburb} · {typeLabel(p.types[0])} · <span className="t-num">{p.year}</span>
            </p>
            <div className="mt-10 flex items-center gap-6">
              <span className="relative block h-px flex-1 bg-fg-20">
                <span ref={line} className="absolute inset-0 block origin-left bg-fg" style={{ transform: "scaleX(0)" }} />
              </span>
              <span className="t-label text-fg-60 motion-reduce:hidden">Keep scrolling</span>
            </div>
          </div>
        </TransitionLink>
      </div>
    </section>
  );
}
