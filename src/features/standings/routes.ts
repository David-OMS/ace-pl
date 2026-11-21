import type { Route } from "next";

export function standingsTeamPath(teamId: string): Route {
  return `/teams/${teamId}` as Route;
}
