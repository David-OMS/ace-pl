import "server-only";

import { serverEnv } from "@/lib/env/server-env";

import { canEditFantasyPrices } from "../domain/can-edit-fantasy-prices";

export function isFantasyPriceAdmin(userId: string): boolean {
  return canEditFantasyPrices(userId, serverEnv.FANTASY_PRICE_ADMIN_ID);
}
