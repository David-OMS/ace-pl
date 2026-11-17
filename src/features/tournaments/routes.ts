import type { Route } from "next";

export const ADMIN_TOURNAMENTS_PATH = "/admin/tournaments";
export const NEW_TOURNAMENT_PATH = "/admin/tournaments/new";

export function adminTournamentPath(tournamentId: string): Route {
  return `${ADMIN_TOURNAMENTS_PATH}/${tournamentId}` as Route;
}

export function adminTournamentSettingsPath(tournamentId: string): Route {
  return `${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/settings` as Route;
}

export function adminTournamentPlayersPath(tournamentId: string): Route {
  return `${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/players` as Route;
}

export function adminNewTeamPath(tournamentId: string): Route {
  return `${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/teams/new` as Route;
}

export function adminTeamPath(tournamentId: string, teamId: string): Route {
  return `${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/teams/${teamId}` as Route;
}

export function adminTournamentFixturesPath(tournamentId: string): Route {
  return `${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/fixtures` as Route;
}
