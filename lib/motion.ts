/**
 * Motion system — every ease, duration and stagger lives here.
 * GSAP eases are strings; CSS uses the matching cubic-bezier token in globals.css.
 */

/** Media in lists/grids/the file pile sits in greyscale until hovered or centred. */
export const MEDIA_MONO_AT_REST = true;

export const ease = {
  reveal: "expo.out",
  transition: "power3.inOut",
  linear: "none",
  css: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const duration = {
  micro: 0.25,
  reveal: 1.1,
  revealShort: 0.9,
  transition: 1.2,
  theme: 0.6,
  mediaFilter: 0.6,
  letterboxHold: 1,
} as const;

export const stagger = {
  lines: 0.07,
  items: 0.08,
  tight: 0.06,
} as const;

/** Font-axis ranges used by the width morph. */
export const wdth = {
  narrow: 62,
  numeral: 68,
  normal: 100,
  expanded: 125,
} as const;

export const parallax = {
  /** Fraction the media lags behind scroll inside its frame. */
  amount: 0.1,
  touchFactor: 0.5,
} as const;

export const cursor = {
  lerp: 0.18,
  dot: 8,
  media: 88,
} as const;

/** Triangle polygon (logo shape) used by clip-path reveals and the page transition. */
export const triangle = {
  /** Small centred triangle — start state for reveals. */
  closed: "polygon(50% 42%, 56% 56%, 44% 56%)",
  /** Triangle large enough to cover any frame. */
  open: "polygon(50% -160%, 260% 230%, -160% 230%)",
  /** Collapsed to a point at centre. */
  point: "polygon(50% 50%, 50% 50%, 50% 50%)",
} as const;
