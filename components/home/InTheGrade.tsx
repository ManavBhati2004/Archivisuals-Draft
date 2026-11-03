"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { home } from "@/content/home";
import { webpOf } from "@/content/media";
import { prefersReducedMotion } from "@/lib/a11y";
import { release, requestPlay } from "@/lib/media-budget";
import { Letterbox } from "@/components/media/Letterbox";
import { Slate } from "@/components/type/Slate";

/** Placeholder "raw" look until real log/graded pairs arrive. */
const RAW_FILTER = "saturate(0.35) contrast(0.72) brightness(1.08)";

/**
 * 05 — IN THE GRADE. Raw (left) vs graded (right), both playing in sync. Drag the divider,
 * or focus it and use the arrow keys. The film letterboxes briefly as it enters.
 */
export function InTheGrade() {
  const { grade } = home;
  const frame = useRef<HTMLDivElement>(null);
  const graded = useRef<HTMLVideoElement>(null);
  const raw = useRef<HTMLVideoElement>(null);
  const [pos, setPos] = useState(50);

  // Graded is the master clock; raw follows it.
  useEffect(() => {
    const m = graded.current;
    const f = raw.current;
    const el = frame.current;
    if (!m || !f || !el || prefersReducedMotion()) return;
    m.dataset.pinned = "true";
    const sync = () => {
      if (Math.abs(f.currentTime - m.currentTime) > 0.08) f.currentTime = m.currentTime;
    };
    const onPlay = () => requestPlay(f);
    const onPause = () => release(f);
    m.addEventListener("play", onPlay);
    m.addEventListener("pause", onPause);
    m.addEventListener("timeupdate", sync);
    m.addEventListener("seeked", sync);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          m.preload = f.preload = "auto";
          requestPlay(m);
        } else {
          release(m);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      m.removeEventListener("play", onPlay);
      m.removeEventListener("pause", onPause);
      m.removeEventListener("timeupdate", sync);
      m.removeEventListener("seeked", sync);
      release(m);
      release(f);
    };
  }, []);

  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = frame.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  const sources = (
    <>
      <source src={grade.film.webm} type="video/webm" />
      <source src={grade.film.mp4} type="video/mp4" />
    </>
  );
  const vidCls = "absolute inset-0 h-full w-full object-cover";

  return (
    <section id="grade" data-chapter="In the grade" className="section">
      <div className="wrap mb-10 flex flex-wrap items-end justify-between gap-6">
        <Slate index="05">In the grade</Slate>
        <p className="t-label text-fg-60">{grade.caption}</p>
      </div>

      <Letterbox className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] max-md:px-0">
        <div
          ref={frame}
          className="relative w-full touch-none select-none overflow-hidden bg-black"
          style={{ aspectRatio: "16/9" }}
          data-cursor="drag"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            fromPointer(e);
          }}
          onPointerMove={(e) => e.buttons === 1 && fromPointer(e)}
        >
          <video ref={graded} className={vidCls} poster={webpOf(grade.film.poster)} muted playsInline loop preload="none" aria-label={`${grade.film.alt}, graded`}>
            {sources}
          </video>
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <video ref={raw} className={vidCls} style={{ filter: RAW_FILTER }} poster={webpOf(grade.film.poster)} muted playsInline loop preload="none" aria-hidden>
              {sources}
            </video>
          </div>

          <span className="t-label pointer-events-none absolute left-4 top-4 text-white mix-blend-difference">Raw</span>
          <span className="t-label pointer-events-none absolute right-4 top-4 text-white mix-blend-difference">Graded</span>

          <div
            role="slider"
            tabIndex={0}
            aria-label="Compare raw and graded footage"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(pos)}% raw`}
            onKeyDown={onKey}
            className="absolute inset-y-0 -ml-6 flex w-12 justify-center outline-offset-0"
            style={{ left: `${pos}%` }}
          >
            <span className="block h-full w-px bg-white" />
            <span className="absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white bg-black/30 text-white">
              <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden>
                <path d="M5 0 L0 5 L5 10 Z M13 0 L18 5 L13 10 Z" fill="currentColor" />
              </svg>
            </span>
          </div>
        </div>
      </Letterbox>
    </section>
  );
}
