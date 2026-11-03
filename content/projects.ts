import { clips, floorPlans, stills, type MediaClip, type MediaStill } from "./media";

/** Fictional projects used until the client's real work arrives. */

export type ProjectType = "listing" | "aerial" | "reels" | "stills";

export const projectTypes: { id: ProjectType; label: string }[] = [
  { id: "listing", label: "Listing films" },
  { id: "aerial", label: "Aerial" },
  { id: "reels", label: "Reels" },
  { id: "stills", label: "Stills" },
];

export type Project = {
  slug: string;
  title: string;
  suburb: string;
  /** First entry is the primary type, used for filtering and labels. */
  types: ProjectType[];
  year: number;
  deliverables: string[];
  brief: string; // [PLACEHOLDER]
  line: string; // one-line summary for cards [PLACEHOLDER]
  hero: MediaClip;
  stills: MediaStill[];
  floorPlan?: MediaStill;
};

export const projects: Project[] = [
  {
    slug: "kauri-house",
    title: "Kauri House",
    suburb: "Herne Bay",
    types: ["listing", "aerial"],
    year: 2026,
    deliverables: ["Listing film", "Aerial", "38 stills"],
    brief:
      "A restored villa with a new pavilion at the back. The agent wanted buyers to feel the change from old to new as they walked through. We filmed the hallway at morning light and the pavilion at dusk, then cut them as one walk.",
    line: "Villa to pavilion in one continuous walk.",
    hero: clips.heroDusk,
    stills: [stills.facade, stills.lounge, stills.kitchen, stills.dining, stills.deck, stills.twilight],
    floorPlan: floorPlans.sample,
  },
  {
    slug: "harbour-ridge",
    title: "Harbour Ridge",
    suburb: "Devonport",
    types: ["aerial", "listing"],
    year: 2026,
    deliverables: ["Aerial", "Listing film", "24 stills"],
    brief:
      "A ridge-top home with views in three directions. The aerial does the explaining: house, street, harbour, city. Interiors stay quiet so the view carries the film.",
    line: "House, street, harbour, city — in one pull-back.",
    hero: clips.aerialPullback,
    stills: [stills.aerial, stills.deck, stills.lounge, stills.bedroom, stills.pool],
  },
  {
    slug: "the-laneway",
    title: "The Laneway",
    suburb: "Ponsonby",
    types: ["reels"],
    year: 2026,
    deliverables: ["3 social reels", "16 stills"],
    brief:
      "A compact townhouse sold mostly through social. Three vertical cuts: the arrival, the kitchen, the courtyard at night. Each one runs under 20 seconds.",
    line: "Three vertical cuts, each under 20 seconds.",
    hero: clips.reelVertical,
    stills: [stills.townhouse, stills.kitchen, stills.stair, stills.bathroom],
  },
  {
    slug: "glasshouse",
    title: "Glasshouse",
    suburb: "Titirangi",
    types: ["listing", "stills"],
    year: 2025,
    deliverables: ["Listing film", "Twilight stills", "Floor plan"],
    brief:
      "A glass box in the bush. We shot through the afternoon into blue hour so the house turns from transparent to lit lantern across the film.",
    line: "Afternoon to blue hour in ninety seconds.",
    hero: clips.poolTwilight,
    stills: [stills.twilight, stills.pool, stills.lounge, stills.detail, stills.deck],
    floorPlan: floorPlans.sample,
  },
  {
    slug: "parnell-rise",
    title: "Parnell Rise",
    suburb: "Parnell",
    types: ["stills"],
    year: 2025,
    deliverables: ["42 stills", "Twilight", "Floor plan"],
    brief:
      "A stills-only brief for a family home. Every room shot twice, once for the listing and once tighter for print. Twilight exteriors to finish.",
    line: "Every room, shot for screen and for print.",
    hero: clips.livingLight,
    stills: [stills.lounge, stills.dining, stills.bedroom, stills.bathroom, stills.stair, stills.twilight],
    floorPlan: floorPlans.sample,
  },
  {
    slug: "seaview-terrace",
    title: "Seaview Terrace",
    suburb: "Mission Bay",
    types: ["listing", "reels"],
    year: 2025,
    deliverables: ["Listing film", "2 reels", "28 stills"],
    brief:
      "A beachside apartment with one big idea: the sea from every room. The film moves window to window; the reels cut the same walk for mobile.",
    line: "The sea from every room.",
    hero: clips.interiorWalk,
    stills: [stills.apartment, stills.lounge, stills.kitchen, stills.bedroom],
  },
  {
    slug: "orchard-lane",
    title: "Orchard Lane",
    suburb: "Remuera",
    types: ["aerial", "stills"],
    year: 2025,
    deliverables: ["Aerial", "32 stills", "Floor plan"],
    brief:
      "A large section with an old orchard. The aerial maps the land for buyers; the stills keep to the house and the garden rooms around it.",
    line: "Mapping the land, then the rooms.",
    hero: clips.exteriorDay,
    stills: [stills.aerial, stills.facade, stills.deck, stills.dining, stills.detail],
    floorPlan: floorPlans.sample,
  },
  {
    slug: "north-shore-quarter",
    title: "North Shore Quarter",
    suburb: "Takapuna",
    types: ["listing", "aerial"],
    year: 2024,
    deliverables: ["Development film", "Aerial", "Stills"],
    brief:
      "Twelve new townhouses, one show home. The film sells the street as much as the units: walkability, the beach, the morning light on the row.",
    line: "Selling the street as much as the units.",
    hero: clips.kitchenPan,
    stills: [stills.townhouse, stills.kitchen, stills.apartment, stills.aerial],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};

export const typeLabel = (t: ProjectType) => projectTypes.find((x) => x.id === t)?.label ?? t;
