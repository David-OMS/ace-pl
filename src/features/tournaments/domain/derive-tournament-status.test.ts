import { deriveTournamentStatus } from "./derive-tournament-status";

describe("deriveTournamentStatus", () => {
  it("stays in setup until roster, teams and fixtures exist", () => {
    expect(
      deriveTournamentStatus({
        hasRoster: false,
        teamCount: 4,
        fixtureCount: 6,
        openFixtureCount: 6,
      }),
    ).toBe("setup");
    expect(
      deriveTournamentStatus({
        hasRoster: true,
        teamCount: 1,
        fixtureCount: 6,
        openFixtureCount: 6,
      }),
    ).toBe("setup");
    expect(
      deriveTournamentStatus({
        hasRoster: true,
        teamCount: 4,
        fixtureCount: 0,
        openFixtureCount: 0,
      }),
    ).toBe("setup");
  });

  it("is active once the schedule is in place with open fixtures", () => {
    expect(
      deriveTournamentStatus({
        hasRoster: true,
        teamCount: 4,
        fixtureCount: 6,
        openFixtureCount: 3,
      }),
    ).toBe("active");
  });

  it("is completed when every fixture is finished", () => {
    expect(
      deriveTournamentStatus({
        hasRoster: true,
        teamCount: 4,
        fixtureCount: 6,
        openFixtureCount: 0,
      }),
    ).toBe("completed");
  });
});
