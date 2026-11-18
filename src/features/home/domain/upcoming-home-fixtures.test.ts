import { upcomingHomeFixtures } from "./upcoming-home-fixtures";

const days = [
  { id: "d1", played_on: "2026-11-20" },
  { id: "d2", played_on: "2026-11-27" },
  { id: "d3", played_on: "2026-12-04" },
];

const fixtures = [
  { id: "gw1-a", game_day_id: "d1", kickoff_time: "18:30:00", status: "draft" },
  { id: "gw1-b", game_day_id: "d1", kickoff_time: "18:55:00", status: "draft" },
  { id: "gw1-c", game_day_id: "d1", kickoff_time: "19:25:00", status: "draft" },
  { id: "gw1-d", game_day_id: "d1", kickoff_time: "19:50:00", status: "draft" },
  { id: "gw2-a", game_day_id: "d2", kickoff_time: "18:30:00", status: "draft" },
  { id: "gw2-b", game_day_id: "d2", kickoff_time: "18:55:00", status: "draft" },
  { id: "gw3-a", game_day_id: "d3", kickoff_time: "18:30:00", status: "draft" },
];

describe("upcomingHomeFixtures", () => {
  it("takes the next matches on the current game day by kick-off", () => {
    expect(upcomingHomeFixtures(days, fixtures, 3).map((row) => row.id)).toEqual([
      "gw1-a",
      "gw1-b",
      "gw1-c",
    ]);
  });

  it("spills into the next game week when the current one is nearly done", () => {
    const almostDone = fixtures.map((row) =>
      row.id === "gw1-d"
        ? row
        : { ...row, status: row.game_day_id === "d1" ? "completed" : row.status },
    );
    expect(upcomingHomeFixtures(days, almostDone, 3).map((row) => row.id)).toEqual([
      "gw1-d",
      "gw2-a",
      "gw2-b",
    ]);
  });

  it("does not plaster the first kick-off from each game week", () => {
    const plastered = fixtures
      .filter((row) => row.kickoff_time === "18:30:00")
      .slice(0, 3)
      .map((row) => row.id);
    expect(plastered).toEqual(["gw1-a", "gw2-a", "gw3-a"]);
    expect(upcomingHomeFixtures(days, fixtures, 3).map((row) => row.id)).not.toEqual(plastered);
  });
});
