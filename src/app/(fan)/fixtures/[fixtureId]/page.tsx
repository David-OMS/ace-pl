import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  fanFixturesCopy,
  FanFixtureDetailScreen,
  getFanFixtureDetail,
  loadBorrowTeamNames,
} from "@/features/fan-fixtures";

export const metadata: Metadata = { title: fanFixturesCopy.detailTitle };

export default async function FanFixtureDetailPage({
  params,
}: PageProps<"/fixtures/[fixtureId]">): Promise<React.JSX.Element> {
  const { fixtureId } = await params;
  const detail = await getFanFixtureDetail(fixtureId);
  if (!detail) notFound();

  const playerIds = [...detail.match.homePlayers, ...detail.match.awayPlayers].map(
    (row) => row.playerId,
  );
  const borrowFrom = await loadBorrowTeamNames(detail.match.tournamentId, playerIds);

  return <FanFixtureDetailScreen detail={detail} borrowFrom={borrowFrom} />;
}
