"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/a11y";
import type { MediaStill } from "@/content/media";
import { Still } from "./Still";
import { Lightbox } from "./Lightbox";

/**
 * Horizontal stills gallery: drag (mouse or touch) with inertia, keyboard focus scrolls items
 * into view, click opens a lightbox with previous/next.
 */
export function DragGallery({ stills, label = "Stills" }: { stills: MediaStill[]; label?: string }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const x = useRef(0);
  const [open, setOpen] = useState<number | null>(null);
  const moved = useRef(false);

  const bounds = () => {
    const vw = viewport.current?.clientWidth ?? 0;
    const tw = track.current?.scrollWidth ?? 0;
    return { min: Math.min(0, vw - tw), max: 0 };
  };

  const setX = useCallback((v: number, animate = false) => {
    const { min, max } = bounds();
    x.current = Math.min(max, Math.max(min, v));
    if (animate) gsap.to(track.current, { x: x.current, duration: prefersReducedMotion() ? 0 : 1.1, ease: ease.reveal, overwrite: true });
    else gsap.set(track.current, { x: x.current });
  }, []);

  useGSAP(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;
    let startX = 0;
    let startPos = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let dragging = false;

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      moved.current = false;
      startX = lastX = e.clientX;
      startPos = x.current;
      lastT = performance.now();
      velocity = 0;
      gsap.killTweensOf(tr);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6 && !moved.current) {
        moved.current = true;
        vp.setPointerCapture(e.pointerId);
      }
      if (!moved.current) return;
      const now = performance.now();
      velocity = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      // Rubber-band past the ends.
      const { min, max } = bounds();
      let next = startPos + dx;
      if (next > max) next = max + (next - max) * 0.3;
      if (next < min) next = min + (next - min) * 0.3;
      x.current = next;
      gsap.set(tr, { x: next });
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (moved.current) {
        const cap = vp.clientWidth * 0.8;
        setX(x.current + Math.max(-cap, Math.min(cap, velocity * 420)), true);
        // Swallow only the click that ends this drag; keyboard activation must still work after.
        window.setTimeout(() => (moved.current = false), 0);
      }
    };
    vp.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    const onResize = () => setX(x.current);
    window.addEventListener("resize", onResize);
    return () => {
      vp.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", onResize);
    };
  });

  // Keep the focused item in view when tabbing.
  const onFocusItem = (el: HTMLElement) => {
    const vw = viewport.current?.clientWidth ?? 0;
    const left = el.offsetLeft;
    if (left + x.current < 0 || left + el.offsetWidth + x.current > vw) setX(-(left - vw * 0.1), true);
  };

  return (
    <>
      <div ref={viewport} className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing" data-cursor="drag">
        <ul ref={track} className="flex w-max gap-[clamp(12px,2vw,32px)] px-[var(--gutter)] will-change-transform" aria-label={label}>
          {stills.map((s, i) => (
            <li key={s.id + i} className="shrink-0">
              <button
                type="button"
                className="group block h-[clamp(240px,52vh,620px)] text-left"
                style={{ aspectRatio: s.aspect }}
                onClick={() => !moved.current && setOpen(i)}
                onFocus={(e) => onFocusItem(e.currentTarget.parentElement as HTMLElement)}
                aria-label={`Open still ${i + 1} of ${stills.length}: ${s.alt}`}
              >
                <Still media={s} fill className="!relative h-full" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <StillsLightbox stills={stills} index={open} onChange={setOpen} />
    </>
  );
}

function StillsLightbox({ stills, index, onChange }: { stills: MediaStill[]; index: number | null; onChange: (i: number | null) => void }) {
  const n = stills.length;
  const go = (d: number) => index !== null && onChange((index + d + n) % n);
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "ArrowRight") onChange((index + 1) % n);
      else if (e.key === "ArrowLeft") onChange((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, n, onChange]);
  useEffect(() => {
    if (index === null) return;
    const img = new Image();
    img.src = stills[(index + 1) % n].src;
  }, [index, stills, n]);

  const s = index !== null ? stills[index] : null;
  return (
    <Lightbox open={index !== null} onClose={() => onChange(null)} label={s ? `Still ${index! + 1} of ${n}` : "Still"}>
      {s && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6">
          <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
            <Still key={s.id} media={s} fit="contain" fill />
          </div>
          <div className="flex items-center gap-8">
            <button type="button" onClick={() => go(-1)} className="t-label min-h-[44px] px-2">
              ← Prev
            </button>
            <p className="t-num text-fg-60">
              {String(index! + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </p>
            <button type="button" onClick={() => go(1)} className="t-label min-h-[44px] px-2">
              Next →
            </button>
          </div>
        </div>
      )}
    </Lightbox>
  );
}
