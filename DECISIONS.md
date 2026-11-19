# ACE PL — Decisions Log

Living record of agreed decisions. Nothing is built until every section is marked final.

Status key: **FINAL** = agreed · **OPEN** = not decided · **CONFIRM** = recorded but needs a yes

---

## 0. Context

- Informal community football: casual sessions on Tuesdays and Fridays (~28 players).
- Casual format: 4 captains pick teams of 7, winner stays, loser off, draw = both off, 7-minute games.
- The app exists to make things more fun. "Good enough" data beats perfect data.

## 1. Platform & Hosting — FINAL

| Item            | Decision                                                                                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform        | Mobile-first web app, used in the browser on iOS and Android. No native app.                                                                                                     |
| Hosting         | Free tiers only. Vercel subdomain for now.                                                                                                                                       |
| Notifications   | Phone push notifications (e.g. fantasy deadline). Opt-in. On iPhone only works if added to the home screen; otherwise users get nothing, which is fine.                          |
| Data            | Fresh start. No import of past tournaments.                                                                                                                                      |
| Login           | Email and password. Google sign-in when a Google Cloud client exists. A forgotten password is reset by an email link.                                                            |
| Anonymous use   | Anyone with the link can view tables, fixtures and stats. Login needed for fantasy, voting and profile.                                                                          |
| Display name    | Any signed-in account can change their profile display name (1–40 characters).                                                                                                   |
| Player profiles | Admins create every player profile. A player logs in, links their account to their profile (admin sends a personal claim link, e.g. via WhatsApp) and uploads their own picture. |
| Player “active” | Not used in admin UX. Who plays a tournament is chosen on the tournament roster. DB column may remain; ignore it for product flows.                                              |

## 2. Scope & Process — FINAL

- No code until all decisions are final, including rules, spec, UI and colours.
- Casual Tuesday/Friday sessions are **not** tracked. Only the monthly tournament.

## 3. Tournament Structure

| Item                        | Decision                                                                                                                                                                                                                   | Status               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Players per tournament      | ~40+                                                                                                                                                                                                                       | FINAL                |
| Team setup                  | Configurable per tournament (any number of teams and squad size). Likely 4×10 or 5×8.                                                                                                                                      | FINAL (configurable) |
| Players on pitch            | Tournament setting, any number (6-a-side now, could be 7 or 8 next time). Nothing in the app assumes a fixed number; fantasy formations follow it.                                                                         | FINAL (configurable) |
| Captains                    | One captain per team, marked by an admin.                                                                                                                                                                                  | FINAL                |
| Goalkeepers                 | Configurable per tournament: **per team** (each squad has its own GK) or **shared**. In shared mode a team may still have a fixed GK on its squad; only sides without a fixed GK borrow from the shared pool on match day. | FINAL (configurable) |
| Game days                   | Admins pick the dates per tournament (usually Fridays)                                                                                                                                                                     | FINAL                |
| Match length                | 20 minutes                                                                                                                                                                                                                 | FINAL                |
| Matches per game day        | Configurable per tournament. A session is ~2 hours, so ~4–5 matches. Not every team plays every Friday.                                                                                                                    | FINAL (configurable) |
| Fixture schedule pattern    | Manual add **or** auto-generate. Generator: round-robin (home/away flip second half), respect matches/day, no back-to-back for the same team, prefer teams who haven't played yet that day.                                | FINAL                |
| Fixture status on create    | Creating a fixture schedules it (`published`). No draft/publish step on create. **Postpone** is an action on an existing fixture. Result publish (match entry) is separate.                                                | FINAL                |
| Walkover                    | Recorded as 3–0 to the team that turned up. Counts in the table only: no goals, appearances or clean sheets for anyone.                                                                                                    | FINAL                |
| Postponed / cancelled match | Admin chooses each time: reschedule, void, or award the result                                                                                                                                                             | FINAL                |
| Winner                      | Top of the league table                                                                                                                                                                                                    | FINAL                |
| Points                      | Win 3, Draw 1, Loss 0                                                                                                                                                                                                      | FINAL                |
| Tiebreak (default)          | Points → goal difference → goals scored → head-to-head → fewest discipline points (yellow = 1, red = 3).                                                                                                                   | FINAL                |
| Playoff option              | Admin can switch a tournament to settle a tie for 1st with an extra playoff match instead of the discipline step. Default is the chain above.                                                                              | FINAL                |

