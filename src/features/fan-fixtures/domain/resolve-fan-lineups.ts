import type { FixtureStatus } from "@/config/fixture-status";
import type { MatchPlayer } from "@/features/matches";

import { isFixtureFinished } from "./is-fixture-finished";

export type FanLineupMode = "squad_preview" | "played";

type ResolveFanLineupsInput = {
  status: FixtureStatus;
  homePlayed: readonly MatchPlayer[];
  awayPlayed: readonly MatchPlayer[];
  homeSquad: readonly MatchPlayer[];
  awaySquad: readonly MatchPlayer[];
};

/** Before full time show registered squads; after FT show who actually played. */
export function resolveFanLineups(input: ResolveFanLineupsInput): {
  mode: FanLineupMode;
  homePlayers: MatchPlayer[];
  awayPlayers: MatchPlayer[];
  showScore: boolean;
} {
  if (isFixtureFinished(input.status)) {
    return {
      mode: "played",
      homePlayers: input.homePlayed.filter((row) => row.status === "played"),
      awayPlayers: input.awayPlayed.filter((row) => row.status === "played"),
      showScore: true,
    };
  }
  return {
    mode: "squad_preview",
    homePlayers: [...input.homeSquad],
    awayPlayers: [...input.awaySquad],
    showScore: false,
  };
}
