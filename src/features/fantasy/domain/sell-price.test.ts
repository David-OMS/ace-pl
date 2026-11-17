import { sellPrice } from "./sell-price";

describe("sellPrice", () => {
  it("returns current when price has not risen", () => {
    expect(sellPrice(8, 8, 0.5)).toBe(8);
    expect(sellPrice(8, 7.5, 0.5)).toBe(7.5);
  });

  it("keeps half of rises rounded down in steps", () => {
    expect(sellPrice(8, 8.5, 0.5)).toBe(8);
    expect(sellPrice(8, 9, 0.5)).toBe(8.5);
    expect(sellPrice(8, 9.5, 0.5)).toBe(8.5);
    expect(sellPrice(8, 10, 0.5)).toBe(9);
  });
});
