import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { assembleStatTotals } from "./assemble-stat-totals";

const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

export async function loadFanStatScope(
  tournamentId: string | null,
): Promise<ReturnType<typeof assembleStatTotals>> {
  const supabase = createPublicSupabaseClient();
  const participationQuery = supabase
    .from("match_participations")
    .select("player_id, status, team_id, fixture_id, position, is_goalkeeper, tournament_id");
  const eventQuery = supabase
    .from("match_events")
    .select("event_type, player_id, quantity, assist_player_id, fixture_id, tournament_id");
  const fixtureQuery = supabase
    .from("fixtures")
    .select("id, home_team_id, away_team_id, status, walkover_winner_team_id, tournament_id")
    .in("status", ["completed", "walkover"]);

  if (tournamentId) {
    participationQuery.eq("tournament_id", tournamentId);
    eventQuery.eq("tournament_id", tournamentId);
    fixtureQuery.eq("tournament_id", tournamentId);
  }

  const [participations, events, fixtures] = await Promise.all([
    participationQuery,
    eventQuery,
    fixtureQuery,
  ]);

  for (const result of [participations, events, fixtures]) {
    if (result.error) throw result.error;
  }

  const rows = participations.data ?? [];
  const playerIds = [...new Set(rows.map((row) => row.player_id))];
  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("id, position")
    .in("id", playerIds.length > 0 ? playerIds : [EMPTY_UUID]);
  if (playersError) throw playersError;

  const positionById = new Map((players ?? []).map((p) => [p.id, p.position as PlayerPosition]));
  const enriched = rows.map((row) => ({
    ...row,
    position: row.position ?? positionById.get(row.player_id) ?? null,
  }));

  return assembleStatTotals(enriched, events.data ?? [], {
    fixtures: fixtures.data ?? [],
    positionByPlayerId: positionById,
  });
}
