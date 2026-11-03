"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cursor } from "@/lib/motion";
import { isFinePointer, prefersReducedMotion } from "@/lib/a11y";

/** Pulls its child toward the pointer when it comes within ~80px. Fine pointers only. */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !isFinePointer() || prefersReducedMotion()) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "expo.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "expo.out" });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const reach = cursor.magneticRadius + Math.max(r.width, r.height) / 2;
        if (Math.hypot(dx, dy) < reach) {
          xTo(dx * cursor.magneticStrength);
          yTo(dy * cursor.magneticStrength);
        } else {
          xTo(0);
          yTo(0);
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
