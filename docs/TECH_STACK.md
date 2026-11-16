# ACE PL — Tech Stack

Each choice below is judged against the same constraints: free hosting, a mobile-first web app, a small team, and code that a professional reviewer would recognise as standard.

| Area | Choice | Why |
|---|---|---|
| Language | **TypeScript** (strict) | Catches mistakes before they reach users. Shared types from the database to the UI. |
| Framework | **Next.js** (App Router) | Server rendering makes pages fast on mobile data. Server Actions handle admin writes without a separate API. Native fit for Vercel. |
| Hosting | **Vercel** (free tier) | Zero-config deploys from GitHub, preview deployments for every pull request. |
| Database | **Supabase Postgres** | A real relational database suits leagues, fixtures and events. Free tier covers our scale. |
| Auth | **Supabase Auth** | Google sign-in and email magic links built in. Sessions work with Next.js server code. |
| Authorisation | **Postgres Row Level Security** | Permissions enforced in the database itself, so a UI bug can't expose admin writes. |
| File storage | **Supabase Storage** | Player photos, with size and type limits and image transforms. |
| Live drafts | **Supabase Realtime** | Several admins entering stats for the same match see each other's entries instantly. |
| Migrations | **Supabase CLI** | Schema changes as versioned SQL files in git, generated TypeScript types. |
| Styling | **Tailwind CSS** + CSS variable tokens | Industry standard. Tokens in `src/theme/` drive every colour and font, so themes and dark mode are one switch. |
| UI primitives | **Radix UI** | Accessible dialogs, menus and selects without imposing a visual style. |
| Icons | **Lucide** | Consistent, clean, tree-shaken. One wrapper component so it can be swapped later. |
| Validation | **Zod** | One schema validates forms in the browser and inputs on the server. |
| Dates | **date-fns** + `@date-fns/tz` | Small, modular. Stores UTC, displays Africa/Lagos time. |
| Push notifications | **Web Push** (service worker + VAPID) | Free, no third-party service. Works on Android, and on iPhone when added to the home screen. |
| Unit / integration tests | **Vitest** + Testing Library | Fast, TypeScript-native, same API as Jest. |
| End-to-end tests | **Playwright** | Tests real flows in real browsers, including mobile viewports. |
| Lint / format | **ESLint** + **Prettier** | Enforces the size limits and conventions in `ENGINEERING_STANDARDS.md`. |
| Git hooks | **Husky** + **lint-staged** + **commitlint** | Checks run before code is committed; commit messages follow Conventional Commits. |
| CI | **GitHub Actions** | Type check, lint, test and build on every push and pull request. |
| Error tracking | **Sentry** (free tier), added before launch | Errors from real phones reach us with context. |

## Not chosen

| Option | Reason |
|---|---|
| Native iOS / Android app | Out of scope. The web app covers both platforms. |
| Separate backend (Express, NestJS) | Server Actions and Postgres cover our needs. Another service is more to host and maintain. |
| ORM (Prisma, Drizzle) | Supabase's generated types and query client work with Row Level Security directly. An ORM would bypass or duplicate it. |
| Global state library (Redux, Zustand) | Most data lives on the server. Local component state is enough for the rest. Revisit if that changes. |
| Firebase | Document database fits league and stats data poorly. |

## Environments

| Environment | Database | URL |
|---|---|---|
| Local development | Supabase project (dev) | `localhost:3000` |
| Preview (pull requests) | Supabase project (dev) | Vercel preview URL |
| Production | Supabase project (prod) | `*.vercel.app` |

Supabase's free plan allows two projects. If both slots aren't available, development and production share one project until a second is free, with extra care on migrations.

## Versions

Exact versions are pinned in `package-lock.json`. Node.js 24 LTS is the runtime (set in `.nvmrc` and `package.json` `engines`).
