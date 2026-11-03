"use client";

import { ui } from "@/lib/ui-store";
import { Button } from "@/components/ui/Button";

/** Primary CTA that opens the global quote panel. */
export function QuoteButton({ label = "Request a quote", variant = "primary" as const }: { label?: string; variant?: "primary" | "ghost" }) {
  return (
    <Button onClick={ui.openQuote} variant={variant}>
      {label}
    </Button>
  );
}
