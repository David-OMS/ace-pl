import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth";
import {
  FantasyEmptyCta,
  FantasyLeaderboardScreen,
  FantasyTheme,
  fantasyCopy,
  FANTASY_CREATE_PATH,
  getMyFantasyTeam,
  listFantasyLeaderboard,
  syncTournamentFantasyScores,
} from "@/features/fantasy";
import { resolveFanTournament } from "@/features/home";

export const metadata: Metadata = { title: fantasyCopy.leaderboard };

export default async function FantasyLeaderboardPage(): Promise<React.JSX.Element> {
  const user = await getCurrentUser();
  const tournament = await resolveFanTournament();

  if (!tournament) {
    return (
      <FantasyTheme className="px-4 py-4">
        <FantasyEmptyCta kind="no_tournament" />
      </FantasyTheme>
    );
  }

  if (!user) {
    return (
      <FantasyTheme className="px-4 py-4">
        <FantasyEmptyCta kind="signed_out" />
      </FantasyTheme>
    );
  }

  await syncTournamentFantasyScores(tournament.id);

  const team = await getMyFantasyTeam({
    tournamentId: tournament.id,
    userId: user.id,
  });
  if (!team) redirect(FANTASY_CREATE_PATH);

  const rows = await listFantasyLeaderboard(tournament.id);

  return <FantasyLeaderboardScreen rows={rows} highlightUserId={user.id} />;
}
