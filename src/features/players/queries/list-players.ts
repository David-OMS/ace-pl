import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { sortPlayers } from "../domain/sort-players";

export type PlayerSummary = {
  id: string;
  name: string;
  position: PlayerPosition;
  isActive: boolean;
  isClaimed: boolean;
};

export async function listPlayers(): Promise<PlayerSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, name, position, is_active, profile_id");

  if (error) throw error;
  return sortPlayers(
    data.map((row) => ({
      id: row.id,
      name: row.name,
      position: row.position,
      isActive: row.is_active,
      isClaimed: row.profile_id !== null,
    })),
  );
}
