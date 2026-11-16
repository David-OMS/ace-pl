# ACE PL — Architecture

## Layers

```
Route (src/app)          thin: reads params, calls a query, renders feature components
  └─ Feature components  presentational, receive data through props
  └─ Server actions      validate → authorise → write → revalidate
       └─ Queries        all database reads for the feature
       └─ Domain         pure business rules, no I/O, fully unit tested
            └─ Config    defaults for scoring, prices, limits
Database (Supabase)      tables, constraints, Row Level Security, audit triggers
```

Dependencies point downward only. Domain code never imports from components, actions or the database client.

## Folder layout

```
ace-pl/
├─ .cursor/rules/            AI coding rules (mirror of the standards)
├─ .github/workflows/        CI pipelines
├─ docs/
│  ├─ adr/                   architecture decision records
│  ├─ ARCHITECTURE.md
│  ├─ ENGINEERING_STANDARDS.md
│  ├─ PRD.md                 original product definition
│  └─ TECH_STACK.md
├─ .env.example              every environment variable, documented
├─ mockups/                  approved design mockups (reference only)
├─ public/                   static assets, PWA manifest, icons
├─ supabase/
│  ├─ migrations/            versioned SQL schema changes
│  └─ seed.sql               local development data
├─ src/
│  ├─ app/                   Next.js routes and layouts only
│  │  ├─ (public)/           home, league, fixtures, players, fantasy, news
│  │  └─ admin/              admin dashboard routes
│  ├─ features/
│  │  ├─ auth/
│  │  ├─ players/
│  │  ├─ tournaments/
│  │  ├─ teams/
│  │  ├─ fixtures/
│  │  ├─ match-results/
│  │  ├─ league/
│  │  ├─ leaderboards/
│  │  ├─ fantasy/
│  │  ├─ fraud-watch/
│  │  ├─ awards/
│  │  ├─ notifications/
│  │  └─ audit-log/
│  ├─ ui/                    shared primitives: Button, Card, Table, Icon, Sheet
│  ├─ theme/                 design tokens and theme definitions
│  ├─ config/                default rule values (scoring, fantasy, limits)
│  ├─ lib/                   supabase clients, env, logger, result type
│  └─ types/                 generated database types
└─ tests/e2e/                Playwright tests
```

Each feature folder follows the same shape, and only creates the parts it needs:

```
features/league/
├─ components/       league-table.tsx, form-guide.tsx
├─ actions/          (server actions, if the feature writes data)
├─ queries/          get-standings.ts
├─ domain/           calculate-standings.ts, calculate-standings.test.ts
├─ schemas/          (Zod schemas for inputs)
├─ copy.ts           user-facing text
└─ index.ts          public exports for other features and routes
```

## Data model (first draft)

Stats are stored as events. Every total on screen (goals, clean sheets, table points, fantasy points) is calculated from these rows.

| Table | Purpose |
|---|---|
| `profiles` | One per login account. Links to a player if claimed. Admin flag. |
| `players` | Football player profile: name, photo, default position, active flag. |
| `tournaments` | Name, dates, status, rule settings (scoring, prices, budget, tiebreak choice). |
| `teams` | A team within one tournament (names can repeat across tournaments). |
| `team_memberships` | Player ↔ team for a tournament, with start and end dates (covers permanent transfers). |
| `game_days` | Dates chosen by admins for a tournament. Doubles as the fantasy gameweek. |
| `fixtures` | Home team, away team, game day, kick-off order, status (draft, published, completed, postponed, void). |
| `match_participations` | Per fixture: player, team played for, status (played, unused sub, absent), position override, goalkeeper flag. Borrowing lives here. |
| `match_events` | Goal (scorer, assister), own goal, save count, penalty save, yellow card, red card, MOTM. |
| `fantasy_player_ranks` | Rank (S/A/B/C) and price per player per tournament. |
| `fantasy_squads` | One per user per tournament: name, bank. |
| `fantasy_picks` | Players in a squad per gameweek: starter or bench, captain, vice-captain. |
| `fantasy_transfers` | Transfer history with gameweek and point cost. |
| `fraud_watch_entries` | Player, caption, start and end dates. At most two open entries. |
| `ballon_dor_votes` | One vote per user per tournament. Hidden until reveal. |
| `awards` | Final award winners per tournament (shared winners allowed). |
| `push_subscriptions` | Browser push endpoints per user. |
| `audit_log` | Who changed what, when, before and after, optional reason. Written by database triggers. |

The schema is finalised in migrations as each feature is built.

## Key flows

**Entering a match (several admins at once).** Admins open a fixture, mark participation and add events. Each change is saved immediately as a draft and broadcast through Supabase Realtime to other admins on the same fixture. Nothing is public until an admin publishes the result. Publishing triggers recalculation of standings, leaderboards and fantasy points.

**Fantasy deadline.** Squads lock at the configured deadline before each game day. A scheduled job sends a push reminder a few hours before.

**Corrections.** Editing a published result creates audit log entries through database triggers, then recalculates everything that depends on it.
