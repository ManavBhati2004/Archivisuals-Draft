"use client";

import { useEffect, useSyncExternalStore, type RefObject } from "react";

const RM = "(prefers-reduced-motion: reduce)";
const FINE = "(hover: hover) and (pointer: fine)";

function mediaStore(query: string) {
  return {
    subscribe(cb: () => void) {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    get: () => window.matchMedia(query).matches,
  };
}

const rm = mediaStore(RM);
const fine = mediaStore(FINE);

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia(RM).matches;
export const isFinePointer = () => typeof window !== "undefined" && window.matchMedia(FINE).matches;

export function useReducedMotion() {
  return useSyncExternalStore(rm.subscribe, rm.get, () => false);
}

export function useFinePointer() {
  return useSyncExternalStore(fine.subscribe, fine.get, () => false);
}

/** Desktop with motion allowed: where pinned/scrubbed sections run. Elsewhere use native fallbacks. */
export const PIN_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)";
const pin = mediaStore(PIN_QUERY);
export function usePinMode() {
  return useSyncExternalStore(pin.subscribe, pin.get, () => false);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Trap Tab focus inside `ref` while `active`; restores focus to the opener on close. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onEscape?: () => void) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const opener = document.activeElement as HTMLElement | null;
    const items = () => Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    const t = window.setTimeout(() => (root.querySelector<HTMLElement>("[data-autofocus]") ?? items()[0])?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape?.();
        return;
      }
      if (e.key !== "Tab") return;
      const list = items();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [active, ref, onEscape]);
}
