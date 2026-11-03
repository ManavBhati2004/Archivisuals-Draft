import { home } from "@/content/home";
import { Video } from "@/components/media/Video";
import { TriangleReveal } from "@/components/media/TriangleReveal";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Slate } from "@/components/type/Slate";
import { SplitLines } from "@/components/type/SplitLines";

/** 08 — THE STUDIO. A few lines about the studio beside a small behind-the-scenes loop. */
export function Studio() {
  const { studio } = home;
  return (
    <section id="studio" data-chapter="Studio" className="section">
      <div className="wrap grid-12 items-end gap-y-14">
        <div className="col-span-12 md:col-span-7">
          <Slate index="08">The studio</Slate>
          <SplitLines as="p" className="t-h3 mt-10 max-w-[28ch]" >
            {studio.lines}
          </SplitLines>
          <TransitionLink href="/about" className="stretch t-label mt-12 inline-block border-b border-fg py-3">
            About us →
          </TransitionLink>
        </div>
        <div className="col-span-8 col-start-3 md:col-span-3 md:col-start-10">
          <TriangleReveal>
            <Video media={studio.clip} />
          </TriangleReveal>
          <p className="t-label mt-4 text-fg-40">Behind the scenes</p>
        </div>
      </div>
    </section>
  );
}
