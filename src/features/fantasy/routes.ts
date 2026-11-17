import type { Route } from "next";

import { FAN_FANTASY_PATH } from "@/features/fan";

export const FANTASY_PATH = FAN_FANTASY_PATH;
export const FANTASY_CREATE_PATH = "/fantasy/create" as Route;
export const FANTASY_TRANSFERS_PATH = "/fantasy/transfers" as Route;
export const FANTASY_LEADERBOARD_PATH = "/fantasy/leaderboard" as Route;

export function fantasyTeamPath(teamId: string): Route {
  return `/fantasy/teams/${teamId}` as Route;
}

export function fantasyGwPlayersPath(gameDayId: string): Route {
  return `/fantasy/gameweeks/${gameDayId}/players` as Route;
}

export function adminFantasyRanksPath(tournamentId: string): Route {
  return `/admin/tournaments/${tournamentId}/fantasy-ranks` as Route;
}
