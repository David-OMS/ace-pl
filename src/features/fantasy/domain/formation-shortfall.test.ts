import { formationShortfall } from "./formation-shortfall";

describe("formationShortfall", () => {
  it("reports the missing DEF line for a three-at-the-back shape", () => {
    expect(
      formationShortfall({
        formation: "3-2-1",
        positions: ["GK", "DEF", "DEF", "MID", "MID", "FWD", "MID", "FWD", "MID"],
      }),
    ).toEqual({ position: "DEF", have: 2, need: 3 });
  });

  it("returns null when the squad can fill the shape", () => {
    expect(
      formationShortfall({
        formation: "3-2-1",
        positions: ["GK", "DEF", "DEF", "DEF", "MID", "MID", "FWD", "MID", "FWD"],
      }),
    ).toBeNull();
  });
});
