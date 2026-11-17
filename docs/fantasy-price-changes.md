# Fantasy price changes (v1)

**Status:** locked for v1 (2026-11-16).  
**Product rules:** `DECISIONS.md` § Fantasy.  
**Domain:** `src/features/fantasy/domain/calculate-price-changes.ts`, `sell-price.ts`.  
**Constants:** `src/config/fantasy.ts` (thresholds, step, floor/ceiling — not player prices).

Opening prices live in `fantasy_player_ranks.price`. Budget lives in `tournaments.fantasy_budget`.

## How FPL does it

Official summary ([Premier League](https://www.premierleague.com/en/news/2858775)):

- Prices move when a player is heavily transferred **in** or **out**.
- Changes usually land overnight UK time, **±£0.1m** at a time.
- Historically at most about **±£0.3m** between gameweek deadlines.
- Sell price ≠ buy price: you keep about **half** of any rise (sell-on).

Community reverse-engineering (not published by FPL):

- **Rise:** net transfers in (NTI) hit a global threshold that scales with active managers.
- **Fall:** net transfers out hit the lower of that threshold or ~**10% of ownership**.
- Wildcard / Free Hit transfers often do not count.
- Exact numbers are private and change through the season.

## ACE PL rules (small league)

We keep the same _idea_ (ownership pressure moves price; sell-on on rises) but size it for ~20–60 managers and our **0.5m** price grid.

| Rule            | Value                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| When            | Once per gameweek, after the Thursday 23:59 deadline                                                       |
| Step            | **±0.5m**                                                                                                  |
| Cap per GW      | **±1.0m** (2 steps)                                                                                        |
| Floor / ceiling | **5.0m** / **20.0m**                                                                                       |
| Rise threshold  | `max(2, ceil(active_fantasy_teams × 0.15))` net transfers **in**                                           |
| Fall threshold  | `max(2, ceil(current_ownership × 0.20))` net transfers **out**                                             |
| What counts     | Rows in `fantasy_transfers` since the last evaluation (in − out). Initial squad create does **not** count. |
| Sell value      | `purchase + floor(rises / 2) × 0.5` — half of rises, rounded down in steps. Falls apply in full.           |

### Examples (40 active teams)

- Rise threshold = `ceil(40 × 0.15)` = **6**. Six more managers buy than sell → **+0.5m**. Twelve net buys → **+1.0m** (cap).
- Player owned by 20 teams: fall threshold = `ceil(20 × 0.20)` = **4**. Four net sells → **−0.5m**.
- Bought at 8.0, rises to 9.0 → sell for **8.5**.

### Why not daily 0.1m?

FPL’s daily tick needs huge transfer volume. With a community league, a weekly evaluation and **0.5m** steps still creates TV (team value) without needing thousands of transfers overnight.

### Admin

Admins set **opening** continuous prices (and can still edit mid-tournament). The algorithm is the automatic path after GW1; it does not replace admin overrides.
