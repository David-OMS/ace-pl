import type { LucideIcon } from "lucide-react";
import { CalendarDays, Home, Shirt, Star, Trophy } from "lucide-react";
import type { Route } from "next";

import { fanCopy } from "./copy";
import {
  FAN_FANTASY_PATH,
  FAN_FIXTURES_PATH,
  FAN_HOME_PATH,
  FAN_LEAGUE_PATH,
  FAN_PLAYERS_PATH,
} from "./routes";

export type FanNavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  match: string;
};

export const FAN_NAV_ITEMS: readonly FanNavItem[] = [
  { href: FAN_HOME_PATH, label: fanCopy.nav.home, icon: Home, match: FAN_HOME_PATH },
  { href: FAN_LEAGUE_PATH, label: fanCopy.nav.league, icon: Trophy, match: FAN_LEAGUE_PATH },
  {
    href: FAN_FIXTURES_PATH,
    label: fanCopy.nav.fixtures,
    icon: CalendarDays,
    match: FAN_FIXTURES_PATH,
  },
  { href: FAN_PLAYERS_PATH, label: fanCopy.nav.players, icon: Shirt, match: FAN_PLAYERS_PATH },
  { href: FAN_FANTASY_PATH, label: fanCopy.nav.fantasy, icon: Star, match: FAN_FANTASY_PATH },
];

export function isFanNavActive(pathname: string, item: FanNavItem): boolean {
  if (item.match === FAN_HOME_PATH) return pathname === FAN_HOME_PATH;
  return pathname === item.match || pathname.startsWith(`${item.match}/`);
}
