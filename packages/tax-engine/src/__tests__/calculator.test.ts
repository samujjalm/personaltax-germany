import { describe, it, expect } from "vitest";
import { calculateTax } from "../calculator.js";
import type { CoupleInput } from "@personaltax/shared-types";

function makeSpouse(overrides: Record<string, unknown> = {}) {
  return {
    zeitraumVon: "2025-01-01",
    zeitraumBis: "2025-12-31",
    bruttoarbeitslohn: 0,
    einbehalteneLohnsteuer: 0,
    einbehaltenerSoli: 0,
    kirchensteuerAN: 0,
    kirchensteuerEhegatte: 0,
    steuerklasse: 3 as const,
    kinderfreibetraege: 0,
    anAnteilRV: 0,
    anAnteilRVBerufsstaendisch: 0,
    anBeitraegeKV: 0,
    anBeitraegePV: 0,
    versorgungsbezuege: 0,
    arbeitslohnMehrereJahre: 0,
    progressionsvorbehaltLeistungen: 0,
    agAnteilRV: 0,
    agAnteilRVBerufsstaendisch: 0,
    privateKVPV: 0,
    anBeitraegeALV: 0,
    agZuschussGesetzlKV: 0,
    agZuschussPrivateKV: 0,
    agZuschussGesetzlPV: 0,
    ...overrides,
  };
}

function makeDeductions(overrides: Record<string, unknown> = {}) {
  return {
    pendlerEntfernungKm: 0,
    pendlerArbeitstage: 0,
    homeOfficeTage: 0,
    sonstigeWerbungskosten: 0,
    ...overrides,
  };
}

function makeInput(overrides: Partial<CoupleInput> = {}): CoupleInput {
  return {
    taxYear: 2025,
    spouse1: makeSpouse(),
    spouse2: makeSpouse({ steuerklasse: 5 as const }),
    deductions1: makeDeductions(),
    deductions2: makeDeductions(),
    kirchensteuerpflichtig1: false,
    kirchensteuerpflichtig2: false,
    anzahlKinder: 0,
    ...overrides,
  };
}

describe("calculateTax – full integration", () => {
  it("returns zero tax for zero income", () => {
    const result = calculateTax(makeInput());
    expect(result.einkommensteuer).toBe(0);
    expect(result.solidaritaetszuschlag).toBe(0);
    expect(result.kirchensteuer).toBe(0);
    expect(result.gesamtsteuer).toBe(0);
    expect(result.differenz).toBe(0);
  });

  it("computes a basic Steuerklasse 3/5 scenario", () => {
    // Spouse 1 (StKl 3): 70,000€ brutto
    // Spouse 2 (StKl 5): 30,000€ brutto
    // No deductions beyond Pauschbetrag
    // Combined brutto: 100,000€
    // After Werbungskostenpauschbetrag (1,230€ each): 97,540€
    // Sonderausgaben: Pauschbetrag 72€ (no KiSt paid, no Vorsorge entered)
    // zvE ≈ 97,468€
    const result = calculateTax(
      makeInput({
        spouse1: makeSpouse({ bruttoarbeitslohn: 7000000 }),
        spouse2: makeSpouse({
          bruttoarbeitslohn: 3000000,
          steuerklasse: 5 as const,
        }),
      })
    );

    expect(result.einkommensteuer).toBeGreaterThan(0);
    expect(result.breakdown.gesamtbetragDerEinkuenfte).toBe(9754000); // 97,540€ in cents
    // Since nothing was withheld, differenz = full tax liability
    expect(result.differenz).toBe(result.gesamtsteuer);
  });

  it("correctly computes refund when too much was withheld", () => {
    // Scenario: 60k + 40k, employer withheld more than actual joint liability
    const result = calculateTax(
      makeInput({
        spouse1: makeSpouse({
          bruttoarbeitslohn: 6000000,
          einbehalteneLohnsteuer: 2000000, // 20,000€ withheld
          einbehaltenerSoli: 110000, // 1,100€ soli
        }),
        spouse2: makeSpouse({
          bruttoarbeitslohn: 4000000,
          einbehalteneLohnsteuer: 1500000, // 15,000€ withheld
          einbehaltenerSoli: 82500, // 825€ soli
          steuerklasse: 5 as const,
        }),
      })
    );

    // Total withheld: 20,000 + 1,100 + 15,000 + 825 = 36,925€
    expect(result.bereitsEinbehalten).toBe(3692500);
    // With splitting on ~97,540€ zvE, actual liability should be lower
    // So differenz should be negative (refund)
    expect(result.differenz).toBeLessThan(0);
  });

  it("computes Kirchensteuer when both are pflichtig", () => {
    const result = calculateTax(
      makeInput({
        spouse1: makeSpouse({ bruttoarbeitslohn: 5000000 }),
        spouse2: makeSpouse({
          bruttoarbeitslohn: 5000000,
          steuerklasse: 5 as const,
        }),
        kirchensteuerpflichtig1: true,
        kirchensteuerpflichtig2: true,
      })
    );

    // KiSt should be 9% of ESt
    expect(result.kirchensteuer).toBeGreaterThan(0);
    // Allow 1€ rounding tolerance
    const expectedKist = Math.floor((result.einkommensteuer * 0.09) / 100) * 100;
    expect(result.kirchensteuer).toBe(expectedKist);
  });

  it("applies Werbungskosten Entfernungspauschale", () => {
    const withoutPendler = calculateTax(
      makeInput({
        spouse1: makeSpouse({ bruttoarbeitslohn: 6000000 }),
        spouse2: makeSpouse({
          bruttoarbeitslohn: 3000000,
          steuerklasse: 5 as const,
        }),
      })
    );

    const withPendler = calculateTax(
      makeInput({
        spouse1: makeSpouse({ bruttoarbeitslohn: 6000000 }),
        spouse2: makeSpouse({
          bruttoarbeitslohn: 3000000,
          steuerklasse: 5 as const,
        }),
        deductions1: makeDeductions({
          pendlerEntfernungKm: 30,
          pendlerArbeitstage: 220,
        }),
      })
    );

    // With 30km × 220 days: 20*0.30*220 + 10*0.38*220 = 1,320 + 836 = 2,156€
    // This exceeds the 1,230€ Pauschbetrag, so tax should be lower
    expect(withPendler.einkommensteuer).toBeLessThan(
      withoutPendler.einkommensteuer
    );
  });

  it("handles Vorsorgeaufwendungen correctly", () => {
    // With social insurance contributions, the tax should be lower
    const withVorsorge = calculateTax(
      makeInput({
        spouse1: makeSpouse({
          bruttoarbeitslohn: 6000000,
          anAnteilRV: 558000, // ~5,580€ AN RV
          agAnteilRV: 558000, // ~5,580€ AG RV
          anBeitraegeKV: 480000, // ~4,800€ KV
          anBeitraegePV: 96000, // ~960€ PV
        }),
        spouse2: makeSpouse({
          bruttoarbeitslohn: 3000000,
          steuerklasse: 5 as const,
          anAnteilRV: 279000,
          agAnteilRV: 279000,
          anBeitraegeKV: 240000,
          anBeitraegePV: 48000,
        }),
      })
    );

    const withoutVorsorge = calculateTax(
      makeInput({
        spouse1: makeSpouse({ bruttoarbeitslohn: 6000000 }),
        spouse2: makeSpouse({
          bruttoarbeitslohn: 3000000,
          steuerklasse: 5 as const,
        }),
      })
    );

    expect(withVorsorge.einkommensteuer).toBeLessThan(
      withoutVorsorge.einkommensteuer
    );
  });
});
