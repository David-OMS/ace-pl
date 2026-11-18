import { mapMatchPlayers } from "./map-match-players";

const players = [
  { id: "cap", name: "Cap", position: "MID" as const, is_active: true },
  { id: "loan", name: "Loan", position: "FWD" as const, is_active: true },
];

describe("mapMatchPlayers", () => {
  it("marks the registered captain when they play for their own team", () => {
    const { homePlayers } = mapMatchPlayers({
      participations: [
        {
          id: "p1",
          player_id: "cap",
          team_id: "home",
          status: "played",
          is_goalkeeper: false,
        },
      ],
      players,
      registered: new Map([["cap", "home"]]),
      captainIds: new Set(["cap"]),
      homeTeamId: "home",
      awayTeamId: "away",
    });
    expect(homePlayers[0]?.isCaptain).toBe(true);
  });

  it("does not show captain when that player is borrowed onto another side", () => {
    const { awayPlayers } = mapMatchPlayers({
      participations: [
        {
          id: "p2",
          player_id: "cap",
          team_id: "away",
          status: "played",
          is_goalkeeper: false,
        },
      ],
      players,
      registered: new Map([["cap", "home"]]),
      captainIds: new Set(["cap"]),
      homeTeamId: "home",
      awayTeamId: "away",
    });
    expect(awayPlayers[0]?.isCaptain).toBe(false);
    expect(awayPlayers[0]?.isBorrowed).toBe(true);
  });
});
