import type { PlayerPosition } from "@/config/player-positions";

export type CleanSheetFixture = {
  fixtureId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number;
  awayGoals: number;
  status: string;
};

export type CleanSheetAppearance = {
  fixtureId: string;
  playerId: string;
  teamId: string;
  status: "played" | "unused_sub" | "absent";
  position: PlayerPosition | null;
  isGoalkeeper: boolean;
};

/** GK / DEF / MID who played for a side that conceded 0 in a completed match. */
export function countCleanSheets(
  fixtures: readonly CleanSheetFixture[],
  appearances: readonly CleanSheetAppearance[],
): Map<string, number> {
  const cleanTeamByFixture = shutoutTeamsByFixture(fixtures);
  const counts = new Map<string, number>();
  for (const row of appearances) {
    if (!countsTowardCleanSheet(row, cleanTeamByFixture)) continue;
    counts.set(row.playerId, (counts.get(row.playerId) ?? 0) + 1);
  }
  return counts;
}

function shutoutTeamsByFixture(fixtures: readonly CleanSheetFixture[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const fixture of fixtures) {
    if (fixture.status !== "completed") continue;
    const teams = new Set<string>();
    if (fixture.awayGoals === 0) teams.add(fixture.homeTeamId);
    if (fixture.homeGoals === 0) teams.add(fixture.awayTeamId);
    if (teams.size > 0) map.set(fixture.fixtureId, teams);
  }
  return map;
}

function countsTowardCleanSheet(
  row: CleanSheetAppearance,
  cleanTeamByFixture: Map<string, Set<string>>,
): boolean {
  if (row.status !== "played") return false;
  const teams = cleanTeamByFixture.get(row.fixtureId);
  if (!teams?.has(row.teamId)) return false;
  if (row.isGoalkeeper) return true;
  return row.position === "GK" || row.position === "DEF" || row.position === "MID";
}
