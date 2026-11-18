import type { MatchPlayer } from "@/features/matches";

import { resolveFanLineups } from "./resolve-fan-lineups";

function player(id: string, status: MatchPlayer["status"]): MatchPlayer {
  return {
    participationId: id,
    playerId: id,
    name: id,
    position: "MID",
    teamId: "t",
    status,
    isGoalkeeper: false,
    isBorrowed: false,
  };
}

describe("resolveFanLineups", () => {
  const homePlayed = [player("a", "played"), player("b", "absent")];
  const awayPlayed = [player("c", "played")];
  const homeSquad = [player("a", "played"), player("b", "played"), player("d", "played")];
  const awaySquad = [player("c", "played"), player("e", "played")];

  it("shows full squads and hides the score before full time", () => {
    const result = resolveFanLineups({
      status: "published",
      homePlayed,
      awayPlayed,
      homeSquad,
      awaySquad,
    });
    expect(result.mode).toBe("squad_preview");
    expect(result.showScore).toBe(false);
    expect(result.homePlayers.map((p) => p.playerId)).toEqual(["a", "b", "d"]);
    expect(result.awayPlayers.map((p) => p.playerId)).toEqual(["c", "e"]);
  });

  it("shows only who played and the score after full time", () => {
    const result = resolveFanLineups({
      status: "completed",
      homePlayed,
      awayPlayed,
      homeSquad,
      awaySquad,
    });
    expect(result.mode).toBe("played");
    expect(result.showScore).toBe(true);
    expect(result.homePlayers.map((p) => p.playerId)).toEqual(["a"]);
    expect(result.awayPlayers.map((p) => p.playerId)).toEqual(["c"]);
  });
});
