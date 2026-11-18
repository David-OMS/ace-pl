import type { PlayerPosition } from "@/config/player-positions";

export type PricedPoolPlayer = {
  id: string;
  name: string;
  position: PlayerPosition;
  price: number;
};

/** Eligible players for a pitch/bench slot, highest price first. */
export function filterPoolForSlot<T extends PricedPoolPlayer>(
  pool: readonly T[],
  slot: { position: PlayerPosition; isBench: boolean },
  takenIds: ReadonlySet<string>,
): T[] {
  return pool
    .filter((player) => {
      if (takenIds.has(player.id)) return false;
      // Bench: any outfield. Starter slots stay position-locked while building.
      if (slot.isBench) return player.position !== "GK";
      return player.position === slot.position;
    })
    .sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
}
