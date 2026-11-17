import type { PlayerPosition } from "@/config/player-positions";

export type PricedPoolPlayer = {
  id: string;
  name: string;
  position: PlayerPosition;
  price: number;
};

/** Players you can bring in for an outgoing pick (budget = bank + out sell price). */
export function affordableReplacements<T extends PricedPoolPlayer>(args: {
  pool: readonly T[];
  ownedIds: ReadonlySet<string>;
  outPosition: PlayerPosition;
  isBench: boolean;
  maxPrice: number;
}): T[] {
  return args.pool
    .filter((player) => {
      if (args.ownedIds.has(player.id)) return false;
      if (player.price > args.maxPrice) return false;
      if (args.isBench) return player.position !== "GK";
      return player.position === args.outPosition;
    })
    .sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
}
