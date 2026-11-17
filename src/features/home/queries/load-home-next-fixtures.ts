import "server-only";

import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type HomeFixtureRow = {
  id: string;
  kickoffTime: string;
  homeTeamName: string;
  homeTeamColor: string;
  awayTeamName: string;
  awayTeamColor: string;
};

const MAX_NEXT = 3;

/** Next upcoming published/draft fixtures for the home strip. */
export async function loadHomeNextFixtures(tournamentId: string): Promise<HomeFixtureRow[]> {
  const supabase = await createSupabaseServerClient();
  const [fixtures, teams] = await Promise.all([
    supabase
      .from("fixtures")
      .select("id, kickoff_time, home_team_id, away_team_id, status")
      .eq("tournament_id", tournamentId)
      .in("status", ["draft", "published"])
      .order("kickoff_time", { ascending: true })
      .limit(MAX_NEXT),
    supabase.from("teams").select("id, name, color").eq("tournament_id", tournamentId),
  ]);
  if (fixtures.error) throw fixtures.error;
  if (teams.error) throw teams.error;

  const teamById = new Map((teams.data ?? []).map((t) => [t.id, t]));
  return (fixtures.data ?? []).map((row) => {
    const home = teamById.get(row.home_team_id);
    const away = teamById.get(row.away_team_id);
    return {
      id: row.id,
      kickoffTime: row.kickoff_time,
      homeTeamName: home?.name ?? "?",
      homeTeamColor: home?.color ?? DEFAULT_TEAM_COLOR,
      awayTeamName: away?.name ?? "?",
      awayTeamColor: away?.color ?? DEFAULT_TEAM_COLOR,
    };
  });
}
