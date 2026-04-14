import { TAX_CONSTANTS } from "../tariff/constants.js";
import type { Lohnsteuerbescheinigung } from "@personaltax/shared-types";

/**
 * Compute Sonderausgaben (special expenses) for the couple.
 *
 * Includes:
 * - Kirchensteuer actually paid (deductible as Sonderausgabe)
 * - Sonderausgabenpauschbetrag (72€ for joint filing) if nothing else
 *
 * Vorsorgeaufwendungen are computed separately and added by the calculator.
 *
 * @returns Sonderausgaben in cents
 */
export function computeSonderausgaben(
  spouse1: Lohnsteuerbescheinigung,
  spouse2: Lohnsteuerbescheinigung,
  year: number
): number {
  const c = TAX_CONSTANTS[year]!;

  // Kirchensteuer paid is deductible as Sonderausgabe
  const kirchensteuerPaid =
    spouse1.kirchensteuerAN +
    spouse1.kirchensteuerEhegatte +
    spouse2.kirchensteuerAN +
    spouse2.kirchensteuerEhegatte;

  // Apply Pauschbetrag if actual Sonderausgaben are less
  return Math.max(kirchensteuerPaid, c.sonderausgabenpauschbetragJoint);
}
