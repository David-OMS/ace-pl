import { teamScoresGameweek } from "./team-scores-gameweek";

describe("teamScoresGameweek", () => {
  const gw1 = "2026-11-20";
  const beforeDeadline = Date.UTC(2026, 10, 19, 12, 0, 0);
  const afterDeadline = Date.UTC(2026, 10, 20, 12, 0, 0);

  it("scores the GW when the team was created before that deadline", () => {
    expect(teamScoresGameweek({ createdAtMs: beforeDeadline, playedOn: gw1 })).toBe(true);
  });

  it("skips the GW when the team was created after that deadline", () => {
    expect(teamScoresGameweek({ createdAtMs: afterDeadline, playedOn: gw1 })).toBe(false);
  });
});
