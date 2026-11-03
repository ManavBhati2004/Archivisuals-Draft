"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { duration, ease } from "@/lib/motion";
import { prefersReducedMotion, useFinePointer } from "@/lib/a11y";
import { projects, projectTypes, typeLabel, type Project, type ProjectType } from "@/content/projects";
import { Video } from "@/components/media/Video";
import { Parallax } from "@/components/media/Parallax";
import { TriangleReveal } from "@/components/media/TriangleReveal";
import { TransitionLink } from "@/components/shell/TransitionLink";

type Filter = "all" | ProjectType;
type View = "grid" | "list";

const FILTERS: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, ...projectTypes];
const isFilter = (v: string | null): v is Filter => !!v && FILTERS.some((f) => f.id === v);

/** Asymmetric rhythm, repeating every five items: one large, then offset pairs. */
const SLOTS = [
  { cls: "md:col-span-12", reel: "md:w-[36%]" },
  { cls: "md:col-span-7", reel: "md:w-[58%]" },
  { cls: "md:col-span-4 md:col-start-9 md:mt-[16vh]", reel: "md:w-[80%]" },
  { cls: "md:col-span-5 md:col-start-2", reel: "md:w-[72%]" },
  { cls: "md:col-span-6 md:col-start-7 md:mt-[10vh]", reel: "md:w-[64%]" },
];

const matches = (p: Project, f: Filter) => f === "all" || p.types.includes(f);

