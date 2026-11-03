/**
 * Media registry. Every clip and still on the site resolves through here, so swapping
 * placeholder footage for the client's real work is a one-file change.
 * Files live in /public/media/placeholder — see CREDITS.md for sources and licences.
 */

export type Aspect = "16/9" | "9/16" | "4/5" | "3/2" | "21/9" | "1/1";

export type MediaClip = {
  id: string;
  kind: "video";
  mp4: string;
  webm: string;
  poster: string; // AVIF; a WebP sibling with the same basename is served as fallback
  alt: string;
  aspect: Aspect;
  placeholder: boolean;
};

export type MediaStill = {
  id: string;
  kind: "image";
  src: string; // AVIF; WebP sibling as fallback
  alt: string;
  aspect: Aspect;
  placeholder: boolean;
};

const BASE = "/media/placeholder";

const clip = (id: string, alt: string, aspect: Aspect = "16/9"): MediaClip => ({
  id,
  kind: "video",
  mp4: `${BASE}/${id}.mp4`,
  webm: `${BASE}/${id}.webm`,
  poster: `${BASE}/${id}.avif`,
  alt,
  aspect,
  placeholder: true,
});

const still = (id: string, alt: string, aspect: Aspect = "3/2"): MediaStill => ({
  id,
  kind: "image",
  src: `${BASE}/${id}.avif`,
  alt,
  aspect,
  placeholder: true,
});

export const clips = {
  heroDusk: clip("hero-dusk", "A modern two-storey home on a sandy section under an evening sky"),
  aerialPullback: clip("aerial-pullback", "Top-down aerial drifting over a suburban street of tiled roofs"),
  interiorWalk: clip("interior-walk", "Slow move through a bedroom towards a sunlit terrace"),
  kitchenPan: clip("kitchen-pan", "Slow pan across a bedroom with soft window light"),
  poolTwilight: clip("pool-twilight", "A pool reflecting white cabanas and palm trees"),
  exteriorDay: clip("exterior-day", "Aerial view of new homes along a quiet suburban street"),
  livingLight: clip("living-light", "A bright room with a ceiling fan, bed and lounge chair"),
  reelVertical: clip("reel-vertical", "Vertical tour moving through a bedroom", "9/16"),
  bts: clip("bts", "Behind the scenes: a camera being set up by hand", "9/16"),
  hallway: clip("hallway", "A long, empty hallway with a door at the end"),
  reelPool: clip("reel-pool", "Vertical cut: a pool reflecting white cabanas", "9/16"),
  reelRoom: clip("reel-room", "Vertical cut: a bedroom in soft window light", "9/16"),
  reelLight: clip("reel-light", "Vertical cut: a bright room with a ceiling fan", "9/16"),
} satisfies Record<string, MediaClip>;

export const stills = {
  facade: still("still-facade", "Aerial of homes and gardens on a suburban corner"),
  lounge: still("still-lounge", "Bright bedroom-lounge with a ceiling fan"),
  kitchen: still("still-kitchen", "Bedroom with tall curtains and soft side light"),
  dining: still("still-dining", "Low-lit bedroom beside a curtained window"),
  bedroom: still("still-bedroom", "Main bedroom with timber floors and a terrace door"),
  bathroom: still("still-bathroom", "Covered terrace beside the main bedroom"),
  stair: still("still-stair", "A hallway lined with doors, framed vertically", "4/5"),
  deck: still("still-deck", "Terrace seating looking out from the bedroom"),
  twilight: still("still-twilight", "A modern home among trees at dusk"),
  aerial: still("still-aerial", "Aerial view over a neighbourhood of houses"),
  detail: still("still-detail", "Bedroom detail framed vertically", "4/5"),
  pool: still("still-pool", "Pool and cabanas in bright sun"),
  apartment: still("still-apartment", "Bedroom opening to a shaded terrace"),
  townhouse: still("still-townhouse", "New homes along a quiet street, from above"),
} satisfies Record<string, MediaStill>;

export const floorPlans = {
  sample: still("plan-sample", "2D floor plan of a three-bedroom house", "4/5"),
} satisfies Record<string, MediaStill>;

/** WebP fallback for a given AVIF path. */
export const webpOf = (avif: string) => avif.replace(/\.avif$/, ".webp");
