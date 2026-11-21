import type { Metadata } from "next";

import { getCurrentUser } from "@/features/auth";
import {
  FantasyEmptyCta,
  FantasyTeamScreen,
  FantasyTheme,
  fantasyCopy,
  getMyFantasyTeam,
  getTransferWindow,
  listFantasyGameDays,
  listFantasyLeaderboard,
  listGameDayPointSummaries,
  listGameDayTopPlayers,
  listMyFantasyTransfers,
  listTeamGameweeks,
} from "@/features/fantasy";
import { resolveFanTournament } from "@/features/home";

export const metadata: Metadata = { title: fantasyCopy.title };

type FantasyPageProps = {
  searchParams: Promise<{ gw?: string }>;
};

export default async function FantasyPage({
  searchParams,
}: FantasyPageProps): Promise<React.JSX.Element> {
  // Request time for cutting off future gameweeks in the GW browser.
  // eslint-disable-next-line react-hooks/purity -- server request clock
  const nowMs = Date.now();
  const user = await getCurrentUser();
  const tournament = await resolveFanTournament();
  const params = await searchParams;
  const selectedGameDayId = params.gw ?? null;

  if (!user) return emptyCta("signed_out");
  if (!tournament) return emptyCta("no_tournament");

  const [team, leaderboard, transferWindow, gameDays, summaries] = await Promise.all([
    getMyFantasyTeam({ tournamentId: tournament.id, userId: user.id }),
    listFantasyLeaderboard(tournament.id),
    getTransferWindow(tournament.id),
    listFantasyGameDays(tournament.id),
    listGameDayPointSummaries(tournament.id),
  ]);
  if (!team) return emptyCta("no_team");

  const myRank = leaderboard.find((row) => row.teamId === team.id)?.rank ?? leaderboard.length + 1;
  const [gameweeks, transfers] = await Promise.all([
    listTeamGameweeks({ teamId: team.id, tournamentId: tournament.id }),
    listMyFantasyTransfers(team.id),
  ]);
  const topPlayers = await loadInitialTopPlayers(selectedGameDayId, gameweeks);

  return (
    <FantasyTeamScreen
      team={team}
      ownerName={user.displayName}
      leaderboard={leaderboard}
      userId={user.id}
      myRank={myRank}
      transferWindow={transferWindow}
      gameDays={gameDays}
      gameweeks={gameweeks}
      selectedGameDayId={selectedGameDayId}
      topPlayers={topPlayers}
      summaries={summaries}
      transfers={transfers}
      nowMs={nowMs}
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

async function loadInitialTopPlayers(
  selectedGameDayId: string | null,
  gameweeks: readonly { gameDayId: string }[],
) {
  if (!selectedGameDayId) return [];
  if (!gameweeks.some((week) => week.gameDayId === selectedGameDayId)) return [];
  return listGameDayTopPlayers(selectedGameDayId);
}
