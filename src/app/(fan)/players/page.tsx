import type { Metadata } from "next";

import { getCurrentUser } from "@/features/auth";
import {
  fanPlayersCopy,
  FanPlayersListScreen,
  getFanPlayerDetail,
  listFanPlayers,
  loadFanLeaderboardBoards,
} from "@/features/fan-players";
import { getMyLinkedPlayer } from "@/features/players";

export const metadata: Metadata = { title: fanPlayersCopy.title };

type PlayersPageProps = {
  searchParams: Promise<{ view?: string }>;
};

export default async function PlayersPage({
  searchParams,
}: PlayersPageProps): Promise<React.JSX.Element> {
  const [params, user, players, boards] = await Promise.all([
    searchParams,
    getCurrentUser(),
    listFanPlayers(),
    loadFanLeaderboardBoards(),
  ]);
  const linked = user ? await getMyLinkedPlayer(user.id) : null;
  const detail = linked ? await getFanPlayerDetail(linked.id) : null;

  return (
    <FanPlayersListScreen
      players={players}
      boards={boards}
      initialView={params.view === "stats" ? "stats" : "roster"}
      me={
        detail
          ? {
              id: detail.id,
              name: detail.name,
              position: detail.position,
              photoUrl: detail.photoUrl,
              priceMillions: detail.priceMillions,
              teamName: detail.teamName,
              stats: detail.tournament,
            }
          : null
      }
    />
  );
}
