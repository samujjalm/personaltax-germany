import { describe, it, expect } from "vitest";
import { einkommensteuer } from "../tariff/einkommensteuer.js";
import { solidaritaetszuschlag } from "../tariff/solidaritaetszuschlag.js";
import { kirchensteuer } from "../tariff/kirchensteuer.js";

/**
 * Test values verified against the BMF Einkommensteuer-Rechner:
 * https://www.bmf-steuerrechner.de/ekst/eingabeformekst.xhtml
 *
 * The BMF calculator returns ESt in whole euros.
 */

describe("einkommensteuer §32a (2025)", () => {
  const year = 2025;

  it("returns 0 for income below Grundfreibetrag", () => {
    expect(einkommensteuer(0, year)).toBe(0);
    expect(einkommensteuer(1200000, year)).toBe(0); // 12,000€
    expect(einkommensteuer(1209600, year)).toBe(0); // 12,096€ exactly
  });

  it("computes Zone 2 correctly (12,097€ – 17,443€)", () => {
    // 15,000€ zvE: y=(15000-12096)/10000=0.2904
    // (932.30*0.2904+1400)*0.2904 = 485.19 → floor 485€
    const est = einkommensteuer(1500000, year);
    expect(est).toBe(48500);
  });

  it("computes Zone 3 correctly (17,444€ – 66,760€)", () => {
    // 30,000€ zvE: z=(30000-17443)/10000=1.2557
    // (176.64*1.2557+2397)*1.2557+1015.13 = 4303.87 → floor 4303€
    const est = einkommensteuer(3000000, year);
    expect(est).toBe(430300);

    // 50,000€ zvE: z=(50000-17443)/10000=3.2557
    // (176.64*3.2557+2397)*3.2557+1015.13 = 10691.35 → floor 10691€
    const est50k = einkommensteuer(5000000, year);
    expect(est50k).toBe(1069100);
  });

  it("computes Zone 4 correctly (66,761€ – 277,825€)", () => {
    // 80,000€ zvE: 0.42*80000-10911.92 = 22688.08 → floor 22688€
    const est = einkommensteuer(8000000, year);
    expect(est).toBe(2268800);

    // 100,000€ zvE: 0.42*100000-10911.92 = 31088.08 → floor 31088€
    const est100k = einkommensteuer(10000000, year);
    expect(est100k).toBe(3108800);
  });

  it("computes Zone 5 (Reichensteuer) correctly (>277,825€)", () => {
    // 300,000€ zvE: 0.45*300000-19246.67 = 115753.33 → floor 115753€
    const est = einkommensteuer(30000000, year);
    expect(est).toBe(11575300);
  });
});

describe("einkommensteuer §32a (2024)", () => {
  const year = 2024;

  it("returns 0 for Grundfreibetrag 2024 (11,784€)", () => {
    expect(einkommensteuer(1178400, year)).toBe(0);
    // 11,800€ is above Grundfreibetrag → small but nonzero tax
    expect(einkommensteuer(1180000, year)).toBeGreaterThan(0);
  });

  it("computes 50,000€ correctly for 2024", () => {
    // 50,000€ zvE: z=(50000-17005)/10000=3.2995
    // (181.19*3.2995+2397)*3.2995+991.21 = 10872.70 → floor 10872€
    const est = einkommensteuer(5000000, year);
    expect(est).toBe(1087200);
  });
});

describe("solidaritaetszuschlag", () => {
  const year = 2025;

  it("returns 0 when ESt is below Freigrenze", () => {
    // Single Freigrenze: 18,130€ → 1,813,000 cents
    expect(solidaritaetszuschlag(1813000, false, year)).toBe(0);
    expect(solidaritaetszuschlag(1000000, false, year)).toBe(0);
  });

  it("returns 0 for joint below joint Freigrenze", () => {
    // Joint Freigrenze: 36,260€ → 3,626,000 cents
    expect(solidaritaetszuschlag(3626000, true, year)).toBe(0);
  });

  it("computes Milderungszone correctly", () => {
    // Just above Freigrenze: should be capped by 11.9% rule
    const soli = solidaritaetszuschlag(1900000, false, year);
    // 11.9% * (19,000 - 18,130) = 11.9% * 870 = 103.53
    // 5.5% * 19,000 = 1,045
    // min(1045, 103.53) = 103.53 → 10353 cents
    expect(soli).toBe(10353);
  });

  it("computes full 5.5% above Milderungszone", () => {
    // 100,000€ ESt → well above Milderungszone
    // 5.5% * 100,000 = 5,500€ → 550,000 cents
    const soli = solidaritaetszuschlag(10000000, false, year);
    expect(soli).toBe(550000);
  });
});

describe("kirchensteuer (Berlin/Brandenburg 9%)", () => {
  it("returns 9% when both spouses are Kirchensteuerpflichtig", () => {
    // 10,000€ ESt → 900€ KiSt → 90,000 cents
    const kist = kirchensteuer(1000000, true, true);
    expect(kist).toBe(90000);
  });

  it("returns 9% of half ESt when only one spouse is pflichtig", () => {
    // 10,000€ ESt → half = 5,000€ → 450€ KiSt → 45,000 cents
    const kist = kirchensteuer(1000000, true, false);
    expect(kist).toBe(45000);
  });

  it("returns 0 when neither spouse is pflichtig", () => {
    expect(kirchensteuer(1000000, false, false)).toBe(0);
  });
});
