import type { PlayerPosition } from "@/config/player-positions";

import { borrowPoolForTeam, teamHasGoalkeeper } from "./borrow-pool-for-team";

const pool: { id: string; name: string; position: PlayerPosition }[] = [
  { id: "out", name: "Out", position: "MID" },
  { id: "shared-gk", name: "Pool Keep", position: "GK" },
];

describe("borrowPoolForTeam", () => {
  it("leaves the list alone when keepers are per team", () => {
    expect(
      borrowPoolForTeam({
        pool,
        teamHasGoalkeeper: true,
        sharedKeeperIds: ["shared-gk"],
        keeperMode: "per_team",
      }).map((p) => p.id),
    ).toEqual(["out", "shared-gk"]);
  });

  it("hides shared keepers when the side already has a fixed GK", () => {
    expect(
      borrowPoolForTeam({
        pool,
        teamHasGoalkeeper: true,
        sharedKeeperIds: ["shared-gk"],
        keeperMode: "shared",
      }).map((p) => p.id),
    ).toEqual(["out"]);
  });

  it("keeps shared keepers available when the side has no GK", () => {
    expect(
      borrowPoolForTeam({
        pool,
        teamHasGoalkeeper: false,
        sharedKeeperIds: ["shared-gk"],
        keeperMode: "shared",
      }).map((p) => p.id),
    ).toEqual(["out", "shared-gk"]);
  });
});

describe("teamHasGoalkeeper", () => {
  it("is true when any row is marked goalkeeper", () => {
    expect(teamHasGoalkeeper([{ isGoalkeeper: false }, { isGoalkeeper: true }])).toBe(true);
    expect(teamHasGoalkeeper([{ isGoalkeeper: false }])).toBe(false);
  });
});
