import "server-only";

import { HOME_NEXT_FIXTURES_COUNT } from "@/config/home";
import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { upcomingHomeFixtures } from "../domain/upcoming-home-fixtures";

export type HomeFixtureRow = {
  id: string;
  kickoffTime: string;
  homeTeamName: string;
  homeTeamColor: string;
  awayTeamName: string;
  awayTeamColor: string;
};

/** Next upcoming fixtures in game-day then kick-off order. */
export function loadHomeNextFixtures(tournamentId: string): Promise<HomeFixtureRow[]> {
  return fanPublicCache(`home-fixtures-upcoming:${tournamentId}`, () =>
    readHomeNextFixtures(tournamentId),
  );
}

async function readHomeNextFixtures(tournamentId: string): Promise<HomeFixtureRow[]> {
  const supabase = createPublicSupabaseClient();
  const [gameDays, fixtures, teams] = await Promise.all([
    supabase
      .from("game_days")
      .select("id, played_on")
      .eq("tournament_id", tournamentId)
      .order("played_on"),
    supabase
      .from("fixtures")
      .select("id, game_day_id, kickoff_time, home_team_id, away_team_id, status")
      .eq("tournament_id", tournamentId),
    supabase.from("teams").select("id, name, color").eq("tournament_id", tournamentId),
  ]);
  if (gameDays.error) throw gameDays.error;
  if (fixtures.error) throw fixtures.error;
  if (teams.error) throw teams.error;

  const picked = upcomingHomeFixtures(
    gameDays.data ?? [],
    fixtures.data ?? [],
    HOME_NEXT_FIXTURES_COUNT,
  );
  const teamById = new Map((teams.data ?? []).map((t) => [t.id, t]));
  return picked.map((row) => {
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
