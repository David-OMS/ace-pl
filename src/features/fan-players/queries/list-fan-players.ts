import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { sortPlayers } from "@/features/players";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type { FanPlayerListItem } from "../domain/filter-fan-players";

export async function listFanPlayers(): Promise<FanPlayerListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, name, position, photo_path")
    .eq("is_active", true);

  if (error) throw error;

  const rows = sortPlayers(
    (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      position: row.position as PlayerPosition,
      isActive: true,
      isClaimed: false,
    })),
  );

  return rows.map((row) => {
    const raw = data?.find((p) => p.id === row.id);
    return {
      id: row.id,
      name: row.name,
      position: row.position,
      photoUrl: playerPhotoUrl(raw?.photo_path),
    };
  });
}
