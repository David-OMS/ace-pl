import "server-only";

import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { buildStandingFixtures } from "./build-standing-fixtures";

export async function loadPublicTeamFormInputs(tournamentId: string, teamId: string) {
  const supabase = createPublicSupabaseClient();
  const [memberships, fixtures, events, participations] = await Promise.all([
    supabase
      .from("team_memberships")
      .select("is_captain, players!inner(id, name, position, photo_path)")
      .eq("team_id", teamId)
      .eq("tournament_id", tournamentId),
    supabase
      .from("fixtures")
      .select("id, home_team_id, away_team_id, status, walkover_winner_team_id, kickoff_time")
      .eq("tournament_id", tournamentId)
      .in("status", ["completed", "walkover"])
      .order("kickoff_time", { ascending: true }),
    supabase
      .from("match_events")
      .select("fixture_id, event_type, player_id")
      .eq("tournament_id", tournamentId)
      .in("event_type", ["goal", "own_goal"]),
    supabase
      .from("match_participations")
      .select("fixture_id, player_id, team_id")
      .eq("tournament_id", tournamentId),
  ]);

  for (const result of [memberships, fixtures, events, participations]) {
    if (result.error) throw result.error;
  }

  return {
    memberships: memberships.data ?? [],
    standingFixtures: buildStandingFixtures(
      fixtures.data ?? [],
      events.data ?? [],
      participations.data ?? [],
    ),
  };
}
