import { z } from "zod";
import { lohnsteuerbescheinigungSchema } from "./lohnsteuerbescheinigung.js";
import { additionalDeductionsSchema } from "./deductions.js";

export const coupleInputSchema = z.object({
  taxYear: z.union([z.literal(2024), z.literal(2025)]),

  spouse1: lohnsteuerbescheinigungSchema,
  spouse2: lohnsteuerbescheinigungSchema,

  /** Additional deductions for spouse 1 */
  deductions1: additionalDeductionsSchema,
  /** Additional deductions for spouse 2 */
  deductions2: additionalDeductionsSchema,

  /** Whether each spouse pays Kirchensteuer */
  kirchensteuerpflichtig1: z.boolean(),
  kirchensteuerpflichtig2: z.boolean(),

  /** Number of children for Kinderfreibetrag / Kindergeld comparison */
  anzahlKinder: z.number().int().min(0).default(0),
});

export type CoupleInput = z.infer<typeof coupleInputSchema>;
