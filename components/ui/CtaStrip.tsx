import { whatsappUrl } from "@/content/site";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { Button } from "./Button";

/** Closing strip used at the end of Work and About. */
export function CtaStrip({ line = "Have a listing coming up?" }: { line?: string }) {
  return (
    <section className="border-t border-fg-14">
      <div className="wrap flex flex-wrap items-center justify-between gap-8 py-[clamp(56px,12vh,140px)]">
        <p className="t-display-sm max-w-[16ch]">{line}</p>
        <div className="flex flex-wrap gap-4">
          <QuoteButton />
          <Button href={whatsappUrl} external variant="ghost">
            WhatsApp us
          </Button>
        </div>
      </div>
    </section>
  );
}
