import { einkommensteuer } from "../tariff/einkommensteuer.js";

/**
 * Splittingverfahren per §32a Abs. 5 EStG (Zusammenveranlagung).
 *
 * 1. Take combined zvE
 * 2. Halve it (floor to whole euros → cents)
 * 3. Apply tariff to the half
 * 4. Double the result
 *
 * @param zvECombinedCents - combined zu versteuerndes Einkommen in cents
 * @param year - tax year
 * @returns { estCents, zvEHalfCents, estHalfCents }
 */
export function splittingverfahren(
  zvECombinedCents: number,
  year: number
): { estCents: number; zvEHalfCents: number; estHalfCents: number } {
  // Floor to whole euros before halving, then back to cents
  const zvEEuros = Math.floor(zvECombinedCents / 100);
  const halfEuros = Math.floor(zvEEuros / 2);
  const zvEHalfCents = halfEuros * 100;

  const estHalfCents = einkommensteuer(zvEHalfCents, year);
  const estCents = estHalfCents * 2;

  return { estCents, zvEHalfCents, estHalfCents };
}
