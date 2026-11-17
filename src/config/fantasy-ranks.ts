export const FANTASY_RANKS = ["S", "A", "B", "C"] as const;
export type FantasyRank = (typeof FANTASY_RANKS)[number];

/** Display band from continuous price (admin UI / seed). */
export function rankFromPrice(price: number): FantasyRank {
  if (price >= 12) return "S";
  if (price >= 8) return "A";
  if (price >= 6) return "B";
  return "C";
}
