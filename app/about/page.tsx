import type { Metadata } from "next";
import { about } from "@/content/about";
import { Still } from "@/components/media/Still";
import { TriangleReveal } from "@/components/media/TriangleReveal";
import { Marquee } from "@/components/type/Marquee";
import { Slate } from "@/components/type/Slate";
import { SplitLines } from "@/components/type/SplitLines";
import { CtaStrip } from "@/components/ui/CtaStrip";

export const metadata: Metadata = {
  title: "About",
  description: "A small Auckland studio filming homes the way they feel: listing films, aerials, reels, photography and floor plans.",
};

export default function AboutPage() {
  return (
    <>
      <section data-chapter="About" className="wrap pb-[var(--section-y)] pt-[calc(var(--header-h)+14vh)]">
        <Slate index="01">About</Slate>
        <SplitLines as="h1" immediate className="t-display mt-8 !text-[clamp(2.25rem,8vw,9rem)]">
          {about.hero[0]}
          <br />
          {about.hero[1]}
        </SplitLines>
      </section>

      <section data-chapter="Story" className="wrap grid-12 items-end gap-y-14 pb-[var(--section-y)]">
        <div className="col-span-8 md:col-span-4">
          <TriangleReveal>
            <Still media={about.bts} />
          </TriangleReveal>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <Slate index="02">The studio</Slate>
          {about.story.map((p, i) => (
            <p key={i} className={`t-body ${i ? "mt-6" : "mt-10 !text-fg"}`}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section data-chapter="Principles" className="wrap pb-[var(--section-y)]">
        <div className="border-b border-fg-14 pb-6">
          <Slate index="03">Principles</Slate>
        </div>
        <ol>
          {about.principles.map((p, i) => (
            <li key={p.title} className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-3 border-b border-fg-14 py-[clamp(24px,4vh,44px)] md:grid-cols-[6rem_1fr_minmax(0,28rem)]">
              <span className="t-num text-fg-40">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="group-stretch uppercase" style={{ fontSize: "clamp(1.6rem, 4vw, 4rem)", lineHeight: 1, letterSpacing: "-0.015em", ["--wght" as string]: 700 }}>
                {p.title}
              </h2>
              <p className="t-body col-start-2 md:col-start-3">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-chapter="Kit" className="wrap grid-12 gap-y-10 pb-[var(--section-y)]">
        <div className="col-span-12 md:col-span-4">
          <Slate index="04">Kit</Slate>
        </div>
        <table className="col-span-12 md:col-span-7 md:col-start-6">
          <caption className="sr-only">Production kit</caption>
          <tbody>
            {about.kit.map(([k, v]) => (
              <tr key={k} className="border-b border-fg-14 first:border-t">
                <th scope="row" className="t-label w-[9rem] py-5 text-left align-baseline font-normal text-fg-40">
                  {k}
                </th>
                <td className="py-5 align-baseline">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section data-chapter="Where we shoot" className="pb-[var(--section-y)]">
        <div className="wrap mb-12">
          <Slate index="05">Where we shoot</Slate>
        </div>
        <Marquee words={about.suburbs} label="Auckland suburbs we shoot in" />
      </section>

      <CtaStrip />
    </>
  );
}
