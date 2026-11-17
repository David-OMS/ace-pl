import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth";
import {
  ADMIN_TOURNAMENTS_PATH,
  getTournament,
  TournamentSettingsScreen,
  tournamentsCopy,
} from "@/features/tournaments";

export const metadata: Metadata = { title: tournamentsCopy.settingsTitle };

export default async function TournamentSettingsPage({
  params,
}: PageProps<"/admin/tournaments/[tournamentId]/settings">): Promise<React.JSX.Element> {
  const { tournamentId } = await params;
  await requireAdmin(`${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/settings`);

  const tournament = await getTournament(tournamentId);
  if (!tournament) notFound();

  return <TournamentSettingsScreen tournament={tournament} />;
}
