import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth";
import {
  ADMIN_TOURNAMENTS_PATH,
  getTournament,
  SharedKeepersPanel,
  TournamentHubScreen,
  tournamentsCopy,
} from "@/features/tournaments";
import { loadTournamentHub } from "@/features/tournaments/server";

export const metadata: Metadata = { title: tournamentsCopy.adminTitle };

export default async function TournamentHubPage({
  params,
}: PageProps<"/admin/tournaments/[tournamentId]">): Promise<React.JSX.Element> {
  const { tournamentId } = await params;
  await requireAdmin(`${ADMIN_TOURNAMENTS_PATH}/${tournamentId}`);

  const tournament = await getTournament(tournamentId);
  if (!tournament) notFound();

  const hub = await loadTournamentHub(tournament);

  return (
    <TournamentHubScreen
      tournament={tournament}
      teams={hub.teams}
      unassigned={hub.unassigned}
      rosterCount={tournament.rosterPlayerIds.length}
      hasFixtures={hub.hasFixtures}
    >
      {tournament.keeperMode === "shared" && tournament.rosterPlayerIds.length > 0 ? (
        <SharedKeepersPanel
          tournamentId={tournament.id}
          keepers={tournament.sharedKeepers}
          candidates={hub.keeperCandidates}
        />
      ) : null}
    </TournamentHubScreen>
  );
}
