import { TAX_CONSTANTS } from "./tariff/constants.js";
import { splittingverfahren } from "./splitting/splittingverfahren.js";

/**
 * Günstigerprüfung: Compare using Kinderfreibetrag vs. keeping Kindergeld.
 *
 * With Kinderfreibetrag: lower zvE → less tax, but Kindergeld is added back to liability.
 * Without Kinderfreibetrag: higher zvE → more tax, but no Kindergeld clawback.
 *
 * The Finanzamt automatically picks whichever is better for the taxpayer.
 *
 * @param zvEBeforeKfbCents - zvE before Kinderfreibetrag deduction (cents)
 * @param anzahlKinder - number of children
 * @param year - tax year
 * @returns { useKinderfreibetrag, zvEFinalCents, kinderfreibetragAmount }
 */
export function guenstigerpruefung(
  zvEBeforeKfbCents: number,
  anzahlKinder: number,
  year: number
): {
  useKinderfreibetrag: boolean;
  zvEFinalCents: number;
  kinderfreibetragAmount: number;
} {
  if (anzahlKinder <= 0) {
    return {
      useKinderfreibetrag: false,
      zvEFinalCents: zvEBeforeKfbCents,
      kinderfreibetragAmount: 0,
    };
  }

  const c = TAX_CONSTANTS[year]!;

  const kfbTotal = anzahlKinder * c.kinderfreibetrag;
  const kindergeldTotal = anzahlKinder * c.kindergeldJahr;

  // Without Kinderfreibetrag
  const estWithout = splittingverfahren(zvEBeforeKfbCents, year).estCents;

  // With Kinderfreibetrag
  const zvEWithKfb = Math.max(0, zvEBeforeKfbCents - kfbTotal);
  const estWith = splittingverfahren(zvEWithKfb, year).estCents;

  // Tax saved by using Kinderfreibetrag
  const taxSaved = estWithout - estWith;

  // If tax saved > Kindergeld, Kinderfreibetrag is better
  // (tax saved replaces Kindergeld, so net benefit = taxSaved - kindergeldTotal)
  if (taxSaved > kindergeldTotal) {
    return {
      useKinderfreibetrag: true,
      zvEFinalCents: zvEWithKfb,
      kinderfreibetragAmount: kfbTotal,
    };
  }

  return {
    useKinderfreibetrag: false,
    zvEFinalCents: zvEBeforeKfbCents,
    kinderfreibetragAmount: 0,
  };
}
