import { z } from "zod";

/** Additional deductions beyond what's on the Lohnsteuerbescheinigung. All amounts in cents. */

export const additionalDeductionsSchema = z.object({
  /** Werbungskosten: Entfernungspauschale */
  pendlerEntfernungKm: z.number().min(0).default(0),
  pendlerArbeitstage: z.number().int().min(0).max(280).default(0),

  /** Werbungskosten: Home-Office-Pauschale (number of days, max 210) */
  homeOfficeTage: z.number().int().min(0).max(210).default(0),

  /** Werbungskosten: Other work-related expenses beyond Pauschbetrag (cents) */
  sonstigeWerbungskosten: z.number().int().min(0).default(0),
});

export type AdditionalDeductions = z.infer<typeof additionalDeductionsSchema>;
