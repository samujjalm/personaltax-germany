import { TAX_CONSTANTS, type TaxYearConstants } from "./constants.js";

/**
 * Compute Einkommensteuer per §32a EStG for a given zu versteuerndes Einkommen (zvE).
 *
 * @param zvECents - zu versteuerndes Einkommen in cents
 * @param year - tax year (2024 or 2025)
 * @returns Einkommensteuer in cents (floored to whole euros, then converted to cents)
 */
export function einkommensteuer(zvECents: number, year: number): number {
  const c = getConstants(year);
  const zvE = Math.floor(zvECents / 100); // convert cents to euros

  if (zvE <= 0) return 0;

  let estEuros: number;

  if (zvE <= c.grundfreibetrag) {
    // Zone 1: tax-free
    estEuros = 0;
  } else if (zvE <= c.zone2Upper) {
    // Zone 2
    const y = (zvE - c.grundfreibetrag) / 10_000;
    estEuros = (c.zone2a * y + c.zone2b) * y;
  } else if (zvE <= c.zone3Upper) {
    // Zone 3
    const z = (zvE - c.zone2Upper) / 10_000;
    estEuros = (c.zone3a * z + c.zone3b) * z + c.zone3c;
  } else if (zvE <= c.zone4Upper) {
    // Zone 4: 42% bracket
    estEuros = c.zone4Rate * zvE - c.zone4Const;
  } else {
    // Zone 5: 45% Reichensteuer
    estEuros = c.zone5Rate * zvE - c.zone5Const;
  }

  // Floor to whole euros, then convert to cents
  return Math.floor(estEuros) * 100;
}

function getConstants(year: number): TaxYearConstants {
  const c = TAX_CONSTANTS[year];
  if (!c) {
    throw new Error(
      `Tax constants not available for year ${year}. Available: ${Object.keys(TAX_CONSTANTS).join(", ")}`
    );
  }
  return c;
}
