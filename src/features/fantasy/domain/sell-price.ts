/**
 * FPL-style sell-on: keep half of rises (rounded down in steps).
 * Falls are fully reflected. Bought 8.0 → rises to 9.0 → sell 8.5.
 */
export function sellPrice(purchasePrice: number, currentPrice: number, step: number): number {
  if (step <= 0) return currentPrice;
  if (currentPrice <= purchasePrice) return currentPrice;
  const rises = Math.round((currentPrice - purchasePrice) / step);
  return purchasePrice + Math.floor(rises / 2) * step;
}
