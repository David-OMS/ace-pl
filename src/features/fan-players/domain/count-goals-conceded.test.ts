import { countGoalsConceded } from "./count-goals-conceded";

describe("countGoalsConceded", () => {
  it("sums goals against for defenders who played", () => {
    const conceded = countGoalsConceded(
      [
        {
          fixtureId: "f1",
          homeTeamId: "h",
          awayTeamId: "a",
          homeGoals: 2,
          awayGoals: 1,
          status: "completed",
        },
      ],
      [
        {
          fixtureId: "f1",
          playerId: "d1",
          teamId: "h",
          status: "played",
          position: "DEF",
          isGoalkeeper: false,
        },
        {
          fixtureId: "f1",
          playerId: "m1",
          teamId: "h",
          status: "played",
          position: "MID",
          isGoalkeeper: false,
        },
      ],
    );
    expect(conceded.get("d1")).toBe(1);
    expect(conceded.has("m1")).toBe(false);
  });
});
