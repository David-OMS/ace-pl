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
  clubTeamId: string | null;
  clubName: string | null;
};

export async function listPickablePlayers(tournamentId: string): Promise<PickablePlayer[]> {
  await ensureDefaultRanks(tournamentId);
  const supabase = await createSupabaseServerClient();

  const [roster, prices, memberships] = await Promise.all([
    supabase
      .from("tournament_players")
      .select("player_id, players!inner(id, name, position, photo_path)")
      .eq("tournament_id", tournamentId),
    supabase.from("fantasy_player_prices").select("player_id, rank, price"),
    supabase
      .from("team_memberships")
      .select("player_id, team_id, teams!inner(id, name)")
      .eq("tournament_id", tournamentId),
  ]);

  if (roster.error) throw roster.error;
  if (prices.error) throw prices.error;
  if (memberships.error) throw memberships.error;

  const priceByPlayer = new Map(
    (prices.data ?? []).map((r) => [
      r.player_id,
      { rank: r.rank as FantasyRank, price: Number(r.price) },
    ]),
  );
  const clubByPlayer = new Map(
    (memberships.data ?? []).map((row) => [
      row.player_id,
      { clubTeamId: row.team_id as string, clubName: row.teams.name as string },
    ]),
  );

  return (roster.data ?? [])
    .map((row) => {
      const player = row.players;
      const priced = priceByPlayer.get(player.id);
      const club = clubByPlayer.get(player.id);
      return {
        id: player.id,
        name: player.name,
        position: player.position,
        photoUrl: playerPhotoUrl(player.photo_path),
        rank: priced?.rank ?? "C",
        price: priced?.price ?? FANTASY_PRICE_FLOOR,
        clubTeamId: club?.clubTeamId ?? null,
        clubName: club?.clubName ?? null,
      };
    })
    .sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
}
