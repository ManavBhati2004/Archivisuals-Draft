"use client";

import { useEffect, useRef } from "react";
import { registerLayer } from "@/lib/transition";

/** Fixed black layer clipped to the logo triangle; animated by lib/transition. */
export function TransitionLayer() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerLayer(ref.current);
    return () => registerLayer(null);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] bg-black"
      style={{ visibility: "hidden", clipPath: "polygon(50% 50%, 50% 50%, 50% 50%)" }}
    />
  );
}
