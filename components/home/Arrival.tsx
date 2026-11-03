"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease, stagger, wdth } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/a11y";
import { whenPreloaded } from "@/lib/preloader";
import { home } from "@/content/home";
import { Video } from "@/components/media/Video";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { Lightbox } from "@/components/media/Lightbox";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { Slate } from "@/components/type/Slate";

type Daypart = "day" | "twilight";
/** Set before paint by the inline head script from the visitor's local hour. */
const readDaypart = (): Daypart => (document.documentElement.dataset.daypart === "day" ? "day" : "twilight");
const noop = () => () => {};

/**
 * 01 — ARRIVAL. The film fills the first screen; the statement sits over it, bottom-left.
 * Pinned on scroll: the headline compresses (wdth 125 → 62) and lifts away while the film
 * settles (1.12 → 1), like the camera stepping through the front door.
 * Time of day: a daylight cut 06:00–17:00 visitor time, the twilight cut otherwise.
 */
export function Arrival() {
  const ref = useRef<HTMLElement>(null);
  const [reelOpen, setReelOpen] = useState(false);
  const daypart = useSyncExternalStore(noop, readDaypart, () => "twilight" as Daypart);
  const { arrival } = home;

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const reduced = prefersReducedMotion();

      // Entrance, as the intro curtain lifts.
      const cancel = whenPreloaded(() => {
        gsap.fromTo(q(".hero-line"), { y: 0, yPercent: reduced ? 0 : 110 }, { yPercent: 0, duration: duration.reveal, ease: ease.reveal, stagger: stagger.lines });
        gsap.fromTo(q(".hero-fade"), { opacity: 0, y: reduced ? 0 : 16 }, { opacity: 1, y: 0, duration: duration.reveal, ease: ease.reveal, stagger: stagger.items, delay: 0.3 });
      });
      if (reduced) return cancel;

      const mobile = window.matchMedia("(max-width: 767px)").matches;
      gsap
        .timeline({
          scrollTrigger: { trigger: section, start: "top top", end: mobile ? "+=50%" : "+=80%", pin: true, scrub: true },
          defaults: { ease: "none" },
        })
        .fromTo(q(".hero-media-inner"), { scale: 1.12 }, { scale: 1 }, 0)
        .fromTo(q(".hero-title"), { "--wdth": wdth.expanded }, { "--wdth": wdth.narrow, opacity: 0, yPercent: -40 }, 0)
        .to(q(".hero-sub"), { opacity: 0, y: -24, duration: 0.5 }, 0)
        .to(q(".hero-dim"), { opacity: 0.15 }, 0);

      return cancel;
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="arrival" data-chapter="Arrival" className="theme-dark relative h-svh min-h-[600px] overflow-hidden bg-black text-fg">
      {/* Film layer */}
      <div className="absolute inset-0" data-cursor="play" onClick={() => setReelOpen(true)}>
        <div className="hero-media-inner h-full w-full will-change-transform">
          {(["twilight", "day"] as const).map((part) => (
            <div key={part} className={`hero-cut-${part} absolute inset-0`}>
              <Video media={arrival.film[part]} fill priority={part === "twilight"} mode="active" active={daypart === part} />
            </div>
          ))}
        </div>
        <div aria-hidden className="hero-dim absolute inset-0 bg-black/35" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      </div>

      <div className="wrap pointer-events-none relative z-10 flex h-full flex-col justify-end pb-6 md:pb-16">
        <h1 className="hero-title t-display !text-[clamp(2rem,8vw,9.5rem)] will-change-transform">
          {arrival.lines.map((l) => (
            <span key={l} className="split-mask block">
              <span className="hero-line block">{l}</span>
            </span>
          ))}
        </h1>

        <div className="hero-sub pointer-events-auto mt-[clamp(20px,3.5vh,40px)] flex flex-wrap items-center gap-x-8 gap-y-5">
          <p className="hero-fade t-body max-w-[32ch] !text-white/75">{arrival.tagline}</p>
          <div className="hero-fade flex flex-wrap items-center gap-6">
            <QuoteButton />
            <button type="button" onClick={() => setReelOpen(true)} className="t-label group flex min-h-[48px] items-center gap-3" data-cursor="play">
              <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                <path d="M0 0 L10 6 L0 12 Z" fill="currentColor" />
              </svg>
              Watch the reel
            </button>
          </div>
        </div>

        <div className="hero-fade mt-[clamp(28px,6vh,72px)] flex items-end justify-between gap-6 border-t border-fg-20 pt-5">
          <Slate index="01">{arrival.slate}</Slate>
          <p className="t-label flex items-center gap-3 text-fg-60">
            Scroll
            <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-fg-14">
              <span className="scroll-line absolute inset-0 block bg-fg" />
            </span>
          </p>
        </div>
      </div>

      <Lightbox open={reelOpen} onClose={() => setReelOpen(false)} label="Showreel">
        <div className="w-full max-w-[min(1600px,calc((100svh-var(--header-h)-var(--gutter))*16/9))]">
          <FilmPlayer media={home.reel} autoPlay title="Showreel" />
        </div>
      </Lightbox>
    </section>
  );
}
