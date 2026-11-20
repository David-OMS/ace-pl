import { sumMatchFantasyPoints } from "./sum-match-fantasy-points";

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

describe("sumMatchFantasyPoints", () => {
  it("keeps a clean sheet from match 1 when match 2 concedes", () => {
    const points = sumMatchFantasyPoints("DEF", [
      { ...blank, cleanSheets: 1, goalsConceded: 0 },
      { ...blank, cleanSheets: 0, goalsConceded: 3 },
    ]);
    // Match1: 1 app + 4 CS = 5; Match2: 1 app − 1 (floor 3/2) = 0; total 5
    expect(points).toBe(5);
  });

  it("applies conceded pairs per match not across the GW", () => {
    const points = sumMatchFantasyPoints("GK", [
      { ...blank, goalsConceded: 1 },
      { ...blank, goalsConceded: 1 },
    ]);
    // Per match floor(1/2)=0 → 1+1 apps = 2; aggregated floor(2/2) would wrongly be 1
    expect(points).toBe(2);
  });

  it("applies save blocks per match not across the GW", () => {
    const points = sumMatchFantasyPoints("GK", [
      { ...blank, saves: 1 },
      { ...blank, saves: 1 },
    ]);
    // Per match floor(1/2)=0 → 2 apps; aggregated floor(2/2)=1 would add a spare point
    expect(points).toBe(2);
  });
});
