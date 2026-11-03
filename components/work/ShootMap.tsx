"use client";

import { useState } from "react";
import { coast, suburbCoords } from "@/content/extras";
import { projects, typeLabel } from "@/content/projects";
import { Video } from "@/components/media/Video";
import { TransitionLink } from "@/components/shell/TransitionLink";
import { Slate } from "@/components/type/Slate";

const W = 1000;
const { west, east, north, south } = coast.bounds;
const H = Math.round((W * (north - south)) / (east - west));
const px = ([lon, lat]: readonly [number, number] | readonly number[]) => [((lon - west) / (east - west)) * W, ((north - lat) / (north - south)) * H] as const;
const path = (pts: readonly (readonly number[])[]) => `M${pts.map((p) => px(p).map((n) => n.toFixed(1)).join(" ")).join(" L")}Z`;

const pins = projects
  .map((p) => ({ p, at: suburbCoords[p.suburb] }))
  .filter((x): x is { p: (typeof projects)[number]; at: [number, number] } => !!x.at)
  .map(({ p, at }) => {
    const [x, y] = px(at);
    return { p, left: (x / W) * 100, top: (y / H) * 100 };
  });

/** Stylised outline of Auckland with a pin per project; hovering (or focusing) a pin previews it. */
export function ShootMap() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section data-chapter="Map" className="section border-t border-fg-14">
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <Slate index="03">On the map</Slate>
          <p className="t-label text-fg-40">
            <span className="t-num">{String(pins.length).padStart(2, "0")}</span> projects across Auckland
          </p>
        </div>

        <div className="relative mx-auto max-w-[1200px]" onMouseLeave={() => setActive(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Stylised map of central Auckland">
            <defs>
              <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M50 0 H0 V50" fill="none" stroke="var(--fg-14)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#map-grid)" />
            {[coast.northShore, coast.isthmus].map((shape, i) => (
              <path key={i} d={path(shape)} fill="var(--fg-14)" fillOpacity={0.35} stroke="var(--fg-60)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            ))}
            {coast.labels.map((l) => {
              const [x, y] = px(l.at);
              return (
                <text key={l.text} x={x} y={y} fill="var(--fg-40)" fontSize="13" letterSpacing="2.4" style={{ textTransform: "uppercase", ["--wdth" as string]: 125, ["--wght" as string]: 500 }}>
                  {l.text}
                </text>
              );
            })}
          </svg>

          <ul aria-label="Projects on the map">
            {pins.map(({ p, left, top }) => {
              const on = active === p.slug;
              const flip = left > 60;
              return (
                <li key={p.slug} className="absolute" style={{ left: `${left}%`, top: `${top}%`, zIndex: on ? 20 : 10 }}>
                  <TransitionLink
                    href={`/work/${p.slug}`}
                    aria-label={`${p.title}, ${p.suburb}`}
                    onMouseEnter={() => setActive(p.slug)}
                    onFocus={() => setActive(p.slug)}
                    onBlur={() => setActive(null)}
                    className="group absolute -left-[22px] -top-[22px] flex h-11 w-11 items-center justify-center"
                    data-cursor="link"
                  >
                    <span className={`block h-[10px] w-[10px] bg-fg transition-transform duration-300 ${on ? "scale-150" : "group-hover:scale-125"}`} />
                    <span aria-hidden className={`absolute h-7 w-7 border border-fg transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`} />
                  </TransitionLink>
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute top-0 w-[min(240px,40vw)] -translate-y-1/2 border border-fg-20 bg-bg p-2 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
                      flip ? "right-6" : "left-6"
                    } ${on ? "opacity-100" : "translate-x-2 opacity-0"}`}
                  >
                    <Video media={p.hero} mode="active" active={on} className={p.hero.aspect === "9/16" ? "mx-auto !w-1/2" : ""} />
                    <p className="t-label mt-3">{p.title}</p>
                    <p className="t-label mt-1 text-fg-60">
                      {p.suburb} · {typeLabel(p.types[0])}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