Matches available per month: 4 Fridays × 4–5 matches = **16–20 matches**.

- 4 teams: one full round-robin = 6 matches, so a month fits ~3 round-robins (18).
- 5 teams: one full round-robin = 10 matches, so a month fits 2 round-robins (20).

## 4. Positions — FINAL

- GK, DEF, MID, FWD (FPL-style).
- Assigned by admins. Can be overridden per match.
- Each team has one fixed goalkeeper per match.

## 5. Match Stats Recorded — FINAL

Entered by admins during or right after each match (can be split between several admins, e.g. one on goals, one on saves).

| Stat             | Notes                                                                                                                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Final score      | Not typed. Calculated from the goals entered.                                                                                                                                                                     |
| Participation    | Squad list per team. Each player per match is **played**, **unused sub** or **absent**. Only "played" counts as an appearance, even if it was 10 seconds. Borrowed players are added to the squad for that match. |
| Goals            | Per goal: scorer (always required, a scorer is always known) + optional assist. A player can appear many times.                                                                                                   |
| Own goals        | Recorded with the player's name, counted for the other team                                                                                                                                                       |
| Assists          | Per goal                                                                                                                                                                                                          |
| Man of the Match | One per match                                                                                                                                                                                                     |
| Saves            | GK only. ±1 accuracy is acceptable.                                                                                                                                                                               |
| Penalty saves    | GK only                                                                                                                                                                                                           |
| Clean sheets     | Auto-derived from the score. Credited to **GK and DEF**.                                                                                                                                                          |
| Goals conceded   | Auto-derived from the score                                                                                                                                                                                       |
| Yellow cards     | Recorded only                                                                                                                                                                                                     |
| Red cards        | Recorded only. The real-life consequence (sent off, fine, forced sub) is decided by the group, not the app.                                                                                                       |

Not tracked: shots, tackles, interceptions, big chances, etc.

## 6. Fantasy

| Item                         | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Status     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| Gameweek                     | One Friday. Points add up across all of a player's matches that day.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | FINAL      |
| Squad size                   | Same as a real tournament team (7 starters + same number of subs)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | FINAL      |
| Goalkeepers                  | 1 GK only. If they don't play, those points are lost.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | FINAL      |
| Formations                   | Four shapes only (DEF-MID-FWD + 1 GK): **2-2-2**, **2-3-1**, **3-1-2**, **3-2-1**. No 3-forward shape. Formation + budget stop stacking all premiums.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | FINAL (v1) |
| Team limit                   | None. Budget is the only limit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | FINAL      |
| Picking yourself / teammates | Allowed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | FINAL      |
| Captain                      | Double points. Vice-captain takes over if the captain doesn't play.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | FINAL      |
| Auto-subs                    | Once per gameweek: blanked **outfield** starter → next bench outfielder who played (**any** outfield position). GK never auto-subs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | FINAL      |
| Transfers                    | Pitch-based. **Before first GW deadline:** remove/add freely (bank refunds); empty **starter** holes = that position only (like create); empty **bench** = any outfield; formation greys **only when squad is full** and can’t cover that shape. **From each GW deadline until every fixture that week is finished** (completed / walkover / void): squad locked — no edits, no free transfer. **After the week is fully recorded:** open again until the next deadline; no remove — transfer only; **1 free**/GW (no carry, refreshed when the week finishes), −5 per extra; **starter** in = same position; **bench** in = any outfield if affordable; starter↔bench same-position swaps free. | FINAL (v1) |
| Other managers’ squads       | Always open from the leaderboard. No LIVE view of rivals — GW chips only. A GW’s squad + points show after at least one match that week is recorded. Earlier locked GWs stay visible; not-yet-recorded GWs show the scouting lock message. Own live squad always visible to the owner.                                                                                                                                                                                                                                                                                                                                                                                                           | FINAL (v1) |
| Deadline                     | Thursday 23:59. After deadline, transfers stay locked until all matches that gameweek are recorded.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | FINAL      |
| Rank allocation              | Admins set continuous opening prices per player (`fantasy_player_ranks.price`). S/A/B/C may stay in the DB for seeding/admin only — fans never see it. Prices show as **₦12.0m**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | FINAL (v1) |
| Price changes                | Ownership-driven during the tournament (FPL-style, sized for a small league). Rules in [`docs/fantasy-price-changes.md`](docs/fantasy-price-changes.md). Admins may still override.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | FINAL (v1) |
| Re-ranking                   | Fresh opening prices before every tournament. Mid-tournament moves come from the price-change algorithm (or admin).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | FINAL (v1) |
| Budget & prices              | Budget on `tournaments.fantasy_budget` (default **68m**). Squad **9**. Floor **5.0m**. Opening list: [`docs/fantasy-opening-prices.md`](docs/fantasy-opening-prices.md). Price-change **wiring** deferred to v2 (rules still in [`docs/fantasy-price-changes.md`](docs/fantasy-price-changes.md)).                                                                                                                                                                                                                                                                                                                                                                                               | FINAL (v1) |
| Team name                    | Unique per tournament (case-insensitive). Owner may rename **at most 2 times** after creating the team.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | FINAL      |
| Scoring values               | Table below, approved for v1. Admin-configurable so values can change without code. Revisit "−1 per 2 goals conceded", which may be too harsh for high-scoring 20-minute 7-a-side.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | FINAL (v1) |

