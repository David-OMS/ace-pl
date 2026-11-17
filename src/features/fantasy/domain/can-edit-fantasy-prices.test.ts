import { FANTASY_PRICE_ADMIN_ID } from "@/config/fantasy";

import { canEditFantasyPrices } from "./can-edit-fantasy-prices";

describe("canEditFantasyPrices", () => {
  it("allows only the price admin", () => {
    expect(canEditFantasyPrices(FANTASY_PRICE_ADMIN_ID)).toBe(true);
    expect(canEditFantasyPrices("00000000-0000-4000-8000-000000000000")).toBe(false);
  });
});
