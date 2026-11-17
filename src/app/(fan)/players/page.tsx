import type { Metadata } from "next";

import {
  fanPlayersCopy,
  FanPlayersListScreen,
  listFanPlayers,
  loadFanLeaderboardBoards,
} from "@/features/fan-players";

export const metadata: Metadata = { title: fanPlayersCopy.title };

type PlayersPageProps = {
  searchParams: Promise<{ view?: string }>;
};

export default async function PlayersPage({
  searchParams,
}: PlayersPageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  const [players, boards] = await Promise.all([listFanPlayers(), loadFanLeaderboardBoards()]);

  return (
    <FanPlayersListScreen
      players={players}
      boards={boards}
      initialView={params.view === "stats" ? "stats" : "roster"}
    />
  );
}
