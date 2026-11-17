import { groupFixturesByGameDay } from "./group-fixtures-by-game-day";

const DAYS = [
  { id: "d1", playedOn: "2026-11-20", label: "Fri 20" },
  { id: "d2", playedOn: "2026-11-27", label: "Fri 27" },
];

describe("groupFixturesByGameDay", () => {
  it("keeps game-day order and sorts kick-offs within a day", () => {
    const groups = groupFixturesByGameDay(DAYS, [
      { id: "f2", gameDayId: "d1", kickoffTime: "18:57:00" },
      { id: "f1", gameDayId: "d1", kickoffTime: "18:30:00" },
      { id: "f3", gameDayId: "d2", kickoffTime: "18:30:00" },
    ]);

    expect(groups.map((g) => g.gameDay.id)).toEqual(["d1", "d2"]);
    expect(groups[0]?.fixtures.map((f) => f.id)).toEqual(["f1", "f2"]);
    expect(groups[1]?.fixtures.map((f) => f.id)).toEqual(["f3"]);
  });

  it("includes empty game days so admins can see gaps", () => {
    const groups = groupFixturesByGameDay(DAYS, []);

    expect(groups).toHaveLength(2);
    expect(groups[0]?.fixtures).toEqual([]);
  });
});
