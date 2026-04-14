import { useMemo } from "react";
import { calculateTax } from "@personaltax/tax-engine";
import type { CoupleInput, TaxResult } from "@personaltax/shared-types";
import { useTaxStore } from "../store/taxStore";

export function useTaxCalculation(): TaxResult | null {
  const {
    taxYear,
    spouse1,
    spouse2,
    deductions1,
    deductions2,
    kirchensteuerpflichtig1,
    kirchensteuerpflichtig2,
    anzahlKinder,
  } = useTaxStore();

  return useMemo(() => {
    // Only calculate if at least one spouse has income
    if (spouse1.bruttoarbeitslohn === 0 && spouse2.bruttoarbeitslohn === 0) {
      return null;
    }

    const input: CoupleInput = {
      taxYear,
      spouse1,
      spouse2,
      deductions1,
      deductions2,
      kirchensteuerpflichtig1,
      kirchensteuerpflichtig2,
      anzahlKinder,
    };

    return calculateTax(input);
  }, [
    taxYear,
    spouse1,
    spouse2,
    deductions1,
    deductions2,
    kirchensteuerpflichtig1,
    kirchensteuerpflichtig2,
    anzahlKinder,
  ]);
}
