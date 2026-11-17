import "server-only";

import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { calculateForm, type FormResult } from "../domain/calculate-form";
import { buildStandingFixtures } from "./build-standing-fixtures";

export type FormDisplayRow = {
  teamId: string;
  teamName: string;
  teamColor: string;
  results: FormResult[];
};

export function getTournamentForm(tournamentId: string): Promise<FormDisplayRow[]> {
  return fanPublicCache(`form:${tournamentId}`, () => readTournamentForm(tournamentId));
}

async function readTournamentForm(tournamentId: string): Promise<FormDisplayRow[]> {
  const supabase = createPublicSupabaseClient();
  const [teams, fixtures, events, participations] = await Promise.all([
    supabase.from("teams").select("id, name, color").eq("tournament_id", tournamentId),
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

  for (const result of [teams, fixtures, events, participations]) {
    if (result.error) throw result.error;
  }

  const teamRows = teams.data ?? [];
  const standingFixtures = buildStandingFixtures(
    fixtures.data ?? [],
    events.data ?? [],
    participations.data ?? [],
  );
  const form = calculateForm({
    teamIds: teamRows.map((t) => t.id),
    fixtures: standingFixtures,
  });
  const byId = new Map(teamRows.map((t) => [t.id, t]));

  return form.map((row) => {
    const team = byId.get(row.teamId);
    return {
      teamId: row.teamId,
      teamName: team?.name ?? "?",
      teamColor: team?.color ?? DEFAULT_TEAM_COLOR,
      results: row.results,
    };
  });
}
