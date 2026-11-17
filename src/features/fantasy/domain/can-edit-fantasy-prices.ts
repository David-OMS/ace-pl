import { FANTASY_PRICE_ADMIN_ID } from "@/config/fantasy";

export function canEditFantasyPrices(userId: string): boolean {
  return userId === FANTASY_PRICE_ADMIN_ID;
}
