import { TAX_CONSTANTS } from "../tariff/constants.js";
import type { Lohnsteuerbescheinigung, AdditionalDeductions } from "@personaltax/shared-types";

/**
 * Compute Werbungskosten for one spouse.
 * Returns the higher of actual Werbungskosten or the Pauschbetrag (1,230€).
 *
 * @returns Werbungskosten in cents
 */
export function computeWerbungskosten(
  _lohnsteuer: Lohnsteuerbescheinigung,
  deductions: AdditionalDeductions,
  year: number
): number {
  const c = TAX_CONSTANTS[year]!;

  let actual = 0;

  // Entfernungspauschale
  if (deductions.pendlerEntfernungKm > 0 && deductions.pendlerArbeitstage > 0) {
    const km = deductions.pendlerEntfernungKm;
    const tage = deductions.pendlerArbeitstage;

    // First 20 km at lower rate, from 21st km at higher rate
    const first20 = Math.min(km, 20);
    const above20 = Math.max(0, km - 20);

    actual +=
      tage * first20 * c.entfernungspauschaleFirst20 +
      tage * above20 * c.entfernungspauschaleFrom21;
  }

  // Home-Office-Pauschale
  if (deductions.homeOfficeTage > 0) {
    const homeOffice =
      deductions.homeOfficeTage * c.homeOfficePauschaleProTag;
    actual += Math.min(homeOffice, c.homeOfficePauschaleMax);
  }

  // Other work-related expenses
  actual += deductions.sonstigeWerbungskosten;

  // Return max of actual vs Pauschbetrag
  return Math.max(actual, c.werbungskostenpauschbetrag);
}
