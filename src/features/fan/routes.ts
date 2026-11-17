import type { Route } from "next";

export const FAN_HOME_PATH = "/" as Route;
export const FAN_LEAGUE_PATH = "/league" as Route;
export const FAN_FIXTURES_PATH = "/fixtures" as Route;
export const FAN_PLAYERS_PATH = "/players" as Route;
export const FAN_PLAYERS_STATS_PATH = "/players?view=stats" as Route;
export const FAN_FANTASY_PATH = "/fantasy" as Route;
export const FAN_PROFILE_PATH = "/profile" as Route;
export const PROFILE_PHOTO_SETUP_PATH = "/profile?setup=photo" as Route;

export function fanFixturePath(fixtureId: string): Route {
  return `${FAN_FIXTURES_PATH}/${fixtureId}` as Route;
}

export function fanPlayerPath(playerId: string): Route {
  return `${FAN_PLAYERS_PATH}/${playerId}` as Route;
}
