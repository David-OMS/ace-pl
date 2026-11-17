import { describe, expect, it } from "vitest";

import { pickDefaultGameDayId } from "./pick-default-game-day";

describe("pickDefaultGameDayId", () => {
  it("returns null when no groups have fixtures", () => {
    expect(
      pickDefaultGameDayId(
        [{ gameDay: { id: "a", playedOn: "2026-11-20" }, fixtures: [] }],
        "2026-11-16",
      ),
    ).toBeNull();
  });

  it("prefers the earliest open game day", () => {
    const groups = [
      {
        gameDay: { id: "gw2", playedOn: "2026-11-13" },
        fixtures: [{ status: "completed" as const }],
      },
      {
        gameDay: { id: "gw3", playedOn: "2026-11-20" },
        fixtures: [{ status: "published" as const }],
      },
      {
        gameDay: { id: "gw4", playedOn: "2026-11-27" },
        fixtures: [{ status: "published" as const }],
      },
    ];
    expect(pickDefaultGameDayId(groups, "2026-11-16")).toBe("gw3");
  });

  it("falls back to the latest day when every match is finished", () => {
    const groups = [
      {
        gameDay: { id: "gw1", playedOn: "2026-11-06" },
        fixtures: [{ status: "completed" as const }],
      },
      {
        gameDay: { id: "gw2", playedOn: "2026-11-13" },
        fixtures: [{ status: "completed" as const }],
      },
    ];
    expect(pickDefaultGameDayId(groups, "2026-11-16")).toBe("gw2");
  });
});
