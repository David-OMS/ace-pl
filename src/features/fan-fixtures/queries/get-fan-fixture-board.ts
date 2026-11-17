import "server-only";

import { listTournamentFixtures, type TournamentFixtureBoard } from "@/features/fixtures";
import { resolveFanTournament } from "@/features/home";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import { loadFanFixtureScores, type FixtureListScore } from "./load-fan-fixture-scores";

export type FanFixtureBoard = {
  tournamentName: string;
  board: TournamentFixtureBoard;
  scores: Map<string, FixtureListScore>;
};

export async function getFanFixtureBoard(): Promise<FanFixtureBoard | null> {
  const cached = await fanPublicCache("fan-fixtures", readFanFixtureBoard);
  if (!cached) return null;
  return {
    tournamentName: cached.tournamentName,
    board: cached.board,
    scores: new Map(Object.entries(cached.scores)),
  };
}

async function readFanFixtureBoard(): Promise<{
  tournamentName: string;
  board: TournamentFixtureBoard;
  scores: Record<string, FixtureListScore>;
} | null> {
  const tournament = await resolveFanTournament();
  if (!tournament) return null;

  const client = createPublicSupabaseClient();
  const board = await listTournamentFixtures(tournament.id, client);
  const allFixtures = [...board.undated, ...board.groups.flatMap((group) => group.fixtures)];
  const scores = await loadFanFixtureScores(allFixtures, client);

  return {
    tournamentName: tournament.name,
    board,
    scores: Object.fromEntries(scores),
  };
}
