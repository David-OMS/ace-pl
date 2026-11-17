import { FIRST_PLACE_TIEBREAKS, KEEPER_MODES } from "@/config/tournament-rules";
import type { SelectOption } from "@/ui/select-field";

import { tournamentsCopy } from "./copy";

export const TIEBREAK_OPTIONS: readonly SelectOption[] = FIRST_PLACE_TIEBREAKS.map((value) => ({
  value,
  label: tournamentsCopy.tiebreaks[value],
}));

export const KEEPER_MODE_OPTIONS: readonly SelectOption[] = KEEPER_MODES.map((value) => ({
  value,
  label: tournamentsCopy.keeperModes[value],
}));
