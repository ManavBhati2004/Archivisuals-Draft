import { z } from "zod";

/** Shared by the QuoteForm (per-step validation) and /api/quote (full validation). */

export const PROPERTY_TYPES = ["House", "Apartment", "Townhouse", "Section", "Development", "Commercial"] as const;

export const DELIVERABLES = [
  "Listing film",
  "Aerial & drone",
  "Social reels",
  "Photography",
  "Twilight stills",
  "Floor plan",
  "Not sure — advise me",
] as const;

/** NZ numbers: 0X… or +64/64 X…, spaces, dashes and brackets allowed. */
const nzPhone = z
  .string()
  .trim()
  .min(1, "Add a phone number")
  .refine((v) => /^(0\d{8,10}|64\d{8,10})$/.test(v.replace(/[\s()+-]/g, "")), "Use an NZ number, e.g. 021 123 4567");

const optionalDate = z.string().trim().optional().default("");

export const propertyStep = z.object({
  address: z.string().trim().min(3, "Add the street address"),
  suburb: z.string().trim().min(2, "Add the suburb"),
  propertyType: z.enum(PROPERTY_TYPES, { error: "Choose a property type" }),
  bedrooms: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => v === "" || (/^\d{1,2}$/.test(v) && Number(v) <= 30), "Use a number, e.g. 3"),
});

export const needsStep = z.object({
  deliverables: z.array(z.enum(DELIVERABLES)).min(1, "Choose at least one"),
  shootDate: optionalDate,
  goLiveDate: optionalDate,
});

export const youStep = z.object({
  name: z.string().trim().min(2, "Add your name"),
  agency: z.string().trim().optional().default(""),
  phone: nzPhone,
  email: z.email("Add a valid email address").trim(),
  notes: z.string().trim().max(2000, "Keep notes under 2000 characters").optional().default(""),
});

export const quoteSchema = propertyStep.extend(needsStep.shape).extend(youStep.shape);
export type Quote = z.infer<typeof quoteSchema>;

export const STEPS = [
  { id: "property", label: "Property", schema: propertyStep },
  { id: "needs", label: "What you need", schema: needsStep },
  { id: "you", label: "You", schema: youStep },
] as const;

/** Form state (strings everywhere, before validation). */
export type QuoteDraft = {
  address: string;
  suburb: string;
  propertyType: string;
  bedrooms: string;
  deliverables: string[];
  shootDate: string;
  goLiveDate: string;
  name: string;
  agency: string;
  phone: string;
  email: string;
  notes: string;
};

export const emptyDraft: QuoteDraft = {
  address: "",
  suburb: "",
  propertyType: "",
  bedrooms: "",
  deliverables: [],
  shootDate: "",
  goLiveDate: "",
  name: "",
  agency: "",
  phone: "",
  email: "",
  notes: "",
};
