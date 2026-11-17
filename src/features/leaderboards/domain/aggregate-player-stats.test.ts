import { aggregatePlayerStats, topByMetric } from "./aggregate-player-stats";

describe("aggregatePlayerStats", () => {
  it("counts apps and events per player", () => {
    const rows = aggregatePlayerStats(
      [
        { playerId: "a", status: "played" },
        { playerId: "a", status: "played" },
        { playerId: "b", status: "absent" },
      ],
      [
        { eventType: "goal", playerId: "a", quantity: 2 },
        { eventType: "yellow_card", playerId: "a", quantity: 1 },
      ],
    );

    expect(rows.find((r) => r.playerId === "a")).toMatchObject({
      apps: 2,
      goals: 2,
      yellowCards: 1,
    });
    expect(rows.find((r) => r.playerId === "b")).toBeUndefined();
  });
});

describe("topByMetric", () => {
  it("returns highest scorers first", () => {
    const top = topByMetric(
      [
        {
          playerId: "a",
          apps: 1,
          goals: 1,
          assists: 0,
          cleanSheets: 0,
          yellowCards: 0,
          redCards: 0,
          saves: 0,
          motm: 0,
          ownGoals: 0,
          penaltySaves: 0,
        },
        {
          playerId: "b",
          apps: 1,
          goals: 5,
          assists: 0,
          cleanSheets: 0,
          yellowCards: 0,
          redCards: 0,
          saves: 0,
          motm: 0,
          ownGoals: 0,
          penaltySaves: 0,
        },
      ],
      "goals",
      3,
    );
    expect(top.map((r) => r.playerId)).toEqual(["b", "a"]);
  });
});
