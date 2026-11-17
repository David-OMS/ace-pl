import "server-only";

import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { calculateStandings, type StandingRow } from "../domain/calculate-standings";
import { buildStandingFixtures } from "./build-standing-fixtures";
import { mapStandingTeamRows } from "./map-standing-team-rows";

export type StandingTeamRow = StandingRow & {
  teamName: string;
  teamColor: string;
  position: number;
};

export type TournamentStandings = {
  tournamentId: string;
  tournamentName: string;
  rows: StandingTeamRow[];
};

export function getTournamentStandings(tournamentId: string): Promise<TournamentStandings | null> {
  return fanPublicCache(`standings:${tournamentId}`, () => readTournamentStandings(tournamentId));
}

async function readTournamentStandings(tournamentId: string): Promise<TournamentStandings | null> {
  const supabase = createPublicSupabaseClient();
  const { data: tournament, error } = await supabase
    .from("tournaments")
    .select("id, name")
    .eq("id", tournamentId)
    .maybeSingle();

  if (error) throw error;
  if (!tournament) return null;

  const [teams, fixtures, events, participations] = await Promise.all([
    supabase.from("teams").select("id, name, color").eq("tournament_id", tournamentId),
    supabase
      .from("fixtures")
      .select("id, home_team_id, away_team_id, status, walkover_winner_team_id")
      .eq("tournament_id", tournamentId)
      .in("status", ["completed", "walkover"]),
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

  for (const result of [teams, fixtures, events, participations]) {
    if (result.error) throw result.error;
  }

  const rows = mapStandingTeamRows(
    calculateStandings({
      teamIds: (teams.data ?? []).map((t) => t.id),
      fixtures: buildStandingFixtures(
        fixtures.data ?? [],
        events.data ?? [],
        participations.data ?? [],
      ),
    }),
    teams.data ?? [],
  );

  return {
    tournamentId: tournament.id,
    tournamentName: tournament.name,
    rows,
  };
}
