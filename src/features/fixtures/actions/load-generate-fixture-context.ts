import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type GenerateFixtureContext = {
  matchesPerGameDay: number;
  teams: { id: string }[];
  gameDays: { id: string }[];
  existing: {
    gameDayId: string;
    homeTeamId: string;
    awayTeamId: string;
    kickoffTime: string;
  }[];
};

export async function loadGenerateFixtureContext(
  tournamentId: string,
): Promise<GenerateFixtureContext | null> {
  const supabase = await createSupabaseServerClient();
  const [tournament, teams, gameDays, fixtures] = await Promise.all([
    supabase
      .from("tournaments")
      .select("matches_per_game_day")
      .eq("id", tournamentId)
      .maybeSingle(),
    supabase.from("teams").select("id").eq("tournament_id", tournamentId).order("name"),
    supabase.from("game_days").select("id").eq("tournament_id", tournamentId).order("played_on"),
    supabase
      .from("fixtures")
      .select("game_day_id, home_team_id, away_team_id, kickoff_time, status")
      .eq("tournament_id", tournamentId),
  ]);

  if (tournament.error || teams.error || gameDays.error || fixtures.error) {
    throw tournament.error ?? teams.error ?? gameDays.error ?? fixtures.error;
  }
  if (!tournament.data) return null;

  const existing = (fixtures.data ?? [])
    .filter((row) => row.status !== "void")
    .map((row) => ({
      gameDayId: row.game_day_id,
      homeTeamId: row.home_team_id,
      awayTeamId: row.away_team_id,
      kickoffTime: row.kickoff_time,
    }));

  return {
    matchesPerGameDay: tournament.data.matches_per_game_day,
    teams: teams.data,
    gameDays: gameDays.data,
    existing,
  };
}
