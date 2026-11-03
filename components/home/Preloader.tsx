"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ease, stagger } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/a11y";
import { markPreloaded, preloadSeen } from "@/lib/preloader";
import { Logo } from "@/components/brand/Logo";

const WORD = "ARCHIVISUALS";

/**
 * 00 — INTRO (first visit per session). The A mark draws itself and ARCHIVISUALS rises
 * letter by letter in the centre of a black screen; then the whole lockup glides up into
 * the header logo while the black curtain lifts to reveal the hero film. ≤ 2.5s, purely
 * decorative: the page is already rendered underneath and never waits on assets.
 *
 * The lockup is built in em with the same proportions as the header lockup (13px), so the
 * hand-off is a single uniform scale + translate onto the header logo.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    if (preloadSeen() || prefersReducedMotion()) {
      el.style.display = "none";
      markPreloaded();
      return;
    }

    el.style.display = "";
    root.classList.add("intro");
    const q = gsap.utils.selector(el);
    const lockup = q(".intro-lockup")[0] as HTMLElement;
    const logo = q(".intro-logo")[0] as HTMLElement;
    const curtain = q(".intro-curtain")[0] as HTMLElement;
    const target = document.querySelector<HTMLElement>(".header-lockup .header-logo");
    // Below sm the header shows the mark only, so the wordmark fades out on the way up.
    const headerWord = document.querySelector<HTMLElement>(".header-lockup > span");
    const wordVisibleInHeader = !!headerWord && getComputedStyle(headerWord).display !== "none";

    const finish = () => {
      root.classList.remove("intro");
      el.style.display = "none";
    };

    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(q(".logo-stroke"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0)
      .fromTo(q(".intro-letter"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: ease.reveal, stagger: stagger.tight * 0.6 }, 0.2);

    // Fly onto the header logo: origin at the intro logo's top-left, uniform scale by logo height.
    tl.add(() => {
      if (!target) return;
      const l = logo.getBoundingClientRect();
      const box = lockup.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      gsap.set(lockup, { transformOrigin: `${l.left - box.left}px ${l.top - box.top}px` });
      gsap.to(lockup, { x: t.left - l.left, y: t.top - l.top, scale: t.height / l.height, duration: 0.85, ease: ease.transition });
      if (!wordVisibleInHeader) gsap.to(q(".intro-word"), { opacity: 0, duration: 0.4 });
    }, 1.45)
      .to(curtain, { yPercent: -100, duration: 0.85, ease: ease.transition }, 1.5)
      .add(() => markPreloaded(), 1.75)
      .set({}, {}, 2.35);

    // Unmounting mid-way (navigation, or StrictMode's dev double-mount) stops the timeline.
    return () => {
      tl.kill();
      gsap.killTweensOf(lockup);
      root.classList.remove("intro");
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="preloader pointer-events-none fixed inset-0 z-[95]">
      <div className="intro-curtain absolute inset-0 bg-black" />
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <div className="intro-lockup flex items-center gap-[0.923em] will-change-transform" style={{ fontSize: "clamp(22px, 5.6vw, 92px)" }}>
          <Logo className="intro-logo h-[1.846em] w-auto overflow-visible" strokeWidth={9} title="" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
          <span className="intro-word flex overflow-hidden" style={{ ["--wdth" as string]: 125, ["--wght" as string]: 700, letterSpacing: "0.02em" }}>
            {WORD.split("").map((c, i) => (
              <span key={i} className="intro-letter inline-block">
                {c}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
