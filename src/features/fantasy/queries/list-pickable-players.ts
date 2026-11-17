import "server-only";

import { FANTASY_PRICE_FLOOR, type FantasyRank } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { ensureDefaultRanks } from "./ensure-default-ranks";

export type PickablePlayer = {
  id: string;
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
  /** DB band only — never show to fans. */
  rank: FantasyRank;
  price: number;
};

export async function listPickablePlayers(tournamentId: string): Promise<PickablePlayer[]> {
  await ensureDefaultRanks(tournamentId);
  const supabase = await createSupabaseServerClient();

  const [roster, ranks] = await Promise.all([
    supabase
      .from("tournament_players")
      .select("player_id, players!inner(id, name, position, photo_path)")
      .eq("tournament_id", tournamentId),
    supabase
      .from("fantasy_player_ranks")
      .select("player_id, rank, price")
      .eq("tournament_id", tournamentId),
  ]);

  if (roster.error) throw roster.error;
  if (ranks.error) throw ranks.error;

  const rankByPlayer = new Map(
    (ranks.data ?? []).map((r) => [
      r.player_id,
      { rank: r.rank as FantasyRank, price: Number(r.price) },
    ]),
  );

  return (roster.data ?? [])
    .map((row) => {
      const player = row.players;
      const ranked = rankByPlayer.get(player.id);
      return {
        id: player.id,
        name: player.name,
        position: player.position,
        photoUrl: playerPhotoUrl(player.photo_path),
        rank: ranked?.rank ?? "C",
        price: ranked?.price ?? FANTASY_PRICE_FLOOR,
      };
    })
    .sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
}
