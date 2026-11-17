import { calculateMatchScore } from "./calculate-match-score";

const HOME = "home";
const AWAY = "away";

describe("calculateMatchScore", () => {
  it("starts at 0–0 with no goals", () => {
    expect(calculateMatchScore({ homeTeamId: HOME, awayTeamId: AWAY, events: [] })).toEqual({
      homeGoals: 0,
      awayGoals: 0,
    });
  });

  it("gives a goal to the scorer's team", () => {
    expect(
      calculateMatchScore({
        homeTeamId: HOME,
        awayTeamId: AWAY,
        events: [
          { eventType: "goal", teamId: HOME },
          { eventType: "goal", teamId: HOME },
          { eventType: "goal", teamId: AWAY },
        ],
      }),
    ).toEqual({ homeGoals: 2, awayGoals: 1 });
  });

  it("counts an own goal for the other team", () => {
    expect(
      calculateMatchScore({
        homeTeamId: HOME,
        awayTeamId: AWAY,
        events: [{ eventType: "own_goal", teamId: HOME }],
      }),
    ).toEqual({ homeGoals: 0, awayGoals: 1 });
  });
});
