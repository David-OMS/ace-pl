import "server-only";

import type { FantasyRank } from "@/config/fantasy";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

export async function loadFantasyPrices(
  playerIds: readonly string[],
): Promise<{ player_id: string; rank: FantasyRank; price: number }[]> {
  const supabase = await createSupabaseServerClient();
  const unique = [...new Set(playerIds)];
  const { data, error } = await supabase
    .from("fantasy_player_prices")
    .select("player_id, rank, price")
    .in("player_id", unique.length > 0 ? unique : [EMPTY_UUID]);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    player_id: row.player_id,
    rank: row.rank as FantasyRank,
    price: Number(row.price),
  }));
}
