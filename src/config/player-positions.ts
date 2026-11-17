import { Constants, type Database } from "@/types/database";

export type PlayerPosition = Database["public"]["Enums"]["player_position"];

/** Pitch order, goalkeeper first. Used for sorting and form options. */
export const PLAYER_POSITIONS: readonly PlayerPosition[] = Constants.public.Enums.player_position;
