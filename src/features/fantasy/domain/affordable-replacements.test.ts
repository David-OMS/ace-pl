import { affordableReplacements } from "./affordable-replacements";

const pool = [
  { id: "a", name: "Alpha", position: "MID" as const, price: 8 },
  { id: "b", name: "Bravo", position: "MID" as const, price: 12 },
  { id: "c", name: "Charlie", position: "FWD" as const, price: 7 },
  { id: "d", name: "Delta", position: "GK" as const, price: 5 },
  { id: "e", name: "Echo", position: "DEF" as const, price: 6 },
];

describe("affordableReplacements", () => {
  it("locks starters to the same position after the first deadline", () => {
    const result = affordableReplacements({
      pool,
      ownedIds: new Set(["owned"]),
      outPosition: "MID",
      maxPrice: 10,
      samePositionOnly: true,
      excludeGoalkeepers: false,
    });
    expect(result.map((p) => p.id)).toEqual(["a"]);
  });

  it("allows any outfield on the bench and excludes GKs", () => {
    const result = affordableReplacements({
      pool,
      ownedIds: new Set(),
      outPosition: "MID",
      maxPrice: 20,
      samePositionOnly: false,
      excludeGoalkeepers: true,
    });
    expect(result.map((p) => p.id)).toEqual(["b", "a", "c", "e"]);
  });

  it("starter holes only accept that position", () => {
    const result = affordableReplacements({
      pool,
      ownedIds: new Set(),
      outPosition: "DEF",
      maxPrice: 8,
      samePositionOnly: true,
      excludeGoalkeepers: false,
    });
    expect(result.map((p) => p.id)).toEqual(["e"]);
  });
});
