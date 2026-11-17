import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type FixtureRow = {
  id: string;
  tournament_id: string;
  home_team_id: string;
  away_team_id: string;
  game_day_id: string;
};

export async function fetchMatchEntryRows(supabase: SupabaseClient<Database>, fixture: FixtureRow) {
  const [teams, gameDay, participations, events, memberships, players] = await Promise.all([
    supabase
      .from("teams")
      .select("id, name, color")
      .in("id", [fixture.home_team_id, fixture.away_team_id]),
    supabase.from("game_days").select("played_on").eq("id", fixture.game_day_id).maybeSingle(),
    supabase
      .from("match_participations")
      .select("id, player_id, team_id, status, is_goalkeeper")
      .eq("fixture_id", fixture.id),
    supabase
      .from("match_events")
      .select("id, event_type, player_id, assist_player_id, quantity, sort_order")
      .eq("fixture_id", fixture.id)
      .order("sort_order"),
    supabase
      .from("team_memberships")
      .select("player_id, team_id")
      .eq("tournament_id", fixture.tournament_id)
      .in("team_id", [fixture.home_team_id, fixture.away_team_id])
      .is("left_on", null),
    supabase.from("players").select("id, name, position, is_active"),
  ]);

  for (const result of [teams, gameDay, participations, events, memberships, players]) {
    if (result.error) throw result.error;
  }

  return {
    teams: teams.data ?? [],
    gameDayPlayedOn: gameDay.data?.played_on ?? null,
    participations: participations.data ?? [],
    events: events.data ?? [],
    memberships: memberships.data ?? [],
    players: players.data ?? [],
  };
}
