"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { MediaClip } from "@/content/media";
import { webpOf } from "@/content/media";
import { release, requestPlay } from "@/lib/media-budget";
import { ui } from "@/lib/ui-store";

const FPS = 25;
const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
/** mm:ss:ff timecode */
const timecode = (t: number) => `${pad(t / 60)}:${pad(t % 60)}:${pad((t % 1) * FPS)}`;

type Props = {
  media: MediaClip;
  autoPlay?: boolean;
  /** Optional WebVTT captions file. */
  captions?: string;
  className?: string;
  title?: string;
  /** Called on every timeupdate (e.g. to highlight the current room on a floor plan). */
  onTime?: (t: number) => void;
};

export type FilmPlayerHandle = { seek: (t: number) => void; play: () => void };

/**
 * Minimal black-and-white film player: play/pause, thin scrubber, narrow-numeral timecode,
 * mute and fullscreen. Keyboard: Space/K play, ←/→ seek 5s, M mute, F fullscreen.
 */
export const FilmPlayer = forwardRef<FilmPlayerHandle, Props>(function FilmPlayer({ media, autoPlay = false, captions, className = "", title, onTime }, handle) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [muted, setMuted] = useState(() => !ui.get().soundOn);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<number>(0);

  const play = useCallback(() => {
    const v = video.current;
    if (!v) return;
    v.dataset.pinned = "true";
    requestPlay(v);
  }, []);
  const pause = useCallback(() => {
    const v = video.current;
    if (v) release(v);
  }, []);
  const toggle = useCallback(() => (video.current?.paused ? play() : pause()), [play, pause]);

  const seek = useCallback((t: number) => {
    const v = video.current;
    if (!v || !v.duration) return;
    v.currentTime = Math.min(v.duration, Math.max(0, t));
    setTime(v.currentTime);
  }, []);

  useImperativeHandle(handle, () => ({ seek, play }), [seek, play]);

  const toggleMute = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const fullscreen = () => {
    const el = wrap.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const wake = () => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2500);
  };

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = muted;
    if (autoPlay) play();
    const v2 = v;
    return () => {
      window.clearTimeout(idleTimer.current);
      release(v2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrubFrom = (e: PointerEvent<HTMLDivElement>) => {
    const r = bar.current?.getBoundingClientRect();
    if (!r || !dur) return;
    seek(((e.clientX - r.left) / r.width) * dur);
  };

  const onKey = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k === " " || k === "k") toggle();
    else if (k === "arrowright") seek(time + 5);
    else if (k === "arrowleft") seek(time - 5);
    else if (k === "m") toggleMute();
    else if (k === "f") fullscreen();
    else return;
    e.preventDefault();
    wake();
  };

  const progress = dur ? time / dur : 0;
  const showControls = !playing || !idle;

  return (
    <div
      ref={wrap}
      className={`group relative overflow-hidden bg-black text-white [container-type:inline-size] ${className}`}
      style={{ aspectRatio: media.aspect }}
      onPointerMove={wake}
      onKeyDown={onKey}
      role="region"
      aria-label={title ? `Film player: ${title}` : "Film player"}
    >
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        poster={webpOf(media.poster)}
        playsInline
        loop
        preload="metadata"
        aria-label={media.alt}
        onClick={toggle}
        data-cursor={playing ? undefined : "play"}
        onPlay={() => {
          setPlaying(true);
          wake();
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          setTime(e.currentTarget.currentTime);
          onTime?.(e.currentTarget.currentTime);
        }}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
      >
        <source src={media.webm} type="video/webm" />
        <source src={media.mp4} type="video/mp4" />
        {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
      </video>

      {!playing && (
        <button
          type="button"
          onClick={play}
          aria-label="Play film"
          data-cursor="play"
          className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center border border-white/40 transition-colors hover:border-white"
        >
          <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden>
            <path d="M1 1 L17 10 L1 19 Z" fill="currentColor" />
          </svg>
        </button>
      )}

      <div
        className="scrim-b absolute inset-x-0 bottom-0 px-[clamp(16px,2.4vw,32px)] pb-4 pt-16 transition-opacity duration-500"
        style={{ opacity: showControls ? 1 : 0 }}
      >
        <div
          ref={bar}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(dur)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={timecode(time)}
          className="relative flex h-6 cursor-pointer items-center"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            scrubFrom(e);
          }}
          onPointerMove={(e) => e.buttons === 1 && scrubFrom(e)}
        >
          <span className="block h-px w-full bg-white/25" />
          <span className="absolute left-0 block h-px w-full origin-left bg-white" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="mt-2 flex items-center gap-3 whitespace-nowrap @md:gap-5">
          <button type="button" onClick={toggle} className="t-label min-h-[44px] min-w-[44px] text-left" aria-label={playing ? "Pause" : "Play"}>
            {playing ? "Pause" : "Play"}
          </button>
          <p className="t-num text-[13px] text-white/60">
            <span className="text-white">{timecode(time)}</span>
            <span className="hidden @md:inline"> / {timecode(dur)}</span>
          </p>
          <span className="flex-1" />
          <button type="button" onClick={toggleMute} className="t-label min-h-[44px]" aria-pressed={!muted}>
            <span className="@md:hidden">{muted ? "Unmute" : "Mute"}</span>
            <span className="hidden @md:inline">{muted ? "Sound off" : "Sound on"}</span>
          </button>
          <button type="button" onClick={fullscreen} className="t-label min-h-[44px]">
            <span className="@md:hidden">Full</span>
            <span className="hidden @md:inline">Full screen</span>
          </button>
        </div>
      </div>
    </div>
  );
});
