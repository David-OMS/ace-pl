import type { FantasyFormation } from "@/config/fantasy";

import type { DraftPick } from "./draft-pick";
import { parseFormation } from "./parse-formation";
import { validateSquad } from "./validate-squad";

export function canAdvanceWizard(args: {
  step: number;
  name: string;
  formation: FantasyFormation;
  picks: readonly DraftPick[];
  squadSize: number;
  budget: number;
}): boolean {
  if (args.step === 0) return args.name.trim().length > 0;
  if (args.step === 1) {
    return Boolean(parseFormation(args.formation)) && args.picks.length === args.squadSize;
  }
  return validateSquad({
    formation: args.formation,
    squadSize: args.squadSize,
    budget: args.budget,
    picks: args.picks,
  }).ok;
}
