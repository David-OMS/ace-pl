import type { PlayerPosition } from "@/config/player-positions";
import type { LeaderboardMetric } from "@/features/leaderboards";

export type HomeStatEntry = {
  playerId: string;
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
  value: number;
};

export type HomeStatBoard = {
  metric: LeaderboardMetric;
  entries: HomeStatEntry[];
};
