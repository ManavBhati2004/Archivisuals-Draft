"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePinMode } from "@/lib/a11y";
import { scrollTo } from "@/lib/lenis";
import { projects, projectTypes, typeLabel, type Project } from "@/content/projects";
import { Video } from "@/components/media/Video";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { RollingDigits } from "@/components/type/RollingDigits";
import { Slate } from "@/components/type/Slate";

const FILMS: Project[] = projects.slice(0, 6);

/**
 * 03 — SELECTED FILMS. Desktop: the section pins and a horizontal track of film panels
 * moves with scroll (scrub 1). The centred panel is active: full scale, colour, playing.
 * Touch / reduced motion: a native scroll-snap carousel with the same counter and bar.
 */
export function SelectedFilms() {
  const ref = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const stops = useRef<number[]>([]);
  const pinMode = usePinMode();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  const panels = () => Array.from(track.current?.querySelectorAll<HTMLElement>(".film-panel") ?? []);
  const nearest = (p: number) => stops.current.reduce((best, s, i) => (Math.abs(s - p) < Math.abs(stops.current[best] - p) ? i : best), 0);
  const setProgress = (p: number) => {
    if (fill.current) fill.current.style.transform = `scaleX(${p})`;
    setActive(nearest(p));
  };

  // Desktop: pinned horizontal scrub.
  useGSAP(
    () => {
      if (!pinMode || !track.current || !ref.current) return;
      const measure = () => {
        const ps = panels();
        const centres = ps.map((el) => el.offsetLeft + el.offsetWidth / 2);
        const dist = centres[centres.length - 1] - centres[0];
        stops.current = centres.map((c) => (c - centres[0]) / dist);
        return dist;
      };
      let distance = measure();
      const tween = gsap.to(track.current, {
        x: () => -distance,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            distance = measure();
          },
          onUpdate: (self) => setProgress(self.progress),
        },
      });
      st.current = tween.scrollTrigger ?? null;
      // This pin is created after hydration (once the media query resolves), i.e. after the
      // triggers below it — re-sort so everything downstream accounts for its spacer.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return () => {
        st.current = null;
      };
    },
    { dependencies: [pinMode], scope: ref, revertOnUpdate: true },
  );

  // Touch / reduced motion: native scroller drives the same UI.
  useEffect(() => {
    const vp = viewport.current;
    if (pinMode || !vp) return;
    const measure = () => {
      const max = vp.scrollWidth - vp.clientWidth || 1;
      stops.current = panels().map((el) => Math.min(1, Math.max(0, (el.offsetLeft + el.offsetWidth / 2 - vp.clientWidth / 2) / max)));
    };
    const onScroll = () => setProgress(vp.scrollLeft / (vp.scrollWidth - vp.clientWidth || 1));
    measure();
    onScroll();
    vp.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      vp.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinMode]);

  // Only the active panel plays, and only while the section is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goToProgress = useCallback(
    (p: number, immediate = false) => {
      p = Math.min(1, Math.max(0, p));
      if (pinMode && st.current) {
        const s = st.current;
        scrollTo(s.start + p * (s.end - s.start), { immediate, duration: 1.2 });
      } else if (viewport.current) {
        const vp = viewport.current;
        vp.scrollTo({ left: p * (vp.scrollWidth - vp.clientWidth), behavior: immediate ? "instant" : "smooth" });
      }
    },
    [pinMode],
  );

  const goTo = (i: number) => goToProgress(stops.current[i] ?? 0);

  const dragFrom = (e: PointerEvent<HTMLDivElement>) => {
    const r = bar.current?.getBoundingClientRect();
    if (r) goToProgress((e.clientX - r.left) / r.width, true);
  };

  const onBarKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo(Math.min(FILMS.length - 1, active + 1));
    else if (e.key === "ArrowLeft") goTo(Math.max(0, active - 1));
    else if (e.key === "Home") goTo(0);
    else if (e.key === "End") goTo(FILMS.length - 1);
    else return;
    e.preventDefault();
  };

  const activeType = FILMS[active]?.types[0];

  return (
    <section
      ref={ref}
      id="selected-films"
      data-chapter="Selected films"
      className={`relative flex flex-col ${pinMode ? "h-svh justify-between pb-[72px] pt-[calc(var(--header-h)+4vh)]" : "section gap-10"}`}
    >
      <div className="wrap flex flex-wrap items-end justify-between gap-6">
        <div>
          <Slate index="03">Selected films</Slate>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2" aria-label="Film categories">
            {projectTypes.map((t) => {
              const first = FILMS.findIndex((p) => p.types[0] === t.id);
              if (first < 0) return null;
              const on = t.id === activeType;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => goTo(first)}
                    aria-pressed={on}
                    className={`t-label relative min-h-[44px] transition-colors duration-300 ${on ? "text-fg" : "text-fg-40 hover:text-fg-60"}`}
                  >
                    {t.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-2 block h-px origin-left bg-fg transition-transform duration-500 ease-[var(--ease-out)]"
                      style={{ transform: `scaleX(${on ? 1 : 0})` }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="flex items-baseline gap-3 text-[clamp(1.75rem,3vw,3rem)]" aria-live="polite">
          <RollingDigits value={active + 1} />
          <span className="t-num text-fg-40">/</span>
          <span className="t-num text-fg-40">{String(FILMS.length).padStart(2, "0")}</span>
        </p>
      </div>

      <div
        ref={viewport}
        className={pinMode ? "overflow-hidden" : "snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}
        data-lenis-prevent-horizontal
      >
        <div
          ref={track}
          className="flex w-max items-end gap-[clamp(16px,3vw,56px)] will-change-transform [--ph:min(54svh,34.9vw)] max-md:[--ph:calc(84vw*9/16)]"
          style={{ paddingInline: pinMode ? "calc(50vw - var(--ph) * 8 / 9)" : "var(--gutter)" }}
        >
          {FILMS.map((p, i) => {
            const vertical = p.hero.aspect === "9/16";
            const on = i === active;
            return (
              <article key={p.slug} className="film-panel shrink-0 snap-center" aria-current={on ? "true" : undefined}>
                <TransitionLink href={`/work/${p.slug}`} className="group block" data-cursor="play" aria-label={`${p.title}, ${p.suburb} — view project`}>
                  <div
                    className="origin-bottom transition-transform duration-[900ms] ease-[var(--ease-out)]"
                    style={{ transform: `scale(${on ? 1 : 0.85})` }}
                  >
                    <div style={{ height: "var(--ph)", aspectRatio: vertical ? "9/16" : "16/9" }}>
                      <Video media={p.hero} mode="active" active={on && inView} mono fill className="!relative h-full" />
                    </div>
                    <div className={`mt-5 transition-opacity duration-700 ${on ? "opacity-100" : "opacity-40"}`} style={{ width: vertical ? "calc(var(--ph) * 9 / 16)" : undefined }}>
                      <h3 className="t-h3 truncate">{p.title}</h3>
                      <p className="t-label mt-2 text-fg-60">
                        {p.suburb} · {typeLabel(p.types[0])} · <span className="t-num">{p.year}</span>
                      </p>
                    </div>
                  </div>
                </TransitionLink>
              </article>
            );
          })}
        </div>
      </div>

      <div className="wrap flex items-center gap-8">
        <div
          ref={bar}
          role="slider"
          tabIndex={0}
          aria-label="Film position"
          aria-valuemin={1}
          aria-valuemax={FILMS.length}
          aria-valuenow={active + 1}
          aria-valuetext={`${FILMS[active]?.title}, ${active + 1} of ${FILMS.length}`}
          data-cursor="drag"
          className="relative flex h-8 flex-1 cursor-grab touch-none items-center active:cursor-grabbing"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            dragFrom(e);
          }}
          onPointerMove={(e) => e.buttons === 1 && dragFrom(e)}
          onKeyDown={onBarKey}
        >
          <span className="block h-px w-full bg-fg-20" />
          <span ref={fill} className="absolute left-0 block h-px w-full origin-left bg-fg" style={{ transform: "scaleX(0)" }} />
        </div>
        <TransitionLink href="/work" className="stretch t-label shrink-0 py-3">
          All work →
        </TransitionLink>
      </div>
    </section>
  );
}
