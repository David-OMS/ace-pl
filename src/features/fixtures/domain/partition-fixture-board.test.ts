import { partitionFixtureBoard } from "./partition-fixture-board";

const DAYS = [
  { id: "d1", playedOn: "2026-11-20", label: "Fri 20", gameweek: 1 },
  { id: "d2", playedOn: "2026-11-27", label: "Fri 27", gameweek: 2 },
];

describe("partitionFixtureBoard", () => {
  it("keeps postponed fixtures out of dated game days", () => {
    const result = partitionFixtureBoard(DAYS, [
      {
        id: "live",
        gameDayId: "d1",
        kickoffTime: "18:30:00",
        status: "published" as const,
      },
      {
        id: "parked",
        gameDayId: "d1",
        kickoffTime: "18:55:00",
        status: "postponed" as const,
      },
    ]);

    expect(result.dated[0]?.fixtures.map((f) => f.id)).toEqual(["live"]);
    expect(result.undated.map((f) => f.id)).toEqual(["parked"]);
  });
});
