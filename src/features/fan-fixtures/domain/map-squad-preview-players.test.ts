import { mapSquadPreviewPlayers } from "./map-squad-preview-players";

describe("mapSquadPreviewPlayers", () => {
  it("keeps the captain flag on the registered squad", () => {
    const squad = mapSquadPreviewPlayers(
      [
        {
          playerId: "c",
          teamId: "t1",
          name: "Cap",
          position: "MID",
          isCaptain: true,
        },
        {
          playerId: "o",
          teamId: "t1",
          name: "Other",
          position: "FWD",
          isCaptain: false,
        },
      ],
      "t1",
    );
    expect(squad.find((p) => p.playerId === "c")?.isCaptain).toBe(true);
    expect(squad.find((p) => p.playerId === "o")?.isCaptain).toBe(false);
  });
});
