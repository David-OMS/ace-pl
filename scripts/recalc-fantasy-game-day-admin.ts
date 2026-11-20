/**
 * Recalculate one fantasy game day using the secret key (no Next request cookies).
 * Usage: npx tsx --env-file=.env.local scripts/recalc-fantasy-game-day-admin.ts <gameDayId>
 */
import { createClient } from "@supabase/supabase-js";

import type { PlayerPosition } from "../src/config/player-positions";
import type { MatchEventType } from "../src/config/match-events";
import { assembleStatTotals } from "../src/features/fan-players/queries/assemble-stat-totals";
import { scoreFantasyGameweekTeam } from "../src/features/fantasy/domain/score-fantasy-gameweek-team";
import { teamScoresGameweek } from "../src/features/fantasy/domain/team-scores-gameweek";

const gameDayId = process.argv[2];
if (!gameDayId) {
  console.error("Need gameDayId");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const DONE = ["completed", "walkover"] as const;

const { data: day, error: dayError } = await sb
  .from("game_days")
  .select("id, tournament_id, played_on")
  .eq("id", gameDayId)
  .maybeSingle();
if (dayError || !day) throw dayError ?? new Error("game day not found");

const { data: fixtures, error: fixError } = await sb
  .from("fixtures")
  .select("id, home_team_id, away_team_id, status, walkover_winner_team_id")
  .eq("game_day_id", gameDayId)
  .in("status", [...DONE]);
if (fixError) throw fixError;
const fixtureRows = fixtures ?? [];
const ids = fixtureRows.map((f) => f.id);

let participationRows: {
  player_id: string;
  status: "played" | "unused_sub" | "absent";
  team_id: string;
  fixture_id: string;
  position: string | null;
  is_goalkeeper: boolean;
}[] = [];
let eventRows: {
  event_type: MatchEventType;
  player_id: string;
  quantity: number;
  assist_player_id: string | null;
  fixture_id: string;
}[] = [];

if (ids.length > 0) {
  const [parts, events] = await Promise.all([
    sb
      .from("match_participations")
      .select("player_id, status, team_id, fixture_id, position, is_goalkeeper")
      .in("fixture_id", ids),
    sb
      .from("match_events")
      .select("event_type, player_id, quantity, assist_player_id, fixture_id")
      .in("fixture_id", ids),
  ]);
  if (parts.error) throw parts.error;
  if (events.error) throw events.error;
  participationRows = (parts.data ?? []).map((row) => ({
    ...row,
    status: row.status as "played" | "unused_sub" | "absent",
  }));
  eventRows = (events.data ?? []).map((row) => ({
    ...row,
    event_type: row.event_type as MatchEventType,
  }));
}

const playerIds = [...new Set(participationRows.map((r) => r.player_id))];
const { data: players, error: playersError } = await sb
  .from("players")
  .select("id, position")
  .in("id", playerIds.length ? playerIds : ["00000000-0000-0000-0000-000000000000"]);
if (playersError) throw playersError;
const positionById = new Map((players ?? []).map((p) => [p.id, p.position as PlayerPosition]));

const enriched = participationRows.map((row) => ({
  ...row,
  position: (row.position as PlayerPosition | null) ?? positionById.get(row.player_id) ?? null,
}));

const assembled = assembleStatTotals(enriched, eventRows, {
  fixtures: fixtureRows,
  positionByPlayerId: positionById,
});
const dayPoints = assembled.totals.map((total) => ({
  playerId: total.playerId,
  rawPoints: assembled.fantasyPoints.get(total.playerId) ?? 0,
  played: total.apps > 0,
}));

const { data: teams, error: teamsError } = await sb
  .from("fantasy_teams")
  .select("id, formation, created_at")
  .eq("tournament_id", day.tournament_id);
if (teamsError) throw teamsError;

for (const team of teams ?? []) {
  if (
    !teamScoresGameweek({
      createdAtMs: Date.parse(team.created_at),
      playedOn: day.played_on,
    })
  ) {
    continue;
  }

  const { data: existing } = await sb
    .from("fantasy_team_gameweeks")
    .select("team_id")
    .eq("team_id", team.id)
    .eq("game_day_id", gameDayId)
    .maybeSingle();
  if (!existing) continue;

  const { data: snapPicks, error: snapError } = await sb
    .from("fantasy_gameweek_picks")
    .select("player_id, slot, is_bench, is_captain, is_vice, players!inner(position)")
    .eq("team_id", team.id)
    .eq("game_day_id", gameDayId);
  if (snapError) throw snapError;

  const scored = scoreFantasyGameweekTeam(
    (snapPicks ?? []).map((pick) => {
      const linked = pick.players as unknown as { position: PlayerPosition };
      return {
        playerId: pick.player_id,
        position: linked.position,
        isBench: pick.is_bench,
        isCaptain: pick.is_captain,
        isVice: pick.is_vice,
        slot: pick.slot,
      };
    }),
    dayPoints,
  );

  const { error: gwError } = await sb
    .from("fantasy_team_gameweeks")
    .update({ points: scored.points })
    .eq("team_id", team.id)
    .eq("game_day_id", gameDayId);
  if (gwError) throw gwError;

  for (const pick of scored.picks) {
    const { error } = await sb
      .from("fantasy_gameweek_picks")
      .update({
        raw_points: pick.rawPoints,
        applied_points: pick.appliedPoints,
        in_xi: pick.inXi,
      })
      .eq("team_id", team.id)
      .eq("game_day_id", gameDayId)
      .eq("player_id", pick.playerId);
    if (error) throw error;
  }
}

const { data: allTeams, error: allErr } = await sb
  .from("fantasy_teams")
  .select("id")
  .eq("tournament_id", day.tournament_id);
if (allErr) throw allErr;

for (const team of allTeams ?? []) {
  const { data: weeks, error } = await sb
    .from("fantasy_team_gameweeks")
    .select("points")
    .eq("team_id", team.id);
  if (error) throw error;
  const { data: hits } = await sb
    .from("fantasy_transfers")
    .select("point_cost")
    .eq("team_id", team.id);
  const gwSum = (weeks ?? []).reduce((s, w) => s + w.points, 0);
  const hitSum = (hits ?? []).reduce((s, h) => s + h.point_cost, 0);
  const { error: upErr } = await sb
    .from("fantasy_teams")
    .update({ total_points: gwSum - hitSum })
    .eq("id", team.id);
  if (upErr) throw upErr;
}

const tosinId = "09a6580d-97e5-4fa1-9bfd-8474d29ef0cd";
const tosinDay = dayPoints.find((p) => p.playerId === tosinId);
const { data: afterPicks } = await sb
  .from("fantasy_gameweek_picks")
  .select("team_id, raw_points, applied_points, is_captain, is_vice")
  .eq("player_id", tosinId)
  .eq("game_day_id", gameDayId);
const afterIds = (afterPicks ?? []).map((p) => p.team_id);
const { data: afterTeams } = afterIds.length
  ? await sb.from("fantasy_teams").select("id, name, total_points").in("id", afterIds)
  : { data: [] };
const { data: afterGw } = afterIds.length
  ? await sb
      .from("fantasy_team_gameweeks")
      .select("team_id, points")
      .eq("game_day_id", gameDayId)
      .in("team_id", afterIds)
  : { data: [] };

console.log(
  JSON.stringify(
    {
      tosinDayPoints: tosinDay,
      affectedTeams: (afterPicks ?? []).map((p) => ({
        ...p,
        name: afterTeams?.find((t) => t.id === p.team_id)?.name,
        total_points: afterTeams?.find((t) => t.id === p.team_id)?.total_points,
        gw_points: afterGw?.find((g) => g.team_id === p.team_id)?.points,
      })),
    },
    null,
    2,
  ),
);
