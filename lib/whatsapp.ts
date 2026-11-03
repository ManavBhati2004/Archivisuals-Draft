import { site } from "@/content/site";
import type { Quote } from "./quote-schema";

// Date-only values (YYYY-MM-DD) are calendar days, so format them in UTC to avoid shifting the day.
const dateFmt = new Intl.DateTimeFormat("en-NZ", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "2026-11-14" → "Sat, 14 Nov 2026"; empty → "Flexible". */
export function formatDate(iso: string) {
  if (!iso) return "Flexible";
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

/** The quote summary used for WhatsApp, email and the mailto fallback. */
export function quoteSummary(q: Quote) {
  const type = q.bedrooms ? `${q.propertyType.toLowerCase()}, ${q.bedrooms} bed` : q.propertyType.toLowerCase();
  const lines = [
    "Hi Archivisuals, I'd like a quote.",
    `Property: ${q.address}, ${q.suburb} (${type})`,
    `Need: ${q.deliverables.join(", ")}`,
    `Preferred date: ${formatDate(q.shootDate)}`,
    q.goLiveDate ? `Listing goes live: ${formatDate(q.goLiveDate)}` : null,
    [q.name, q.agency].filter(Boolean).join(" · "),
    `${q.phone} · ${q.email}`,
    q.notes ? `Notes: ${q.notes}` : null,
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}

/** wa.me link with the summary prefilled. Number is international format, no + or leading 0. */
export const whatsappLink = (text: string) => `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;

export const mailtoLink = (q: Quote, text: string) =>
  `mailto:${site.contact.email}?subject=${encodeURIComponent(`Quote request — ${q.address}, ${q.suburb}`)}&body=${encodeURIComponent(text)}`;
