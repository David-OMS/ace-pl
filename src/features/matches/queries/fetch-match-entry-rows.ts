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

type QueryError = { error: { message: string } | null };

export async function fetchMatchEntryRows(supabase: SupabaseClient<Database>, fixture: FixtureRow) {
  const bundle = await loadMatchEntryBundle(supabase, fixture);
  throwIfAnyError(Object.values(bundle));
  return {
    teams: rows(bundle.teams),
    gameDayPlayedOn: bundle.gameDay.data?.played_on ?? null,
    participations: rows(bundle.participations),
    events: rows(bundle.events),
    memberships: rows(bundle.memberships),
    players: rows(bundle.players),
    keeperMode: bundle.tournament.data?.keeper_mode ?? "per_team",
    sharedKeeperIds: rows(bundle.keepers).map((row) => row.player_id),
  };
}

function rows<T>(result: { data: T[] | null }): T[] {
  return result.data ?? [];
}

function throwIfAnyError(results: QueryError[]) {
  for (const result of results) {
    if (result.error) throw result.error;
  }
}

async function loadMatchEntryBundle(supabase: SupabaseClient<Database>, fixture: FixtureRow) {
  const teamIds = [fixture.home_team_id, fixture.away_team_id];
  const [teams, gameDay, participations, events, memberships, players, tournament, keepers] =
    await Promise.all([
      supabase.from("teams").select("id, name, color").in("id", teamIds),
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
        .select("player_id, team_id, is_captain")
        .eq("tournament_id", fixture.tournament_id)
        .in("team_id", teamIds)
        .is("left_on", null),
      supabase.from("players").select("id, name, position, is_active"),
      supabase
        .from("tournaments")
        .select("keeper_mode")
        .eq("id", fixture.tournament_id)
        .maybeSingle(),
      supabase
        .from("tournament_keepers")
        .select("player_id")
        .eq("tournament_id", fixture.tournament_id),
    ]);
  return { teams, gameDay, participations, events, memberships, players, tournament, keepers };
}
