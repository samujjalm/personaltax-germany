import { useState, useCallback } from "react";

interface EurInputProps {
  label: string;
  zeile?: string;
  value: number; // cents
  onChange: (cents: number) => void;
  hint?: string;
}

/**
 * Input field for EUR amounts. Displays/accepts values in euros,
 * stores internally as cents.
 */
export function EurInput({ label, zeile, value, onChange, hint }: EurInputProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    value === 0 ? "" : (value / 100).toFixed(2).replace(".", ",")
  );

  const handleBlur = useCallback(() => {
    if (displayValue.trim() === "") {
      onChange(0);
      return;
    }
    const cleaned = displayValue.replace(/\./g, "").replace(",", ".");
    const euros = parseFloat(cleaned);
    if (isNaN(euros)) {
      setDisplayValue("");
      onChange(0);
      return;
    }
    const cents = Math.round(euros * 100);
    onChange(cents);
    setDisplayValue(euros.toFixed(2).replace(".", ","));
  }, [displayValue, onChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {zeile && (
          <span className="text-gray-400 font-mono text-xs mr-2">
            Zeile {zeile}
          </span>
        )}
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          onBlur={handleBlur}
          placeholder="0,00"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-8 text-right text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
          €
        </span>
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
