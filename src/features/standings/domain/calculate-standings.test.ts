import { calculateStandings } from "./calculate-standings";

const A = "team-a";
const B = "team-b";
const C = "team-c";

describe("calculateStandings", () => {
  it("gives 3 points for a win and 1 each for a draw", () => {
    const table = calculateStandings({
      teamIds: [A, B, C],
      fixtures: [
        {
          homeTeamId: A,
          awayTeamId: B,
          status: "completed",
          walkoverWinnerTeamId: null,
          homeGoals: 2,
          awayGoals: 1,
        },
        {
          homeTeamId: B,
          awayTeamId: C,
          status: "completed",
          walkoverWinnerTeamId: null,
          homeGoals: 0,
          awayGoals: 0,
        },
      ],
    });

    // A top on points; C above B on goal difference (0 vs −1).
    expect(table.map((r) => r.teamId)).toEqual([A, C, B]);
    expect(table[0]).toMatchObject({ points: 3, won: 1, goalsFor: 2, goalsAgainst: 1 });
    expect(table[1]).toMatchObject({ points: 1, drawn: 1, goalDifference: 0 });
    expect(table[2]).toMatchObject({ points: 1, drawn: 1, lost: 1, goalDifference: -1 });
  });

  it("counts a walkover as 3–0 with no need for goal events", () => {
    const table = calculateStandings({
      teamIds: [A, B],
      fixtures: [
        {
          homeTeamId: A,
          awayTeamId: B,
          status: "walkover",
          walkoverWinnerTeamId: B,
          homeGoals: 0,
          awayGoals: 0,
        },
      ],
    });

    expect(table[0]).toMatchObject({
      teamId: B,
      points: 3,
      goalsFor: 3,
      goalsAgainst: 0,
      goalDifference: 3,
    });
    expect(table[1]).toMatchObject({ teamId: A, points: 0, goalsFor: 0, goalsAgainst: 3 });
  });

  it("ignores draft and published fixtures", () => {
    const table = calculateStandings({
      teamIds: [A, B],
      fixtures: [
        {
          homeTeamId: A,
          awayTeamId: B,
          status: "published",
          walkoverWinnerTeamId: null,
          homeGoals: 5,
          awayGoals: 0,
        },
      ],
    });

    expect(table.every((r) => r.played === 0)).toBe(true);
  });

  it("breaks ties on goal difference then goals scored", () => {
    const table = calculateStandings({
      teamIds: [A, B, C],
      fixtures: [
        {
          homeTeamId: A,
          awayTeamId: C,
          status: "completed",
          walkoverWinnerTeamId: null,
          homeGoals: 3,
          awayGoals: 0,
        },
        {
          homeTeamId: B,
          awayTeamId: C,
          status: "completed",
          walkoverWinnerTeamId: null,
          homeGoals: 1,
          awayGoals: 0,
        },
      ],
    });

    expect(table.map((r) => r.teamId)).toEqual([A, B, C]);
    expect(table[0]?.goalDifference).toBe(3);
    expect(table[1]?.goalDifference).toBe(1);
  });
});