**Budget & prices (v1).** Locked for the first tournament playtest. Names/₦m: [`docs/fantasy-opening-prices.md`](docs/fantasy-opening-prices.md). Price moves: [`docs/fantasy-price-changes.md`](docs/fantasy-price-changes.md).

- Budget **68m** (stored per tournament) · squad **9** · price floor **5.0m** · GK included in budget.
- Continuous per-player prices in DB (Ekene 15.5 … floor 5.0). Not flat S/A/B/C.
- Mid-tournament price moves: rules locked in docs; **app wiring is v2**.
- Intent: dual premium (Ekene + Pharooq) is the template; all three premiums (Ekene + Pharooq + Billy) do not fit a serious XI.
- Older flat-band idea (S12 / A9 / B7 / C5, budget = 8 × squad size) is **superseded** for v1; keep only as history.

**Formations (v1, DEF-MID-FWD + 1 GK):** 2-2-2 · 2-3-1 · 3-1-2 · 3-2-1.

**Scoring proposal (per match):**

| Event                  | GK  | DEF | MID | FWD |
| ---------------------- | --- | --- | --- | --- |
| Appearance             | +1  | +1  | +1  | +1  |
| Goal                   | +7  | +7  | +5  | +4  |
| Assist                 | +4  | +4  | +3  | +3  |
| Clean sheet            | +4  | +4  | +1  | 0   |
| Every 2 saves          | +1  | –   | –   | –   |
| Penalty save           | +5  | –   | –   | –   |
| Every 2 goals conceded | −1  | −1  | 0   | 0   |
| Man of the Match       | +3  | +3  | +3  | +3  |
| Yellow card            | −1  | −1  | −1  | −1  |
| Red card               | −3  | −3  | −3  | −3  |
| Own goal               | −3  | −3  | −3  | −3  |

**Other fantasy decisions**

- Prices shown as **₦12.0m** (naira).
- Each tournament's fantasy league is separate. No all-time fantasy leaderboard (for now).
- Late joiners allowed. They start on 0 points. — assumed, change if wrong.

## 7. Awards

