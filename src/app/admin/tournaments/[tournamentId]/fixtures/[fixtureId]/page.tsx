import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth";
import { adminFixturePath } from "@/features/fixtures";
import {
  ensureMatchSquads,
  getMatchEntry,
  MatchEntryScreen,
  matchesCopy,
} from "@/features/matches";

export const metadata: Metadata = { title: matchesCopy.title };

export default async function MatchEntryPage({
  params,
}: PageProps<"/admin/tournaments/[tournamentId]/fixtures/[fixtureId]">): Promise<React.JSX.Element> {
  const { tournamentId, fixtureId } = await params;
  await requireAdmin(adminFixturePath(tournamentId, fixtureId));

  await ensureMatchSquads(fixtureId);
  const match = await getMatchEntry(fixtureId);
  if (!match || match.tournamentId !== tournamentId) notFound();

  return <MatchEntryScreen match={match} />;
}
