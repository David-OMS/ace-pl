import { calculateAutoAwards } from "./calculate-auto-awards";

const blank = {
  apps: 1,
  goals: 0,
  assists: 0,
  cleanSheets: 0,
  yellowCards: 0,
  redCards: 0,
  saves: 0,
  motm: 0,
  ownGoals: 0,
  penaltySaves: 0,
  goalsConceded: 0,
};

describe("calculateAutoAwards", () => {
  it("shares golden boot on equal goals", () => {
    const result = calculateAutoAwards([
      { ...blank, playerId: "a", name: "A", goals: 5 },
      { ...blank, playerId: "b", name: "B", goals: 5 },
      { ...blank, playerId: "c", name: "C", goals: 2 },
    ]);
    expect(result.goldenBoot.map((w) => w.playerId)).toEqual(["a", "b"]);
  });

  it("breaks golden glove ties with saves then goals conceded", () => {
    const result = calculateAutoAwards([
      {
        ...blank,
        playerId: "a",
        name: "A",
        cleanSheets: 2,
        saves: 4,
        goalsConceded: 3,
      },
      {
        ...blank,
        playerId: "b",
        name: "B",
        cleanSheets: 2,
        saves: 6,
        goalsConceded: 5,
      },
    ]);
    expect(result.goldenGlove.map((w) => w.playerId)).toEqual(["b"]);
  });
});
