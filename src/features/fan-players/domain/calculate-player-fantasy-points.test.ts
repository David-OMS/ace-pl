import { calculatePlayerFantasyPoints } from "./calculate-player-fantasy-points";

const blank = {
  apps: 0,
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

describe("calculatePlayerFantasyPoints", () => {
  it("scores appearance and a forward goal", () => {
    const points = calculatePlayerFantasyPoints("FWD", {
      ...blank,
      apps: 3,
      goals: 2,
    });
    expect(points).toBe(3 + 2 * 4);
  });

  it("gives defenders +7 for a goal and +4 for an assist", () => {
    const points = calculatePlayerFantasyPoints("DEF", {
      ...blank,
      apps: 1,
      goals: 1,
      assists: 1,
    });
    expect(points).toBe(1 + 7 + 4);
  });

  it("penalises every two goals conceded for a defender", () => {
    const points = calculatePlayerFantasyPoints("DEF", {
      ...blank,
      apps: 1,
      goalsConceded: 5,
    });
    expect(points).toBe(1 - 2);
  });

  it("awards save points in blocks of two for a goalkeeper", () => {
    const points = calculatePlayerFantasyPoints("GK", {
      ...blank,
      apps: 1,
      saves: 5,
    });
    expect(points).toBe(1 + 2);
  });

  it("gives midfielders +1 for a clean sheet and −3 for an own goal", () => {
    const points = calculatePlayerFantasyPoints("MID", {
      ...blank,
      apps: 1,
      cleanSheets: 1,
      ownGoals: 1,
    });
    expect(points).toBe(1 + 1 - 3);
  });
});
