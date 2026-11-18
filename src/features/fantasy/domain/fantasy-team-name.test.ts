import {
  canChangeFantasyTeamName,
  isSameFantasyTeamName,
  normalizeFantasyTeamName,
  remainingFantasyNameChanges,
} from "./fantasy-team-name";

describe("fantasy team name", () => {
  it("normalizes spaces and treats names as case-insensitive", () => {
    expect(normalizeFantasyTeamName("  Ace   FC ")).toBe("Ace FC");
    expect(isSameFantasyTeamName("Ace FC", "ace fc")).toBe(true);
    expect(isSameFantasyTeamName("Ace FC", "Ace United")).toBe(false);
  });

  it("allows two renames then blocks", () => {
    expect(remainingFantasyNameChanges(0)).toBe(2);
    expect(canChangeFantasyTeamName(0)).toBe(true);
    expect(canChangeFantasyTeamName(1)).toBe(true);
    expect(canChangeFantasyTeamName(2)).toBe(false);
    expect(remainingFantasyNameChanges(2)).toBe(0);
  });
});
