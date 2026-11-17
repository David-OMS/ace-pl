import { Constants, type Database } from "@/types/database";

export type TournamentStatus = Database["public"]["Enums"]["tournament_status"];
export type FirstPlaceTiebreak = Database["public"]["Enums"]["first_place_tiebreak"];
export type KeeperMode = Database["public"]["Enums"]["keeper_mode"];

export const TOURNAMENT_STATUSES: readonly TournamentStatus[] =
  Constants.public.Enums.tournament_status;
export const FIRST_PLACE_TIEBREAKS: readonly FirstPlaceTiebreak[] =
  Constants.public.Enums.first_place_tiebreak;
export const KEEPER_MODES: readonly KeeperMode[] = Constants.public.Enums.keeper_mode;

/** Must match the check constraints in the tournaments migration. */
export const PLAYERS_ON_PITCH = { min: 2, max: 11, default: 6 } as const;
/** The squad can never be smaller than the number on the pitch; the schema checks that too. */
export const SQUAD_SIZE = { min: 2, max: 30, default: 10 } as const;
export const MATCHES_PER_GAME_DAY = { min: 1, max: 12, default: 4 } as const;
export const TOURNAMENT_NAME_MAX_LENGTH = 60;
export const TEAM_NAME_MAX_LENGTH = 30;
