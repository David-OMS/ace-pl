import "server-only";

import type { PlayerPosition } from "@/config/player-positions";
import { sortPlayers } from "@/features/players";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import type { FanPlayerListItem } from "../domain/filter-fan-players";

export function listFanPlayers(): Promise<FanPlayerListItem[]> {
  return fanPublicCache("fan-players", readFanPlayers);
}

async function readFanPlayers(): Promise<FanPlayerListItem[]> {
  const supabase = createPublicSupabaseClient();
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
