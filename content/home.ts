import { clips } from "./media";
import { site } from "./site";

/** Home page copy. [PLACEHOLDER] / [CONFIRM] items await client sign-off. */
export const home = {
  arrival: {
    lines: ["Architecture,", "in motion."], // [ALT: "Homes, directed." / "Every home has an opening scene."]
    tagline: site.tagline,
    slate: "Arrival · Exterior · Aerial",
    /** Time-of-day hero: daylight cut 06:00–17:00 visitor time, twilight otherwise. */
    film: { day: clips.exteriorDay, twilight: clips.heroDusk },
  },
  reel: clips.heroDusk,
  threshold: {
    label: "The name",
    statement:
      "Archi, for the buildings. Visuals, for how it feels to walk through them. We film homes the way they’re lived in, not the way they’re listed.", // [PLACEHOLDER]
    caption: "A roofline and a play button. That’s the whole job.",
  },
  process: [
    { title: "Request", body: "Send the address and what you need, by WhatsApp or the quote form." },
    {
      title: "Quote & plan",
      body: `We reply with a quote within ${site.replyHours} hours and schedule the shoot around the light.`, // [CONFIRM response time]
    },
    { title: "Shoot", body: "Film, aerial and stills in one visit." },
    {
      title: "Deliver",
      body: `Stills in ${site.delivery.stillsHours} hours, graded film in ${site.delivery.filmDays} days.`, // [CONFIRM]
    },
  ],
  studio: {
    lines:
      "A small Auckland studio of filmmakers and photographers. We shoot every home ourselves, grade every frame ourselves, and deliver when we said we would.", // [PLACEHOLDER]
    clip: clips.bts,
  },
  finalFrame: ["Let’s film", "your next", "listing."],
};
