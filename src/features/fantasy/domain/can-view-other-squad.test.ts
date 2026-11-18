import { canViewOtherSquadGameweek } from "./can-view-other-squad";

describe("canViewOtherSquadGameweek", () => {
  it("hides a gameweek with no locked snapshot", () => {
    expect(canViewOtherSquadGameweek(false)).toBe(false);
  });

  it("shows a gameweek after a match locks the snapshot", () => {
    expect(canViewOtherSquadGameweek(true)).toBe(true);
  });
});
