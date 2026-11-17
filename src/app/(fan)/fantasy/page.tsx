import type { Metadata } from "next";

import { getCurrentUser } from "@/features/auth";
import {
  FantasyEmptyCta,
  FantasyTeamScreen,
  FantasyTheme,
  fantasyCopy,
  getFantasyTeamGameweek,
  getMyFantasyTeam,
  isUnlimitedTransferPeriod,
  listFantasyGameDays,
  listFantasyLeaderboard,
  listGameDayTopPlayers,
  listMyFantasyTransfers,
} from "@/features/fantasy";
import { resolveFanTournament } from "@/features/home";

export const metadata: Metadata = { title: fantasyCopy.title };

type FantasyPageProps = {
  searchParams: Promise<{ gw?: string }>;
};

export default async function FantasyPage({
  searchParams,
}: FantasyPageProps): Promise<React.JSX.Element> {
  const user = await getCurrentUser();
  const tournament = await resolveFanTournament();
  const params = await searchParams;
  const selectedGameDayId = params.gw ?? null;

  if (!user) return emptyCta("signed_out");
  if (!tournament) return emptyCta("no_tournament");

  const [team, leaderboard, beforeFirstDeadline, gameDays] = await Promise.all([
    getMyFantasyTeam({ tournamentId: tournament.id, userId: user.id }),
    listFantasyLeaderboard(tournament.id),
    isUnlimitedTransferPeriod(tournament.id),
    listFantasyGameDays(tournament.id),
  ]);
  if (!team) return emptyCta("no_team");

  const myRank = leaderboard.find((row) => row.teamId === team.id)?.rank ?? leaderboard.length + 1;
  const [{ gameweek, topPlayers }, transfers] = await Promise.all([
    loadGwViews({
      teamId: team.id,
      tournamentId: tournament.id,
      selectedGameDayId,
    }),
    listMyFantasyTransfers(team.id),
  ]);

  return (
    <FantasyTeamScreen
      team={team}
      leaderboard={leaderboard}
      userId={user.id}
      myRank={myRank}
      beforeFirstDeadline={beforeFirstDeadline}
      gameDays={gameDays}
      selectedGameDayId={selectedGameDayId}
      gameweek={gameweek}
      topPlayers={topPlayers}
      transfers={transfers}
    />
  );
}

function emptyCta(kind: "signed_out" | "no_tournament" | "no_team"): React.JSX.Element {
  return (
    <FantasyTheme className="px-4 py-4">
      <FantasyEmptyCta kind={kind} />
    </FantasyTheme>
  );
}

async function loadGwViews(args: {
  teamId: string;
  tournamentId: string;
  selectedGameDayId: string | null;
}) {
  const { teamId, tournamentId, selectedGameDayId } = args;
  if (selectedGameDayId === null) {
    return { gameweek: null, topPlayers: [] as const };
  }
  const [gameweek, topPlayers] = await Promise.all([
    getFantasyTeamGameweek({ teamId, gameDayId: selectedGameDayId, tournamentId }),
    listGameDayTopPlayers(selectedGameDayId),
  ]);
  return { gameweek, topPlayers };
}
