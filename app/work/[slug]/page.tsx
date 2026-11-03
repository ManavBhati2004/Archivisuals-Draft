import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, nextProject, projects, typeLabel } from "@/content/projects";
import { site } from "@/content/site";
import { FilmPlayer } from "@/components/media/FilmPlayer";
import { DragGallery } from "@/components/media/DragGallery";
import { NextProject } from "@/components/work/NextProject";
import { FloorPlanPlayer } from "@/components/work/FloorPlanPlayer";
import { Slate } from "@/components/type/Slate";
import { SplitLines } from "@/components/type/SplitLines";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title}, ${p.suburb}`,
    description: `${p.line} ${p.deliverables.join(", ")} — ${p.suburb}, Auckland.`,
    openGraph: { images: [{ url: p.hero.poster.replace(/\.avif$/, ".webp") }] },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = nextProject(slug);
  const vertical = p.hero.aspect === "9/16";

  const videoLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${p.title}, ${p.suburb}`,
    description: p.brief,
    thumbnailUrl: [new URL(p.hero.poster.replace(/\.avif$/, ".webp"), site.url).toString()],
    contentUrl: new URL(p.hero.mp4, site.url).toString(),
    uploadDate: `${p.year}-01-01`,
    creator: { "@type": "Organization", name: site.name },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />

      <header data-chapter="Title" className="wrap pb-[clamp(40px,8vh,96px)] pt-[calc(var(--header-h)+14vh)]">
        <Slate index={String(projects.indexOf(p) + 1).padStart(2, "0")}>{typeLabel(p.types[0])}</Slate>
        <SplitLines as="h1" immediate className="t-display mt-8 max-w-[14ch]">
          {p.title}
        </SplitLines>
        <dl className="mt-12 grid grid-cols-2 border-t border-fg-14 md:grid-cols-4">
          {[
            ["Suburb", p.suburb],
            ["Deliverables", p.deliverables.join(" · ")],
            ["Year", String(p.year)],
            ["Type", p.types.map(typeLabel).join(" · ")],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-fg-14 py-4 pr-4 md:border-b-0">
              <dt className="t-label text-fg-40">{k}</dt>
              <dd className={`mt-2 ${k === "Year" ? "t-num" : ""}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section data-chapter="Film" aria-label="Film">
        <div className={vertical ? "wrap flex justify-center" : ""}>
          <div className="w-full" style={vertical ? { width: "min(100%, calc(min(85svh, 1100px) * 9 / 16))" } : undefined}>
            <FilmPlayer media={p.hero} title={p.title} className="w-full" />
          </div>
        </div>
      </section>

      <section data-chapter="The brief" className="section wrap grid-12 gap-y-8">
        <p className="t-label col-span-12 text-fg-60 md:col-span-3">The brief</p>
        <SplitLines as="p" className="t-h3 col-span-12 max-w-[34ch] md:col-span-8 md:col-start-5">
          {p.brief}
        </SplitLines>
      </section>

      <section data-chapter="Stills" className="pb-[var(--section-y)]">
        <div className="wrap mb-10 flex items-end justify-between border-b border-fg-14 pb-6">
          <p className="t-label text-fg-60">Stills</p>
          <p className="t-label text-fg-40">
            <span className="t-num">{String(p.stills.length).padStart(2, "0")}</span> frames · drag to browse
          </p>
        </div>
        <DragGallery stills={p.stills} label={`${p.title} stills`} />
      </section>

      {p.floorPlan && (
        <section data-chapter="Floor plan" className="wrap pb-[var(--section-y)]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-fg-14 pb-6">
            <p className="t-label text-fg-60">Walk the plan</p>
            <p className="t-label text-fg-40">Choose a room to jump the film there</p>
          </div>
          <FloorPlanPlayer media={p.hero} title={p.title} />
        </section>
      )}

      <NextProject project={next} />
    </article>
  );
}