| Item                                | Decision                                                                                                                                                                  | Status     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Ballon d'Or = Man of the Tournament | Same award. No separate award.                                                                                                                                            | FINAL      |
| Shortlist                           | Top 5 players by tournament fantasy points. Only they can be voted for.                                                                                                   | FINAL      |
| Voters                              | Anyone logged in. Players can't vote for themselves. One vote per person.                                                                                                 | FINAL      |
| Voting window                       | Opened manually by an admin, with a deadline                                                                                                                              | FINAL      |
| Secrecy                             | No live vote counter. Results hidden until the admin reveals the winner.                                                                                                  | FINAL      |
| Weighting                           | 50% fan vote + 50% stats. To be tested with scenarios later.                                                                                                              | FINAL (v1) |
| "Stats" measure                     | Each player's points from the fantasy scoring table (a weighted total of all their stats). Shown as **"stats score"**, not "fantasy points", and captaincy doesn't apply. | FINAL      |
| Calculation                         | Each half is a score out of 100 relative to the best on the shortlist (see example below)                                                                                 | FINAL (v1) |
| Golden Boot                         | Automatic: most goals. Ties are **shared**.                                                                                                                               | FINAL      |
| Playmaker                           | Automatic: most assists. Ties are **shared**.                                                                                                                             | FINAL      |
| Golden Glove                        | Automatic: most clean sheets. If level: more saves, then fewer goals conceded. Shared only if all equal.                                                                  | FINAL      |
| Fantasy top scorer                  | No award. Just bragging rights on the leaderboard.                                                                                                                        | FINAL      |

**Ballon d'Or example.** Shortlist of 3. 30 votes in total.

| Player | Votes     | Vote score | Fantasy pts | Stats score | Final  |
| ------ | --------- | ---------- | ----------- | ----------- | ------ |
| Tunde  | 16 (most) | 100        | 40          | 80          | **90** |
| David  | 8         | 50         | 50 (most)   | 100         | 75     |
| Kwame  | 6         | 38         | 35          | 70          | 54     |

Tunde wins: the most popular, with strong stats. David had the best stats but not the votes. A player with huge votes and weak stats can't run away with it.

## 8. Fraud Watch — FINAL

- For absolute stinker performances. Purely admin judgement ("vibes"), no stats or voting.
- Not tied to a tournament. Admins can put someone on it when no tournament exists. Baller d'Or and the auto awards stay on the tournament.
- Up to 2 players at a time (1 is fine).
- Streak counted in Fridays (gameweeks) on the list, e.g. "Fraud Watch: 4 weeks".
- Current and past Fraud Watch appearances are preserved and displayed.

## 9. Borrowing & Transfers — FINAL

**Borrowing**

- Recorded per match through the lineup: the match shows which team each player played for.
- A borrowed player can still play for their own team in other matches the same day.
- Stats always belong to the player. Goals count towards the result of the team they played for in that match.
- The player's registered team doesn't change.

**Permanent transfers**

- Should be rare. Admins can do it whenever needed.
- Records previous team, new team and date. Past matches are never reassigned.

## 10. Discipline — FINAL

- Yellow and red cards are recorded only.
- No fines, suspensions or money tracking in the app. Admins enforce punishments in real life.

## 11. UI / Branding — FINAL (design locked; logo pending)

- Feel: best of both worlds. Clean and official structure, with banter in the details (Fraud Watch, captions).
- Not a Premier League replica.
- **Chosen style: Street Volt** (black/white, volt-yellow #d4ff00 accent, orange #ff3d00 secondary, hard edges, Anton + Space Grotesk). — FINAL
- **Fantasy tab uses Retro Kit styling** (navy/cream/kit-red, chunky borders, Archivo Black). — FINAL
- **Light and dark mode** for both. — FINAL
- Reference: "★ Chosen" option in `mockups/index.html`.
- Logo: the user will supply it at the end of the decision process. — PENDING
- Bottom navigation (5 tabs): Home, League, Fixtures, Players, Fantasy. News and Profile sit in the header.
- **Icons:** proper custom/icon-set icons in the real app. No emoji-style icons (the mockup emojis are placeholders). — FINAL
- **Home “Next fixtures”:** next open matches in real order (game day, then kick-off), filling across weeks — not first kick-off of each week, and not only the current week. — FINAL
- **Fan match page:** before full time show each team’s full registered squad (who plays is decided on the session). Score and “who played” only after the result is recorded. — FINAL

## 12. Admin — FINAL

| Item                | Decision                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admins              | Added by the developer. Unlimited. Every admin can do everything, except fantasy prices: only account `a90018ef-f708-4d44-8a9f-7bed7b2676ef` can see or edit those. |
| Admin bottom nav    | **Home**, **Tournaments**, **Players**, **Awards**. Fixtures are managed inside each tournament. Match entry from a fixture. Change log later.                      |
| Admin order of work | 1) Maintain global player pool → 2) Create tournament + settings → 3) Select tournament players → 4) Build teams → 5) Set fixtures → 6) Record matches              |
| Match availability  | Tap fixture → tap team → see squad list → tap player → mark absent. Add borrowed players to the squad for that match. No lineup submission.                         |
| Live entry          | Several admins can add events to the same match as it happens (division of labour). Everything stays a **draft** until an admin publishes the result.               |
| Change log          | Admin-only. Records who, when, before → after, optional reason.                                                                                                     |
| Fraud Watch caption | Optional                                                                                                                                                            |

