"use client";

import { useEffect } from "react";

const PAUSED = "▶ Your tour is paused";

/** When the tab loses focus its title becomes "▶ Your tour is paused"; restored on return. */
export function TabTitle() {
  useEffect(() => {
    let saved = document.title;
    const onChange = () => {
      if (document.hidden) {
        if (document.title !== PAUSED) saved = document.title;
        document.title = PAUSED;
      } else if (document.title === PAUSED) {
        document.title = saved;
      }
    };
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return null;
}
