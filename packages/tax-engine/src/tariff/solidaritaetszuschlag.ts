import { TAX_CONSTANTS } from "./constants.js";

/**
 * Compute Solidaritätszuschlag.
 *
 * Rules:
 * - If ESt <= Freigrenze: SolZ = 0
 * - In Milderungszone: SolZ = min(5.5% * ESt, 11.9% * (ESt - Freigrenze))
 * - Above Milderungszone: SolZ = 5.5% * ESt
 *
 * @param estCents - Einkommensteuer in cents
 * @param joint - true for Zusammenveranlagung (doubles the Freigrenze)
 * @param year - tax year
 * @returns Solidaritätszuschlag in cents
 */
export function solidaritaetszuschlag(
  estCents: number,
  joint: boolean,
  year: number
): number {
  const c = TAX_CONSTANTS[year];
  if (!c) throw new Error(`No constants for year ${year}`);

  const est = estCents / 100; // euros
  const freigrenze = joint ? c.soliFreigrenzeJoint : c.soliFreigrenzeSingle;

  if (est <= freigrenze) return 0;

  const fullSolz = 0.055 * est;
  const milderung = 0.119 * (est - freigrenze);

  const solzEuros = Math.min(fullSolz, milderung);

  // Floor to whole cents
  return Math.floor(solzEuros * 100);
}
