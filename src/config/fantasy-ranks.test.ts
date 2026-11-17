import { rankFromPrice } from "./fantasy-ranks";

describe("rankFromPrice", () => {
  it("maps continuous prices to display bands", () => {
    expect(rankFromPrice(15.5)).toBe("S");
    expect(rankFromPrice(12)).toBe("S");
    expect(rankFromPrice(8)).toBe("A");
    expect(rankFromPrice(6)).toBe("B");
    expect(rankFromPrice(5.5)).toBe("C");
  });
});
