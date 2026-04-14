import { useCallback } from "react";
import type { AdditionalDeductions } from "@personaltax/shared-types";
import { EurInput } from "./EurInput";

interface Props {
  deductions1: AdditionalDeductions;
  deductions2: AdditionalDeductions;
  kirchensteuerpflichtig1: boolean;
  kirchensteuerpflichtig2: boolean;
  anzahlKinder: number;
  onChangeDeductions1: (d: AdditionalDeductions) => void;
  onChangeDeductions2: (d: AdditionalDeductions) => void;
  onChangeKist1: (v: boolean) => void;
  onChangeKist2: (v: boolean) => void;
  onChangeKinder: (n: number) => void;
  onNext: () => void;
  onBack: () => void;
}

function DeductionFields({
  label,
  data,
  onChange,
}: {
  label: string;
  data: AdditionalDeductions;
  onChange: (d: AdditionalDeductions) => void;
}) {
  const update = useCallback(
    (field: keyof AdditionalDeductions, value: number) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange]
  );

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1 w-full">
        Werbungskosten — {label}
      </legend>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entfernung Wohnung ↔ Arbeit (km, einfach)
          </label>
          <input
            type="number"
            min="0"
            value={data.pendlerEntfernungKm || ""}
            onChange={(e) =>
              update("pendlerEntfernungKm", parseFloat(e.target.value) || 0)
            }
            placeholder="0"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arbeitstage im Jahr
          </label>
          <input
            type="number"
            min="0"
            max="280"
            value={data.pendlerArbeitstage || ""}
            onChange={(e) =>
              update("pendlerArbeitstage", parseInt(e.target.value) || 0)
            }
            placeholder="220"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Home-Office-Tage im Jahr (max. 210)
        </label>
        <input
          type="number"
          min="0"
          max="210"
          value={data.homeOfficeTage || ""}
          onChange={(e) =>
            update("homeOfficeTage", parseInt(e.target.value) || 0)
          }
          placeholder="0"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
      </div>
      <EurInput
        label="Sonstige Werbungskosten"
        value={data.sonstigeWerbungskosten}
        onChange={(v) => update("sonstigeWerbungskosten", v)}
        hint="Arbeitsmittel, Fortbildung, Reisekosten etc."
      />
    </fieldset>
  );
}

export function DeductionsForm({
  deductions1,
  deductions2,
  kirchensteuerpflichtig1,
  kirchensteuerpflichtig2,
  anzahlKinder,
  onChangeDeductions1,
  onChangeDeductions2,
  onChangeKist1,
  onChangeKist2,
  onChangeKinder,
  onNext,
  onBack,
}: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Weitere Angaben
      </h2>

      {/* Household info */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1 w-full">
          Haushalt
        </legend>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anzahl Kinder
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={anzahlKinder || ""}
            onChange={(e) => onChangeKinder(parseInt(e.target.value) || 0)}
            placeholder="0"
            className="block w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={kirchensteuerpflichtig1}
              onChange={(e) => onChangeKist1(e.target.checked)}
              className="rounded border-gray-300"
            />
            Person 1: Kirchensteuerpflichtig
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={kirchensteuerpflichtig2}
              onChange={(e) => onChangeKist2(e.target.checked)}
              className="rounded border-gray-300"
            />
            Person 2: Kirchensteuerpflichtig
          </label>
        </div>
      </fieldset>

      <DeductionFields
        label="Person 1"
        data={deductions1}
        onChange={onChangeDeductions1}
      />
      <DeductionFields
        label="Person 2"
        data={deductions2}
        onChange={onChangeDeductions2}
      />

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Zurück
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Berechnen
        </button>
      </div>
    </div>
  );
}
