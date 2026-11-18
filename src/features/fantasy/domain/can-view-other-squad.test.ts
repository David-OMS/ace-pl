import { canViewOtherSquad } from "./can-view-other-squad";

describe("canViewOtherSquad", () => {
  it("hides other squads before any gameweek is locked", () => {
    expect(canViewOtherSquad(0)).toBe(false);
  });

  it("allows viewing once a locked gameweek exists", () => {
    expect(canViewOtherSquad(1)).toBe(true);
  });
});
