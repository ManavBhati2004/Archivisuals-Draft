"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { reels } from "@/content/extras";
import { Video } from "@/components/media/Video";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Slate } from "@/components/type/Slate";
import { SplitLines } from "@/components/type/SplitLines";

/** Swipeable 9:16 reels inside a minimal phone outline (swipe, drag, arrows or dots). */
export function ReelsStrip() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const t = track.current;
    if (!t) return;
    const n = Math.max(0, Math.min(reels.length - 1, i));
    t.scrollTo({ left: n * t.clientWidth, behavior: "smooth" });
  };

  // Mouse drag (touch swipes natively).
  const drag = useRef({ x: 0, left: 0, down: false });
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, down: true };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down || !track.current) return;
    track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = () => {
    if (!drag.current.down || !track.current) return;
    drag.current.down = false;
    setDragging(false);
    const t = track.current;
    const delta = t.scrollLeft - drag.current.left;
    const from = Math.round(drag.current.left / t.clientWidth);
    go(Math.abs(delta) > t.clientWidth * 0.15 ? from + Math.sign(delta) : from);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(active + 1);
    else if (e.key === "ArrowLeft") go(active - 1);
    else return;
    e.preventDefault();
  };

  const current = reels[active].project;

  return (
    <section ref={section} data-chapter="Reels" className="section border-t border-fg-14">
      <div className="wrap grid-12 items-center gap-y-14">
        <div className="col-span-12 md:col-span-5">
          <Slate index="02">Made for the feed</Slate>
          <SplitLines className="t-display-sm mt-8">Reels, cut vertical.</SplitLines>
          <p className="t-body mt-8">Short 9:16 cuts for Instagram, TikTok and the portals — sound-off friendly, captioned, and ready the day after the shoot.</p>
          <div className="mt-10 flex items-center gap-6">
            <button type="button" onClick={() => go(active - 1)} disabled={active === 0} className="t-label min-h-[44px] disabled:opacity-30" aria-label="Previous reel">
              ← Prev
            </button>
            <p className="t-num text-fg-60" aria-live="polite">
              {String(active + 1).padStart(2, "0")} / {String(reels.length).padStart(2, "0")}
            </p>
            <button type="button" onClick={() => go(active + 1)} disabled={active === reels.length - 1} className="t-label min-h-[44px] disabled:opacity-30" aria-label="Next reel">
              Next →
            </button>
          </div>
        </div>

        <div className="col-span-12 flex flex-col items-center md:col-span-5 md:col-start-8">
          {/* Phone outline */}
          <div className="relative w-[min(300px,72vw)] rounded-[44px] border border-fg-40 p-[10px]" style={{ aspectRatio: "9/19" }}>
            <span aria-hidden className="absolute left-1/2 top-[18px] z-10 block h-[18px] w-[76px] -translate-x-1/2 rounded-full bg-black" />
            <div className="relative h-full overflow-hidden rounded-[34px] bg-black">
              {/* Story-style progress segments */}
              <div aria-hidden className="absolute inset-x-4 top-11 z-10 flex gap-1">
                {reels.map((_, i) => (
                  <span key={i} className={`h-[2px] flex-1 transition-colors duration-500 ${i <= active ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
              <div
                ref={track}
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label="Reels"
                onKeyDown={onKey}
                onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerLeave={endDrag}
                data-cursor="drag"
                data-lenis-prevent-horizontal
                className={`flex h-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${dragging ? "cursor-grabbing select-none" : "snap-x snap-mandatory"}`}
              >
                {reels.map((r, i) => (
                  <div key={r.clip.id} className="relative h-full w-full shrink-0 snap-center" aria-label={`Reel ${i + 1} of ${reels.length}: ${r.project.title}`} role="group">
                    <Video media={r.clip} fill mode="active" active={inView && i === active} />
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-6 pt-16 text-white">
                <p className="t-label">{current.title}</p>
                <p className="t-label mt-1 text-white/60">{current.suburb}</p>
              </div>
            </div>
          </div>
          <TransitionLink href={`/work/${current.slug}`} className="stretch t-label mt-8 py-2">
            View {current.title} →
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
