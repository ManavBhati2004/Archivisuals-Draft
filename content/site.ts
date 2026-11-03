/**
 * Studio details. Values marked [CONFIRM] / [PLACEHOLDER] are awaiting client sign-off.
 */
export const site = {
  name: "Archivisuals",
  url: "https://archivisuals.co.nz", // [CONFIRM domain]
  title: "Archivisuals — Real Estate Video Production, Auckland",
  description:
    "Listing films, aerials, social reels, photography and floor plans for agents, agencies, developers and homeowners across Auckland.",
  tagline: "Real estate films, aerials and stills. Auckland.", // [PLACEHOLDER]
  city: "Auckland",
  timeZone: "Pacific/Auckland",
  contact: {
    email: "hello@archivisuals.co.nz", // [CONFIRM]
    phoneDisplay: "021 000 0000", // [CONFIRM]
    phoneHref: "+64210000000", // [CONFIRM]
    /** International format, no + or leading 0. */
    whatsapp: "64210000000", // [CONFIRM]
    instagram: "archivisuals", // [CONFIRM]
  },
  replyHours: 4, // [CONFIRM response time]
  delivery: { stillsHours: 24, filmDays: 3 }, // [CONFIRM]
  droneCertification: "CAA Part 101 compliant", // [CONFIRM certification wording]
  areaServed: [
    "Herne Bay",
    "Ponsonby",
    "Remuera",
    "Parnell",
    "Devonport",
    "Takapuna",
    "Mission Bay",
    "St Heliers",
    "Titirangi",
    "Waiheke Island",
    "Albany",
    "Howick",
  ], // [CONFIRM AREA]
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const instagramUrl = `https://instagram.com/${site.contact.instagram}`;
export const whatsappUrl = `https://wa.me/${site.contact.whatsapp}`;