### Admin screens

**Home**

- ACE PL + ADMIN brand bar. Next match as black scoreboard card (`GM· Match x of y`). Tournament summary + shortcuts.
- Empty state: create tournament, manage players.

**Players**

- Global pool for the community (add / edit / deactivate). Not tournament-specific.

**Tournaments**

- List / open the tournament hub. Create tournament if none.
- **Create flow:** create tournament → **Manage players** (searchable multi-select from the global pool, “X players selected”, Save). First save continues to **Create team**. Later saves return to the hub.
- **Hub (main page):** setup prompts, manage players / create team / **manage fixtures**, team list with kit colours, unassigned, shared keepers when mode is shared. Settings is gear top-right.
- **Fixtures:** live under the tournament (GM · date groups, coloured crests). Not a bottom-nav tab.
- **Create team:** name + optional “Add players” (search, multi-select, capped by squad size). Save and create another, or save and return to hub. Players can also be added later on team detail.
- **Team detail:** captain, remove player (back to unassigned), add players within remaining spots, delete team.
- **Manage players** can add/remove/replace anyone on the tournament roster (deselect removes; still on a team membership is cleared on remove).
- **Settings (subpage):** name, start date, end date, players on pitch, squad size, matches per game day, keeper mode, 1st-place tiebreak, game days list. Status is not manual.
- **Status (automatic):** `setup` until roster + ≥2 teams + fixtures exist → `active`. When every fixture is finished (completed / walkover / void) → `completed`.

**Awards** (bottom-nav tab)

- Fraud Watch (empty shell until used), **Baller d'Or** (shortlist + voting UI, empty until stats), auto awards (Golden Boot / Playmaker / Golden Glove).

**Fixtures** (inside tournament)

- Manual add and/or auto-generate. Empty schedule → **Generate all fixtures**. Partial (manual) schedule → **Fill remaining fixtures** (skips existing pairs; free slots only).
- Generator constraints: double round-robin. **Within a day:** unfinished teams first. With an odd side, if the sit-out must play the **same day**, pair them with an **early** team (more rest) — not the side that just finished. **New day:** rest is even, so any opponent is fine, but teams with fewer games so far (the sit-out) still open the day. Soft no back-to-back kick-offs when a rested pair exists.
- List: GM · date groups with coloured crests; delete (×) on the row. Postpone / set date live on the opened fixture page.
- **Postpone (park):** no date → status `postponed`, listed under **No date** (not under the old game day). Optional date + kick-off moves it onto a **free** slot; conflict if that day/time is taken.
- **Set date** (from postponed): date + kick-off required; same slot conflict rule.
- **Insert & shift (agreed direction, not built yet):** when you want the postponed match back _before_ later fixtures, later kick-offs slide forward one slot (extra game day if needed). Park + free-slot remains the default.
- Tap a fixture → match entry: schedule actions, scoreboard, **Lineups**, events.
- **Kit colour:** editable on team detail (palette swatches); randomised on create.

**Dates**

- Tournament has **start date** and **end date**.
- **Game days** are the actual dates fixtures are played on (within that window).

---

## Change history

