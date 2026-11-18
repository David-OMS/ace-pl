import type { FantasyFormation } from "@/config/fantasy";
import type { PlayerPosition } from "@/config/player-positions";

import { fantasyCopy } from "../copy";
import { formationShortfall } from "./formation-shortfall";

export function blockedFormationMessage(
  formation: FantasyFormation,
  positions: readonly PlayerPosition[],
): string {
  const short = formationShortfall({ formation, positions });
  if (!short) return fantasyCopy.formationBlockedGeneric(formation);
  return fantasyCopy.formationBlocked(formation, short.position, short.have);
}
