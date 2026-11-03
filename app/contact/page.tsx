import type { Metadata } from "next";
import { instagramUrl, site, whatsappUrl } from "@/content/site";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { LiveClock } from "@/components/shell/LiveClock";
import { Slate } from "@/components/type/Slate";
import { SplitLines } from "@/components/type/SplitLines";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact",
  description: `Request a quote for a listing film, aerials, reels, photography or floor plans in Auckland. We reply within ${site.replyHours} hours.`,
};

export default function ContactPage() {
  const c = site.contact;
  return (
    <>
      <section data-chapter="Contact" className="wrap pt-[calc(var(--header-h)+14vh)]">
        <Slate index="01">Contact</Slate>
        <SplitLines as="h1" immediate className="t-display mt-8 !text-[clamp(2.25rem,8vw,9rem)]">
          Let&rsquo;s film
          <br />
          your next
          <br />
          listing.
        </SplitLines>
      </section>

      <section data-chapter="Quote" className="wrap grid-12 gap-y-20 pb-[var(--section-y)] pt-[clamp(64px,12vh,140px)]">
        <div className="col-span-12 md:col-span-7">
          <h2 className="t-label mb-10 border-b border-fg-14 pb-6 text-fg-60">Request a quote</h2>
          <QuoteForm />
        </div>

        <aside className="col-span-12 md:col-span-4 md:col-start-9" aria-label="Direct contact">
          <h2 className="t-label mb-10 border-b border-fg-14 pb-6 text-fg-60">Or reach us directly</h2>
          <Button href={whatsappUrl} external magnetic>
            WhatsApp us
          </Button>
          <dl className="mt-12 space-y-6">
            <div>
              <dt className="t-label text-fg-40">Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${c.email}`} className="text-[18px] hover:text-fg-60">
                  {c.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="t-label text-fg-40">Phone</dt>
              <dd className="mt-2">
                <a href={`tel:${c.phoneHref}`} className="t-num text-[20px] hover:text-fg-60">
                  {c.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="t-label text-fg-40">Instagram</dt>
              <dd className="mt-2">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[18px] hover:text-fg-60">
                  @{c.instagram}
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-12 border-t border-fg-14 pt-6">
            <LiveClock />
            <p className="t-label mt-3 text-fg-40">Usually replies within {site.replyHours} hours</p>
          </div>
        </aside>
      </section>
    </>
  );
}
