import { affordableReplacements } from "./affordable-replacements";

const pool = [
  { id: "a", name: "Alpha", position: "MID" as const, price: 8 },
  { id: "b", name: "Bravo", position: "MID" as const, price: 12 },
  { id: "c", name: "Charlie", position: "FWD" as const, price: 7 },
  { id: "d", name: "Delta", position: "GK" as const, price: 5 },
];

describe("affordableReplacements", () => {
  it("keeps same position, within budget, highest price first", () => {
    const result = affordableReplacements({
      pool,
      ownedIds: new Set(["owned"]),
      outPosition: "MID",
      isBench: false,
      maxPrice: 10,
    });
    expect(result.map((p) => p.id)).toEqual(["a"]);
  });

  it("allows any outfield on the bench and excludes GKs", () => {
    const result = affordableReplacements({
      pool,
      ownedIds: new Set(),
      outPosition: "MID",
      isBench: true,
      maxPrice: 20,
    });
    expect(result.map((p) => p.id)).toEqual(["b", "a", "c"]);
  });
});
