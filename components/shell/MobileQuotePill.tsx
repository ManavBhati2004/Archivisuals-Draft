"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ui, useUI } from "@/lib/ui-store";

/** Mobile only: a fixed "Request a quote" pill that appears once past the first screen (not on Contact, which has the form). */
export function MobileQuotePill() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const overlayOpen = useUI((s) => s.menuOpen || s.quoteOpen);
  const hidden = overlayOpen || pathname === "/contact";

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = show && !hidden;
  return (
    <div
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center transition-[transform,opacity] duration-500 ease-[var(--ease-out)] md:hidden"
      style={{ transform: visible ? "translateY(0)" : "translateY(140%)", opacity: visible ? 1 : 0 }}
    >
      <button
        type="button"
        onClick={ui.openQuote}
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        className="t-label min-h-[48px] border border-fg bg-fg px-7 text-bg"
      >
        Request a quote
      </button>
    </div>
  );
}
