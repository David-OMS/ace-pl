# ACE PL

League table, fixtures, player stats, fantasy football and Fraud Watch for the ACE PL community tournament.

## Documentation

| Document                                                         | Contents                                                 |
| ---------------------------------------------------------------- | -------------------------------------------------------- |
| [`DECISIONS.md`](DECISIONS.md)                                   | Agreed product rules. The source of truth for behaviour. |
| [`docs/PRD.md`](docs/PRD.md)                                     | Original product definition.                             |
| [`docs/ENGINEERING_STANDARDS.md`](docs/ENGINEERING_STANDARDS.md) | How code is written here.                                |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)                   | Layers, folders, data model.                             |
| [`docs/TECH_STACK.md`](docs/TECH_STACK.md)                       | Libraries and why they were chosen.                      |
| [`mockups/`](mockups/)                                           | Approved design mockups. Open `index.html` in a browser. |

## Getting started

Requirements: Node.js 24 (see `.nvmrc`) and a Supabase project.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Scripts

| Command                 | What it does                                                 |
| ----------------------- | ------------------------------------------------------------ |
| `npm run dev`           | Start the development server                                 |
| `npm run build`         | Production build                                             |
| `npm run check`         | Type check, lint, format check and tests: run before pushing |
| `npm run test:watch`    | Tests in watch mode                                          |
| `npm run db:new <name>` | Create a new migration file                                  |
| `npm run db:push`       | Apply migrations to the linked Supabase project              |
| `npm run db:types`      | Regenerate `src/types/database.ts` from the database         |

## Contributing

- Branch from `main`: `feat/<thing>` or `fix/<thing>`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org): `feat(league): add goal difference tiebreak`.
- Git hooks lint and format staged files and check the commit message.
- CI must pass before merging.
