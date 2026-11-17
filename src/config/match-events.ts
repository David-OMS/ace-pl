import { Constants, type Database } from "@/types/database";

export type MatchEventType = Database["public"]["Enums"]["match_event_type"];
export type ParticipationStatus = Database["public"]["Enums"]["participation_status"];

export const MATCH_EVENT_TYPES: readonly MatchEventType[] = Constants.public.Enums.match_event_type;
export const PARTICIPATION_STATUSES: readonly ParticipationStatus[] =
  Constants.public.Enums.participation_status;

/** Walkover score written into the table only — no player events. */
export const WALKOVER_SCORE = { winner: 3, loser: 0 } as const;
