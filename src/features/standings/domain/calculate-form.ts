import type { StandingFixture } from "./calculate-standings";

export type FormResult = "W" | "D" | "L";

export type TeamForm = {
  teamId: string;
  results: FormResult[];
};

type CalculateFormInput = {
  teamIds: readonly string[];
  /** Chronological order (oldest first). */
  fixtures: readonly StandingFixture[];
  last?: number;
};

/** Last N results per team from completed / walkover fixtures. */
export function calculateForm({ teamIds, fixtures, last = 5 }: CalculateFormInput): TeamForm[] {
  const results = new Map<string, FormResult[]>(teamIds.map((id) => [id, []]));

  for (const fixture of fixtures) {
    const score = formScore(fixture);
    if (!score) continue;
    pushResult(results, fixture.homeTeamId, outcome(score.home, score.away));
    pushResult(results, fixture.awayTeamId, outcome(score.away, score.home));
  }

  return teamIds.map((teamId) => ({
    teamId,
    results: (results.get(teamId) ?? []).slice(-last),
  }));
}

function formScore(fixture: StandingFixture): { home: number; away: number } | null {
  if (fixture.status === "walkover" && fixture.walkoverWinnerTeamId) {
    const homeWins = fixture.walkoverWinnerTeamId === fixture.homeTeamId;
    return homeWins ? { home: 1, away: 0 } : { home: 0, away: 1 };
  }
  if (fixture.status === "completed") {
    return { home: fixture.homeGoals, away: fixture.awayGoals };
  }
  return null;
}

function outcome(forTeam: number, against: number): FormResult {
  if (forTeam > against) return "W";
  if (forTeam < against) return "L";
  return "D";
}

function pushResult(results: Map<string, FormResult[]>, teamId: string, result: FormResult): void {
  const list = results.get(teamId);
  if (list) list.push(result);
}
