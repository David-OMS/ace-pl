# ACE PL — Engineering Standards

These standards apply to every change in this repository, whether written by a person or an AI model.
The enforceable parts are mirrored in `.cursor/rules/` and checked by ESLint, TypeScript and CI.

---

## 1. Principles

1. **Readable over clever.** Code is read far more often than it is written.
2. **One purpose per file, one job per function.** If a name needs "and", split it.
3. **Nothing hardcoded.** Colours, fonts, spacing, scoring values, prices, limits and copy live in one place each.
4. **Business rules are pure and tested.** Standings, fantasy scoring and awards are plain functions with no database or UI code.
5. **The database is the source of truth.** Stats are stored as match events. Totals are calculated, never typed in.
6. **Secure by default.** Every write is authorised on the server and by database policies, not just hidden in the UI.
7. **Leave it better.** Fix small problems you touch; log bigger ones as issues.

## 2. Size limits

| Unit | Limit | Enforced by |
|---|---|---|
| File | 250 lines (excluding blank lines and comments) | ESLint `max-lines` |
| React component file | 200 lines | ESLint `max-lines` |
| Function / component body | 50 lines | ESLint `max-lines-per-function` |
| Cyclomatic complexity | 10 per function | ESLint `complexity` |
| Function parameters | 3 (use an options object beyond that) | ESLint `max-params` |
| Nesting depth | 3 | ESLint `max-depth` |

A limit may be exceeded only when splitting would make the code harder to follow, or when it is over by a few lines.
The exception must be marked with an `eslint-disable-next-line` comment that states the reason.

## 3. Naming

- Files and folders: `kebab-case` (`league-table.tsx`, `calculate-standings.ts`).
- React components: `PascalCase` (`LeagueTable`).
- Functions and variables: `camelCase`, named by what they do or hold (`calculateStandings`, `publishedFixtures`).
- Booleans read as questions: `isPublished`, `hasCleanSheet`, `canVote`.
- Constants that are true constants: `SCREAMING_SNAKE_CASE`.
- Database: `snake_case` tables (plural) and columns (`match_events`, `scored_by_player_id`).
- No abbreviations beyond common football ones (`GK`, `DEF`, `MID`, `FWD`, `GW`, `MOTM`, `GD`).
- No vague names: `data`, `info`, `handle`, `utils`, `helpers`, `manager`, `stuff`, `temp`.

## 4. Project structure

See `docs/ARCHITECTURE.md` for the full layout. In short:

- `src/app/` holds routes only. Pages are thin: fetch, then render feature components.
- `src/features/<feature>/` holds everything for one feature: `components/`, `actions/`, `queries/`, `domain/`, `schemas/`.
- `src/ui/` holds shared, feature-agnostic UI primitives (button, card, table).
- `src/lib/` holds infrastructure (Supabase clients, environment, logger).
- `src/theme/` holds design tokens and themes.
- Features import each other only through the feature's `index.ts`. No reaching into another feature's internals.

## 5. TypeScript

- `strict` mode on, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- No `any`. Use `unknown` and narrow it.
- No non-null assertions (`!`) except in tests.
- Database types are generated from the schema (`npm run db:types`), never written by hand.
- All external input (forms, URL params, server action arguments) is validated with Zod at the boundary.
- Prefer `type` over `interface` unless declaration merging is needed.
- Return types are explicit on exported functions.

## 6. React and Next.js

- Server Components by default. Add `"use client"` only for interactivity.
- Mutations go through Server Actions in `features/<feature>/actions/`. Each action: validate input → check permission → write → revalidate.
- Data reads go through `features/<feature>/queries/`. Components never call Supabase directly.
- Components receive data through props. No fetching inside presentational components.
- Every list has a stable `key` from data, never the array index.
- Loading, empty and error states are designed, not left blank.

## 7. Styling and theming

- All visual values come from design tokens in `src/theme/`. Components never contain hex codes, font names or raw pixel values.
- Tokens are exposed as CSS variables and mapped into Tailwind, so `bg-surface` or `text-accent` follow the active theme.
- Themes: `street` (main app) and `retro` (fantasy), each with `light` and `dark` modes.
- Changing a colour or font means editing one token file. If a change needs edits in several components, the token is missing.
- Icons come from one icon library through a single `Icon` wrapper. No emoji used as icons.

## 8. Configuration, not hardcoding

