import type { SVGProps } from "react";

/**
 * The Archivisuals "A" mark, inline so its stroke can animate (stroke-dashoffset on
 * `.logo-stroke`, pathLength normalised to 1).
 * PLACEHOLDER TRACE — swap the path for the master vector when supplied (/public/brand/logo.svg).
 */
export const LOGO_PATH = "M30 86 H4 L50 6 L96 86 H30 L50 48 L64 74 H38";

export function Logo({ strokeWidth = 7, title = "Archivisuals", ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg viewBox="0 0 100 92" fill="none" role="img" aria-label={title} {...props}>
      <path
        className="logo-stroke"
        d={LOGO_PATH}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
        strokeMiterlimit={10}
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={className} style={{ ["--wdth" as string]: 125, ["--wght" as string]: 700, letterSpacing: "0.02em" }}>
      ARCHIVISUALS
    </span>
  );
}
