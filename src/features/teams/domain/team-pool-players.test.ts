import { teamPoolPlayers } from "./team-pool-players";

const players = [
  { id: "m", name: "Mid", position: "MID" as const, isActive: true, isClaimed: false },
  { id: "g", name: "Keep", position: "GK" as const, isActive: true, isClaimed: false },
];

describe("teamPoolPlayers", () => {
  it("keeps GKs available when keepers are per team", () => {
    expect(teamPoolPlayers(players, "per_team").map((p) => p.id)).toEqual(["m", "g"]);
  });

  it("still keeps GKs available in shared mode so a team can have a fixed keeper", () => {
    expect(teamPoolPlayers(players, "shared").map((p) => p.id)).toEqual(["m", "g"]);
  });
});
