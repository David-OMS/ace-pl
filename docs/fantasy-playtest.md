# Fantasy scoring playtest

Tournament data is fake — reshape game days / fixtures freely.

## How time works (simulate real weeks)

The app does **not** need a fake clock. Deadlines and “current GW” come from **`game_days.played_on`** and fixture **`kickoff_time`** vs real `now()`.

To feel weeks pass: **move those dates**, then use the app as a normal person.

### Recommended loop

1. **Reset** (optional once): clear fantasy teams / match events / finished fixtures if the DB is messy. Keep real players + tournament + team colours.
2. **Build calendar**: create Fridays as game days in order (GW1, GW2, GW3…).
3. **Before GW1**
   - Set GW1 `played_on` to **tomorrow** (or later this week).
   - Fantasy is still in the unlimited-edit window until the first Friday’s deadline.
   - Create full 9-man squads on two accounts; set C/V.
4. **Open GW1**
   - Set GW1 `played_on` to **today** (or yesterday) so the deadline has passed → 1 free transfer.
   - Put fixtures on that game day with kickoffs **today**.
   - Score + **publish** matches → fantasy GW points appear under the GW1 chip.
5. **Between weeks**
   - Make transfers on the live squad (test −5 on a second transfer).
   - Do **not** change GW1 snapshot by editing after publish — transfers only affect future GWs.
6. **Open GW2**
   - Leave GW1 in the past.
   - Set GW2 `played_on` + fixture kickoffs to **today**.
   - Score + publish → check GW2 chip vs GW1 / totals / leaderboard.
7. Repeat for GW3…

### SQL knobs (manual time travel)

```sql
-- Move a Friday (deadline + GW label order)
update public.game_days
set played_on = current_date   -- or current_date - 7, + 7, etc.
where id = '<game-day-uuid>';

-- Nudge kickoffs for that day
update public.fixtures
set kickoff_time = now() + interval '30 minutes'
where game_day_id = '<game-day-uuid>';
```

Unlimited edits = no Friday has passed yet.  
1 FT / hits = at least one Friday `played_on` is ≤ today.

## 0. Migrations (once)

Apply in order (Supabase dashboard SQL, `db push`, or your usual path):

1. `20261116250000_fantasy_budget_68.sql`
2. `20261116251000_fantasy_gameweek_scoring.sql`
3. Rebuild **full 9** squads under 68m while edits are still open
4. `20261116252000_fantasy_playtest_past_friday.sql` — earliest Friday → **2026-11-14** (deadline passed → 1 FT)
5. `20261117010000_backfill_participation_positions.sql` — CS positions on old lineups

## 1. Two managers

1. **Account A** (you): full squad under 68m, captain + vice set, save
2. Incognito / second browser → sign up **Account B** → create another full fantasy team
3. Deliberately pick **overlapping** real players so the same match events hit both squads
4. On **A**, put someone on the **bench** who will play; leave a **starter** who you will mark **absent** (same position) — that’s the auto-sub test

## 2. Game days / fixtures (4–5 matches)

Admin → tournament → fixtures:

1. Put several fixtures on **GW1**
2. Optional kickoff nudge with the SQL above

## 3. Score one match (auto-sub check)

1. Open a fixture → lineups
2. Starter you want blanked → **absent** (or unused sub)
3. Bench partner (same position on someone’s fantasy XI) → **played**
4. Add a few events (goal / card) on players who appear in fantasy squads
5. **Publish**

Then:

- `/fantasy` → tap **GW1** chip → points under names; blanked starter dimmed; bench sub in XI with points
- Leaderboard totals should move
- Open the other manager from the leaderboard → same GW chip

## 4. More fixtures same GW

Publish 2–3 more on the **same** game day. Points for that GW are the **sum** of all finished fixtures that Friday — refresh / re-open GW1 after each publish.

## 5. Second gameweek

1. Leave GW1 dates in the past
2. Move GW2 `played_on` + kickoffs to “today”
3. Transfers on live squad, then score GW2
4. Compare GW1 / GW2 chips and season total

## What “good” looks like

| Check                                 | Expect                                                  |
| ------------------------------------- | ------------------------------------------------------- |
| Absent starter, bench same-pos played | Auto-sub; points on the sub; starter dimmed / 0 applied |
| Captain played                        | Their points ×2                                         |
| Captain blank, vice played            | Vice ×2                                                 |
| Two managers                          | Both get points for shared real players                 |
| Leaderboard                           | `total_points` = Σ GW − transfer hits                   |
| Other team link                       | Read-only pitch + GW chips                              |
| 2 transfers after deadline            | Shows −5 hit and **saves**                              |
