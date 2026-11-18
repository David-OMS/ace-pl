import "server-only";

import type { MatchEntry } from "@/features/matches";
import { getMatchEntry } from "@/features/matches";

import type { FanLineupMode } from "../domain/resolve-fan-lineups";
import { resolveFanLineups } from "../domain/resolve-fan-lineups";
import { loadFixtureTeamSquads } from "./load-fixture-team-squads";

export type FanFixtureDetail = {
  match: MatchEntry;
  mode: FanLineupMode;
  showScore: boolean;
};

export async function getFanFixtureDetail(fixtureId: string): Promise<FanFixtureDetail | null> {
  const match = await getMatchEntry(fixtureId);
  if (!match) return null;

  const squads = await loadFixtureTeamSquads({
    tournamentId: match.tournamentId,
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
  });
  const lineups = resolveFanLineups({
    status: match.status,
    homePlayed: match.homePlayers,
    awayPlayed: match.awayPlayers,
    homeSquad: squads.homeSquad,
    awaySquad: squads.awaySquad,
  });

  return {
    match: {
      ...match,
      homePlayers: lineups.homePlayers,
      awayPlayers: lineups.awayPlayers,
    },
    mode: lineups.mode,
    showScore: lineups.showScore,
  };
}
