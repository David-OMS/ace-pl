import type { Route } from "next";

import { ButtonLink } from "@/ui/button-link";
import { Card } from "@/ui/card";

import { adminCopy } from "../copy";
import type { AdminHomeSnapshot } from "../queries/get-admin-home-snapshot";

type AdminHomeTournamentCardProps = {
  snapshot: AdminHomeSnapshot;
  statusLabel: string;
  tournamentHref: Route;
  fixturesHref: Route | null;
  settingsHref: Route;
};

export function AdminHomeTournamentCard({
  snapshot,
  statusLabel,
  tournamentHref,
  fixturesHref,
  settingsHref,
}: AdminHomeTournamentCardProps): React.JSX.Element {
  const { home } = adminCopy;
  const tournament = snapshot.tournament;
  if (!tournament) return <></>;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl uppercase">{tournament.name}</h2>
        <p className="text-xs font-bold text-muted uppercase">
          {home.status}: {statusLabel}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <ButtonLink href={tournamentHref} fullWidth>
          {home.openTournament}
        </ButtonLink>
        {fixturesHref ? (
          <ButtonLink href={fixturesHref} variant="secondary" fullWidth>
            {home.openFixtures}
          </ButtonLink>
        ) : null}
        <ButtonLink href={settingsHref} variant="secondary" fullWidth>
          {home.openSettings}
        </ButtonLink>
      </div>
    </Card>
  );
}
