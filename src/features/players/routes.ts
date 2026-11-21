import type { Route } from "next";

export const ADMIN_PLAYERS_PATH = "/admin/players" as Route;
export const ADMIN_PLAYER_PRICES_PATH = "/admin/players/prices" as Route;
export const NEW_PLAYER_PATH = "/admin/players/new" as Route;
export const CLAIM_BASE_PATH = "/claim";

export function adminPlayerPath(playerId: string): Route {
  return `${ADMIN_PLAYERS_PATH}/${playerId}` as Route;
}

export function claimPath(token: string): Route {
  return `${CLAIM_BASE_PATH}/${token}` as Route;
}
