import { MATCH_EVENT_TYPES, PARTICIPATION_STATUSES } from "@/config/match-events";
import type { SelectOption } from "@/ui/select-field";

import { matchesCopy } from "./copy";

export const PARTICIPATION_OPTIONS: readonly SelectOption[] = PARTICIPATION_STATUSES.map(
  (value) => ({ value, label: matchesCopy.participation[value] }),
);

export const EVENT_TYPE_OPTIONS: readonly SelectOption[] = MATCH_EVENT_TYPES.map((value) => ({
  value,
  label: matchesCopy.eventTypes[value],
}));
