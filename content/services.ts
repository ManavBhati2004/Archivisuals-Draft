import { clips, type MediaClip } from "./media";
import { site } from "./site";

/** What we shoot. Descriptions are [PLACEHOLDER] until the client signs them off. */
export type Service = {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  clip: MediaClip;
};

export const services: Service[] = [
  {
    id: "listing",
    title: "Listing films",
    description:
      "A walk through the home in the order a buyer would take it. Shot in one visit, cut to music, graded in-house.",
    deliverables: ["60–120 s landscape film", "30 s cut-down", "Licensed music"],
    clip: clips.interiorWalk,
  },
  {
    id: "aerial",
    title: "Aerial & drone",
    description: `The house, the street, the view, the distance to the water. ${site.droneCertification}.`, // [CONFIRM certification wording]
    deliverables: ["Aerial film segment", "Aerial stills", "Section and boundary views"],
    clip: clips.aerialPullback,
  },
  {
    id: "reels",
    title: "Social reels (9:16)",
    description: "Vertical cuts made for Instagram, TikTok and listing portals. Short, fast to read, sound-off friendly.",
    deliverables: ["2–3 vertical reels", "Captions burned in", "Cover frames"],
    clip: clips.reelVertical,
  },
  {
    id: "photo",
    title: "Photography & twilight",
    description: "Every room, exterior and detail, balanced for true colour. Twilight sessions shot at blue hour.",
    deliverables: ["25–45 edited stills", "Twilight exteriors", "Web and print sizes"],
    clip: clips.poolTwilight,
  },
  {
    id: "plans",
    title: "Floor plans (2D)",
    description: "Measured on site during the shoot and drawn clean, so buyers understand the layout at a glance.",
    deliverables: ["2D floor plan", "Room dimensions", "PDF and PNG"],
    clip: clips.livingLight,
  },
];
