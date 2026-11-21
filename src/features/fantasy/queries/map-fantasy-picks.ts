import { FANTASY_PRICE_FLOOR, type FantasyRank } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";
import { playerPhotoUrl } from "@/lib/players/player-photo-url";

import type { FantasyPickView } from "./get-my-fantasy-team";

type PickRow = {
  player_id: string;
  slot: number;
  is_bench: boolean;
  is_captain: boolean;
  is_vice: boolean;
  players: {
    id: string;
    name: string;
    position: PlayerPosition;
    photo_path: string | null;
  };
};

type RankRow = { player_id: string; rank: FantasyRank; price: number };
type ClubRow = { player_id: string; clubTeamId: string; clubName: string };

export function mapFantasyPicks(
  pickRows: readonly PickRow[],
  ranks: readonly RankRow[],
  clubs: readonly ClubRow[] = [],
): FantasyPickView[] {
  const rankByPlayer = new Map(
    ranks.map((r) => [r.player_id, { rank: r.rank, price: Number(r.price) }]),
  );
  const clubByPlayer = new Map(clubs.map((c) => [c.player_id, c]));

  return pickRows.map((row) => {
    const player = row.players;
    const ranked = rankByPlayer.get(player.id);
    const club = clubByPlayer.get(player.id);
    return {
      playerId: player.id,
      name: player.name,
      position: player.position,
      photoUrl: playerPhotoUrl(player.photo_path),
      rank: ranked?.rank ?? "C",
      price: ranked?.price ?? FANTASY_PRICE_FLOOR,
      slot: row.slot,
      isBench: row.is_bench,
      isCaptain: row.is_captain,
      isVice: row.is_vice,
      clubTeamId: club?.clubTeamId ?? null,
      clubName: club?.clubName ?? null,
    };
  });
}
