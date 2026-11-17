# Fantasy opening prices (v1)

**Status:** locked for v1 / first tournament playtest (2026-11-16).  
**Seed:** `supabase/seed_fantasy_prices.sql` writes these into `fantasy_player_ranks`.  
**Budget:** `tournaments.fantasy_budget` (default 68). Price moves (v2 wiring): [`fantasy-price-changes.md`](fantasy-price-changes.md).

| Setting       | Value                               |
| ------------- | ----------------------------------- |
| Budget        | **68m**                             |
| Squad         | **9** (1 GK + 6 starters + 2 bench) |
| Price floor   | **5.0m**                            |
| Formations    | 2-2-2 · 2-3-1 · 3-1-2 · 3-2-1       |
| Product rules | `DECISIONS.md` § Fantasy            |

Prices in **₦m**. GK is included in the 68m budget. Tobi = Dave (one person).

## Goalkeepers

| Player | Price |
| ------ | ----- |
| Logito | 5.0   |
| Samin  | 5.0   |

## Defenders

| Player    | Price |
| --------- | ----- |
| Justin    | 7.5   |
| Bobby     | 8.0   |
| Fawaz     | 8.0   |
| Big 5     | 7.5   |
| Mikey     | 7.5   |
| Tosin     | 6.5   |
| Elite     | 6.5   |
| Deo       | 6.0   |
| Daddy Ray | 5.5   |
| Ayo       | 5.5   |
| Buniyamin | 5.5   |
| Richie    | 5.0   |
| Adams     | 5.0   |
| Alisson   | 5.0   |
| Ndibe     | 5.0   |
| Prince    | 5.0   |
| SK        | 5.0   |
| Kanye     | 5.0   |
| Korede    | 5.0   |

## Midfielders

| Player    | Price |
| --------- | ----- |
| Billy     | 12.5  |
| Chisom    | 8.5   |
| Frank     | 8.5   |
| Abbah     | 8.0   |
| Emmy      | 7.0   |
| Tosan     | 7.0   |
| Tobi      | 6.5   |
| Tucha     | 6.5   |
| Ibrahim G | 6.0   |
| Ladipo    | 6.0   |
| Mitong    | 6.0   |
| Ricky     | 6.0   |
| Mike      | 6.0   |
| Wahab     | 5.5   |
| IBB       | 5.0   |
| Juwon     | 5.0   |
| Kylez     | 5.0   |

## Forwards

| Player    | Price |
| --------- | ----- |
| Ekene     | 15.5  |
| Pharooq   | 14.5  |
| Audu      | 10.0  |
| Ray       | 10.0  |
| Brymo     | 9.5   |
| Charles   | 9.5   |
| Ibrahim D | 9.5   |
| Swanky    | 9.0   |
| Haaland   | 7.0   |
| Japeth    | 7.0   |
| Jamal     | 7.0   |
| Čalēb     | 7.0   |
| Sule      | 6.5   |
| Kaka      | 5.5   |
| Pamzi     | 5.5   |
| Victor    | 5.5   |
| Lamba     | 5.0   |
| Shemshak  | 5.0   |
| Ocheni    | 5.0   |

## Design notes

- Dual premium (Ekene + Pharooq = 30m) is the intended template under 72m.
- All three premiums (Ekene + Pharooq + Billy = 42.5m) do not fit a serious XI at a 5.0 floor.
- Pamzi is listed as a forward at 5.5m (plays more like a defender).
- Charles added at 9.5m.
- When seeding the app: match these names to `players` rows and write `fantasy_player_ranks.price` (and a display rank if the UI still shows S/A/B/C).
