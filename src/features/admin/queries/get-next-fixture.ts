import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { pickNextFixture } from "./pick-next-fixture";

export type NextHomeFixture = {
  id: string;
  tournamentId: string;
  kickoffTime: string;
  playedOn: string;
  playedOnLabel: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamColor: string;
  awayTeamColor: string;
  /** 1-based gameweek index among tournament game days. */
  gameweek: number;
  /** 1-based match index on that game day. */
  matchIndex: number;
  matchesOnDay: number;
};

/** Earliest unfinished fixture; completed / postponed drop off so the next one fills the card. */
export async function getNextFixture(tournamentId: string): Promise<NextHomeFixture | null> {
  const supabase = await createSupabaseServerClient();

  const { data: allDays, error: allDaysError } = await supabase
    .from("game_days")
    .select("id, played_on")
    .eq("tournament_id", tournamentId)
    .order("played_on");
  if (allDaysError) throw allDaysError;
  if (!allDays.length) return null;

  const { data: fixtures, error: fixturesError } = await supabase
    .from("fixtures")
    .select("id, tournament_id, game_day_id, kickoff_time, home_team_id, away_team_id, status")
    .eq("tournament_id", tournamentId);
  if (fixturesError) throw fixturesError;
  if (!fixtures.length) return null;

  const teamIds = [...new Set(fixtures.flatMap((row) => [row.home_team_id, row.away_team_id]))];
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("id, name, color")
    .in("id", teamIds);
  if (teamsError) throw teamsError;

  return pickNextFixture(allDays, fixtures, teams ?? []);
}
