import { z } from "zod";

import {
  FIRST_PLACE_TIEBREAKS,
  KEEPER_MODES,
  MATCHES_PER_GAME_DAY,
  PLAYERS_ON_PITCH,
  SQUAD_SIZE,
  TOURNAMENT_NAME_MAX_LENGTH,
  TOURNAMENT_STATUSES,
} from "@/config/tournament-rules";
import type { TablesInsert } from "@/types/database";

const leagueDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const tournamentInputSchema = z
  .object({
    name: z.string().trim().min(1).max(TOURNAMENT_NAME_MAX_LENGTH),
    startsOn: leagueDateSchema,
    endsOn: leagueDateSchema,
    playersOnPitch: z.coerce.number().int().min(PLAYERS_ON_PITCH.min).max(PLAYERS_ON_PITCH.max),
    squadSize: z.coerce.number().int().min(SQUAD_SIZE.min).max(SQUAD_SIZE.max),
    matchesPerGameDay: z.coerce
      .number()
      .int()
      .min(MATCHES_PER_GAME_DAY.min)
      .max(MATCHES_PER_GAME_DAY.max),
    firstPlaceTiebreak: z.enum(FIRST_PLACE_TIEBREAKS),
    keeperMode: z.enum(KEEPER_MODES),
    status: z.enum(TOURNAMENT_STATUSES),
  })
  .refine((value) => value.squadSize >= value.playersOnPitch, {
    message: "squad_smaller_than_pitch",
    path: ["squadSize"],
  })
  .refine((value) => value.endsOn >= value.startsOn, {
    message: "ends_before_starts",
    path: ["endsOn"],
  });

export type TournamentInput = z.infer<typeof tournamentInputSchema>;

export function readTournamentForm(formData: FormData): unknown {
  return {
    name: formData.get("name"),
    startsOn: formData.get("startsOn"),
    endsOn: formData.get("endsOn"),
    playersOnPitch: formData.get("playersOnPitch"),
    squadSize: formData.get("squadSize"),
    matchesPerGameDay: formData.get("matchesPerGameDay"),
    firstPlaceTiebreak: formData.get("firstPlaceTiebreak"),
    keeperMode: formData.get("keeperMode") ?? "shared",
    // Status is derived from roster / teams / fixtures — never set from the form.
    status: "setup",
  };
}

export function toTournamentRow(input: TournamentInput): TablesInsert<"tournaments"> {
  return {
    name: input.name,
    starts_on: input.startsOn,
    ends_on: input.endsOn,
    players_on_pitch: input.playersOnPitch,
    squad_size: input.squadSize,
    matches_per_game_day: input.matchesPerGameDay,
    first_place_tiebreak: input.firstPlaceTiebreak,
    keeper_mode: input.keeperMode,
    status: input.status,
  };
}

/** Settings updates must not overwrite auto status. */
export function toTournamentUpdateRow(
  input: TournamentInput,
): Omit<TablesInsert<"tournaments">, "status"> {
  const { status: _status, ...row } = toTournamentRow(input);
  return row;
}
