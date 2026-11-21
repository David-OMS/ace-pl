import "server-only";

import { FANTASY_PRICE_FLOOR, type FantasyRank } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type PricedPlayerAdminRow = {
  id: string;
  name: string;
  position: PlayerPosition;
  rank: FantasyRank;
  price: number;
};

/** All players with global fantasy prices for the admin prices screen. */
export async function listPricedPlayersForAdmin(): Promise<PricedPlayerAdminRow[]> {
  const supabase = await createSupabaseServerClient();
  const [players, prices] = await Promise.all([
    supabase.from("players").select("id, name, position").eq("is_active", true),
    supabase.from("fantasy_player_prices").select("player_id, rank, price"),
  ]);

  if (players.error) throw players.error;
  if (prices.error) throw prices.error;

  const priceByPlayer = new Map(
    (prices.data ?? []).map((row) => [
      row.player_id,
      { rank: row.rank as FantasyRank, price: Number(row.price) },
    ]),
  );

  return (players.data ?? [])
    .map((player) => {
      const priced = priceByPlayer.get(player.id);
      return {
        id: player.id,
        name: player.name,
        position: player.position as PlayerPosition,
        rank: priced?.rank ?? "C",
        price: priced?.price ?? FANTASY_PRICE_FLOOR,
      };
    })
    .sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
}
