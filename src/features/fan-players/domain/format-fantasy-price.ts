/** Display price in naira millions, e.g. ₦15.5m. */
export function formatFantasyPrice(millions: number): string {
  return `₦${millions.toFixed(1)}m`;
}
