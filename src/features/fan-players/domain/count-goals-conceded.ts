import type { PlayerPosition } from "@/config/player-positions";

export type ConcededFixture = {
  fixtureId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number;
  awayGoals: number;
  status: string;
};

export type ConcededAppearance = {
  fixtureId: string;
  playerId: string;
  teamId: string;
  status: "played" | "unused_sub" | "absent";
  position: PlayerPosition | null;
  isGoalkeeper: boolean;
};

/** Goals conceded for GK/DEF who played in a completed match (their team's opponent goals). */
export function countGoalsConceded(
  fixtures: readonly ConcededFixture[],
  appearances: readonly ConcededAppearance[],
): Map<string, number> {
  const concededByFixtureTeam = new Map<string, number>();

  for (const fixture of fixtures) {
    if (fixture.status !== "completed") continue;
    concededByFixtureTeam.set(`${fixture.fixtureId}:${fixture.homeTeamId}`, fixture.awayGoals);
    concededByFixtureTeam.set(`${fixture.fixtureId}:${fixture.awayTeamId}`, fixture.homeGoals);
  }

  const counts = new Map<string, number>();
  for (const row of appearances) {
    if (row.status !== "played") continue;
    if (!tracksConceded(row)) continue;
    const goals = concededByFixtureTeam.get(`${row.fixtureId}:${row.teamId}`) ?? 0;
    if (goals === 0) continue;
    counts.set(row.playerId, (counts.get(row.playerId) ?? 0) + goals);
  }
  return counts;
}

function tracksConceded(row: ConcededAppearance): boolean {
  if (row.isGoalkeeper) return true;
  return row.position === "GK" || row.position === "DEF";
}
