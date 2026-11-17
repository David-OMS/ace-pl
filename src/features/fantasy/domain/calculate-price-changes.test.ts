import {
  calculatePriceChanges,
  priceChangeThresholds,
  type PriceChangeRules,
} from "./calculate-price-changes";

const rules: PriceChangeRules = {
  activeTeams: 40,
  floor: 5,
  ceiling: 20,
  step: 0.5,
  maxStepsPerGw: 2,
  riseTeamShare: 0.15,
  fallOwnershipShare: 0.2,
  minThreshold: 2,
};

describe("calculatePriceChanges", () => {
  it("uses ceil(activeTeams × share) for rises (min 2)", () => {
    expect(priceChangeThresholds(rules).rise).toBe(6);
    expect(priceChangeThresholds({ ...rules, activeTeams: 5 }).rise).toBe(2);
  });

  it("rises by one step when net transfers hit the threshold once", () => {
    const changes = calculatePriceChanges(
      [{ playerId: "a", price: 8, ownership: 10, netTransfers: 6 }],
      rules,
    );
    expect(changes).toEqual([{ playerId: "a", oldPrice: 8, newPrice: 8.5, delta: 0.5 }]);
  });

  it("caps rises at maxStepsPerGw", () => {
    const changes = calculatePriceChanges(
      [{ playerId: "a", price: 8, ownership: 10, netTransfers: 20 }],
      rules,
    );
    expect(changes[0]?.newPrice).toBe(9);
  });

  it("falls using ownership share, respects floor", () => {
    const changes = calculatePriceChanges(
      [{ playerId: "b", price: 5.5, ownership: 20, netTransfers: -4 }],
      rules,
    );
    expect(changes).toEqual([{ playerId: "b", oldPrice: 5.5, newPrice: 5, delta: -0.5 }]);
  });

  it("skips players under threshold", () => {
    expect(
      calculatePriceChanges([{ playerId: "c", price: 7, ownership: 10, netTransfers: 5 }], rules),
    ).toEqual([]);
  });
});
