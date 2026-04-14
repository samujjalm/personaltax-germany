# CLAUDE.md

## Project Overview

German tax estimation tool for married couples filing jointly (Zusammenveranlagung), focused on the Steuerklasse III/V scenario. Scoped to Berlin/Brandenburg (Kirchensteuer always 9%).

## Monorepo Layout

- `packages/shared-types` — Zod schemas and TypeScript interfaces (Lohnsteuerbescheinigung, deductions, results)
- `packages/tax-engine` — Pure TypeScript tax calculation engine. No server dependencies — runs in both browser and Node.js
- `apps/web` — React + Vite + Tailwind frontend with step-by-step wizard
- `apps/api` — Lightweight Hono server with a single POST /api/calculate endpoint

Dependency graph: `shared-types` <- `tax-engine` <- `apps/web` and `apps/api`

## Commands

```bash
pnpm install                                    # Install all dependencies
pnpm dev                                        # Start all dev servers (Turborepo)
pnpm --filter @personaltax/web dev              # Frontend only (port 5173)
pnpm --filter @personaltax/api dev              # API only (port 3001)
pnpm --filter @personaltax/tax-engine test      # Run tax-engine tests (vitest)
pnpm build                                      # Build all packages
pnpm --filter @personaltax/shared-types build   # Build shared-types first if types changed
```

## Build Order

When changing types in `shared-types`, rebuild in order: `shared-types` -> `tax-engine` -> `apps`. Turborepo handles this automatically with `pnpm build`.

## Architecture Decisions

- **All monetary values are stored in integer cents** to avoid floating-point errors. The frontend converts to/from euros for display.
- **Tax engine is a pure function**: `calculateTax(CoupleInput) => TaxResult`. No side effects, no state.
- **The §32a tariff is implemented directly** from statute (not from BMF PAP, which computes Lohnsteuer, not Einkommensteuer). Year-specific constants live in `packages/tax-engine/src/tariff/constants.ts`.
- **Steuerklasse does NOT affect the annual calculation** — it only determines how much was withheld by employers. The Splittingverfahren produces the same result regardless of Steuerklasse combination.
- **Kirchensteuer is hardcoded at 9%** (Berlin/Brandenburg only). No Bundesland selector.

## Testing

Tests are in `packages/tax-engine/src/__tests__/`. Run with `pnpm --filter @personaltax/tax-engine test`.

Test expectations are derived from the §32a formula directly — not from external sources. Zone 4 and 5 values can be cross-checked against the BMF calculator at bmf-steuerrechner.de.

## Adding a New Tax Year

1. Add constants to `packages/tax-engine/src/tariff/constants.ts` (Grundfreibetrag, zone boundaries, coefficients)
2. Add the year to the `taxYear` union in `packages/shared-types/src/input.ts`
3. Add the year option to the `<select>` in `apps/web/src/App.tsx`
4. Add test cases in `packages/tax-engine/src/__tests__/tariff.test.ts`

## Code Style

- TypeScript strict mode throughout
- No semicolons are fine — the codebase uses semicolons consistently
- German domain terms are kept as-is in code (zvE, Lohnsteuerbescheinigung, Kirchensteuer, etc.)