- Football and fantasy rules (points per goal, prices, budget, transfer cost, formations) are stored per tournament in the database and read through typed config.
- Defaults live in `src/config/` with one file per area (`scoring-defaults.ts`, `fantasy-defaults.ts`).
- User-facing text lives with its feature in a `copy.ts` file, never scattered through JSX logic.
- Environment-specific values come from validated environment variables (`src/lib/env.ts`). The app fails at startup if one is missing.

## 9. Database

- Every schema change is a migration in `supabase/migrations/`. The dashboard is never used to change the schema.
- Row Level Security is on for every table. Public read where the product allows it; writes for admins only, checked by policy.
- Foreign keys and constraints enforce the rules the database can enforce (unique votes, max two Fraud Watch players, valid scores).
- Results and stats are never hard-deleted. Changes are recorded in the audit log with who, when, before and after.
- Seed data for local development lives in `supabase/seed.sql`.

## 10. Testing

| Layer | Tool | Requirement |
|---|---|---|
| Domain logic (standings, scoring, awards, fixtures) | Vitest | Every rule covered, including edge cases. Target 100%. |
| Server actions and queries | Vitest | Happy path, invalid input, unauthorised user. |
| Components with logic | Testing Library | Behaviour, not markup snapshots. |
| Critical flows (log in, enter a match result, pick a fantasy squad) | Playwright | Must pass before release. |

- Test names describe behaviour: `awards 3 points for a win`, not `test1`.
- Every bug fix comes with a test that fails without the fix.

## 11. Errors and logging

- Never swallow errors. Either handle them meaningfully or let them reach the error boundary.
- Server actions return a typed result (`{ ok: true, data }` or `{ ok: false, error }`). They don't throw to the client.
- Users see a plain, specific message. Details go to the logger.
- No `console.log` in committed code. Use the logger in `src/lib/logger.ts`.

## 12. Comments and documentation

- Comments explain **why**, never **what**. If code needs a comment to explain what it does, rename or simplify it.
- Write comments like a colleague would: short, plain and specific.
  - Good: `// Own goals count for the opponent, so flip the team before tallying.`
  - Bad: `// This function calculates the standings for the league table.`
- No commented-out code, no decorative banners, no emoji in code.
- Exported domain functions get a one-line JSDoc only if the name and types don't already make the behaviour obvious.
- Significant technical decisions are recorded in `docs/adr/` (one short file per decision: context, decision, consequences).
- Product decisions live in `DECISIONS.md`.

## 13. User-facing copy

- Plain, direct and in the group's voice. Banter is welcome where it belongs (Fraud Watch, empty states).
- Banned: "Seamlessly", "Elevate", "Unlock", "Dive in", "Supercharge", "Effortless", "Journey", "Leverage", "Empower", "Revolutionize", "Game-changer", "Welcome aboard", "Oops! Something went wrong".
- No exclamation-mark spam. No emoji in UI chrome.
- Error messages say what happened and what to do: "Couldn't save the result. Check your connection and try again."

## 14. Git and reviews

- `main` is always deployable. Work happens on short-lived branches: `feat/league-table`, `fix/clean-sheet-calc`.
- Commits follow Conventional Commits: `feat(league): add goal difference tiebreak`.
- Pull requests are small, describe what and why, and must pass CI.
- Never commit secrets, `.env` files or generated build output.

## 15. Continuous integration

Every push and pull request runs:

1. Type check (`tsc --noEmit`)
2. Lint (`eslint`), with size limits as errors
3. Format check (`prettier --check`)
4. Unit and integration tests (`vitest run`)
5. Production build (`next build`)

Playwright end-to-end tests run before each release.

## 16. Security and privacy

- Authorisation is checked on the server for every action, and again by database policies.
- The Supabase service-role key is server-only and never reaches the browser.
- Uploaded images are restricted by type and size, and stored in a dedicated bucket.
- Personal data is limited to what the app needs: name, email, photo.
- Dependencies are kept current; `npm audit` runs in CI.

## 17. Accessibility and performance

- WCAG 2.2 AA: colour contrast, focus states, labels on every input, tap targets of at least 44px.
- Works on a mid-range Android phone on mobile data. Images are optimised; pages load the data they need, not more.
- All times are stored in UTC and displayed in Africa/Lagos time.

## 18. Dependencies

- Add a dependency only when it saves real effort and is well maintained. Record the reason in the pull request.
- Exact versions are locked in `package-lock.json`.
- One library per job (one icon set, one date library, one validation library).
