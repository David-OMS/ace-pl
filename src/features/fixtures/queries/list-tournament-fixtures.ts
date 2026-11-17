import "server-only";

import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";
import type { FixtureStatus } from "@/config/fixture-status";
import { formatGameDay } from "@/lib/dates/format-game-day";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { FixtureGameDayGroup } from "../domain/group-fixtures-by-game-day";
import { partitionFixtureBoard } from "../domain/partition-fixture-board";

export type FixtureListItem = {
  id: string;
  gameDayId: string;
  kickoffTime: string;
  status: FixtureStatus;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamColor: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamColor: string;
};

export type FixtureBoardTeam = { id: string; name: string; color: string };

export type FixtureGameDayHeading = {
  id: string;
  playedOn: string;
  label: string;
  gameweek: number;
};

export type TournamentFixtureBoard = {
  teams: FixtureBoardTeam[];
  gameDays: FixtureGameDayHeading[];
  groups: FixtureGameDayGroup<FixtureListItem>[];
  undated: FixtureListItem[];
};

export async function listTournamentFixtures(
  tournamentId: string,
): Promise<TournamentFixtureBoard> {
  const supabase = await createSupabaseServerClient();
  const [teams, gameDays, fixtures] = await Promise.all([
    supabase
      .from("teams")
      .select("id, name, color")
      .eq("tournament_id", tournamentId)
      .order("name"),
    supabase
      .from("game_days")
      .select("id, played_on")
      .eq("tournament_id", tournamentId)
      .order("played_on"),
    supabase
      .from("fixtures")
      .select("id, game_day_id, kickoff_time, status, home_team_id, away_team_id")
      .eq("tournament_id", tournamentId),
  ]);

  if (teams.error) throw teams.error;
  if (gameDays.error) throw gameDays.error;
  if (fixtures.error) throw fixtures.error;

  const teamById = new Map(teams.data.map((team) => [team.id, team]));
  const headings = gameDays.data.map((day, index) => ({
    id: day.id,
    playedOn: day.played_on,
    label: formatGameDay(day.played_on),
    gameweek: index + 1,
  }));
  const rows = fixtures.data.map((row) => mapFixtureRow(row, teamById));
  const { dated, undated } = partitionFixtureBoard(headings, rows);

  return {
    teams: teams.data,
    gameDays: headings,
    groups: dated,
    undated,
  };
}

function mapFixtureRow(
  row: {
    id: string;
    game_day_id: string;
    kickoff_time: string;
    status: FixtureStatus;
    home_team_id: string;
    away_team_id: string;
  },
  teamById: Map<string, { name: string; color: string }>,
): FixtureListItem {
  const home = teamById.get(row.home_team_id);
  const away = teamById.get(row.away_team_id);
  return {
    id: row.id,
    gameDayId: row.game_day_id,
    kickoffTime: row.kickoff_time,
    status: row.status,
    homeTeamId: row.home_team_id,
    homeTeamName: home?.name ?? "?",
    homeTeamColor: home?.color ?? DEFAULT_TEAM_COLOR,
    awayTeamId: row.away_team_id,
    awayTeamName: away?.name ?? "?",
    awayTeamColor: away?.color ?? DEFAULT_TEAM_COLOR,
  };
}
