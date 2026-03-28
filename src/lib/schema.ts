import { z } from "zod";

export const applicationSchema = z.object({
  legalBusinessName: z.string().min(2, "Enter the legal business name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a phone number"),
  websiteUrl: z.string().url("Enter a valid website URL"),
  monthlyVolumeBand: z.enum(["under_50k", "50k_250k", "250k_1m", "over_1m"]),
  avgTicketDollars: z.coerce.number().min(1).max(50000),
  industry: z.string().min(2, "Describe your industry or vertical"),
  chargebackBand: z.enum(["under_50bp", "50_100bp", "over_100bp", "unknown"]),
  countriesSold: z.enum(["us_only", "us_ca", "international"]),
  priorProcessing: z.enum(["yes", "no", "first_time"]),
  acceptIndicativeTerms: z
    .boolean()
    .refine((v) => v === true, { message: "Confirm you understand this quote is indicative" }),
});

export type ApplicationPayload = z.infer<typeof applicationSchema>;

export const step1Schema = applicationSchema.pick({
  legalBusinessName: true,
  email: true,
  phone: true,
  websiteUrl: true,
});

export const step2Schema = applicationSchema.pick({
  monthlyVolumeBand: true,
  avgTicketDollars: true,
  industry: true,
});

export const step3Schema = applicationSchema.pick({
  chargebackBand: true,
  countriesSold: true,
  priorProcessing: true,
});
