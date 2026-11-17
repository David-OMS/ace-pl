import { formationFitsSquad } from "./formation-fits-squad";

describe("formationFitsSquad", () => {
  it("allows 2-2-2 when the squad has two of each outfield line", () => {
    expect(
      formationFitsSquad({
        formation: "2-2-2",
        positions: ["GK", "DEF", "DEF", "MID", "MID", "FWD", "FWD", "MID", "DEF"],
      }),
    ).toBe(true);
  });

  it("blocks a two-striker shape when only one forward is owned", () => {
    expect(
      formationFitsSquad({
        formation: "2-2-2",
        positions: ["GK", "DEF", "DEF", "DEF", "MID", "MID", "MID", "FWD", "MID"],
      }),
    ).toBe(false);
  });
});
