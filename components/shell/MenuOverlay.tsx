"use client";

import { useCallback, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease, stagger } from "@/lib/motion";
import { useFocusTrap, prefersReducedMotion } from "@/lib/a11y";
import { startScroll, stopScroll } from "@/lib/lenis";
import { ui, useUI } from "@/lib/ui-store";
import { clips, type MediaClip } from "@/content/media";
import { instagramUrl, site, whatsappUrl } from "@/content/site";
import { TransitionLink } from "./TransitionLink";
import { Video } from "@/components/media/Video";
import { LiveClock } from "./LiveClock";

const links: { href: string; label: string; clip: MediaClip }[] = [
  { href: "/", label: "Home", clip: clips.heroDusk },
  { href: "/work", label: "Work", clip: clips.aerialPullback },
  { href: "/about", label: "About", clip: clips.bts },
  { href: "/contact", label: "Contact", clip: clips.interiorWalk },
];

/** Full-screen black menu: giant expanded links; the hovered one stretches over its muted preview. */
export function MenuOverlay() {
  const open = useUI((s) => s.menuOpen);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const close = useCallback(() => ui.closeMenu(), []);
  useFocusTrap(ref, open, close);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduced = prefersReducedMotion();
      if (open) {
        stopScroll();
        gsap.set(el, { visibility: "visible" });
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0.01 : 0.9, ease: ease.transition });
        gsap.fromTo(
          el.querySelectorAll(".menu-link-inner"),
          { yPercent: reduced ? 0 : 110, opacity: reduced ? 0 : 1 },
          { yPercent: 0, opacity: 1, duration: duration.reveal, ease: ease.reveal, stagger: stagger.items, delay: reduced ? 0 : 0.35 },
        );
        gsap.fromTo(el.querySelectorAll(".menu-fade"), { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 0.6 });
      } else {
        startScroll();
        gsap.to(el, {
          clipPath: "inset(0 0 100% 0)",
          duration: reduced ? 0.01 : 0.7,
          ease: ease.transition,
          onComplete: () => {
            gsap.set(el, { visibility: "hidden" });
            setHovered(null);
          },
        });
      }
    },
    { dependencies: [open], scope: ref },
  );

  return (
    <div
      ref={ref}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className="theme-dark fixed inset-0 z-[55] flex flex-col bg-black text-fg"
      style={{ visibility: "hidden", clipPath: "inset(0 0 100% 0)" }}
    >
      {/* Preview clips behind the links */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {links.map((l, i) => (
          <div key={l.href} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: hovered === i ? 0.4 : 0 }}>
            <Video media={l.clip} mode="active" active={open && hovered === i} fill />
          </div>
        ))}
      </div>

      <nav aria-label="Menu" className="wrap relative flex flex-1 flex-col justify-center pt-[var(--header-h)]">
        <ul onMouseLeave={() => setHovered(null)}>
          {links.map((l, i) => {
            const current = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href} className="overflow-hidden">
                <TransitionLink
                  href={l.href}
                  tabIndex={open ? 0 : -1}
                  aria-current={current ? "page" : undefined}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  className="block py-1 transition-[opacity,--wdth] duration-500 ease-[var(--ease-out)]"
                  style={{
                    opacity: hovered === null || hovered === i ? 1 : 0.3,
                    ["--wdth" as string]: hovered === i ? 125 : 100,
                    ["--wght" as string]: 750,
                  }}
                >
                  <span className="menu-link-inner flex items-baseline gap-6">
                    <span className="t-num text-sm text-fg-40">0{i + 1}</span>
                    <span className="text-[clamp(3rem,11vw,9.5rem)] uppercase leading-[0.95] tracking-[-0.02em]">{l.label}</span>
                  </span>
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="menu-fade wrap relative grid grid-cols-2 gap-6 pb-8 md:grid-cols-4">
        <LiveClock className="text-fg-60" />
        <a tabIndex={open ? 0 : -1} href={`mailto:${site.contact.email}`} className="t-label text-fg-60 hover:text-fg">
          {site.contact.email}
        </a>
        <a tabIndex={open ? 0 : -1} href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="t-label text-fg-60 hover:text-fg">
          WhatsApp
        </a>
        <a tabIndex={open ? 0 : -1} href={instagramUrl} target="_blank" rel="noopener noreferrer" className="t-label text-fg-60 hover:text-fg">
          Instagram
        </a>
      </div>
    </div>
  );
}
