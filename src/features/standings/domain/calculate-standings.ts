import { WALKOVER_SCORE } from "@/config/match-events";

export type StandingFixture = {
  homeTeamId: string;
  awayTeamId: string;
  status: "completed" | "walkover" | string;
  /** Set when status is walkover. */
  walkoverWinnerTeamId: string | null;
  homeGoals: number;
  awayGoals: number;
};

export type StandingRow = {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

type CalculateStandingsInput = {
  teamIds: readonly string[];
  fixtures: readonly StandingFixture[];
};

/** League table from completed / walkover fixtures. Order is points → GD → GF. */
export function calculateStandings({ teamIds, fixtures }: CalculateStandingsInput): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  for (const teamId of teamIds) {
    rows.set(teamId, emptyRow(teamId));
  }

  for (const fixture of fixtures) {
    const score = resolveScore(fixture);
    if (!score) continue;
    applyResult({
      rows,
      homeId: fixture.homeTeamId,
      awayId: fixture.awayTeamId,
      homeGoals: score.home,
      awayGoals: score.away,
    });
  }

  return [...rows.values()].sort(compareStandings);
}

function emptyRow(teamId: string): StandingRow {
  return {
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

function resolveScore(fixture: StandingFixture): { home: number; away: number } | null {
  if (fixture.status === "walkover" && fixture.walkoverWinnerTeamId) {
    const homeWins = fixture.walkoverWinnerTeamId === fixture.homeTeamId;
    return homeWins
      ? { home: WALKOVER_SCORE.winner, away: WALKOVER_SCORE.loser }
      : { home: WALKOVER_SCORE.loser, away: WALKOVER_SCORE.winner };
  }
  if (fixture.status === "completed") {
    return { home: fixture.homeGoals, away: fixture.awayGoals };
  }
  return null;
}

function applyResult({
  rows,
  homeId,
  awayId,
  homeGoals,
  awayGoals,
}: {
  rows: Map<string, StandingRow>;
  homeId: string;
  awayId: string;
  homeGoals: number;
  awayGoals: number;
}): void {
  const home = rows.get(homeId);
  const away = rows.get(awayId);
  if (!home || !away) return;

  home.played += 1;
  away.played += 1;
  home.goalsFor += homeGoals;
  home.goalsAgainst += awayGoals;
  away.goalsFor += awayGoals;
  away.goalsAgainst += homeGoals;
  home.goalDifference = home.goalsFor - home.goalsAgainst;
  away.goalDifference = away.goalsFor - away.goalsAgainst;

  if (homeGoals > awayGoals) {
    home.won += 1;
    away.lost += 1;
    home.points += 3;
  } else if (homeGoals < awayGoals) {
    away.won += 1;
    home.lost += 1;
    away.points += 3;
  } else {
    home.drawn += 1;
    away.drawn += 1;
    home.points += 1;
    away.points += 1;
  }
}

function compareStandings(a: StandingRow, b: StandingRow): number {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    a.teamId.localeCompare(b.teamId)
  );
}
