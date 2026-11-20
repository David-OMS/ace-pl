import { countCleanSheets, countFantasyCleanSheets } from "./count-clean-sheets";

const fixture = {
  fixtureId: "f1",
  homeTeamId: "h",
  awayTeamId: "a",
  homeGoals: 2,
  awayGoals: 0,
  status: "completed",
} as const;

const appearances = [
  {
    fixtureId: "f1",
    playerId: "gk",
    teamId: "h",
    status: "played" as const,
    position: "GK" as const,
    isGoalkeeper: true,
  },
  {
    fixtureId: "f1",
    playerId: "mid",
    teamId: "h",
    status: "played" as const,
    position: "MID" as const,
    isGoalkeeper: false,
  },
  {
    fixtureId: "f1",
    playerId: "def",
    teamId: "h",
    status: "played" as const,
    position: "DEF" as const,
    isGoalkeeper: false,
  },
  {
    fixtureId: "f1",
    playerId: "fwd",
    teamId: "h",
    status: "played" as const,
    position: "FWD" as const,
    isGoalkeeper: false,
  },
];

describe("countCleanSheets", () => {
  it("credits only GK and DEF on the stats board", () => {
    const counts = countCleanSheets([fixture], appearances);
    expect(counts.get("gk")).toBe(1);
    expect(counts.get("def")).toBe(1);
    expect(counts.get("mid")).toBeUndefined();
    expect(counts.get("fwd")).toBeUndefined();
  });
});

describe("countFantasyCleanSheets", () => {
  it("still credits MID for fantasy points", () => {
    const counts = countFantasyCleanSheets([fixture], appearances);
    expect(counts.get("gk")).toBe(1);
    expect(counts.get("def")).toBe(1);
    expect(counts.get("mid")).toBe(1);
    expect(counts.get("fwd")).toBeUndefined();
  });
});
