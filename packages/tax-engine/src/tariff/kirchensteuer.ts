/**
 * Compute Kirchensteuer for Berlin/Brandenburg (always 9%).
 *
 * @param estCents - Einkommensteuer in cents (basis for Kirchensteuer)
 * @param spouse1Pflichtig - whether spouse 1 pays Kirchensteuer
 * @param spouse2Pflichtig - whether spouse 2 pays Kirchensteuer
 * @returns Kirchensteuer in cents
 */
export function kirchensteuer(
  estCents: number,
  spouse1Pflichtig: boolean,
  spouse2Pflichtig: boolean
): number {
  const rate = 0.09; // 9% for Berlin/Brandenburg

  if (spouse1Pflichtig && spouse2Pflichtig) {
    // Both pay: full 9% of ESt
    return Math.floor((estCents * rate) / 100) * 100;
  }

  if (spouse1Pflichtig || spouse2Pflichtig) {
    // Only one pays: half the ESt as basis (Halbteilungsverfahren)
    const halfEst = Math.floor(estCents / 2);
    return Math.floor((halfEst * rate) / 100) * 100;
  }

  // Neither pays
  return 0;
}
