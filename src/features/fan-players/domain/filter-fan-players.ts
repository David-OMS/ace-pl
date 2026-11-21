import type { PlayerPosition } from "@/config/player-positions";

export type FanPlayerListItem = {
  id: string;
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
  teamName: string | null;
  teamColor: string | null;
};

export function filterFanPlayers(
  players: readonly FanPlayerListItem[],
  query: string,
): FanPlayerListItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...players];
  return players.filter(
    (player) =>
      player.name.toLowerCase().includes(needle) ||
      player.position.toLowerCase().includes(needle) ||
      (player.teamName?.toLowerCase().includes(needle) ?? false),
  );
}
