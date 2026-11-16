# ACE PL — Decisions Log

Living record of agreed decisions. Nothing is built until every section is marked final.

Status key: **FINAL** = agreed · **OPEN** = not decided · **CONFIRM** = recorded but needs a yes

---

## 0. Context

- Informal community football: casual sessions on Tuesdays and Fridays (~28 players).
- Casual format: 4 captains pick teams of 7, winner stays, loser off, draw = both off, 7-minute games.
- The app exists to make things more fun. "Good enough" data beats perfect data.

## 1. Platform & Hosting — FINAL

| Item | Decision |
|---|---|
| Platform | Mobile-first web app, used in the browser on iOS and Android. No native app. |
| Hosting | Free tiers only. Vercel subdomain for now. |
| Notifications | Phone push notifications (e.g. fantasy deadline). Opt-in. On iPhone only works if added to the home screen; otherwise users get nothing, which is fine. |
| Data | Fresh start. No import of past tournaments. |
| Login | Google sign-in + email magic link. |
| Anonymous use | Anyone with the link can view tables, fixtures and stats. Login needed for fantasy, voting and profile. |
| Player profiles | Admins create every player profile. A player logs in, links their account to their profile (admin sends a personal claim link, e.g. via WhatsApp) and uploads their own picture. |

## 2. Scope & Process — FINAL

- No code until all decisions are final, including rules, spec, UI and colours.
- Casual Tuesday/Friday sessions are **not** tracked. Only the monthly tournament.

## 3. Tournament Structure

| Item | Decision | Status |
|---|---|---|
| Players per tournament | ~40+ | FINAL |
| Team setup | Configurable per tournament (any number of teams and squad size). Likely 4×10 or 5×8. | FINAL (configurable) |
| Players on pitch | 7 per team | FINAL |
| Game days | Admins pick the dates per tournament (usually Fridays) | FINAL |
| Match length | 20 minutes | FINAL |
| Matches per game day | Configurable per tournament. A session is ~2 hours, so ~4–5 matches. Not every team plays every Friday. | FINAL (configurable) |
| Fixture schedule pattern | How many games each team plays per Friday and across the month. Waiting on team structure. | OPEN |
| Postponed / cancelled match | Admin chooses each time: reschedule, void, or award the result | FINAL |
| Winner | Top of the league table | FINAL |
| Points | Win 3, Draw 1, Loss 0 | FINAL |
| Tiebreak | Points → goal difference | FINAL |
| 1st place still level | Admin chooses per tournament: **fewest discipline points** (yellow = 1, red = 3) **or** a playoff match. Only applies to 1st place. Other positions stay shared. | FINAL |

Matches available per month: 4 Fridays × 4–5 matches = **16–20 matches**.
- 4 teams: one full round-robin = 6 matches, so a month fits ~3 round-robins (18).
- 5 teams: one full round-robin = 10 matches, so a month fits 2 round-robins (20).

## 4. Positions — FINAL

- GK, DEF, MID, FWD (FPL-style).
- Assigned by admins. Can be overridden per match.
- Each team has one fixed goalkeeper per match.

## 5. Match Stats Recorded — FINAL

Entered by admins during or right after each match (can be split between several admins, e.g. one on goals, one on saves).

| Stat | Notes |
|---|---|
| Final score | Not typed. Calculated from the goals entered. |
| Participation | Squad list per team. Each player per match is **played**, **unused sub** or **absent**. Only "played" counts as an appearance, even if it was 10 seconds. Borrowed players are added to the squad for that match. |
| Goals | Per goal: scorer (always required, a scorer is always known) + optional assist. A player can appear many times. |
| Own goals | Recorded with the player's name, counted for the other team |
| Assists | Per goal |
| Man of the Match | One per match |
| Saves | GK only. ±1 accuracy is acceptable. |
| Penalty saves | GK only |
| Clean sheets | Auto-derived from the score. Credited to **GK and DEF**. |
| Goals conceded | Auto-derived from the score |
| Yellow cards | Recorded only |
| Red cards | Recorded only. The real-life consequence (sent off, fine, forced sub) is decided by the group, not the app. |

Not tracked: shots, tackles, interceptions, big chances, etc.

## 6. Fantasy

