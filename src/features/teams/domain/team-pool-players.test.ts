import { teamPoolPlayers } from "./team-pool-players";

const players = [
  { id: "m", name: "Mid", position: "MID" as const, isActive: true, isClaimed: false },
  { id: "g", name: "Keep", position: "GK" as const, isActive: true, isClaimed: false },
];

describe("teamPoolPlayers", () => {
  it("keeps everyone when keepers are per team", () => {
    expect(teamPoolPlayers(players, "per_team").map((p) => p.id)).toEqual(["m", "g"]);
  });

  it("drops GKs when keepers are shared", () => {
    expect(teamPoolPlayers(players, "shared").map((p) => p.id)).toEqual(["m"]);
  });
});
