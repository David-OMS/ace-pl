import type { PlayerPosition } from "@/config/player-positions";
import type { LeaderboardMetric } from "@/features/leaderboards";

import type { FanLeaderboardRow, FanPlayerStatSnapshot } from "./build-fan-player-stats";

export type FanPlayerDetail = {
  id: string;
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
  priceMillions: number;
  /** Club in the current fan tournament; null if unassigned. */
  teamName: string | null;
  teamColor: string | null;
  tournamentName: string | null;
  tournament: FanPlayerStatSnapshot;
  allTime: FanPlayerStatSnapshot;
  leaderboardTournament: Record<LeaderboardMetric, FanLeaderboardRow[]>;
  leaderboardAllTime: Record<LeaderboardMetric, FanLeaderboardRow[]>;
};
