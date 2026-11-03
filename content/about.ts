import { clips, type MediaStill } from "./media";
import { site } from "./site";

/** About page copy. [PLACEHOLDER] items await client sign-off. */
export const about = {
  hero: ["We film homes", "the way they feel."],
  story: [
    "Archivisuals started with one camera and a simple idea: a listing film should feel like walking through the front door, not scrolling through a brochure. We still shoot every home ourselves.", // [PLACEHOLDER]
    "We work with agents, agencies, developers and homeowners across Auckland. One visit covers film, aerial and stills, and every frame is graded in-house so the colour you see is the colour of the home.", // [PLACEHOLDER]
  ],
  bts: {
    id: "bts-still",
    kind: "image",
    src: clips.bts.poster,
    alt: "Behind the scenes: a camera being set up before a shoot",
    aspect: "9/16",
    placeholder: true,
  } satisfies MediaStill,
  principles: [
    { title: "Shot for the light", body: "We plan every shoot around where the sun will be, room by room." },
    { title: "One visit, everything", body: "Film, aerial, stills and floor plan in a single appointment." },
    { title: "Graded, never filtered", body: "True colour, balanced by hand. No presets, no fake skies." },
    { title: "Delivered when promised", body: `Stills in ${site.delivery.stillsHours} hours, film in ${site.delivery.filmDays} days. Every time.` },
  ], // [PLACEHOLDER]
  kit: [
    ["Camera", "Full-frame cinema camera, 4K 10-bit"],
    ["Lenses", "Wide primes, 14–85 mm"],
    ["Gimbal", "Three-axis stabiliser"],
    ["Drone", "4K aerial platform, licensed operator"],
    ["Lighting", "Portable LED panels, colour-matched"],
  ], // [PLACEHOLDER]
  suburbs: site.areaServed, // [CONFIRM AREA]
};
