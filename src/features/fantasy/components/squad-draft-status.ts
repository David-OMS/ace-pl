import { FANTASY_SQUAD_SIZE } from "@/config/fantasy";

import { fantasyCopy } from "../copy";
import { validateSquad } from "../domain/validate-squad";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";

export function squadDraftStatus(args: {
  formation: string;
  budget: number;
  picks: readonly FantasyPickView[];
}): { valid: boolean; reason: string | null } {
  const result = validateSquad({
    formation: args.formation,
    squadSize: FANTASY_SQUAD_SIZE,
    budget: args.budget,
    picks: args.picks.map((p) => ({
      playerId: p.playerId,
      position: p.position,
      price: p.price,
      isBench: p.isBench,
      isCaptain: p.isCaptain,
      isVice: p.isVice,
      clubTeamId: p.clubTeamId,
    })),
  });
  if (result.ok) return { valid: true, reason: null };
  return {
    valid: false,
    reason: fantasyCopy.squadErrors[result.error] ?? fantasyCopy.squadIncomplete,
  };
}