| Item | Decision | Status |
|---|---|---|
| Gameweek | One Friday. Points add up across all of a player's matches that day. | FINAL |
| Squad size | Same as a real tournament team (7 starters + same number of subs) | FINAL |
| Goalkeepers | 1 GK only. If they don't play, those points are lost. | FINAL |
| Formations | 2-2-2, 3-2-1, 2-3-1, 3-1-2 (DEF-MID-FWD, plus 1 GK). Budget stops stacking top attackers. | FINAL |
| Team limit | None. Budget is the only limit. | FINAL |
| Picking yourself / teammates | Allowed | FINAL |
| Captain | Double points. Vice-captain takes over if the captain doesn't play. | FINAL |
| Auto-subs | Bench player comes in if an outfield starter doesn't play (no GK auto-sub) | FINAL |
| Transfers | Swap-based: bank + outgoing player's price must cover the incoming player. Unlimited before gameweek 1. After that, 2 free per gameweek (unused ones don't carry over). Each extra transfer costs **−5 points**. | FINAL |
| Deadline | Thursday 23:59 | FINAL |
| Rank allocation | Admins decide. Later, previous tournament stats help inform it. | FINAL |
| Re-ranking | Re-ranked before every tournament. Fixed during a tournament. | FINAL |
| Budget & prices | Proposal below. To be playtested with real players. | OPEN (playtest) |
| Scoring values | Table below, approved for v1. Admin-configurable so values can change without code. Revisit "−1 per 2 goals conceded", which may be too harsh for high-scoring 20-minute 7-a-side. | FINAL (v1) |

**Budget proposal (to playtest).** Admins must be able to change these per tournament.

| Rank | Price | Share of players |
|---|---|---|
| S | 12 | top ~10% |
| A | 9 | next ~25% |
| B | 7 | next ~35% |
| C | 5 | bottom ~30% |

Budget = 8 × squad size (64 for 8 players, 80 for 10).

**Formation proposal (DEF-MID-FWD, plus 1 GK):** 2-2-2, 3-2-1, 2-3-1, 3-1-2.

**Scoring proposal (per match):**

| Event | GK | DEF | MID | FWD |
|---|---|---|---|---|
| Appearance | +1 | +1 | +1 | +1 |
| Goal | +6 | +6 | +5 | +4 |
| Assist | +3 | +3 | +3 | +3 |
| Clean sheet | +4 | +4 | 0 | 0 |
| Every 2 saves | +1 | – | – | – |
| Penalty save | +5 | – | – | – |
| Every 2 goals conceded | −1 | −1 | 0 | 0 |
| Man of the Match | +3 | +3 | +3 | +3 |
| Yellow card | −1 | −1 | −1 | −1 |
| Red card | −3 | −3 | −3 | −3 |
| Own goal | −2 | −2 | −2 | −2 |

**Other fantasy decisions**
- Prices shown as **₦12.0m** (naira).
- Each tournament's fantasy league is separate. No all-time fantasy leaderboard (for now).
- Late joiners allowed. They start on 0 points. — assumed, change if wrong.

## 7. Awards

| Item | Decision | Status |
|---|---|---|
| Ballon d'Or = Man of the Tournament | Same award. No separate award. | FINAL |
| Shortlist | Top 5 players by tournament fantasy points. Only they can be voted for. | FINAL |
| Voters | Anyone logged in. Players can't vote for themselves. One vote per person. | FINAL |
| Voting window | Opened manually by an admin, with a deadline | FINAL |
| Secrecy | No live vote counter. Results hidden until the admin reveals the winner. | FINAL |
| Weighting | 50% fan vote + 50% stats. To be tested with scenarios later. | FINAL (v1) |
| "Stats" measure | Each player's points from the fantasy scoring table (a weighted total of all their stats). Shown as **"stats score"**, not "fantasy points", and captaincy doesn't apply. | FINAL |
| Calculation | Each half is a score out of 100 relative to the best on the shortlist (see example below) | FINAL (v1) |
| Golden Boot | Automatic: most goals. Ties are **shared**. | FINAL |
| Playmaker | Automatic: most assists. Ties are **shared**. | FINAL |
| Golden Glove | Automatic: most clean sheets. If level: more saves, then fewer goals conceded. Shared only if all equal. | FINAL |
| Fantasy top scorer | No award. Just bragging rights on the leaderboard. | FINAL |

**Ballon d'Or example.** Shortlist of 3. 30 votes in total.

| Player | Votes | Vote score | Fantasy pts | Stats score | Final |
|---|---|---|---|---|---|
| Tunde | 16 (most) | 100 | 40 | 80 | **90** |
| David | 8 | 50 | 50 (most) | 100 | 75 |
| Kwame | 6 | 38 | 35 | 70 | 54 |

Tunde wins: the most popular, with strong stats. David had the best stats but not the votes. A player with huge votes and weak stats can't run away with it.

## 8. Fraud Watch — FINAL

- For absolute stinker performances. Purely admin judgement ("vibes"), no stats or voting.
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

## 12. Admin — FINAL

| Item | Decision |
|---|---|
| Admins | Added by the developer. Unlimited. Every admin can do everything. |
| Admin order of work | 1) Put players into teams → 2) Generate fixtures → 3) Record match events |
| Match availability | Tap fixture → tap team → see squad list → tap player → mark absent. Add borrowed players to the squad for that match. No lineup submission. |
| Live entry | Several admins can add events to the same match as it happens (division of labour). Everything stays a **draft** until an admin publishes the result. |
| Change log | Admin-only. Records who, when, before → after, optional reason. |
| Fraud Watch caption | Optional |

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
