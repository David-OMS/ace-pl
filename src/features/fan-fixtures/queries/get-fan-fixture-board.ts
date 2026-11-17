import "server-only";

import { listTournamentFixtures, type TournamentFixtureBoard } from "@/features/fixtures";
import { resolveFanTournament } from "@/features/home";

import { loadFanFixtureScores, type FixtureListScore } from "./load-fan-fixture-scores";

export type FanFixtureBoard = {
  tournamentName: string;
  board: TournamentFixtureBoard;
  scores: Map<string, FixtureListScore>;
};

export async function getFanFixtureBoard(): Promise<FanFixtureBoard | null> {
  const tournament = await resolveFanTournament();
  if (!tournament) return null;

  const board = await listTournamentFixtures(tournament.id);
  const allFixtures = [...board.undated, ...board.groups.flatMap((group) => group.fixtures)];
  const scores = await loadFanFixtureScores(allFixtures);

  return {
    tournamentName: tournament.name,
    board,
    scores,
  };
}
