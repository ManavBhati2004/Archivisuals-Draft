import type { MediaStill } from "@/content/media";
import { webpOf } from "@/content/media";

type Props = {
  media: MediaStill;
  mono?: boolean;
  priority?: boolean;
  /** Fill the parent instead of reserving the still's aspect ratio. */
  fill?: boolean;
  /** object-fit; floor plans use "contain". */
  fit?: "cover" | "contain";
  className?: string;
  sizes?: string;
};

/** AVIF → WebP still with a reserved aspect ratio (no layout shift). */
export function Still({ media, mono = false, priority = false, fill = false, fit = "cover", className = "", sizes }: Props) {
  return (
    <picture
      className={`${fill ? "absolute inset-0" : "relative"} block overflow-hidden ${className}`}
      style={fill ? undefined : { aspectRatio: media.aspect }}
    >
      <source srcSet={media.src} type="image/avif" sizes={sizes} />
      <img
        src={webpOf(media.src)}
        alt={media.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        draggable={false}
        className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${mono ? "media-mono" : ""}`}
      />
    </picture>
  );
}
