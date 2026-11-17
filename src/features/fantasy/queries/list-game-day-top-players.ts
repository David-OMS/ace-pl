import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { loadGameDayPlayerPoints } from "./load-game-day-player-points";

export type GameDayTopPlayer = {
  playerId: string;
  name: string;
  points: number;
};

const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

/** Real-player fantasy points for a Friday, highest first. */
export async function listGameDayTopPlayers(gameDayId: string): Promise<GameDayTopPlayer[]> {
  const dayPoints = await loadGameDayPlayerPoints(gameDayId);
  const scored = dayPoints
    .filter((row) => row.played || row.rawPoints !== 0)
    .slice()
    .sort((a, b) => b.rawPoints - a.rawPoints || a.playerId.localeCompare(b.playerId));

  const ids = scored.map((row) => row.playerId);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, name")
    .in("id", ids.length > 0 ? ids : [EMPTY_UUID]);
  if (error) throw error;

  const nameById = new Map((data ?? []).map((row) => [row.id, row.name]));
  return scored.map((row) => ({
    playerId: row.playerId,
    name: nameById.get(row.playerId) ?? "?",
    points: row.rawPoints,
  }));
}
