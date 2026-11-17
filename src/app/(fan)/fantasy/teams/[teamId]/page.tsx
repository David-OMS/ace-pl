import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  FantasyPublicTeamScreen,
  FantasyTheme,
  fantasyCopy,
  getFantasyTeamById,
  getFantasyTeamGameweek,
  listFantasyGameDays,
  syncTournamentFantasyScores,
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
  const team = await getFantasyTeamById(teamId);
  if (!team) notFound();

  await syncTournamentFantasyScores(team.tournamentId);

  const gameDays = await listFantasyGameDays(team.tournamentId);
  const selectedGameDayId = gw ?? null;
  const gameweek =
    selectedGameDayId !== null && selectedGameDayId !== undefined
      ? await getFantasyTeamGameweek({
          teamId: team.id,
          gameDayId: selectedGameDayId,
          tournamentId: team.tournamentId,
        })
      : null;

  return (
    <FantasyTheme>
      <FantasyPublicTeamScreen
        team={team}
        gameDays={gameDays}
        selectedGameDayId={selectedGameDayId}
        gameweek={gameweek}
      />
    </FantasyTheme>
  );
}
