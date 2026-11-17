import { describe, expect, it } from "vitest";

import { countFraudWeeks } from "./count-fraud-weeks";

describe("countFraudWeeks", () => {
  const gameDays = ["2026-11-07", "2026-11-14", "2026-11-21", "2026-11-28"];

  it("counts game days from start through today for an open entry", () => {
    expect(
      countFraudWeeks({
        startedOn: "2026-11-07",
        endedOn: null,
        gameDays,
        today: "2026-11-22",
      }),
    ).toBe(3);
  });

  it("shows at least one week while open before any game day lands", () => {
    expect(
      countFraudWeeks({
        startedOn: "2026-11-10",
        endedOn: null,
        gameDays,
        today: "2026-11-12",
      }),
    ).toBe(1);
  });

  it("stops counting after endedOn", () => {
    expect(
      countFraudWeeks({
        startedOn: "2026-11-07",
        endedOn: "2026-11-14",
        gameDays,
        today: "2026-11-28",
      }),
    ).toBe(2);
  });
});
