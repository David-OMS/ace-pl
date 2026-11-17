import { resolveEventTeam } from "./resolve-event-team";

describe("resolveEventTeam", () => {
  it("returns the team the player lined up for", () => {
    expect(
      resolveEventTeam("p1", [
        { playerId: "p1", teamId: "home" },
        { playerId: "p2", teamId: "away" },
      ]),
    ).toBe("home");
  });

  it("returns null when the player is not in the squad", () => {
    expect(resolveEventTeam("ghost", [{ playerId: "p1", teamId: "home" }])).toBeNull();
  });
});
