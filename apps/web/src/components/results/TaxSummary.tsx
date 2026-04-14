import type { TaxResult } from "@personaltax/shared-types";
import { formatEur, formatPercent } from "../../lib/formatters";

interface Props {
  result: TaxResult;
  onBack: () => void;
  onReset: () => void;
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: "green" | "red";
}) {
  const textColor =
    highlight === "green"
      ? "text-green-700"
      : highlight === "red"
        ? "text-red-700"
        : "text-gray-900";

  return (
    <div
      className={`flex justify-between py-2 ${bold ? "font-semibold" : ""}`}
    >
      <span className="text-gray-600">{label}</span>
      <span className={textColor}>{value}</span>
    </div>
  );
}

export function TaxSummary({ result, onBack, onReset }: Props) {
  const isRefund = result.differenz < 0;
  const diffAbs = Math.abs(result.differenz);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Ergebnis</h2>

      {/* Big number */}
      <div
        className={`rounded-lg p-6 text-center ${
          isRefund ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}
      >
        <p className="text-sm text-gray-600 mb-1">
          {isRefund
            ? "Voraussichtliche Erstattung"
            : "Voraussichtliche Nachzahlung"}
        </p>
        <p
          className={`text-3xl font-bold ${
            isRefund ? "text-green-700" : "text-red-700"
          }`}
        >
          {formatEur(diffAbs)}
        </p>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 divide-y divide-gray-100">
        <h3 className="font-semibold text-gray-800 pb-2">
          Steuerberechnung (Zusammenveranlagung / Splitting)
        </h3>

        <div className="pt-2">
          <Row
            label="Gesamtbetrag der Einkünfte"
            value={formatEur(result.breakdown.gesamtbetragDerEinkuenfte)}
          />
          <Row
            label="Sonderausgaben"
            value={`- ${formatEur(result.breakdown.sonderausgaben)}`}
          />
          <Row
            label="Zu versteuerndes Einkommen (zvE)"
            value={formatEur(result.breakdown.zuVersteuerndesEinkommen)}
            bold
          />
        </div>

        <div className="pt-2">
          <Row
            label="zvE / 2 (Splittingtarif)"
            value={formatEur(result.breakdown.zvEHalf)}
          />
          <Row
            label="ESt auf Hälfte"
            value={formatEur(result.breakdown.estHalf)}
          />
          <Row
            label="Einkommensteuer (× 2)"
            value={formatEur(result.einkommensteuer)}
            bold
          />
        </div>

        <div className="pt-2">
          <Row
            label="Solidaritätszuschlag"
            value={formatEur(result.solidaritaetszuschlag)}
          />
          <Row
            label="Kirchensteuer"
            value={formatEur(result.kirchensteuer)}
          />
          <Row
            label="Gesamte Steuerlast"
            value={formatEur(result.gesamtsteuer)}
            bold
          />
        </div>

        <div className="pt-2">
          <Row
            label="Bereits einbehalten (Lohnsteuer + Soli + KiSt)"
            value={formatEur(result.bereitsEinbehalten)}
          />
          <Row
            label={isRefund ? "Erstattung" : "Nachzahlung"}
            value={formatEur(diffAbs)}
            bold
            highlight={isRefund ? "green" : "red"}
          />
        </div>

        <div className="pt-2">
          <Row
            label="Effektiver Steuersatz"
            value={formatPercent(result.effektiverSteuersatz)}
          />
          {result.breakdown.kinderfreibetragGenutzt && (
            <p className="text-xs text-gray-500 mt-1">
              * Kinderfreibetrag wurde angewendet (günstiger als Kindergeld)
            </p>
          )}
        </div>
      </div>

      {/* Per-spouse breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Person 1", b: result.breakdown.spouse1 },
          { label: "Person 2", b: result.breakdown.spouse2 },
        ].map(({ label, b }) => (
          <div
            key={label}
            className="bg-gray-50 rounded-lg border border-gray-200 p-4"
          >
            <h4 className="font-semibold text-gray-800 text-sm mb-2">
              {label}
            </h4>
            <div className="text-xs space-y-1">
              <Row label="Brutto" value={formatEur(b.bruttoarbeitslohn)} />
              <Row
                label="Werbungskosten"
                value={`- ${formatEur(b.werbungskosten)}`}
              />
              <Row
                label="Einkünfte"
                value={formatEur(b.einkuenfteNichtselbstaendig)}
                bold
              />
              <Row
                label="Altersvorsorge-Abzug"
                value={formatEur(b.altersvorsorgeAbzug)}
              />
              <Row
                label="Basis KV/PV-Abzug"
                value={formatEur(b.basisKVPVAbzug)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        Dies ist eine unverbindliche Schätzung und ersetzt keine
        Steuerberatung. Alle Angaben ohne Gewähr.
      </p>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Zurück
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Neue Berechnung
        </button>
      </div>
    </div>
  );
}
