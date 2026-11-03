import { home } from "@/content/home";
import { whatsappUrl } from "@/content/site";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { Button } from "@/components/ui/Button";
import { Slate } from "@/components/type/Slate";
import { WidthMorph } from "@/components/type/WidthMorph";

/** 08 — FINAL FRAME. The closing call to action; the global footer follows. */
export function FinalFrame() {
  return (
    <section id="final-frame" data-chapter="Final frame" className="section pb-0">
      <div className="wrap">
        <Slate index="08">Final frame</Slate>
        <WidthMorph className="t-display mt-12 !whitespace-normal !text-[clamp(2.25rem,9vw,10rem)]">
          {home.finalFrame.map((l) => (
            <span key={l} className="block whitespace-nowrap">
              {l}
            </span>
          ))}
        </WidthMorph>
        <div className="mt-14 flex flex-wrap gap-4">
          <QuoteButton />
          <Button href={whatsappUrl} external variant="ghost">
            WhatsApp us
          </Button>
        </div>
      </div>
    </section>
  );
}
