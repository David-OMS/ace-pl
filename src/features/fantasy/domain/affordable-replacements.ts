import type { PlayerPosition } from "@/config/player-positions";

export type PricedPoolPlayer = {
  id: string;
  name: string;
  position: PlayerPosition;
  price: number;
};

type AffordableReplacementsArgs<T extends PricedPoolPlayer> = {
  pool: readonly T[];
  ownedIds: ReadonlySet<string>;
  outPosition: PlayerPosition;
  maxPrice: number;
  /** After first deadline, starter transfers must match position. */
  samePositionOnly: boolean;
  /** Bench never takes a second GK. */
  excludeGoalkeepers: boolean;
};

/** Players you can bring in (budget = bank + out sell price). */
export function affordableReplacements<T extends PricedPoolPlayer>(
  args: AffordableReplacementsArgs<T>,
): T[] {
  return args.pool
    .filter((player) => {
      if (args.ownedIds.has(player.id)) return false;
      if (player.price > args.maxPrice) return false;
      if (args.samePositionOnly) return player.position === args.outPosition;
      if (args.excludeGoalkeepers && player.position === "GK") return false;
      return true;
    })
    .sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
}
