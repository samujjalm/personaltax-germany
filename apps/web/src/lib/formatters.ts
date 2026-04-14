/** Format cents as EUR string (e.g. 123456 → "1.234,56 €") */
export function formatEur(cents: number): string {
  const euros = cents / 100;
  return euros.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

/** Format a decimal as percentage (e.g. 0.2534 → "25,34%") */
export function formatPercent(rate: number): string {
  return (rate * 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " %";
}

/** Parse a EUR input string to cents. Handles both "1.234,56" and "1234.56" formats. */
export function parseEurToCents(value: string): number {
  if (!value || value.trim() === "") return 0;
  // Remove thousands separators (dots in German format)
  // Replace comma with dot for decimal
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  const euros = parseFloat(cleaned);
  if (isNaN(euros)) return 0;
  return Math.round(euros * 100);
}
