import { useCallback } from "react";
import type { Lohnsteuerbescheinigung } from "@personaltax/shared-types";
import { EurInput } from "./EurInput";

interface Props {
  title: string;
  data: Lohnsteuerbescheinigung;
  onChange: (data: Lohnsteuerbescheinigung) => void;
  onNext: () => void;
  onBack?: () => void;
}

export function LohnsteuerbescheinigungForm({
  title,
  data,
  onChange,
  onNext,
  onBack,
}: Props) {
  const update = useCallback(
    (field: keyof Lohnsteuerbescheinigung, value: number) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600">
        Tragen Sie die Werte aus der Lohnsteuerbescheinigung ein.
      </p>

      {/* Steuerklasse */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-gray-400 font-mono text-xs mr-2">
              Zeile 22
            </span>
            Steuerklasse
          </label>
          <select
            value={data.steuerklasse}
            onChange={(e) =>
              onChange({
                ...data,
                steuerklasse: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6,
              })
            }
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          >
            <option value={1}>I</option>
            <option value={2}>II</option>
            <option value={3}>III</option>
            <option value={4}>IV</option>
            <option value={5}>V</option>
            <option value={6}>VI</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-gray-400 font-mono text-xs mr-2">
              Zeile 22
            </span>
            Kinderfreibeträge
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={data.kinderfreibetraege}
            onChange={(e) =>
              onChange({
                ...data,
                kinderfreibetraege: parseFloat(e.target.value) || 0,
              })
            }
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Income & Withheld Taxes */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1 w-full">
          Einkommen & einbehaltene Steuern
        </legend>
        <EurInput
          zeile="3"
          label="Bruttoarbeitslohn einschl. Sachbezüge"
          value={data.bruttoarbeitslohn}
          onChange={(v) => update("bruttoarbeitslohn", v)}
        />
        <div className="grid grid-cols-2 gap-4">
          <EurInput
            zeile="4"
            label="Einbehaltene Lohnsteuer"
            value={data.einbehalteneLohnsteuer}
            onChange={(v) => update("einbehalteneLohnsteuer", v)}
          />
          <EurInput
            zeile="5"
            label="Einbehaltener Solidaritätszuschlag"
            value={data.einbehaltenerSoli}
            onChange={(v) => update("einbehaltenerSoli", v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <EurInput
            zeile="6"
            label="Kirchensteuer (Arbeitnehmer)"
            value={data.kirchensteuerAN}
            onChange={(v) => update("kirchensteuerAN", v)}
          />
          <EurInput
            zeile="7"
            label="Kirchensteuer (Ehegatte)"
            value={data.kirchensteuerEhegatte}
            onChange={(v) => update("kirchensteuerEhegatte", v)}
          />
        </div>
      </fieldset>

      {/* Social Insurance Contributions */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1 w-full">
          Sozialversicherungsbeiträge (Arbeitnehmeranteil)
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <EurInput
            zeile="24a"
            label="Rentenversicherung"
            value={data.anAnteilRV}
            onChange={(v) => update("anAnteilRV", v)}
          />
          <EurInput
            zeile="24b"
            label="Berufsständische Versorgung"
            value={data.anAnteilRVBerufsstaendisch}
            onChange={(v) => update("anAnteilRVBerufsstaendisch", v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <EurInput
            zeile="25"
            label="Krankenversicherung"
            value={data.anBeitraegeKV}
            onChange={(v) => update("anBeitraegeKV", v)}
          />
          <EurInput
            zeile="26"
            label="Pflegeversicherung"
            value={data.anBeitraegePV}
            onChange={(v) => update("anBeitraegePV", v)}
          />
        </div>
      </fieldset>

      {/* Arbeitgeberanteil (Tier 2 but useful) */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1 w-full">
          Arbeitgeberanteil Rentenversicherung
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <EurInput
            zeile="23a"
            label="AG-Anteil Rentenversicherung"
            value={data.agAnteilRV}
            onChange={(v) => update("agAnteilRV", v)}
          />
          <EurInput
            zeile="23b"
            label="AG-Anteil berufsständisch"
            value={data.agAnteilRVBerufsstaendisch}
            onChange={(v) => update("agAnteilRVBerufsstaendisch", v)}
          />
        </div>
      </fieldset>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Zurück
          </button>
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
