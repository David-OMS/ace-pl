import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  fanFixturesCopy,
  FanFixtureDetailScreen,
  loadBorrowTeamNames,
} from "@/features/fan-fixtures";
import { getMatchEntry } from "@/features/matches";

export const metadata: Metadata = { title: fanFixturesCopy.detailTitle };

export default async function FanFixtureDetailPage({
  params,
}: PageProps<"/fixtures/[fixtureId]">): Promise<React.JSX.Element> {
  const { fixtureId } = await params;
  const match = await getMatchEntry(fixtureId);
  if (!match) notFound();

  const playerIds = [...match.homePlayers, ...match.awayPlayers].map((row) => row.playerId);
  const borrowFrom = await loadBorrowTeamNames(match.tournamentId, playerIds);

  return <FanFixtureDetailScreen match={match} borrowFrom={borrowFrom} />;
}