- 2026-11-15: Rounds 1–2 recorded (platform, login, stats, tournament basics, positions).
- 2026-11-15: Round 3 recorded (fantasy rules; budget, scoring and formations proposed).
- 2026-11-15: Confirmed gameweek, auto-subs, formations, tiebreak; scoring approved for v1.
- 2026-11-16: Round 4 recorded (transfers −5, borrowing, permanent transfers, Fraud Watch, awards, discipline).
- 2026-11-16: Round 5 recorded (public viewing, admin-created profiles, Ballon d'Or shortlist, shared awards, 1st-place tiebreak options, UI mockups).
- 2026-11-16: Style chosen (Street Volt + Retro Kit fantasy, light/dark). Ballon d'Or maths approved for v1.
- 2026-11-16: Design locked. Ballon d'Or shortlist = top 5. Golden Glove order confirmed. Logo to come from user.
- 2026-11-16: Round 6 recorded (admin flow, availability, own goals, admins, change log, postponements, icons).
- 2026-11-16: Round 7 recorded (participation states, own goal −2, live drafts, notifications, naira prices, fresh start). Remaining open items stay open; building starts.
- 2026-11-16: Handbook (Ace Ballerz League 2026) reviewed. Players on pitch is a setting, captains per team, walkovers 3–0 result-only, full tiebreak chain with playoff as an option, fixtures entered manually for now.
- 2026-11-16: Keeper mode per tournament — per-team or shared pool (often 2 keepers for the whole league).
- 2026-11-18: Shared mode hybrid — a team may still carry a fixed GK; only sides without one borrow from the shared pool on match day.
- 2026-11-18: Home next fixtures = chronological upcoming strip; fan match page shows squads until FT, then who played + score.
- 2026-11-18: Profile can change display name; fantasy team name unique per tournament, max 2 renames.
- 2026-11-18: Formation grey-out + error if squad can’t fill; bench transfers any outfield; auto-subs any outfield position.
- 2026-11-18: Rival squads always clickable; no LIVE; GW visible after a match that week is recorded.
- 2026-11-20: Fantasy squad locks from each GW deadline until every fixture that week is finished; free transfer refreshes when the week opens again.
- 2026-11-16: Admin IA locked — Home / Tournaments / Players / Fixtures nav; tournament workspace vs settings; explicit tournament squad; fixtures tab separate; start+end dates plus game days.
- 2026-11-16: Player “Still plays” / inactive not used in admin; tournament roster is who plays.
- 2026-11-16: Fixtures — create = scheduled; postpone after; auto-gen with no back-to-back; match entry matches mockup (tap absent, borrow).
- 2026-11-16: Tournament hub IA — manage players first (multi-select), then create teams (search multi-add within squad size); team list + detail later; match squads default played / tap = absent.
- 2026-11-16: Postpone optional date / set-date later; change-log trigger supports composite keys (tournament_players, tournament_keepers).
- 2026-11-16: Tournament status automatic (setup → active → completed); admin home shows next match; fixture delete sits on the time row.
- 2026-11-16: Admin UI matches Street Volt mockup (brand bar, scoreboard next match, kit colours). Fixtures under tournament; Awards nav (Fraud / Baller d'Or / auto). Lineups rename. Team colour column.
- 2026-11-16: Postponed fixtures under No date; postpone/set-date on fixture page with kick-off slot conflict; generate fills remaining; kit colour picker on team detail; home card drops count list. Insert & shift deferred.
- 2026-11-16: Fantasy opening-price playtest list consolidated (full roster incl. Pamzi, Charles 9.5, Tobi=Dave) at 70m / 9 — see `docs/fantasy-opening-prices.md`. Still OPEN.
- 2026-11-16: Fantasy v1 locked in docs — **72m** / 9, floor 5.0m, formations 2-2-2 · 2-3-1 · 3-1-2 · 3-2-1, continuous prices in `docs/fantasy-opening-prices.md`. Not wired into app config yet.
- 2026-11-16: Wired budget (`tournaments.fantasy_budget`), opening prices seed, and ACE PL price-change algorithm (see `docs/fantasy-price-changes.md`).
- 2026-11-16: Fantasy transfers = 1 free/GW (no carry); MID clean sheet +1; own goal −3; pitch-based transfers (no dropdowns); scoring table shown in app.
- 2026-11-16: Fantasy budget **68m**; live GW scoring on publish (snapshots, auto-subs, C/V); GW chips + other managers’ squads. Price-change **wiring** deferred to v2.
