# Steuerrechner — German Tax Estimation for Couples

A web app that estimates the annual income tax (Einkommensteuer) for married couples filing jointly (Zusammenveranlagung) in Germany. Designed for the common Steuerklasse III / V scenario, scoped to Berlin/Brandenburg.

Enter your Lohnsteuerbescheinigung data for both spouses and get an instant estimate of your Nachzahlung (back-payment) or Erstattung (refund).

> **Disclaimer:** This is an estimation tool, not professional tax advice. All calculations are provided without guarantee (ohne Gewähr).

## How It Works

1. Each spouse enters their Lohnsteuerbescheinigung values (gross income, withheld taxes, social insurance contributions)
2. The engine computes the joint taxable income (zu versteuerndes Einkommen)
3. Applies the Splittingverfahren (§32a Abs. 5 EStG) — halve, apply tariff, double
4. Compares the computed tax liability against what was already withheld
5. Shows the difference: refund or back-payment

## Project Structure

```
personaltax/
├── packages/
│   ├── shared-types/     # Zod schemas & TypeScript interfaces
│   └── tax-engine/       # Pure TS calculation engine (runs in browser & Node)
│       ├── tariff/       # §32a tariff, Solidaritätszuschlag, Kirchensteuer
│       ├── splitting/    # Splittingverfahren (Zusammenveranlagung)
│       └── deductions/   # Vorsorgeaufwendungen, Werbungskosten, Sonderausgaben
├── apps/
│   ├── web/              # React + Vite + Tailwind frontend
│   └── api/              # Hono API server
├── turbo.json
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js >= 18
- pnpm >= 9

## Getting Started

```bash
# Install dependencies
pnpm install

# Start both frontend and API dev servers
pnpm dev

# Or start individually:
pnpm --filter @personaltax/web dev    # Frontend at http://localhost:5173
pnpm --filter @personaltax/api dev    # API at http://localhost:3001
```

## Running Tests

```bash
pnpm --filter @personaltax/tax-engine test
```

24 tests covering the §32a tariff, Splittingverfahren, Solidaritätszuschlag, Kirchensteuer, and full integration scenarios.

## Building

```bash
pnpm build
```

Builds all packages in dependency order via Turborepo.

## Tax Calculation Details

### Supported Tax Years

- 2024
- 2025

### What's Implemented (Phase 1)

- §32a Einkommensteuertarif (all 5 zones, parameterized by year)
- Splittingverfahren (Ehegattensplitting / Zusammenveranlagung)
- Solidaritätszuschlag (with Freigrenze and Milderungszone)
- Kirchensteuer (9% — Berlin/Brandenburg)
- Vorsorgeaufwendungen (Altersvorsorge + Basis-KV/PV)
- Werbungskostenpauschbetrag (1,230 EUR)
- Entfernungspauschale and Home-Office-Pauschale
- Kinderfreibetrag Günstigerprüfung (vs. Kindergeld)
- Sonderausgabenpauschbetrag

### Planned (Phase 2)

- Progressionsvorbehalt (Elterngeld, Krankengeld, etc.)
- Handwerkerleistungen / haushaltsnahe Dienstleistungen (§35a)
- Spenden, Kinderbetreuungskosten
- Außergewöhnliche Belastungen

## Tech Stack

| Concern | Choice |
|---------|--------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Forms | Controlled components with Zustand |
| Backend | Hono on Node.js |
| Validation | Zod (shared schemas between FE/BE) |
| Testing | Vitest |
| Monorepo | pnpm workspaces + Turborepo |

## API

### `POST /api/calculate`

Accepts a `CoupleInput` JSON body and returns a `TaxResult`.

### `GET /api/health`

Returns `{ "status": "ok" }`.

## License

See [LICENSE](LICENSE).
