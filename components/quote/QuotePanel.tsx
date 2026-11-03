"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { prefersReducedMotion, useFocusTrap } from "@/lib/a11y";
import { startScroll, stopScroll } from "@/lib/lenis";
import { ui, useUI } from "@/lib/ui-store";
import { site, whatsappUrl } from "@/content/site";
import { QuoteForm } from "./QuoteForm";

/** Global slide-over opened by every "Request a quote" button; holds the shared QuoteForm. */
export function QuotePanel() {
  const open = useUI((s) => s.quoteOpen);
  const ref = useRef<HTMLDivElement>(null);
  // The form mounts while the panel is open, so it always restores the latest saved draft.
  const [mounted, setMounted] = useState(false);
  const close = useCallback(() => ui.closeQuote(), []);
  useFocusTrap(ref, open, close);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const panel = el.querySelector(".quote-sheet");
      const scrim = el.querySelector(".quote-scrim");
      const d = prefersReducedMotion() ? 0.01 : 0.9;
      if (open) {
        stopScroll();
        setMounted(true);
        gsap.set(el, { visibility: "visible" });
        gsap.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: d * 0.6 });
        gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: d, ease: ease.transition });
      } else {
        startScroll();
        gsap.to(scrim, { opacity: 0, duration: d * 0.6 });
        gsap.to(panel, { xPercent: 100, duration: d * 0.8, ease: ease.transition, onComplete: () => {
            gsap.set(el, { visibility: "hidden" });
            setMounted(false);
          },
        });
      }
    },
    { dependencies: [open], scope: ref },
  );

  return (
    <div ref={ref} className="fixed inset-0 z-[70]" style={{ visibility: "hidden" }} aria-hidden={!open}>
      <button type="button" aria-label="Close quote panel" tabIndex={-1} onClick={close} className="quote-scrim absolute inset-0 bg-black/60" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        className="quote-sheet theme-dark absolute inset-y-0 right-0 flex w-full max-w-[640px] flex-col overflow-y-auto border-l border-fg-14 bg-black px-[clamp(20px,4vw,56px)] py-8 text-fg"
        data-lenis-prevent
      >
        <div className="flex items-center justify-between">
          <p className="t-label text-fg-60">Request a quote</p>
          <button type="button" onClick={close} data-autofocus className="t-label min-h-[44px] px-2">
            Close
          </button>
        </div>
        <h2 id="quote-title" className="t-display-sm mt-12 !text-[clamp(2rem,3.4vw,3.25rem)]">
          Let&rsquo;s film your next listing.
        </h2>
        <p className="t-body mt-6">
          Tell us about the property. We reply within {site.replyHours} hours — or{" "}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="border-b border-fg-40 text-fg hover:border-fg">
            message us on WhatsApp
          </a>
          .
        </p>
        <div className="mt-12 pb-8">
          {mounted && <QuoteForm compact />}
        </div>
      </div>
    </div>
  );
}
