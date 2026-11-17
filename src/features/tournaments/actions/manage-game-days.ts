"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { adminTournamentPath, adminTournamentSettingsPath } from "../routes";

export type GameDayState = ActionResult<{ savedAt: number }> | null;

const UNIQUE_VIOLATION = "23505";

const addGameDaySchema = z.object({ tournamentId: z.uuid(), playedOn: z.iso.date() });
const removeGameDaySchema = z.object({ tournamentId: z.uuid(), gameDayId: z.uuid() });

export async function addGameDay(
  _previous: GameDayState,
  formData: FormData,
): Promise<GameDayState> {
  const parsed = addGameDaySchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    playedOn: formData.get("playedOn"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, playedOn } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("game_days")
    .insert({ tournament_id: tournamentId, played_on: playedOn });

  if (error?.code === UNIQUE_VIOLATION) return fail("conflict");
  if (error) {
    logger.error("add_game_day_failed", { tournamentId, error });
    return fail("save_failed");
  }
  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(adminTournamentSettingsPath(tournamentId));
  return ok({ savedAt: Date.now() });
}

/** Fails once fixtures hang off the game day, because the foreign key blocks the delete. */
export async function removeGameDay(
  _previous: GameDayState,
  formData: FormData,
): Promise<GameDayState> {
  const parsed = removeGameDaySchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    gameDayId: formData.get("gameDayId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, gameDayId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("game_days").delete().eq("id", gameDayId);

  if (error) {
    logger.error("remove_game_day_failed", { gameDayId, error });
    return fail("save_failed");
  }
  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(adminTournamentSettingsPath(tournamentId));
  return ok({ savedAt: Date.now() });
}
