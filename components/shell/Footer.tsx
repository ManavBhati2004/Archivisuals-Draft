"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/a11y";
import { scrollTo } from "@/lib/lenis";
import { instagramUrl, nav, site, whatsappUrl } from "@/content/site";
import { services } from "@/content/services";
import { TransitionLink } from "./TransitionLink";
import { LiveClock } from "./LiveClock";

const WORD = "ARCHIVISUALS";

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const letters = ref.current?.querySelectorAll(".fw-letter");
      if (!letters?.length) return;
      if (prefersReducedMotion()) {
        gsap.from(letters, { opacity: 0, duration: 0.6, scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } });
        return;
      }
      gsap.from(letters, {
        yPercent: 105,
        duration: duration.reveal,
        ease: ease.reveal,
        stagger: 0.045,
        scrollTrigger: { trigger: ".fw-word", start: "top 95%", once: true },
      });
    },
    { scope: ref },
  );

  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="relative overflow-hidden pt-[clamp(80px,12vh,160px)]">
      <div className="wrap">
        <div className="grid-12 gap-y-12 border-t border-fg-14 pt-12">
          <div className="col-span-12 md:col-span-3">
            <LiveClock className="text-fg" />
            <p className="t-label mt-3 text-fg-40">Real estate films · Auckland</p>
          </div>
          <FooterCol title="Pages" className="md:col-start-6">
            <li>
              <TransitionLink href="/" className="stretch inline-block py-1">Home</TransitionLink>
            </li>
            {nav.map((l) => (
              <li key={l.href}>
                <TransitionLink href={l.href} className="stretch inline-block py-1">
                  {l.label}
                </TransitionLink>
              </li>
            ))}
          </FooterCol>
          <FooterCol title="Services">
            {services.map((s) => (
              <li key={s.id} className="py-1 text-fg-60">
                {s.title}
              </li>
            ))}
          </FooterCol>
          <FooterCol title="Contact">
            <li>
              <a href={`mailto:${site.contact.email}`} className="inline-block py-1 hover:text-fg-60">{site.contact.email}</a>
            </li>
            <li>
              <a href={`tel:${site.contact.phoneHref}`} className="t-num inline-block py-1 hover:text-fg-60">{site.contact.phoneDisplay}</a>
            </li>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-fg-60">WhatsApp</a>
            </li>
            <li>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-fg-60">Instagram</a>
            </li>
          </FooterCol>
        </div>
      </div>

      <p
        aria-label="Archivisuals"
        className="fw-word mt-[clamp(64px,10vh,140px)] flex justify-between overflow-hidden px-[clamp(8px,1.2vw,20px)] leading-[0.8]"
        style={{ fontSize: "clamp(2.5rem, 12.6vw, 15.5rem)", ["--wdth" as string]: 125, ["--wght" as string]: 800, letterSpacing: "-0.02em" }}
      >
        {WORD.split("").map((ch, i) => (
          <span key={i} aria-hidden className="fw-letter inline-block pb-[0.04em]">
            {ch}
          </span>
        ))}
      </p>

      <div className="wrap flex flex-wrap items-center justify-between gap-4 border-t border-fg-14 py-6">
        <p className="t-label text-fg-40">
          © <span className="t-num">{year}</span> {site.name}
        </p>
        <TransitionLink href="/privacy" className="t-label text-fg-40 hover:text-fg">
          Privacy
        </TransitionLink>
        <button type="button" onClick={() => scrollTo(0, { duration: 2 })} className="t-label min-h-[44px] text-fg-60 hover:text-fg">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`col-span-6 md:col-span-2 ${className}`}>
      <p className="t-label mb-4 text-fg-40">{title}</p>
      <ul className="text-[15px]">{children}</ul>
    </div>
  );
}
