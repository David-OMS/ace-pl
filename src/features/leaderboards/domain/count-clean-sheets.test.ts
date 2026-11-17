import { countCleanSheets } from "./count-clean-sheets";

describe("countCleanSheets", () => {
  it("credits GK, DEF and MID on a shutout side", () => {
    const counts = countCleanSheets(
      [
        {
          fixtureId: "f1",
          homeTeamId: "h",
          awayTeamId: "a",
          homeGoals: 2,
          awayGoals: 0,
          status: "completed",
        },
      ],
      [
        {
          fixtureId: "f1",
          playerId: "gk",
          teamId: "h",
          status: "played",
          position: "GK",
          isGoalkeeper: true,
        },
        {
          fixtureId: "f1",
          playerId: "mid",
          teamId: "h",
          status: "played",
          position: "MID",
          isGoalkeeper: false,
        },
        {
          fixtureId: "f1",
          playerId: "def",
          teamId: "h",
          status: "played",
          position: "DEF",
          isGoalkeeper: false,
        },
        {
          fixtureId: "f1",
          playerId: "def-null",
          teamId: "h",
          status: "played",
          position: null,
          isGoalkeeper: false,
        },
      ],
    );
    expect(counts.get("gk")).toBe(1);
    expect(counts.get("def")).toBe(1);
    expect(counts.get("mid")).toBe(1);
    expect(counts.get("def-null")).toBeUndefined();
  });
});
