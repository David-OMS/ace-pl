import { formatGameDay } from "./format-game-day";

describe("formatGameDay", () => {
  it("shows the weekday so admins can spot a date that isn't a Friday", () => {
    expect(formatGameDay("2026-11-20")).toMatch(/Fri/);
    expect(formatGameDay("2026-11-20")).toMatch(/20/);
  });

  it("keeps the same calendar day at the turn of the year", () => {
    expect(formatGameDay("2027-01-01")).toMatch(/1 Jan 2027|Jan 1, 2027/);
  });
});
