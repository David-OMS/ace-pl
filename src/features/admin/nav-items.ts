import type { LucideIcon } from "lucide-react";
import { Award, Home, Shirt, Trophy } from "lucide-react";
import type { Route } from "next";

import { adminCopy } from "./copy";
import {
  ADMIN_AWARDS_PATH,
  ADMIN_HOME_PATH,
  ADMIN_PLAYERS_PATH,
  ADMIN_TOURNAMENTS_PATH,
} from "./routes";

export type AdminNavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  /** Path prefix that counts as active for nested routes. */
  match: string;
};

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { href: ADMIN_HOME_PATH, label: adminCopy.nav.home, icon: Home, match: ADMIN_HOME_PATH },
  {
    href: ADMIN_TOURNAMENTS_PATH,
    label: adminCopy.nav.tournaments,
    icon: Trophy,
    match: ADMIN_TOURNAMENTS_PATH,
  },
  {
    href: ADMIN_PLAYERS_PATH,
    label: adminCopy.nav.players,
    icon: Shirt,
    match: ADMIN_PLAYERS_PATH,
  },
  {
    href: ADMIN_AWARDS_PATH,
    label: adminCopy.nav.awards,
    icon: Award,
    match: ADMIN_AWARDS_PATH,
  },
];

export function isAdminNavActive(pathname: string, item: AdminNavItem): boolean {
  if (item.match === ADMIN_HOME_PATH) return pathname === ADMIN_HOME_PATH;
  return pathname === item.match || pathname.startsWith(`${item.match}/`);
}
