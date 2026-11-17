import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";
import { formatGameDay } from "@/lib/dates/format-game-day";

import type { NextHomeFixture } from "./get-next-fixture";

const DONE = new Set(["completed", "walkover", "void", "postponed"]);

type FixtureRow = {
  id: string;
  tournament_id: string;
  game_day_id: string;
  kickoff_time: string;
  home_team_id: string;
  away_team_id: string;
  status: string;
};

type DayRow = { id: string; played_on: string };
type TeamRow = { id: string; name: string; color: string };

/** Pure pick of the next unfinished fixture + GM / match labels. */
export function pickNextFixture(
  allDays: readonly DayRow[],
  fixtures: readonly FixtureRow[],
  teams: readonly TeamRow[],
): NextHomeFixture | null {
  if (!allDays.length || !fixtures.length) return null;
  const next = earliestOpenFixture(allDays, fixtures);
  if (!next) return null;
  const dayIndex = allDays.findIndex((day) => day.id === next.game_day_id);
  const playedOn = allDays[dayIndex]?.played_on;
  if (!playedOn) return null;
  return toNextHomeFixture({ next, playedOn, dayIndex, fixtures, teams });
}

function earliestOpenFixture(
  allDays: readonly DayRow[],
  fixtures: readonly FixtureRow[],
): FixtureRow | undefined {
  const dayOrder = new Map(allDays.map((day, index) => [day.id, index]));
  return fixtures
    .filter((row) => !DONE.has(row.status))
    .sort((a, b) => {
      const byDay = (dayOrder.get(a.game_day_id) ?? 0) - (dayOrder.get(b.game_day_id) ?? 0);
      return byDay !== 0 ? byDay : a.kickoff_time.localeCompare(b.kickoff_time);
    })[0];
}

function toNextHomeFixture(input: {
  next: FixtureRow;
  playedOn: string;
  dayIndex: number;
  fixtures: readonly FixtureRow[];
  teams: readonly TeamRow[];
}): NextHomeFixture {
  const { next, playedOn, dayIndex, fixtures, teams } = input;
  const allOnDay = fixtures
    .filter((row) => row.game_day_id === next.game_day_id)
    .sort((a, b) => a.kickoff_time.localeCompare(b.kickoff_time));
  const teamById = new Map(teams.map((team) => [team.id, team]));
  const home = teamById.get(next.home_team_id);
  const away = teamById.get(next.away_team_id);
  const index = allOnDay.findIndex((row) => row.id === next.id);
  return {
    id: next.id,
    tournamentId: next.tournament_id,
    kickoffTime: next.kickoff_time,
    playedOn,
    playedOnLabel: formatGameDay(playedOn),
    homeTeamName: home?.name ?? "?",
    awayTeamName: away?.name ?? "?",
    homeTeamColor: home?.color ?? DEFAULT_TEAM_COLOR,
    awayTeamColor: away?.color ?? DEFAULT_TEAM_COLOR,
    gameweek: Math.max(dayIndex + 1, 1),
    matchIndex: Math.max(index + 1, 1),
    matchesOnDay: allOnDay.length,
  };
}
