import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth";
import { listPlayers } from "@/features/players";
import { getTeamSetup } from "@/features/teams/server";
import {
  ADMIN_TOURNAMENTS_PATH,
  getTournament,
  TournamentPlayersScreen,
  tournamentsCopy,
} from "@/features/tournaments";

export const metadata: Metadata = { title: tournamentsCopy.workspace.rosterTitle };

export default async function TournamentPlayersPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}): Promise<React.JSX.Element> {
  const { tournamentId } = await params;
  await requireAdmin(`${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/players`);

  const tournament = await getTournament(tournamentId);
  if (!tournament) notFound();

  const sharedKeeperIds = tournament.sharedKeepers.map((keeper) => keeper.playerId);
  const [players, setup] = await Promise.all([
    listPlayers(),
    getTeamSetup({
      tournamentId: tournament.id,
      squadSize: tournament.squadSize,
      keeperMode: tournament.keeperMode,
      sharedKeeperIds,
      rosterPlayerIds: tournament.rosterPlayerIds,
    }),
  ]);

  return (
    <TournamentPlayersScreen
      tournament={tournament}
      players={players.map((player) => ({
        id: player.id,
        name: player.name,
        position: player.position,
      }))}
      next={setup.squads.length === 0 ? "teams" : "hub"}
    />
  );
}
