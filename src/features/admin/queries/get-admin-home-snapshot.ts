import "server-only";

import type { WorkingTournament } from "../working-tournament";
import { countTournamentHome } from "./count-tournament-home";
import { getNextFixture, type NextHomeFixture } from "./get-next-fixture";
import { getWorkingTournament } from "./get-working-tournament";

export type AdminHomeSnapshot = {
  tournament: WorkingTournament | null;
  rosterCount: number;
  teamCount: number;
  unassignedCount: number;
  fixtureCount: number;
  nextGameDay: string | null;
  nextFixture: NextHomeFixture | null;
};

/** Counts for the working tournament so admin home isn’t empty. */
export async function getAdminHomeSnapshot(): Promise<AdminHomeSnapshot> {
  const tournament = await getWorkingTournament();
  if (!tournament) {
    return {
      tournament: null,
      rosterCount: 0,
      teamCount: 0,
      unassignedCount: 0,
      fixtureCount: 0,
      nextGameDay: null,
      nextFixture: null,
    };
  }

  const [counts, nextFixture] = await Promise.all([
    countTournamentHome(tournament.id),
    getNextFixture(tournament.id),
  ]);
  return { tournament, ...counts, nextFixture };
}
