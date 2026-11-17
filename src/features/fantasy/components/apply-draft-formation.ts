import { FANTASY_SQUAD_SIZE, type FantasyFormation } from "@/config/fantasy";

import { reseatPicksForFormation } from "../domain/reseat-picks-for-formation";
import type { FantasyPickView } from "../queries/get-my-fantasy-team";

export function applyDraftFormation(args: {
  next: FantasyFormation;
  picks: readonly FantasyPickView[];
  nameById: ReadonlyMap<string, string>;
}): FantasyPickView[] {
  const reseated = reseatPicksForFormation({
    formation: args.next,
    squadSize: FANTASY_SQUAD_SIZE,
    picks: args.picks.map((p) => ({
      playerId: p.playerId,
      position: p.position,
      price: p.price,
      isCaptain: p.isCaptain,
      isVice: p.isVice,
    })),
  });

  return reseated.map((p, slot) => {
    const prior = args.picks.find((x) => x.playerId === p.playerId);
    return {
      playerId: p.playerId,
      name: prior?.name ?? args.nameById.get(p.playerId) ?? "?",
      position: p.position,
      photoUrl: prior?.photoUrl ?? null,
      rank: prior?.rank ?? "C",
      price: p.price,
      slot,
      isBench: p.isBench,
      isCaptain: p.isCaptain,
      isVice: p.isVice,
    };
  });
}
