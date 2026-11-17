import { generateRoundRobinFixtures } from "./generate-round-robin";

const TEAMS = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }, { id: "e" }];

const DAYS = [{ id: "d1" }, { id: "d2" }, { id: "d3" }, { id: "d4" }];

describe("generateRoundRobinFixtures", () => {
  it("builds a double round-robin packed into game days", () => {
    const fixtures = generateRoundRobinFixtures({
      teams: TEAMS,
      gameDays: DAYS,
      matchesPerGameDay: 5,
      firstKickoff: "19:00",
      gapMinutes: 25,
    });

    expect(fixtures).toHaveLength(20);
    expect(fixtures[0]?.kickoffTime).toBe("19:00:00");
    expect(fixtures[1]?.kickoffTime).toBe("19:25:00");
  });

  it("returns nothing without enough teams or days", () => {
    expect(
      generateRoundRobinFixtures({
        teams: [{ id: "a" }],
        gameDays: DAYS,
        matchesPerGameDay: 4,
        firstKickoff: "19:00",
        gapMinutes: 25,
      }),
    ).toEqual([]);
  });

  it("fills only missing pairs when some fixtures already exist", () => {
    const fixtures = generateRoundRobinFixtures({
      teams: TEAMS,
      gameDays: DAYS,
      matchesPerGameDay: 5,
      firstKickoff: "19:00",
      gapMinutes: 25,
      existing: [
        {
          gameDayId: "d1",
          homeTeamId: "a",
          awayTeamId: "b",
          kickoffTime: "19:00:00",
        },
      ],
    });

    expect(fixtures).toHaveLength(19);
    expect(fixtures.some((row) => row.homeTeamId === "a" && row.awayTeamId === "b")).toBe(false);
    expect(fixtures.find((row) => row.gameDayId === "d1")?.kickoffTime).toBe("19:25:00");
  });

  it("lets every team play once before anyone plays twice when the day allows", () => {
    const four = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
    const fixtures = generateRoundRobinFixtures({
      teams: four,
      gameDays: [{ id: "d1" }],
      matchesPerGameDay: 2,
      firstKickoff: "19:00",
      gapMinutes: 25,
    });

    const ids = fixtures.flatMap((row) => [row.homeTeamId, row.awayTeamId]);
    expect(fixtures).toHaveLength(2);
    expect(new Set(ids).size).toBe(4);
  });

  it("pairs a same-day sit-out with an early team, not the side that just finished", () => {
    const fixtures = generateRoundRobinFixtures({
      teams: TEAMS,
      gameDays: [{ id: "d1" }],
      matchesPerGameDay: 3,
      firstKickoff: "19:00",
      gapMinutes: 25,
    });

    expect(fixtures).toHaveLength(3);
    const firstIds = new Set([fixtures[0]?.homeTeamId, fixtures[0]?.awayTeamId]);
    const secondIds = new Set([fixtures[1]?.homeTeamId, fixtures[1]?.awayTeamId]);
    const third = [fixtures[2]?.homeTeamId, fixtures[2]?.awayTeamId];
    const sitOut = third.find((id) => id && !firstIds.has(id) && !secondIds.has(id));
    const partner = third.find((id) => id !== sitOut);

    expect(sitOut).toBeDefined();
    expect(partner).toBeDefined();
    expect(firstIds.has(partner!)).toBe(true);
    expect(secondIds.has(partner!)).toBe(false);
  });

  it("puts the previous-day sit-out first on a new day", () => {
    const fixtures = generateRoundRobinFixtures({
      teams: TEAMS,
      gameDays: [{ id: "d1" }, { id: "d2" }],
      matchesPerGameDay: 2,
      firstKickoff: "19:00",
      gapMinutes: 25,
    });

    const day1Teams = new Set(
      fixtures
        .filter((row) => row.gameDayId === "d1")
        .flatMap((row) => [row.homeTeamId, row.awayTeamId]),
    );
    const sitOut = TEAMS.map((team) => team.id).find((id) => !day1Teams.has(id));
    const day2First = fixtures.find((row) => row.gameDayId === "d2");

    expect(sitOut).toBeDefined();
    expect([day2First?.homeTeamId, day2First?.awayTeamId]).toContain(sitOut);
  });
});
