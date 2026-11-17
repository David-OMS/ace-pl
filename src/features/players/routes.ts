import type { Route } from "next";

export const ADMIN_PLAYERS_PATH = "/admin/players";
export const NEW_PLAYER_PATH = "/admin/players/new";
export const CLAIM_BASE_PATH = "/claim";

export function adminPlayerPath(playerId: string): Route {
  return `${ADMIN_PLAYERS_PATH}/${playerId}` as Route;
}

export function claimPath(token: string): Route {
  return `${CLAIM_BASE_PATH}/${token}` as Route;
}
