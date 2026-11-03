import { clips, type MediaClip } from "./media";
import { getProject, type Project } from "./projects";

/** Reels strip: vertical cuts shown inside a phone outline. */
export const reels: { clip: MediaClip; project: Project }[] = [
  { clip: clips.reelVertical, project: getProject("the-laneway")! },
  { clip: clips.reelPool, project: getProject("glasshouse")! },
  { clip: clips.reelRoom, project: getProject("seaview-terrace")! },
  { clip: clips.reelLight, project: getProject("parnell-rise")! },
];

/** Approximate suburb centres (lon, lat) for the shoot map. */
export const suburbCoords: Record<string, [number, number]> = {
  "Herne Bay": [174.733, -36.844],
  Devonport: [174.797, -36.829],
  Ponsonby: [174.745, -36.857],
  Titirangi: [174.655, -36.936],
  Parnell: [174.781, -36.858],
  "Mission Bay": [174.832, -36.849],
  Remuera: [174.8, -36.88],
  Takapuna: [174.772, -36.79],
};

/**
 * Stylised Auckland coastline (lon, lat) — deliberately simplified, not survey-accurate.
 * North Shore above the Waitematā; the isthmus between the Waitematā and the Manukau.
 */
export const coast = {
  bounds: { west: 174.6, east: 174.9, north: -36.75, south: -36.97 },
  northShore: [
    [174.6, -36.75], [174.76, -36.75], [174.775, -36.775], [174.772, -36.795], [174.785, -36.81],
    [174.805, -36.826], [174.795, -36.834], [174.775, -36.828], [174.75, -36.822], [174.72, -36.818],
    [174.69, -36.812], [174.66, -36.806], [174.63, -36.8], [174.6, -36.798],
  ],
  isthmus: [
    [174.6, -36.862], [174.63, -36.858], [174.66, -36.852], [174.69, -36.847], [174.715, -36.843],
    [174.733, -36.839], [174.75, -36.842], [174.765, -36.846], [174.78, -36.848], [174.8, -36.846],
    [174.82, -36.845], [174.835, -36.846], [174.855, -36.85], [174.875, -36.856], [174.9, -36.862],
    [174.9, -36.97], [174.82, -36.97], [174.78, -36.955], [174.74, -36.94], [174.7, -36.935],
    [174.67, -36.945], [174.64, -36.94], [174.6, -36.932],
  ],
  labels: [
    { text: "Waitematā Harbour", at: [174.69, -36.828] },
    { text: "Manukau Harbour", at: [174.62, -36.958] },
    { text: "Hauraki Gulf", at: [174.83, -36.78] },
  ],
} as const;

/** Interactive floor plan: rooms (in a 1200×1500 drawing) and when each appears in the film. */
export const planRooms = [
  { id: "living", label: "Living", x: 100, y: 100, w: 560, h: 520, t: 0 },
  { id: "kitchen", label: "Kitchen", x: 660, y: 100, w: 440, h: 340, t: 1.5 },
  { id: "dining", label: "Dining", x: 660, y: 440, w: 440, h: 180, t: 3 },
  { id: "hall", label: "Hall", x: 520, y: 840, w: 260, h: 200, t: 4.5 },
  { id: "bed1", label: "Bedroom 1", x: 100, y: 620, w: 420, h: 420, t: 6 },
  { id: "bath", label: "Bath", x: 520, y: 620, w: 260, h: 220, t: 7.5 },
  { id: "bed2", label: "Bedroom 2", x: 780, y: 620, w: 320, h: 420, t: 8.5 },
  { id: "bed3", label: "Bedroom 3", x: 100, y: 1040, w: 500, h: 360, t: 9.5 },
  { id: "deck", label: "Deck", x: 600, y: 1040, w: 500, h: 360, t: 10.5 },
] as const; // [PLACEHOLDER] timestamps until real films are cut
