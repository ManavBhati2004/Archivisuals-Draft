import type { Metadata } from "next";
import { WorkIndex } from "@/components/work/WorkIndex";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { ReelsStrip } from "@/components/work/ReelsStrip";
import { ShootMap } from "@/components/work/ShootMap";
import { Slate } from "@/components/type/Slate";
import { WidthMorph } from "@/components/type/WidthMorph";

export const metadata: Metadata = {
  title: "Work",
  description: "Listing films, aerials, social reels and stills from across Auckland.",
};

export default function WorkPage() {
  return (
    <>
      <section data-chapter="Work" className="wrap pb-[clamp(48px,8vh,96px)] pt-[calc(var(--header-h)+14vh)]">
        <Slate index="01">Selected work</Slate>
        <WidthMorph as="h1" trigger="load" className="mt-6 uppercase" >
          <span className="block leading-[0.82] tracking-[-0.03em]" style={{ fontSize: "clamp(4.5rem, 19vw, 21rem)", ["--wght" as string]: 800 }}>
            Work
          </span>
        </WidthMorph>
        <p className="t-body mt-8">Films, aerials and stills from across Auckland.</p>
      </section>
      <div data-chapter="Projects">
        <WorkIndex />
      </div>
      <ReelsStrip />
      <ShootMap />
      <div data-chapter="Contact">
        <CtaStrip />
      </div>
    </>
  );
}
