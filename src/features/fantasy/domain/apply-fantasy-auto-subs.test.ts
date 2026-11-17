import { applyFantasyAutoSubs } from "./apply-fantasy-auto-subs";

describe("applyFantasyAutoSubs", () => {
  it("keeps starters who played", () => {
    const inXi = applyFantasyAutoSubs(
      [
        { playerId: "gk", position: "GK", isBench: false, benchOrder: 0 },
        { playerId: "d1", position: "DEF", isBench: false, benchOrder: 0 },
        { playerId: "b1", position: "MID", isBench: true, benchOrder: 7 },
      ],
      new Set(["gk", "d1"]),
    );
    expect([...inXi].sort()).toEqual(["d1", "gk"]);
  });

  it("subs first bench outfielder who played for a blanking starter", () => {
    const inXi = applyFantasyAutoSubs(
      [
        { playerId: "gk", position: "GK", isBench: false, benchOrder: 0 },
        { playerId: "d1", position: "DEF", isBench: false, benchOrder: 0 },
        { playerId: "b1", position: "MID", isBench: true, benchOrder: 7 },
        { playerId: "b2", position: "FWD", isBench: true, benchOrder: 8 },
      ],
      new Set(["gk", "b2"]),
    );
    expect(inXi.has("d1")).toBe(false);
    expect(inXi.has("b2")).toBe(true);
    expect(inXi.has("b1")).toBe(false);
  });

  it("never auto-subs the goalkeeper", () => {
    const inXi = applyFantasyAutoSubs(
      [
        { playerId: "gk", position: "GK", isBench: false, benchOrder: 0 },
        { playerId: "bgk", position: "GK", isBench: true, benchOrder: 7 },
        { playerId: "d1", position: "DEF", isBench: false, benchOrder: 0 },
      ],
      new Set(["bgk", "d1"]),
    );
    expect(inXi.has("gk")).toBe(true);
    expect(inXi.has("bgk")).toBe(false);
  });
});
