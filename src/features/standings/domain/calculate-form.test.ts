import { calculateForm } from "./calculate-form";

describe("calculateForm", () => {
  it("keeps the last N results in order", () => {
    const form = calculateForm({
      teamIds: ["a", "b"],
      last: 2,
      fixtures: [
        {
          homeTeamId: "a",
          awayTeamId: "b",
          status: "completed",
          walkoverWinnerTeamId: null,
          homeGoals: 2,
          awayGoals: 1,
        },
        {
          homeTeamId: "b",
          awayTeamId: "a",
          status: "completed",
          walkoverWinnerTeamId: null,
          homeGoals: 0,
          awayGoals: 0,
        },
        {
          homeTeamId: "a",
          awayTeamId: "b",
          status: "completed",
          walkoverWinnerTeamId: null,
          homeGoals: 0,
          awayGoals: 3,
        },
      ],
    });
    expect(form.find((r) => r.teamId === "a")?.results).toEqual(["D", "L"]);
    expect(form.find((r) => r.teamId === "b")?.results).toEqual(["D", "W"]);
  });
});
