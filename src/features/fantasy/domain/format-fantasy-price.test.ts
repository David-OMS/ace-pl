import { formatFantasyPrice } from "./format-fantasy-price";

describe("formatFantasyPrice", () => {
  it("formats with the naira sign and m suffix", () => {
    expect(formatFantasyPrice(15)).toBe("₦15.0m");
    expect(formatFantasyPrice(15.5)).toBe("₦15.5m");
    expect(formatFantasyPrice(5)).toBe("₦5.0m");
  });
});
