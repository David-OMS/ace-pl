import type { PlayerPosition } from "@/config/player-positions";

import { buildLeaderboardBoards, buildPlayerStatSnapshot } from "./build-fan-player-stats";
import type { AssembledStats } from "./assemble-stat-totals";
import type { FanPlayerDetail } from "./fan-player-detail-model";

type PlayerRow = {
  id: string;
  name: string;
  position: PlayerPosition;
  photo_path: string | null;
};

type FanRosterRow = {
  id: string;
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
};

export function mapFanPlayerDetail(input: {
  player: PlayerRow;
  photoUrl: string | null;
  priceMillions: number;
  tournamentName: string | null;
  tournamentScope: AssembledStats;
  allTimeScope: AssembledStats;
  roster: FanRosterRow[];
}): FanPlayerDetail {
  const position = input.player.position;
  const tournamentRow = input.tournamentScope.totals.find((r) => r.playerId === input.player.id);
  const allRow = input.allTimeScope.totals.find((r) => r.playerId === input.player.id);

  return {
    id: input.player.id,
    name: input.player.name,
    position,
    photoUrl: input.photoUrl,
    priceMillions: input.priceMillions,
    tournamentName: input.tournamentName,
    tournament: buildPlayerStatSnapshot(
      position,
      tournamentRow,
      input.tournamentScope.goalsConceded.get(input.player.id) ?? 0,
    ),
    allTime: buildPlayerStatSnapshot(
      position,
      allRow,
      input.allTimeScope.goalsConceded.get(input.player.id) ?? 0,
    ),
    leaderboardTournament: buildLeaderboardBoards(input.tournamentScope.totals, input.roster),
    leaderboardAllTime: buildLeaderboardBoards(input.allTimeScope.totals, input.roster),
  };
}
