import { TAX_CONSTANTS } from "../tariff/constants.js";
import type { Lohnsteuerbescheinigung } from "@personaltax/shared-types";

/**
 * Compute Vorsorgeaufwendungen (pension/insurance deductions) for one spouse.
 *
 * Two categories:
 * 1. Altersvorsorgeaufwendungen (Basisversorgung / Schicht 1)
 *    - AN + AG Rentenversicherung, 100% deductible since 2023
 *    - Up to Höchstbetrag, minus tax-free AG-Anteil
 *
 * 2. Sonstige Vorsorgeaufwendungen
 *    - Basis-Krankenversicherung (GKV minus 4% Krankengeldanteil, or PKV Basistarif)
 *    - Pflegepflichtversicherung
 *    - These Basisbeiträge are ALWAYS fully deductible
 *
 * @returns { altersvorsorge, basisKVPV } both in cents
 */
export function computeVorsorgeaufwendungen(
  l: Lohnsteuerbescheinigung,
  year: number
): { altersvorsorge: number; basisKVPV: number } {
  const c = TAX_CONSTANTS[year]!;

  // --- Altersvorsorge ---
  // Total RV contributions (AN + AG)
  const totalRV =
    l.anAnteilRV +
    l.anAnteilRVBerufsstaendisch +
    l.agAnteilRV +
    l.agAnteilRVBerufsstaendisch;

  // Capped at Höchstbetrag
  const cappedRV = Math.min(totalRV, c.altersvorsorgeHoechstbetrag);

  // Deductible = capped total minus tax-free AG portion
  const agAnteilSteuerfrei = l.agAnteilRV + l.agAnteilRVBerufsstaendisch;
  const altersvorsorge = Math.max(0, cappedRV - agAnteilSteuerfrei);

  // --- Basis KV + PV ---
  let basisKV: number;

  if (l.privateKVPV > 0) {
    // Private KV/PV: Zeile 28 is the Basis amount
    basisKV = l.privateKVPV;
  } else {
    // GKV: Zeile 25 minus 4% Krankengeldanteil
    basisKV = Math.round(l.anBeitraegeKV * 0.96);
  }

  const basisKVPV = basisKV + l.anBeitraegePV;

  return { altersvorsorge, basisKVPV };
}
