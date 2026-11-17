import "server-only";

import type { MatchEventType } from "@/config/match-events";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

const DONE = ["completed", "walkover"] as const;

export async function fetchGameDayMatchRows(gameDayId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: fixtures, error: fixError } = await supabase
    .from("fixtures")
    .select("id, home_team_id, away_team_id, status, walkover_winner_team_id")
    .eq("game_day_id", gameDayId)
    .in("status", [...DONE]);
  if (fixError) throw fixError;
  const fixtureRows = fixtures ?? [];
  if (fixtureRows.length === 0) {
    return { fixtureRows, participationRows: [], eventRows: [] };
  }

  const ids = fixtureRows.map((f) => f.id);
  const [parts, events] = await Promise.all([
    supabase
      .from("match_participations")
      .select("player_id, status, team_id, fixture_id, position, is_goalkeeper")
      .in("fixture_id", ids),
    supabase
      .from("match_events")
      .select("event_type, player_id, quantity, assist_player_id, fixture_id")
      .in("fixture_id", ids),
  ]);
  if (parts.error) throw parts.error;
  if (events.error) throw events.error;

  return {
    fixtureRows,
    participationRows: (parts.data ?? []).map((row) => ({
      ...row,
      status: row.status as "played" | "unused_sub" | "absent",
    })),
    eventRows: (events.data ?? []).map((row) => ({
      ...row,
      event_type: row.event_type as MatchEventType,
    })),
  };
}
