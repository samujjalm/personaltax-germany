/** All monetary values are in cents (integer). */

export interface TaxBreakdown {
  /** Per-spouse intermediate values */
  spouse1: SpouseBreakdown;
  spouse2: SpouseBreakdown;

  /** Combined values */
  gesamtbetragDerEinkuenfte: number;
  sonderausgaben: number;
  zuVersteuerndesEinkommen: number;

  /** Splitting calculation */
  zvEHalf: number;
  estHalf: number;

  /** Whether Kinderfreibetrag was more favorable than Kindergeld */
  kinderfreibetragGenutzt: boolean;
}

export interface SpouseBreakdown {
  bruttoarbeitslohn: number;
  werbungskosten: number;
  einkuenfteNichtselbstaendig: number;

  /** Vorsorgeaufwendungen */
  altersvorsorgeAbzug: number;
  basisKVPVAbzug: number;
}

export interface TaxResult {
  /** The final computed Einkommensteuer after Splitting */
  einkommensteuer: number;

  /** Solidaritätszuschlag */
  solidaritaetszuschlag: number;

  /** Kirchensteuer (9% Berlin/Brandenburg) */
  kirchensteuer: number;

  /** Total tax liability (ESt + Soli + KiSt) */
  gesamtsteuer: number;

  /** Total tax already withheld (sum of Zeile 4+5+6+7 from both) */
  bereitsEinbehalten: number;

  /** Positive = Nachzahlung (owe more), Negative = Erstattung (refund) */
  differenz: number;

  /** Effective tax rate on combined zvE */
  effektiverSteuersatz: number;

  /** Detailed breakdown of intermediate calculations */
  breakdown: TaxBreakdown;
}
