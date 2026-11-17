import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";
import { resolveFanTournament } from "@/features/home";
import type { LeaderboardMetric } from "@/features/leaderboards";

import { buildLeaderboardBoards, type FanLeaderboardRow } from "./build-fan-player-stats";
import { loadFanStatScope } from "./load-fan-stat-scope";

export type FanLeaderboardBoards = Record<LeaderboardMetric, FanLeaderboardRow[]>;

export function loadFanLeaderboardBoards(): Promise<FanLeaderboardBoards> {
  return fanPublicCache("fan-leaderboards", readFanLeaderboardBoards);
}

async function readFanLeaderboardBoards(): Promise<FanLeaderboardBoards> {
  const tournament = await resolveFanTournament();
  const [scope, playersResult] = await Promise.all([
    loadFanStatScope(tournament?.id ?? null),
    loadRosterMeta(),
  ]);
  return buildLeaderboardBoards(scope.totals, playersResult);
}

async function loadRosterMeta() {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, name, position, photo_path")
    .eq("is_active", true);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    position: row.position as PlayerPosition,
    photoUrl: playerPhotoUrl(row.photo_path),
  }));
}
