import { FANTASY_SQUAD_SIZE } from "@/config/fantasy";

import { validateSquad } from "../domain/validate-squad";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";

export function unlimitedSquadValid(args: {
  formation: string;
  budget: number;
  picks: readonly FantasyPickView[];
}): boolean {
  return validateSquad({
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
    })),
  }).ok;
}
