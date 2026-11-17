import type { TournamentStatus } from "@/config/tournament-rules";

export type TournamentStatusInput = {
  hasRoster: boolean;
  teamCount: number;
  fixtureCount: number;
  /** Fixtures that are not finished (completed / walkover / void). */
  openFixtureCount: number;
};

/**
 * setup → missing roster, teams or fixtures.
 * active → schedule exists and something still to play.
 * completed → every fixture has a result (or void).
 */
export function deriveTournamentStatus(input: TournamentStatusInput): TournamentStatus {
  if (!input.hasRoster || input.teamCount < 2 || input.fixtureCount === 0) return "setup";
  if (input.openFixtureCount === 0) return "completed";
  return "active";
}
