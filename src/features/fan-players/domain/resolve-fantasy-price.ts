import { FANTASY_PRICE_FLOOR } from "@/config/fantasy";

/** Continuous price from DB; S/A/B/C rank is ignored for display. */
export function resolveFantasyPrice(storedPrice: number | null | undefined): number {
  if (storedPrice === null || storedPrice === undefined || Number.isNaN(Number(storedPrice))) {
    return FANTASY_PRICE_FLOOR;
  }
  return Number(storedPrice);
}
