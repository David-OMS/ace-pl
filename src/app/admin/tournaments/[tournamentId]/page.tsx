import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin, getCurrentUser } from "@/features/auth";
import { canEditFantasyPrices } from "@/features/fantasy";
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

  const [hub, user] = await Promise.all([loadTournamentHub(tournament), getCurrentUser()]);

  return (
    <TournamentHubScreen
      tournament={tournament}
      teams={hub.teams}
      unassigned={hub.unassigned}
      rosterCount={tournament.rosterPlayerIds.length}
      hasFixtures={hub.hasFixtures}
      showPrices={user !== null && canEditFantasyPrices(user.id)}
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
