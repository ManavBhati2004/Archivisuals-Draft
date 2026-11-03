"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const fmt = new Intl.DateTimeFormat("en-NZ", {
  timeZone: site.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** "AUCKLAND — 18:42", ticking in Pacific/Auckland time. */
export function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className={`t-label ${className}`}>
      {site.city.toUpperCase()} — <time className="t-num inline-block min-w-[5ch]" suppressHydrationWarning>{time ?? "--:--"}</time>
    </p>
  );
}
