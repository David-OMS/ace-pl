import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth";
import { CreateTeamScreen, teamsCopy } from "@/features/teams";
import { getTeamSetup, teamPoolPlayers } from "@/features/teams/server";
import { ADMIN_TOURNAMENTS_PATH, adminTournamentPath, getTournament } from "@/features/tournaments";

export const metadata: Metadata = { title: teamsCopy.createTitle };

export default async function NewTeamPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}): Promise<React.JSX.Element> {
  const { tournamentId } = await params;
  await requireAdmin(`${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/teams/new`);

  const tournament = await getTournament(tournamentId);
  if (!tournament) notFound();

  const sharedKeeperIds = tournament.sharedKeepers.map((keeper) => keeper.playerId);
  const setup = await getTeamSetup({
    tournamentId: tournament.id,
    squadSize: tournament.squadSize,
    keeperMode: tournament.keeperMode,
    sharedKeeperIds,
    rosterPlayerIds: tournament.rosterPlayerIds,
  });

  return (
    <CreateTeamScreen
      tournamentId={tournament.id}
      tournamentName={tournament.name}
      squadSize={tournament.squadSize}
      availablePlayers={teamPoolPlayers(setup.unassigned, tournament.keeperMode).map((player) => ({
        id: player.id,
        name: player.name,
        position: player.position,
      }))}
      backHref={adminTournamentPath(tournament.id)}
    />
  );
}
