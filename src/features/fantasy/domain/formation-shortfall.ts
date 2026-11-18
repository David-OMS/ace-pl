import type { FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import { parseFormation } from "./parse-formation";

export type FormationShortfall = {
  position: Exclude<PlayerPosition, "GK">;
  have: number;
  need: number;
};

/** First position the squad is short for this formation, if any. */
export function formationShortfall(args: {
  formation: FantasyFormation;
  positions: readonly PlayerPosition[];
}): FormationShortfall | null {
  const parsed = parseFormation(args.formation);
  if (!parsed) return null;

  const counts: Record<PlayerPosition, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  for (const position of args.positions) {
    counts[position] += 1;
  }

  const needed = [
    { position: "DEF" as const, have: counts.DEF, need: parsed.def },
    { position: "MID" as const, have: counts.MID, need: parsed.mid },
    { position: "FWD" as const, have: counts.FWD, need: parsed.fwd },
  ];
  return needed.find((row) => row.have < row.need) ?? null;
}
