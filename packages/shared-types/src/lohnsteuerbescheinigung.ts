import { z } from "zod";

/** All monetary values are in cents (integer) to avoid floating-point errors. */

export const lohnsteuerbescheinigungSchema = z.object({
  // --- Tier 1: Essential for MVP ---

  /** Zeile 1: Bescheinigungszeitraum */
  zeitraumVon: z.string().describe("Start of certification period (YYYY-MM-DD)"),
  zeitraumBis: z.string().describe("End of certification period (YYYY-MM-DD)"),

  /** Zeile 3: Bruttoarbeitslohn einschl. Sachbezüge (cents) */
  bruttoarbeitslohn: z.number().int(),

  /** Zeile 4: Einbehaltene Lohnsteuer (cents) */
  einbehalteneLohnsteuer: z.number().int().min(0),

  /** Zeile 5: Einbehaltener Solidaritätszuschlag (cents) */
  einbehaltenerSoli: z.number().int().min(0),

  /** Zeile 6: Einbehaltene Kirchensteuer des Arbeitnehmers (cents) */
  kirchensteuerAN: z.number().int().min(0),

  /** Zeile 7: Einbehaltene Kirchensteuer des Ehegatten (cents) */
  kirchensteuerEhegatte: z.number().int().min(0),

  /** Zeile 22: Steuerklasse */
  steuerklasse: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
  ]),

  /** Zeile 22: Zahl der Kinderfreibeträge (e.g. 0, 0.5, 1.0, 1.5, ...) */
  kinderfreibetraege: z.number().min(0),

  /** Zeile 24a: Arbeitnehmeranteil zur gesetzlichen Rentenversicherung (cents) */
  anAnteilRV: z.number().int().min(0),

  /** Zeile 24b: Arbeitnehmeranteil an berufsständische Versorgungseinrichtungen (cents) */
  anAnteilRVBerufsstaendisch: z.number().int().min(0),

  /** Zeile 25: Arbeitnehmerbeiträge zur gesetzlichen Krankenversicherung (cents) */
  anBeitraegeKV: z.number().int().min(0),

  /** Zeile 26: Arbeitnehmerbeiträge zur sozialen Pflegeversicherung (cents) */
  anBeitraegePV: z.number().int().min(0),

  // --- Tier 2: Important for accuracy (defaulting to 0 in MVP) ---

  /** Zeile 8: In 3. enthaltene Versorgungsbezüge (cents) */
  versorgungsbezuege: z.number().int().min(0).default(0),

  /** Zeile 10: Arbeitslohn für mehrere Jahre / Abfindungen (cents) */
  arbeitslohnMehrereJahre: z.number().int().min(0).default(0),

  /** Zeile 15: Leistungen dem Progressionsvorbehalt unterliegend (cents) */
  progressionsvorbehaltLeistungen: z.number().int().min(0).default(0),

  /** Zeile 23a: Arbeitgeberanteil zur gesetzlichen Rentenversicherung (cents) */
  agAnteilRV: z.number().int().min(0).default(0),

  /** Zeile 23b: Arbeitgeberanteil an berufsständische Versorgungseinrichtungen (cents) */
  agAnteilRVBerufsstaendisch: z.number().int().min(0).default(0),

  /** Zeile 28: Beiträge zur privaten KV/PV-Pflichtversicherung oder Mindestvorsorgepauschale (cents) */
  privateKVPV: z.number().int().min(0).default(0),

  /** Zeile 30: Arbeitnehmerbeiträge zur Arbeitslosenversicherung (cents) */
  anBeitraegeALV: z.number().int().min(0).default(0),

  /** Zeile 34a: Steuerfreie AG-Zuschüsse zur gesetzlichen KV (cents) */
  agZuschussGesetzlKV: z.number().int().min(0).default(0),

  /** Zeile 34b: Steuerfreie AG-Zuschüsse zur privaten KV (cents) */
  agZuschussPrivateKV: z.number().int().min(0).default(0),

  /** Zeile 34c: Steuerfreie AG-Zuschüsse zur gesetzlichen PV (cents) */
  agZuschussGesetzlPV: z.number().int().min(0).default(0),
});

export type Lohnsteuerbescheinigung = z.infer<
  typeof lohnsteuerbescheinigungSchema
>;
