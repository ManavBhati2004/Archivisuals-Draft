"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { MediaClip } from "@/content/media";
import { planRooms } from "@/content/extras";
import { FilmPlayer, type FilmPlayerHandle } from "@/components/media/FilmPlayer";

/**
 * Clickable floor plan beside the film: click (or Enter/Space on) a room to jump the film to
 * where that room appears; the room currently on screen highlights as the film plays.
 */
export function FloorPlanPlayer({ media, title }: { media: MediaClip; title: string }) {
  const player = useRef<FilmPlayerHandle>(null);
  const [time, setTime] = useState(0);
  const current = [...planRooms].sort((a, b) => a.t - b.t).filter((r) => r.t <= time + 0.05).pop()?.id;

  const jump = (t: number) => {
    player.current?.seek(t);
    player.current?.play();
  };
  const onKey = (e: KeyboardEvent, t: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      jump(t);
    }
  };

  return (
    <div className="grid-12 items-center gap-y-10">
      <div className="col-span-12 md:col-span-7">
        <FilmPlayer ref={player} media={media} title={`${title} — walk the plan`} onTime={setTime} />
      </div>
      <div className="col-span-12 bg-white p-[clamp(12px,2.4vw,36px)] text-black md:col-span-5">
        <svg viewBox="0 0 1200 1500" className="block h-auto w-full" role="group" aria-label="Floor plan — choose a room to jump the film there">
          {planRooms.map((r) => {
            const on = current === r.id;
            return (
              <g
                key={r.id}
                role="button"
                tabIndex={0}
                aria-label={`${r.label} — play from ${r.t.toFixed(1)} seconds`}
                aria-pressed={on}
                onClick={() => jump(r.t)}
                onKeyDown={(e) => onKey(e, r.t)}
                className="group cursor-pointer outline-none [&:focus-visible_rect]:stroke-[14]"
                data-cursor="play"
              >
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  fill={on ? "#000" : "#fff"}
                  stroke="#000"
                  strokeWidth={6}
                  className="transition-[fill] duration-500 group-hover:fill-black/10"
                  style={on ? { fill: "#000" } : undefined}
                />
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 + 10}
                  textAnchor="middle"
                  fontSize="30"
                  letterSpacing="4"
                  fill={on ? "#fff" : "#000"}
                  style={{ textTransform: "uppercase", ["--wdth" as string]: 125, ["--wght" as string]: 500 }}
                >
                  {r.label}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="t-label mt-4 text-black/60">Choose a room to jump there</p>
      </div>
    </div>
  );
}
