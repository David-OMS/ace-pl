import { parseFormation, isFantasyFormation } from "./parse-formation";

describe("parseFormation", () => {
  it("parses a valid DEF-MID-FWD string and counts starters with GK", () => {
    expect(parseFormation("2-2-2")).toEqual({
      def: 2,
      mid: 2,
      fwd: 2,
      starters: 7,
    });
    expect(parseFormation("3-1-2")).toEqual({
      def: 3,
      mid: 1,
      fwd: 2,
      starters: 7,
    });
  });

  it("rejects unknown formations", () => {
    expect(parseFormation("4-4-2")).toBeNull();
    expect(parseFormation("")).toBeNull();
    expect(isFantasyFormation("2-2-2")).toBe(true);
    expect(isFantasyFormation("1-1-1")).toBe(false);
  });
});
