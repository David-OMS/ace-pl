import { PLAYER_POSITIONS, type PlayerPosition } from "@/config/player-positions";

type SortablePlayer = {
  name: string;
  position: PlayerPosition;
  /** Missing means treat as active for ordering. */
  isActive?: boolean;
};

/** Active players first, then by pitch position (GK to FWD), then alphabetically. */
export function sortPlayers<T extends SortablePlayer>(players: readonly T[]): T[] {
  return [...players].sort(
    (a, b) =>
      Number(b.isActive !== false) - Number(a.isActive !== false) ||
      PLAYER_POSITIONS.indexOf(a.position) - PLAYER_POSITIONS.indexOf(b.position) ||
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}
