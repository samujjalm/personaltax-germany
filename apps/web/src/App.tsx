import { useTaxStore } from "./store/taxStore";
import { useTaxCalculation } from "./hooks/useTaxCalculation";
import { LohnsteuerbescheinigungForm } from "./components/forms/LohnsteuerbescheinigungForm";
import { DeductionsForm } from "./components/forms/DeductionsForm";
import { TaxSummary } from "./components/results/TaxSummary";

const STEPS = ["spouse1", "spouse2", "deductions", "result"] as const;

function StepIndicator({ current }: { current: string }) {
  const labels = [
    { key: "spouse1", label: "Person 1" },
    { key: "spouse2", label: "Person 2" },
    { key: "deductions", label: "Abzüge" },
    { key: "result", label: "Ergebnis" },
  ];
  const currentIdx = STEPS.indexOf(current as (typeof STEPS)[number]);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {labels.map(({ key, label }, idx) => (
        <div key={key} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              idx <= currentIdx
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {idx + 1}
          </div>
          <span
            className={`text-sm ${idx <= currentIdx ? "text-gray-900" : "text-gray-400"} hidden sm:inline`}
          >
            {label}
          </span>
          {idx < labels.length - 1 && (
            <div
              className={`w-8 h-0.5 ${idx < currentIdx ? "bg-blue-600" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const store = useTaxStore();
  const result = useTaxCalculation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Steuerrechner
          </h1>
          <p className="text-sm text-gray-500">
            Zusammenveranlagung (Ehegattensplitting) — Steuerklasse III / V
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <StepIndicator current={store.step} />

        {/* Tax year selector */}
        {store.step !== "result" && (
          <div className="mb-6 flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Steuerjahr:
            </label>
            <select
              value={store.taxYear}
              onChange={(e) =>
                store.setTaxYear(parseInt(e.target.value) as 2024 | 2025)
              }
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        )}

        {store.step === "spouse1" && (
          <LohnsteuerbescheinigungForm
            title="Person 1 — Lohnsteuerbescheinigung"
            data={store.spouse1}
            onChange={store.setSpouse1}
            onNext={() => store.setStep("spouse2")}
          />
        )}

        {store.step === "spouse2" && (
          <LohnsteuerbescheinigungForm
            title="Person 2 — Lohnsteuerbescheinigung"
            data={store.spouse2}
            onChange={store.setSpouse2}
            onNext={() => store.setStep("deductions")}
            onBack={() => store.setStep("spouse1")}
          />
        )}

        {store.step === "deductions" && (
          <DeductionsForm
            deductions1={store.deductions1}
            deductions2={store.deductions2}
            kirchensteuerpflichtig1={store.kirchensteuerpflichtig1}
            kirchensteuerpflichtig2={store.kirchensteuerpflichtig2}
            anzahlKinder={store.anzahlKinder}
            onChangeDeductions1={store.setDeductions1}
            onChangeDeductions2={store.setDeductions2}
            onChangeKist1={store.setKirchensteuerpflichtig1}
            onChangeKist2={store.setKirchensteuerpflichtig2}
            onChangeKinder={store.setAnzahlKinder}
            onNext={() => {
              store.setResult(result);
              store.setStep("result");
            }}
            onBack={() => store.setStep("spouse2")}
          />
        )}

        {store.step === "result" && result && (
          <TaxSummary
            result={result}
            onBack={() => store.setStep("deductions")}
            onReset={store.reset}
          />
        )}
      </main>
    </div>
  );
}
