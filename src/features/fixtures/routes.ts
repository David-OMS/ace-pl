import type { Route } from "next";

export function adminFixturePath(tournamentId: string, fixtureId: string): Route {
  return `/admin/tournaments/${tournamentId}/fixtures/${fixtureId}` as Route;
}
