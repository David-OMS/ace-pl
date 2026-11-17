import { firstGameweekDeadlineMs } from "./first-gameweek-deadline";

describe("firstGameweekDeadlineMs", () => {
  it("lands on the Thursday before a Friday game day", () => {
    const ms = firstGameweekDeadlineMs("2026-11-20");
    const deadline = new Date(ms);
    expect(deadline.getUTCDay()).toBe(4);
    expect(deadline.getUTCHours()).toBe(22);
    expect(deadline.getUTCMinutes()).toBe(59);
  });
});
