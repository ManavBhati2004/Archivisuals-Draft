"use client";

import { useSyncExternalStore } from "react";

/** Tiny global UI store: menu, quote panel and sound. No provider needed. */
type UIState = {
  menuOpen: boolean;
  quoteOpen: boolean;
  soundOn: boolean;
};

let state: UIState = { menuOpen: false, quoteOpen: false, soundOn: false };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const ui = {
  get: () => state,
  set(patch: Partial<UIState>) {
    state = { ...state, ...patch };
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  openQuote: () => ui.set({ quoteOpen: true, menuOpen: false }),
  closeQuote: () => ui.set({ quoteOpen: false }),
  toggleMenu: () => ui.set({ menuOpen: !state.menuOpen }),
  closeMenu: () => ui.set({ menuOpen: false }),
  toggleSound: () => ui.set({ soundOn: !state.soundOn }),
};

const SERVER: UIState = { menuOpen: false, quoteOpen: false, soundOn: false };

export function useUI<T>(select: (s: UIState) => T): T {
  return useSyncExternalStore(
    ui.subscribe,
    () => select(state),
    () => select(SERVER),
  );
}
