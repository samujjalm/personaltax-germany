import { describe, it, expect } from "vitest";
import { splittingverfahren } from "../splitting/splittingverfahren.js";

describe("splittingverfahren", () => {
  const year = 2025;

  it("halves the zvE, applies tariff, and doubles", () => {
    // 100,000€ combined → 50,000€ each half
    // ESt on 50,000€ = 10,691€ → doubled = 21,382€
    const result = splittingverfahren(10000000, year);
    expect(result.zvEHalfCents).toBe(5000000);
    expect(result.estHalfCents).toBe(1069100);
    expect(result.estCents).toBe(2138200);
  });

  it("returns 0 for income below double Grundfreibetrag", () => {
    // 24,000€ combined → 12,000€ each → below 12,096€ Grundfreibetrag
    const result = splittingverfahren(2400000, year);
    expect(result.estCents).toBe(0);
  });

  it("shows splitting advantage for unequal incomes", () => {
    // Classic 3/5 scenario: 80,000€ + 20,000€ = 100,000€
    // Without splitting: ESt(80k) + ESt(20k) = 22,688 + 1,810 = 24,498€
    // With splitting: 2 * ESt(50k) = 2 * 10,691 = 21,382€
    const splitting = splittingverfahren(10000000, year);
    expect(splitting.estCents).toBe(2138200); // 21,382€
  });

  it("handles odd euro amounts (floors correctly)", () => {
    // 100,001€ → floor to euros = 100,001 → half = 50,000
    const result = splittingverfahren(10000100, year);
    expect(result.zvEHalfCents).toBe(5000000);
  });
});
