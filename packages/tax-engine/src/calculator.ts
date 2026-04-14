import type {
  CoupleInput,
  TaxResult,
  TaxBreakdown,
  SpouseBreakdown,
  Lohnsteuerbescheinigung,
  AdditionalDeductions,
} from "@personaltax/shared-types";
import { computeWerbungskosten } from "./deductions/werbungskosten.js";
import { computeVorsorgeaufwendungen } from "./deductions/vorsorgeaufwendungen.js";
import { computeSonderausgaben } from "./deductions/sonderausgaben.js";
import { splittingverfahren } from "./splitting/splittingverfahren.js";
import { solidaritaetszuschlag } from "./tariff/solidaritaetszuschlag.js";
import { kirchensteuer } from "./tariff/kirchensteuer.js";
import { guenstigerpruefung } from "./kinderfreibetrag.js";

/**
 * Full tax calculation for a married couple filing jointly (Zusammenveranlagung).
 *
 * Implements the 13-step flow from the plan:
 * 1. Einkünfte per spouse
 * 2-3. Gesamtbetrag der Einkünfte (combined)
 * 4. Sonderausgaben (Vorsorge + Kirchensteuer paid)
 * 5. (Außergewöhnliche Belastungen — Phase 2)
 * 6. Einkommen
 * 7. Kinderfreibetrag Günstigerprüfung
 * 8. Splittingverfahren
 * 9. (Progressionsvorbehalt — Phase 2)
 * 10. Solidaritätszuschlag
 * 11. Kirchensteuer
 * 12. (Steuerermäßigungen — Phase 2)
 * 13. Compare liability vs. withheld → Nachzahlung/Erstattung
 */
export function calculateTax(input: CoupleInput): TaxResult {
  const year = input.taxYear;

  // --- Step 1: Einkünfte aus nichtselbständiger Arbeit per spouse ---
  const spouse1Breakdown = computeSpouseBreakdown(
    input.spouse1,
    input.deductions1,
    year
  );
  const spouse2Breakdown = computeSpouseBreakdown(
    input.spouse2,
    input.deductions2,
    year
  );

  // --- Step 2-3: Gesamtbetrag der Einkünfte ---
  const gesamtbetragDerEinkuenfte =
    spouse1Breakdown.einkuenfteNichtselbstaendig +
    spouse2Breakdown.einkuenfteNichtselbstaendig;

  // --- Step 4: Sonderausgaben ---
  // 4a. Vorsorgeaufwendungen (computed per spouse, then summed)
  const vorsorge1 = spouse1Breakdown.altersvorsorgeAbzug + spouse1Breakdown.basisKVPVAbzug;
  const vorsorge2 = spouse2Breakdown.altersvorsorgeAbzug + spouse2Breakdown.basisKVPVAbzug;
  const totalVorsorge = vorsorge1 + vorsorge2;

  // 4b. Other Sonderausgaben (Kirchensteuer paid, Pauschbetrag)
  const otherSonderausgaben = computeSonderausgaben(
    input.spouse1,
    input.spouse2,
    year
  );

  const sonderausgaben = totalVorsorge + otherSonderausgaben;

  // --- Step 6: Einkommen ---
  const einkommen = Math.max(0, gesamtbetragDerEinkuenfte - sonderausgaben);

  // --- Step 7: Kinderfreibetrag Günstigerprüfung ---
  const kfbResult = guenstigerpruefung(einkommen, input.anzahlKinder, year);
  const zvE = kfbResult.zvEFinalCents;

  // --- Step 8: Splittingverfahren ---
  const splitting = splittingverfahren(zvE, year);
  const est = splitting.estCents;

  // --- Step 10: Solidaritätszuschlag ---
  const soli = solidaritaetszuschlag(est, true, year);

  // --- Step 11: Kirchensteuer ---
  const kist = kirchensteuer(
    est,
    input.kirchensteuerpflichtig1,
    input.kirchensteuerpflichtig2
  );

  // --- Step 13: Total liability vs. withheld ---
  const gesamtsteuer = est + soli + kist;

  const bereitsEinbehalten =
    input.spouse1.einbehalteneLohnsteuer +
    input.spouse1.einbehaltenerSoli +
    input.spouse1.kirchensteuerAN +
    input.spouse1.kirchensteuerEhegatte +
    input.spouse2.einbehalteneLohnsteuer +
    input.spouse2.einbehaltenerSoli +
    input.spouse2.kirchensteuerAN +
    input.spouse2.kirchensteuerEhegatte;

  const differenz = gesamtsteuer - bereitsEinbehalten;

  // Effective tax rate
  const effektiverSteuersatz =
    zvE > 0 ? gesamtsteuer / zvE : 0;

  const breakdown: TaxBreakdown = {
    spouse1: spouse1Breakdown,
    spouse2: spouse2Breakdown,
    gesamtbetragDerEinkuenfte,
    sonderausgaben,
    zuVersteuerndesEinkommen: zvE,
    zvEHalf: splitting.zvEHalfCents,
    estHalf: splitting.estHalfCents,
    kinderfreibetragGenutzt: kfbResult.useKinderfreibetrag,
  };

  return {
    einkommensteuer: est,
    solidaritaetszuschlag: soli,
    kirchensteuer: kist,
    gesamtsteuer,
    bereitsEinbehalten,
    differenz,
    effektiverSteuersatz,
    breakdown,
  };
}

function computeSpouseBreakdown(
  l: Lohnsteuerbescheinigung,
  d: AdditionalDeductions,
  year: number
): SpouseBreakdown {
  const bruttoarbeitslohn = l.bruttoarbeitslohn;

  // Werbungskosten (max of actual vs Pauschbetrag)
  const werbungskosten = computeWerbungskosten(l, d, year);

  // Einkünfte = Brutto - Werbungskosten
  const einkuenfteNichtselbstaendig = Math.max(
    0,
    bruttoarbeitslohn - werbungskosten
  );

  // Vorsorgeaufwendungen
  const { altersvorsorge, basisKVPV } = computeVorsorgeaufwendungen(l, year);

  return {
    bruttoarbeitslohn,
    werbungskosten,
    einkuenfteNichtselbstaendig,
    altersvorsorgeAbzug: altersvorsorge,
    basisKVPVAbzug: basisKVPV,
  };
}
