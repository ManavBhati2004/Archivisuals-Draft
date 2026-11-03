"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cursor as C, duration, ease } from "@/lib/motion";
import { prefersReducedMotion, useFinePointer } from "@/lib/a11y";

type Mode = "default" | "link" | "play" | "drag";

/**
 * 8px white dot with mix-blend-mode: difference, so it reads on black and white alike.
 * [data-cursor="play"] → 88px circle with a triangle and "PLAY"; "drag" → "DRAG";
 * links and buttons → slight grow. Desktop (fine pointer) only.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useFinePointer();
  const [mode, setMode] = useState<Mode>("default");

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, [enabled]);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const reduced = prefersReducedMotion();
    const dur = reduced ? 0 : 1 - C.lerp * 4;
    const xTo = gsap.quickTo(el, "x", { duration: dur, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: dur, ease: "power3.out" });
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { opacity: 1, duration: duration.micro });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const tagged = t?.closest<HTMLElement>("[data-cursor]");
      if (tagged) return setMode((tagged.dataset.cursor as Mode) ?? "default");
      if (t?.closest("a, button, [role='button'], label, select")) return setMode("link");
      setMode("default");
    };
    const onLeave = () => {
      gsap.to(el, { opacity: 0, duration: duration.micro });
      shown = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = mode === "play" || mode === "drag" ? C.media : mode === "link" ? 28 : C.dot;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0 mix-blend-difference"
      style={{ willChange: "transform" }}
    >
      <div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black"
        style={{
          width: size,
          height: size,
          transition: `width 0.45s ${ease.css}, height 0.45s ${ease.css}`,
        }}
      >
        <span
          className="t-label flex flex-col items-center gap-1 text-[10px] transition-opacity duration-300"
          style={{ opacity: mode === "play" || mode === "drag" ? 1 : 0 }}
        >
          {mode === "play" && (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M2 1 L11 6 L2 11 Z" fill="currentColor" />
            </svg>
          )}
          {mode === "play" ? "Play" : mode === "drag" ? "Drag" : ""}
        </span>
      </div>
    </div>
  );
}
