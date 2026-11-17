import "server-only";

import { leagueToday } from "@/lib/dates/league-today";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { FixtureCardData } from "../components/fixture-card";

export type TodaysFixture = FixtureCardData & {
  tournamentId: string;
  tournamentName: string;
};

/** Scheduled (or live) fixtures for the league's calendar today. */
export async function listTodaysFixtures(): Promise<TodaysFixture[]> {
  const today = leagueToday();
  const supabase = await createSupabaseServerClient();
  const { data: days, error: daysError } = await supabase
    .from("game_days")
    .select("id, tournament_id")
    .eq("played_on", today);

  if (daysError) throw daysError;
  if (!days.length) return [];

  const tournamentIds = [...new Set(days.map((day) => day.tournament_id))];
  const [tournaments, fixtures, teams] = await Promise.all([
    supabase.from("tournaments").select("id, name").in("id", tournamentIds),
    supabase
      .from("fixtures")
      .select("id, tournament_id, kickoff_time, status, home_team_id, away_team_id")
      .in(
        "game_day_id",
        days.map((day) => day.id),
      )
      .in("status", ["published", "completed", "walkover", "postponed"])
      .order("kickoff_time"),
    supabase.from("teams").select("id, name").in("tournament_id", tournamentIds),
  ]);

  if (tournaments.error) throw tournaments.error;
  if (fixtures.error) throw fixtures.error;
  if (teams.error) throw teams.error;

  const tournamentName = new Map(tournaments.data.map((row) => [row.id, row.name]));
  const teamName = new Map(teams.data.map((row) => [row.id, row.name]));

  return fixtures.data.map((row) => ({
    id: row.id,
    tournamentId: row.tournament_id,
    tournamentName: tournamentName.get(row.tournament_id) ?? "?",
    kickoffTime: row.kickoff_time,
    status: row.status,
    homeTeamName: teamName.get(row.home_team_id) ?? "?",
    awayTeamName: teamName.get(row.away_team_id) ?? "?",
  }));
}
