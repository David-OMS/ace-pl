import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { resolveFanTournament } from "@/features/home";
import type { LeaderboardMetric } from "@/features/leaderboards";

import { buildLeaderboardBoards, type FanLeaderboardRow } from "./build-fan-player-stats";
import { loadFanStatScope } from "./load-fan-stat-scope";

export type FanLeaderboardBoards = Record<LeaderboardMetric, FanLeaderboardRow[]>;

export async function loadFanLeaderboardBoards(): Promise<FanLeaderboardBoards> {
  const tournament = await resolveFanTournament();
  const [scope, playersResult] = await Promise.all([
    loadFanStatScope(tournament?.id ?? null),
    loadRosterMeta(),
  ]);
  return buildLeaderboardBoards(scope.totals, playersResult);
}

async function loadRosterMeta() {
  const supabase = await createSupabaseServerClient();
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
