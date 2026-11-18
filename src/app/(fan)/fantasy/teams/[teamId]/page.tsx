import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth";
import {
  FantasyPublicTeamScreen,
  FantasyTheme,
  fantasyCopy,
  FANTASY_PATH,
  getFantasyTeamPublicHeader,
  listFantasyGameDays,
  listGameDayTopPlayers,
  listTeamGameweeks,
} from "@/features/fantasy";

export const metadata: Metadata = { title: fantasyCopy.viewSquad };

type PublicTeamPageProps = {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ gw?: string }>;
};

export default async function FantasyPublicTeamPage({
  params,
  searchParams,
}: PublicTeamPageProps): Promise<React.JSX.Element> {
  const { teamId } = await params;
  const { gw } = await searchParams;
  const team = await getFantasyTeamPublicHeader(teamId);
  if (!team) notFound();

  const user = await getCurrentUser();
  if (user?.id === team.userId) redirect(FANTASY_PATH);

  const [gameDays, gameweeks] = await Promise.all([
    listFantasyGameDays(team.tournamentId),
    listTeamGameweeks({ teamId: team.id, tournamentId: team.tournamentId }),
  ]);
  const selectedGameDayId = gw ?? null;
  const topPlayers =
    selectedGameDayId && gameweeks.some((week) => week.gameDayId === selectedGameDayId)
      ? await listGameDayTopPlayers(selectedGameDayId)
      : [];

  return (
    <FantasyTheme>
      <FantasyPublicTeamScreen
        team={team}
        gameDays={gameDays}
        gameweeks={gameweeks}
        selectedGameDayId={selectedGameDayId}
        topPlayers={topPlayers}
      />
    </FantasyTheme>
  );
}
