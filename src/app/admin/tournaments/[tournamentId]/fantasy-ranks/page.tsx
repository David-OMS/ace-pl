import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCurrentUser, requireAdmin } from "@/features/auth";
import { FantasyRanksAdminScreen, fantasyCopy, listPickablePlayers } from "@/features/fantasy";
import { isFantasyPriceAdmin } from "@/features/fantasy/server/is-fantasy-price-admin";
import { ADMIN_TOURNAMENTS_PATH, adminTournamentPath, getTournament } from "@/features/tournaments";

export const metadata: Metadata = { title: fantasyCopy.adminRanksTitle };

export default async function FantasyRanksAdminPage({
  params,
}: PageProps<"/admin/tournaments/[tournamentId]/fantasy-ranks">): Promise<React.JSX.Element> {
  const { tournamentId } = await params;
  await requireAdmin(`${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/fantasy-ranks`);
  const user = await getCurrentUser();
  if (!user || !isFantasyPriceAdmin(user.id)) notFound();

  const tournament = await getTournament(tournamentId);
  if (!tournament) notFound();

  const players = await listPickablePlayers(tournament.id);

  return (
    <FantasyRanksAdminScreen
      tournamentId={tournament.id}
      tournamentName={tournament.name}
      backHref={adminTournamentPath(tournament.id)}
      players={players}
    />
  );
}
