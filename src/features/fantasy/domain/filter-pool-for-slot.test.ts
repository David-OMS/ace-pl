import { filterPoolForSlot } from "./filter-pool-for-slot";

const pool = [
  { id: "1", name: "Cheap", position: "FWD" as const, price: 5 },
  { id: "2", name: "Premium", position: "FWD" as const, price: 15.5 },
  { id: "3", name: "Mid", position: "FWD" as const, price: 9 },
  { id: "4", name: "Keeper", position: "GK" as const, price: 5 },
];

describe("filterPoolForSlot", () => {
  it("filters by position and sorts highest price first", () => {
    const result = filterPoolForSlot(pool, { position: "FWD", isBench: false }, new Set());
    expect(result.map((p) => p.id)).toEqual(["2", "3", "1"]);
  });

  it("excludes taken players and GKs on the bench", () => {
    const result = filterPoolForSlot(pool, { position: "MID", isBench: true }, new Set(["1"]));
    expect(result.map((p) => p.id)).toEqual(["2", "3"]);
  });
});
