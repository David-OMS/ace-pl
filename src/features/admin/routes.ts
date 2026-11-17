import type { Route } from "next";

/** Admin shell paths. Kept here so client nav never imports feature barrels. */
export const ADMIN_HOME_PATH = "/admin" as Route;
export const ADMIN_TOURNAMENTS_PATH = "/admin/tournaments" as Route;
export const ADMIN_PLAYERS_PATH = "/admin/players" as Route;
export const ADMIN_AWARDS_PATH = "/admin/awards" as Route;
/** @deprecated Fixtures live under each tournament. Kept for redirects. */
export const ADMIN_FIXTURES_PATH = "/admin/fixtures" as Route;
