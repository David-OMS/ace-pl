import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth";
import { TeamDetailScreen, teamsCopy } from "@/features/teams";
import { getTeamSetup, teamPoolPlayers } from "@/features/teams/server";
import { ADMIN_TOURNAMENTS_PATH, adminTournamentPath, getTournament } from "@/features/tournaments";

export const metadata: Metadata = { title: teamsCopy.title };

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ tournamentId: string; teamId: string }>;
}): Promise<React.JSX.Element> {
  const { tournamentId, teamId } = await params;
  await requireAdmin(`${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/teams/${teamId}`);

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

  const squad = setup.squads.find((item) => item.teamId === teamId);
  if (!squad) notFound();

  return (
    <TeamDetailScreen
      tournamentId={tournament.id}
      tournamentName={tournament.name}
      teamId={squad.teamId}
      teamName={squad.teamName}
      teamColor={squad.color}
      squadSize={tournament.squadSize}
      players={squad.players.map((player) => ({
        id: player.id,
        name: player.name,
        position: player.position,
        isCaptain: player.isCaptain,
      }))}
      availablePlayers={teamPoolPlayers(setup.unassigned, tournament.keeperMode).map((player) => ({
        id: player.id,
        name: player.name,
        position: player.position,
      }))}
      backHref={adminTournamentPath(tournament.id)}
    />
  );
}
