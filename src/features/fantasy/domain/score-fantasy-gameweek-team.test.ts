import { scoreFantasyGameweekTeam } from "./score-fantasy-gameweek-team";

const baseSquad = [
  {
    playerId: "gk",
    position: "GK" as const,
    isBench: false,
    isCaptain: false,
    isVice: false,
    slot: 0,
  },
  {
    playerId: "d1",
    position: "DEF" as const,
    isBench: false,
    isCaptain: true,
    isVice: false,
    slot: 1,
  },
  {
    playerId: "m1",
    position: "MID" as const,
    isBench: false,
    isCaptain: false,
    isVice: true,
    slot: 2,
  },
  {
    playerId: "b1",
    position: "FWD" as const,
    isBench: true,
    isCaptain: false,
    isVice: false,
    slot: 7,
  },
];

describe("scoreFantasyGameweekTeam", () => {
  it("doubles the captain when they play in the XI", () => {
    const result = scoreFantasyGameweekTeam(baseSquad, [
      { playerId: "gk", rawPoints: 2, played: true },
      { playerId: "d1", rawPoints: 5, played: true },
      { playerId: "m1", rawPoints: 3, played: true },
      { playerId: "b1", rawPoints: 4, played: true },
    ]);
    expect(result.picks.find((p) => p.playerId === "d1")?.appliedPoints).toBe(10);
    expect(result.points).toBe(2 + 10 + 3);
  });

  it("doubles the vice when captain blanks", () => {
    const result = scoreFantasyGameweekTeam(baseSquad, [
      { playerId: "gk", rawPoints: 1, played: true },
      { playerId: "d1", rawPoints: 0, played: false },
      { playerId: "m1", rawPoints: 4, played: true },
      { playerId: "b1", rawPoints: 6, played: true },
    ]);
    // d1 blank → b1 auto-sub; captain blank → vice m1 ×2; b1 in XI with 6
    expect(result.picks.find((p) => p.playerId === "m1")?.appliedPoints).toBe(8);
    expect(result.picks.find((p) => p.playerId === "b1")?.inXi).toBe(true);
    expect(result.picks.find((p) => p.playerId === "d1")?.inXi).toBe(false);
    expect(result.points).toBe(1 + 8 + 6);
  });

  it("gives bench 0 applied points when they stay on the bench", () => {
    const result = scoreFantasyGameweekTeam(baseSquad, [
      { playerId: "gk", rawPoints: 1, played: true },
      { playerId: "d1", rawPoints: 2, played: true },
      { playerId: "m1", rawPoints: 3, played: true },
      { playerId: "b1", rawPoints: 9, played: true },
    ]);
    expect(result.picks.find((p) => p.playerId === "b1")?.appliedPoints).toBe(0);
    expect(result.picks.find((p) => p.playerId === "b1")?.rawPoints).toBe(9);
  });
});
