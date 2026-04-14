/**
 * Year-specific tax constants for the §32a EStG income tax tariff.
 * All monetary values in cents unless otherwise noted.
 */

export interface TaxYearConstants {
  /** Grundfreibetrag (basic tax-free allowance) in euros */
  grundfreibetrag: number;
  /** Zone 2 upper bound in euros */
  zone2Upper: number;
  /** Zone 3 upper bound in euros */
  zone3Upper: number;
  /** Zone 4 upper bound in euros (Reichensteuer threshold) */
  zone4Upper: number;

  /** Zone 2 coefficient a (for y²) */
  zone2a: number;
  /** Zone 2 coefficient b (for y) */
  zone2b: number;
  /** Zone 3 coefficient a (for z²) */
  zone3a: number;
  /** Zone 3 coefficient b (for z) */
  zone3b: number;
  /** Zone 3 constant c */
  zone3c: number;

  /** Zone 4 rate */
  zone4Rate: number;
  /** Zone 4 constant (subtracted) */
  zone4Const: number;
  /** Zone 5 rate (Reichensteuer) */
  zone5Rate: number;
  /** Zone 5 constant (subtracted) */
  zone5Const: number;

  /** Solidaritätszuschlag Freigrenze (single) in euros */
  soliFreigrenzeSingle: number;
  /** Solidaritätszuschlag Freigrenze (joint/splitting) in euros */
  soliFreigrenzeJoint: number;

  /** Werbungskostenpauschbetrag per person in cents */
  werbungskostenpauschbetrag: number;

  /** Sonderausgabenpauschbetrag (single) in cents */
  sonderausgabenpauschbetragSingle: number;
  /** Sonderausgabenpauschbetrag (joint) in cents */
  sonderausgabenpauschbetragJoint: number;

  /** Kinderfreibetrag per child (both parents combined) in cents */
  kinderfreibetrag: number;

  /** Kindergeld per child per year in cents */
  kindergeldJahr: number;

  /** Altersvorsorge Höchstbetrag per person in cents */
  altersvorsorgeHoechstbetrag: number;

  /** Entfernungspauschale: rate per km for first 20 km (cents per km) */
  entfernungspauschaleFirst20: number;
  /** Entfernungspauschale: rate per km from 21st km (cents per km) */
  entfernungspauschaleFrom21: number;

  /** Home-Office-Pauschale per day in cents */
  homeOfficePauschaleProTag: number;
  /** Home-Office-Pauschale max per year in cents */
  homeOfficePauschaleMax: number;
}

export const TAX_CONSTANTS: Record<number, TaxYearConstants> = {
  2024: {
    grundfreibetrag: 11784,
    zone2Upper: 17005,
    zone3Upper: 66760,
    zone4Upper: 277825,
    zone2a: 922.98,
    zone2b: 1400,
    zone3a: 181.19,
    zone3b: 2397,
    zone3c: 991.21,
    zone4Rate: 0.42,
    zone4Const: 10636.31,
    zone5Rate: 0.45,
    zone5Const: 18971.56,
    soliFreigrenzeSingle: 18130,
    soliFreigrenzeJoint: 36260,
    werbungskostenpauschbetrag: 123000,
    sonderausgabenpauschbetragSingle: 3600,
    sonderausgabenpauschbetragJoint: 7200,
    kinderfreibetrag: 931200,
    kindergeldJahr: 300000,
    altersvorsorgeHoechstbetrag: 2760400,
    entfernungspauschaleFirst20: 30,
    entfernungspauschaleFrom21: 38,
    homeOfficePauschaleProTag: 600,
    homeOfficePauschaleMax: 126000,
  },
  2025: {
    grundfreibetrag: 12096,
    zone2Upper: 17443,
    zone3Upper: 66760,
    zone4Upper: 277825,
    zone2a: 932.3,
    zone2b: 1400,
    zone3a: 176.64,
    zone3b: 2397,
    zone3c: 1015.13,
    zone4Rate: 0.42,
    zone4Const: 10911.92,
    zone5Rate: 0.45,
    zone5Const: 19246.67,
    soliFreigrenzeSingle: 18130,
    soliFreigrenzeJoint: 36260,
    werbungskostenpauschbetrag: 123000,
    sonderausgabenpauschbetragSingle: 3600,
    sonderausgabenpauschbetragJoint: 7200,
    kinderfreibetrag: 931200,
    kindergeldJahr: 306000,
    altersvorsorgeHoechstbetrag: 2928400,
    entfernungspauschaleFirst20: 30,
    entfernungspauschaleFrom21: 38,
    homeOfficePauschaleProTag: 600,
    homeOfficePauschaleMax: 126000,
  },
};
