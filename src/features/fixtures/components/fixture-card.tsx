import type { Route } from "next";

import type { FixtureStatus } from "@/config/fixture-status";
import { formatKickoffTime } from "@/lib/dates/format-kickoff-time";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { fixturesCopy } from "../copy";

export type FixtureCardData = {
  id: string;
  kickoffTime: string;
  status: FixtureStatus;
  homeTeamName: string;
  awayTeamName: string;
};

type FixtureCardProps = {
  fixture: FixtureCardData;
  href: Route;
  /** e.g. "Today" on the home screen. */
  eyebrow?: string;
};

export function FixtureCard({ fixture, href, eyebrow }: FixtureCardProps): React.JSX.Element {
  return (
    <SoftNavLink
      href={href}
      className="flex min-h-16 items-center gap-3 rounded-card border-2 border-line bg-surface px-3 py-3"
    >
      <TeamSide name={fixture.homeTeamName} />
      <div className="flex w-24 flex-col items-center justify-center gap-0.5 text-center">
        {eyebrow ? <span className="text-xs font-bold text-muted">{eyebrow}</span> : null}
        <span className="font-display text-lg uppercase">{centreLabel(fixture)}</span>
      </div>
      <TeamSide name={fixture.awayTeamName} />
    </SoftNavLink>
  );
}

function TeamSide({ name }: { name: string }): React.JSX.Element {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <span className="flex size-9 items-center justify-center rounded-card border-2 border-line bg-canvas font-display text-sm">
        {initial}
      </span>
      <span className="w-full truncate text-center text-sm font-bold">{name}</span>
    </div>
  );
}

function centreLabel(fixture: FixtureCardData): string {
  if (fixture.status === "published") return formatKickoffTime(fixture.kickoffTime);
  if (fixture.status === "postponed") return fixturesCopy.statuses.postponed;
  if (fixture.status === "completed" || fixture.status === "walkover") {
    return fixturesCopy.statuses.completed;
  }
  return fixturesCopy.statuses[fixture.status];
}
