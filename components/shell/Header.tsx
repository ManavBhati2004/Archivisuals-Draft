"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { nav } from "@/content/site";
import { ui, useUI } from "@/lib/ui-store";
import { Logo, Wordmark } from "@/components/brand/Logo";
import { TransitionLink } from "./TransitionLink";
import { Magnetic } from "@/components/type/Magnetic";

/** Hides on scroll down, returns on scroll up; gains a backdrop once past the first screen. */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const menuOpen = useUI((s) => s.menuOpen);
  const [solid, setSolid] = useState(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const show = gsap.quickTo(el, "yPercent", { duration: 0.6, ease: "expo.out" });
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setSolid(y > window.innerHeight * 0.85);
          const hidden = !ui.get().menuOpen && y >= 120 && self.direction === 1;
          show(hidden ? -100 : 0);
          // Sticky bars under the header (Work filters) follow it up and down.
          document.documentElement.dataset.header = hidden ? "hidden" : "shown";
        },
      });
      return () => st.kill();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-[60] transition-[background-color,backdrop-filter] duration-500 ${
        solid && !menuOpen ? "bg-[rgb(var(--bg-rgb)/0.55)] backdrop-blur-md" : ""
      } ${menuOpen ? "theme-dark text-fg" : ""}`}
    >
      <a href="#main" className="sr-only-focusable t-label absolute left-4 top-4 z-10 bg-fg px-4 py-3 text-bg">
        Skip to content
      </a>
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        {/* Lockup is sized in em so the intro can fly its scaled-up twin into this exact spot. */}
        <TransitionLink href="/" aria-label="Archivisuals — home" className="header-lockup flex items-center gap-[0.923em] text-[13px]" data-cursor="link">
          <Logo className="header-logo h-[1.846em] w-auto" strokeWidth={9} title="" aria-hidden />
          <Wordmark className="hidden sm:inline" />
        </TransitionLink>

        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          {nav.map((l) => (
            <TransitionLink
              key={l.href}
              href={l.href}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
              className={`stretch t-label inline-block py-3 [--wdth:100] ${
                pathname.startsWith(l.href) ? "text-fg" : "text-fg-60 hover:text-fg"
              }`}
            >
              {l.label}
            </TransitionLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={ui.toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="t-label flex min-h-[44px] items-center gap-3 px-2"
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <span aria-hidden className="relative block h-[9px] w-5">
              <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${menuOpen ? "top-1 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${menuOpen ? "top-1 -rotate-45" : "top-2"}`} />
            </span>
          </button>
          <span className="hidden md:inline-block">
            <Magnetic>
              <button
                type="button"
                onClick={ui.openQuote}
                className="t-label min-h-[44px] border border-fg bg-fg px-5 py-3 text-bg transition-colors duration-300 hover:bg-transparent hover:text-fg"
              >
                Request a quote
              </button>
            </Magnetic>
          </span>
        </div>
      </div>
    </header>
  );
}
