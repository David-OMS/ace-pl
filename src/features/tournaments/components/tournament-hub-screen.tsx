import Link from "next/link";
import { Settings } from "lucide-react";

import { Icon } from "@/ui/icon";
import { PageHeader } from "@/ui/page-header";

import { tournamentsCopy } from "../copy";
import type { TournamentDetail } from "../queries/get-tournament";
import { ADMIN_TOURNAMENTS_PATH, adminTournamentSettingsPath } from "../routes";
import { HubSetupPrompts } from "./hub-setup-prompts";
import { HubTeamList, HubUnassignedList } from "./hub-team-list";

export type HubTeam = { id: string; name: string; color: string; playerCount: number };
export type HubPlayer = { id: string; name: string; position: string };

type TournamentHubScreenProps = {
  tournament: TournamentDetail;
  teams: readonly HubTeam[];
  unassigned: readonly HubPlayer[];
  rosterCount: number;
  hasFixtures: boolean;
  children?: React.ReactNode;
};

export function TournamentHubScreen({
  tournament,
  teams,
  unassigned,
  rosterCount,
  hasFixtures,
  children,
}: TournamentHubScreenProps): React.JSX.Element {
  const needsRoster = rosterCount === 0;
  const needsTeams = rosterCount > 0 && teams.length === 0;
  const needsFixtures = !hasFixtures && teams.length > 0;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pb-4">
      <PageHeader
        title={tournament.name}
        back={{ href: ADMIN_TOURNAMENTS_PATH, label: tournamentsCopy.backToTournaments }}
        action={
          <Link
            href={adminTournamentSettingsPath(tournament.id)}
            className="inline-flex size-11 items-center justify-center rounded-card border-2 border-line bg-surface"
            aria-label={tournamentsCopy.settingsLink}
          >
            <Icon icon={Settings} size="md" />
          </Link>
        }
      />
      <p className="text-xs font-bold text-muted uppercase">
        {tournamentsCopy.statuses[tournament.status]}
      </p>
      <HubSetupPrompts
        tournamentId={tournament.id}
        needsRoster={needsRoster}
        needsTeams={needsTeams}
        needsFixtures={needsFixtures}
      />
      <HubTeamList tournamentId={tournament.id} squadSize={tournament.squadSize} teams={teams} />
      <HubUnassignedList players={unassigned} />
      {children}
    </main>
  );
}
