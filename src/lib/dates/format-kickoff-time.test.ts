import { formatKickoffTime } from "./format-kickoff-time";

describe("formatKickoffTime", () => {
  it("formats handbook kick-off times", () => {
    expect(formatKickoffTime("18:30:00")).toMatch(/6:30/);
    expect(formatKickoffTime("18:57")).toMatch(/6:57/);
  });
});
