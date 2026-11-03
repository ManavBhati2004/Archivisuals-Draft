"use client";

import { ui, useUI } from "@/lib/ui-store";

/** Bottom-left; off by default. Unmutes the reel and case-study films. */
export function SoundToggle() {
  const on = useUI((s) => s.soundOn);
  return (
    <button
      type="button"
      onClick={ui.toggleSound}
      aria-pressed={on}
      className={`t-label fixed bottom-4 left-[var(--gutter)] z-50 hidden min-h-[44px] items-center gap-3 md:flex ${on ? "eq-on" : ""}`}
    >
      <span aria-hidden className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="eq-bar block h-3 w-[2px] bg-current" />
        ))}
      </span>
      <span className="text-fg-60">Sound {on ? "on" : "off"}</span>
    </button>
  );
}
