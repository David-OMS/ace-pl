import type { Route } from "next";

import { SoftNavLink } from "@/ui/soft-nav-link";

import { playersCopy } from "../copy";
import { ADMIN_PLAYER_PRICES_PATH, ADMIN_PLAYERS_PATH } from "../routes";

type PlayersAdminTab = "list" | "prices";

const TABS: { id: PlayersAdminTab; href: Route; label: string }[] = [
  { id: "list", href: ADMIN_PLAYERS_PATH, label: playersCopy.tabs.list },
  { id: "prices", href: ADMIN_PLAYER_PRICES_PATH, label: playersCopy.tabs.prices },
];

type PlayersAdminTabsProps = { active: PlayersAdminTab };

export function PlayersAdminTabs({ active }: PlayersAdminTabsProps): React.JSX.Element {
  return (
    <nav className="flex gap-2" aria-label={playersCopy.tabs.aria}>
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <SoftNavLink
            key={tab.id}
            href={tab.href}
            className={
              isActive
                ? "rounded-card border-2 border-line bg-hero px-3 py-2 text-sm font-bold text-on-hero"
                : "rounded-card border-2 border-line bg-surface px-3 py-2 text-sm font-bold text-muted"
            }
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </SoftNavLink>
        );
      })}
    </nav>
  );
}
