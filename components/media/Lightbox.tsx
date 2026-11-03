"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { prefersReducedMotion, useFocusTrap } from "@/lib/a11y";
import { startScroll, stopScroll } from "@/lib/lenis";

/** Full-screen black lightbox with focus trap, Esc to close and scroll lock. */
export function Lightbox({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose);

  useEffect(() => {
    if (!open || !ref.current) return;
    stopScroll();
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: prefersReducedMotion() ? 0.01 : 0.6, ease: ease.reveal });
    return () => startScroll();
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div ref={ref} role="dialog" aria-modal="true" aria-label={label} className="theme-dark fixed inset-0 z-[80] flex flex-col bg-black text-fg" data-lenis-prevent>
      <div className="wrap flex h-[var(--header-h)] shrink-0 items-center justify-between">
        <p className="t-label text-fg-60">{label}</p>
        <button type="button" onClick={onClose} data-autofocus className="t-label min-h-[44px] px-2">
          Close
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-[var(--gutter)] pb-[var(--gutter)]">{children}</div>
    </div>,
    document.body,
  );
}