export function WorkIndex() {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("grid");
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const underline = useRef<HTMLSpanElement>(null);

  // ?type= → initial filter (read after mount so the static HTML always lists everything).
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isFilter(t)) setFilter(t);
  }, []);

  const choose = (f: Filter) => {
    if (f === filter) return;
    if (grid.current && view === "grid") flipState.current = Flip.getState(grid.current.querySelectorAll(".work-item"));
    setFilter(f);
    const url = f === "all" ? "/work" : `/work?type=${f}`;
    window.history.replaceState(window.history.state, "", url);
  };

  // Flip the grid from its previous layout once React has committed the new one.
  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || !grid.current) {
      ScrollTrigger.refresh();
      return;
    }
    const reduced = prefersReducedMotion();
    Flip.from(state, {
      targets: grid.current.querySelectorAll(".work-item"),
      duration: reduced ? 0 : duration.transition * 0.8,
      ease: ease.transition,
      absolute: true,
      scale: false,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: duration.reveal, ease: ease.reveal, delay: 0.2 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.4 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

  // Sliding underline under the active filter.
  useEffect(() => {
    const place = () => {
      const el = tabs.current[filter];
      if (!el || !underline.current) return;
      underline.current.style.transform = `translateX(${el.offsetLeft}px) scaleX(${el.offsetWidth / 100})`;
    };
    place();
    document.fonts?.ready.then(place);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [filter]);

  const visible = projects.filter((p) => matches(p, filter));

  return (
    <>
      <div className="under-header z-40 border-y border-fg-14 bg-bg">
        <div className="wrap flex items-center justify-between gap-6">
          <div className="relative -mx-1 overflow-x-auto [scrollbar-width:none]">
            <ul className="flex gap-x-6 px-1 md:gap-x-9" aria-label="Filter work">
              {FILTERS.map((f) => {
                const on = f.id === filter;
                const count = projects.filter((p) => matches(p, f.id)).length;
                return (
                  <li key={f.id}>
                    <button
                      ref={(el) => {
                        tabs.current[f.id] = el;
                      }}
                      type="button"
                      aria-pressed={on}
                      onClick={() => choose(f.id)}
                      className={`t-label flex min-h-[52px] items-center gap-2 whitespace-nowrap transition-colors duration-300 ${on ? "text-fg" : "text-fg-40 hover:text-fg-60"}`}
                    >
                      {f.label}
                      <span className="t-num text-[11px] text-fg-40">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <span
              ref={underline}
              aria-hidden
              className="absolute bottom-0 left-0 block h-px w-[100px] origin-left bg-fg transition-transform duration-700 ease-[var(--ease-out)]"
            />
          </div>
          <div className="flex shrink-0 gap-4" role="group" aria-label="View">
            {(["grid", "list"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`t-label min-h-[52px] capitalize ${view === v ? "text-fg" : "text-fg-40 hover:text-fg-60"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      <div className="wrap pb-[var(--section-y)] pt-[clamp(48px,10vh,120px)]">
        {view === "grid" ? (
          <ul ref={grid} className="grid-12 gap-y-[clamp(56px,12vh,160px)]">
            {projects.map((p) => {
              const k = visible.indexOf(p);
              const slot = SLOTS[Math.max(0, k) % SLOTS.length];
              return (
                <li key={p.slug} data-flip-id={p.slug} className={`work-item col-span-12 ${slot.cls} ${k < 0 ? "hidden" : ""}`}>
                  <GridItem project={p} reelWidth={slot.reel} />
                </li>
              );
            })}
          </ul>
        ) : (
          <WorkList items={visible} />
        )}
      </div>
    </>
  );
}

function GridItem({ project: p, reelWidth }: { project: Project; reelWidth: string }) {
  const fine = useFinePointer();
  const [hover, setHover] = useState(false);
  const vertical = p.hero.aspect === "9/16";
  return (
    <TransitionLink
      href={`/work/${p.slug}`}
      className="group block"
      data-cursor="play"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className={vertical ? `w-[70%] ${reelWidth}` : ""}>
        <TriangleReveal>
          <div className="relative" style={{ aspectRatio: p.hero.aspect }}>
            <Parallax>
              {/* Desktop: preview plays on hover. Touch: plays while in view. */}
              <Video media={p.hero} mono fill mode={fine ? "active" : "inview"} active={hover} />
            </Parallax>
          </div>
        </TriangleReveal>
      </div>
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="t-h3 group-stretch">{p.title}</h2>
        <p className="t-label text-fg-60">
          {p.suburb} · {typeLabel(p.types[0])} · <span className="t-num">{p.year}</span>
        </p>
      </div>
    </TransitionLink>
  );
}

/** Index rows; on desktop a preview clip follows the cursor over the hovered row. */
function WorkList({ items }: { items: Project[] }) {
  const fine = useFinePointer();
  const [hovered, setHovered] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const el = preview.current;
      if (!el || !fine) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        xTo(e.clientX + 24);
        yTo(e.clientY - el.offsetHeight / 2);
      };
      window.addEventListener("pointermove", move, { passive: true });
      return () => window.removeEventListener("pointermove", move);
    },
    { dependencies: [fine] },
  );

  useGSAP(
    () => {
      gsap.from(".list-row", { opacity: 0, y: 24, duration: duration.reveal, ease: ease.reveal, stagger: 0.05 });
    },
    { scope: list, dependencies: [items.length] },
  );

  return (
    <>
      <ol ref={list} className="border-t border-fg-14" onMouseLeave={() => setHovered(null)}>
        {items.map((p, i) => (
          <li key={p.slug} className="list-row border-b border-fg-14" onMouseEnter={() => setHovered(i)}>
            <TransitionLink
              href={`/work/${p.slug}`}
              className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 py-6 transition-opacity duration-500 md:grid-cols-[4rem_1fr_12rem_10rem_4rem]"
              style={{ opacity: hovered === null || hovered === i ? 1 : 0.35 }}
              onFocus={() => setHovered(i)}
            >
              <span className="t-num text-fg-40">{String(i + 1).padStart(2, "0")}</span>
              <span className="group-stretch uppercase" style={{ fontSize: "clamp(1.5rem, 3.4vw, 3.25rem)", lineHeight: 1, ["--wght" as string]: 700 }}>
                {p.title}
              </span>
              <span className="t-label col-start-2 text-fg-60 md:col-start-auto">{p.suburb}</span>
              <span className="t-label col-start-2 text-fg-60 md:col-start-auto">{typeLabel(p.types[0])}</span>
              <span className="t-num hidden text-fg-40 md:block">{p.year}</span>
            </TransitionLink>
          </li>
        ))}
      </ol>

      {fine && (
        <div ref={preview} aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 w-[min(26vw,380px)]">
          {items.map((p, i) => (
            <div
              key={p.slug}
              className="absolute left-0 top-0 w-full transition-[opacity,clip-path] duration-500 ease-[var(--ease-out)]"
              style={{ opacity: hovered === i ? 1 : 0, clipPath: hovered === i ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
            >
              <Video media={p.hero} mode="active" active={hovered === i} className={p.hero.aspect === "9/16" ? "mx-auto !w-1/2" : ""} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
