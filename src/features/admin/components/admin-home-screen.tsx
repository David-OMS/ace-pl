import type { Route } from "next";

import { ButtonLink } from "@/ui/button-link";
import { Card } from "@/ui/card";

import { adminCopy } from "../copy";
import type { AdminHomeSnapshot } from "../queries/get-admin-home-snapshot";
import { AdminHomeNextFixture } from "./admin-home-next-fixture";
import { AdminHomeSetupSteps } from "./admin-home-setup-steps";
import { AdminHomeTournamentCard } from "./admin-home-tournament-card";

type AdminHomeScreenProps = {
  snapshot: AdminHomeSnapshot;
  statusLabel: string | null;
  playersHref: Route;
  createTournamentHref: Route;
  tournamentHref: Route | null;
  fixturesHref: Route | null;
  settingsHref: Route | null;
  manageRosterHref: Route | null;
  createTeamHref: Route | null;
};

export function AdminHomeScreen({
  snapshot,
  statusLabel,
  playersHref,
  createTournamentHref,
  tournamentHref,
  fixturesHref,
  settingsHref,
  manageRosterHref,
  createTeamHref,
}: AdminHomeScreenProps): React.JSX.Element {
  const { home } = adminCopy;
  const ready =
    snapshot.tournament && tournamentHref && settingsHref && statusLabel
      ? { tournamentHref, settingsHref, statusLabel, fixturesHref }
      : null;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pb-4">
      {ready ? (
        <>
          <AdminHomeNextFixture fixture={snapshot.nextFixture} />
          <AdminHomeTournamentCard
            snapshot={snapshot}
            statusLabel={ready.statusLabel}
            tournamentHref={ready.tournamentHref}
            fixturesHref={ready.fixturesHref}
            settingsHref={ready.settingsHref}
          />
          <AdminHomeSetupSteps
            snapshot={snapshot}
            manageRosterHref={manageRosterHref}
            createTeamHref={createTeamHref}
            fixturesHref={fixturesHref}
          />
        </>
      ) : (
        <Card className="flex flex-col gap-3">
          <p className="text-sm text-muted">{home.empty}</p>
          <ButtonLink href={createTournamentHref} fullWidth>
            {home.createTournament}
          </ButtonLink>
          <ButtonLink href={playersHref} variant="secondary" fullWidth>
            {home.managePlayers}
          </ButtonLink>
        </Card>
      )}
    </main>
  );
}
