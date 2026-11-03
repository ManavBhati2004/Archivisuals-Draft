import type { Metadata } from "next";
import { clips } from "@/content/media";
import { Video } from "@/components/media/Video";
import { Slate } from "@/components/type/Slate";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Wrong room" };

/** 404 — "WRONG ROOM." over a looping empty hallway. */
export default function NotFound() {
  return (
    <section data-chapter="404" className="theme-dark relative h-svh min-h-[560px] overflow-hidden bg-black text-fg">
      <Video media={clips.hallway} fill priority />
      <div aria-hidden className="absolute inset-0 bg-black/55" />
      <div className="wrap relative flex h-full flex-col justify-end pb-[clamp(32px,10vh,120px)]">
        <Slate index="404">Page not found</Slate>
        <h1 className="t-display mt-8">Wrong room.</h1>
        <p className="t-body mt-6 !text-white/75">This door doesn&rsquo;t lead anywhere. Let&rsquo;s take you back to the start.</p>
        <div className="mt-10">
          <Button href="/">
            Back to the front door
          </Button>
        </div>
      </div>
    </section>
  );
}
