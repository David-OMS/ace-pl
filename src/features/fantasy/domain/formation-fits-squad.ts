import type { FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import { parseFormation } from "./parse-formation";

/** True when the squad has enough of each position to fill the formation's starters. */
export function formationFitsSquad(args: {
  formation: FantasyFormation;
  positions: readonly PlayerPosition[];
}): boolean {
  const parsed = parseFormation(args.formation);
  if (!parsed) return false;

  const counts: Record<PlayerPosition, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  for (const position of args.positions) {
    counts[position] += 1;
  }

  return (
    counts.GK >= 1 &&
    counts.DEF >= parsed.def &&
    counts.MID >= parsed.mid &&
    counts.FWD >= parsed.fwd
  );
}
