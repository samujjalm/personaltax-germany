import { create } from "zustand";
import type {
  Lohnsteuerbescheinigung,
  AdditionalDeductions,
  TaxResult,
} from "@personaltax/shared-types";

type Step = "spouse1" | "spouse2" | "deductions" | "result";

function emptyLohnsteuer(): Lohnsteuerbescheinigung {
  return {
    zeitraumVon: "2025-01-01",
    zeitraumBis: "2025-12-31",
    bruttoarbeitslohn: 0,
    einbehalteneLohnsteuer: 0,
    einbehaltenerSoli: 0,
    kirchensteuerAN: 0,
    kirchensteuerEhegatte: 0,
    steuerklasse: 3,
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
  };
}

function emptyDeductions(): AdditionalDeductions {
  return {
    pendlerEntfernungKm: 0,
    pendlerArbeitstage: 0,
    homeOfficeTage: 0,
    sonstigeWerbungskosten: 0,
  };
}

interface TaxStore {
  step: Step;
  taxYear: 2024 | 2025;
  spouse1: Lohnsteuerbescheinigung;
  spouse2: Lohnsteuerbescheinigung;
  deductions1: AdditionalDeductions;
  deductions2: AdditionalDeductions;
  kirchensteuerpflichtig1: boolean;
  kirchensteuerpflichtig2: boolean;
  anzahlKinder: number;
  result: TaxResult | null;

  setStep: (step: Step) => void;
  setTaxYear: (year: 2024 | 2025) => void;
  setSpouse1: (data: Lohnsteuerbescheinigung) => void;
  setSpouse2: (data: Lohnsteuerbescheinigung) => void;
  setDeductions1: (data: AdditionalDeductions) => void;
  setDeductions2: (data: AdditionalDeductions) => void;
  setKirchensteuerpflichtig1: (v: boolean) => void;
  setKirchensteuerpflichtig2: (v: boolean) => void;
  setAnzahlKinder: (n: number) => void;
  setResult: (r: TaxResult | null) => void;
  reset: () => void;
}

export const useTaxStore = create<TaxStore>((set) => ({
  step: "spouse1",
  taxYear: 2025,
  spouse1: emptyLohnsteuer(),
  spouse2: { ...emptyLohnsteuer(), steuerklasse: 5 },
  deductions1: emptyDeductions(),
  deductions2: emptyDeductions(),
  kirchensteuerpflichtig1: false,
  kirchensteuerpflichtig2: false,
  anzahlKinder: 0,
  result: null,

  setStep: (step) => set({ step }),
  setTaxYear: (taxYear) => set({ taxYear }),
  setSpouse1: (spouse1) => set({ spouse1 }),
  setSpouse2: (spouse2) => set({ spouse2 }),
  setDeductions1: (deductions1) => set({ deductions1 }),
  setDeductions2: (deductions2) => set({ deductions2 }),
  setKirchensteuerpflichtig1: (kirchensteuerpflichtig1) =>
    set({ kirchensteuerpflichtig1 }),
  setKirchensteuerpflichtig2: (kirchensteuerpflichtig2) =>
    set({ kirchensteuerpflichtig2 }),
  setAnzahlKinder: (anzahlKinder) => set({ anzahlKinder }),
  setResult: (result) => set({ result }),
  reset: () =>
    set({
      step: "spouse1",
      spouse1: emptyLohnsteuer(),
      spouse2: { ...emptyLohnsteuer(), steuerklasse: 5 },
      deductions1: emptyDeductions(),
      deductions2: emptyDeductions(),
      kirchensteuerpflichtig1: false,
      kirchensteuerpflichtig2: false,
      anzahlKinder: 0,
      result: null,
    }),
}));
