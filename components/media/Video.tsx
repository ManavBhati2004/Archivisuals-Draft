"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { MediaClip } from "@/content/media";
import { webpOf } from "@/content/media";
import { release, requestPlay } from "@/lib/media-budget";
import { prefersReducedMotion, useFinePointer } from "@/lib/a11y";
import { useUI } from "@/lib/ui-store";

type Props = {
  media: MediaClip;
  /**
   * inview  — plays while ≥35% visible (default)
   * active  — plays only while `active` is true (sliders, hover previews)
   * manual  — never autoplays; parent controls it via the ref
   */
  mode?: "inview" | "active" | "manual";
  active?: boolean;
  /** Greyscale at rest, colour on hover / when active (lists, grids, the file pile). */
  mono?: boolean;
  /** Above-the-fold: load eagerly. */
  priority?: boolean;
  /** Follows the global sound toggle (reel and case-study films). */
  sound?: boolean;
  /** Fill the parent (object-cover) instead of reserving its own aspect ratio. */
  fill?: boolean;
  loop?: boolean;
  className?: string;
  videoClassName?: string;
};

/**
 * Poster-first video: <picture> poster underneath (AVIF→WebP), muted loop on top.
 * Lazy (preload="none" until near the viewport), play/pause via IntersectionObserver,
 * and every play goes through the global two-video budget. Reduced motion: poster only.
 */
export const Video = forwardRef<HTMLVideoElement, Props>(function Video(
  { media, mode = "inview", active = false, mono = false, priority = false, sound = false, fill = false, loop = true, className = "", videoClassName = "" },
  fwd,
) {
  const ref = useRef<HTMLVideoElement>(null);
  useImperativeHandle(fwd, () => ref.current as HTMLVideoElement);
  const soundOn = useUI((s) => s.soundOn);

  // In-view autoplay
  useEffect(() => {
    const v = ref.current;
    if (!v || mode !== "inview" || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (v.preload === "none") v.preload = "auto";
          requestPlay(v);
        } else {
          release(v);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      release(v);
    };
  }, [mode]);

  // Controlled autoplay
  useEffect(() => {
    const v = ref.current;
    if (!v || mode !== "active" || prefersReducedMotion()) return;
    if (active) {
      if (v.preload === "none") v.preload = "auto";
      requestPlay(v);
    } else {
      release(v);
    }
  }, [active, mode]);

  useEffect(() => {
    const v = ref.current;
    if (v && sound) v.muted = !soundOn;
  }, [sound, soundOn]);

  // Touch: mono media blooms to colour while centred in the viewport (no hover there).
  const fine = useFinePointer();
  const [centred, setCentred] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v || !mono || fine || mode === "active") return;
    const io = new IntersectionObserver(([e]) => setCentred(e.isIntersecting), { rootMargin: "-40% 0px -40% 0px" });
    io.observe(v);
    return () => io.disconnect();
  }, [mono, fine, mode]);

  const frame = fill ? "absolute inset-0 h-full w-full" : "relative w-full";
  const monoCls = mono ? "media-mono" : "";

  return (
    <div
      className={`${frame} overflow-hidden bg-black ${active || centred ? "is-active" : ""} ${className}`}
      style={fill ? undefined : { aspectRatio: media.aspect }}
    >
      <picture>
        <source srcSet={media.poster} type="image/avif" />
        <img
          src={webpOf(media.poster)}
          alt=""
          aria-hidden
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${monoCls} ${videoClassName}`}
        />
      </picture>
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover ${monoCls} ${videoClassName}`}
        muted
        playsInline
        loop={loop}
        preload={priority ? "auto" : "none"}
        aria-label={media.alt}
        disablePictureInPicture
      >
        <source src={media.webm} type="video/webm" />
        <source src={media.mp4} type="video/mp4" />
      </video>
    </div>
  );
});
