"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { fail, ok } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { ADMIN_PLAYERS_PATH, adminPlayerPath } from "../routes";
import { playerInputSchema, readPlayerForm } from "../schemas/player-input-schema";
import type { PlayerFormState } from "./create-player";

const playerIdSchema = z.uuid();

export async function updatePlayer(
  _previous: PlayerFormState,
  formData: FormData,
): Promise<PlayerFormState> {
  const playerId = playerIdSchema.safeParse(formData.get("playerId"));
  const parsed = playerInputSchema.safeParse(readPlayerForm(formData));
  if (!playerId.success || !parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { name, position } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .update({ name, position })
    .eq("id", playerId.data)
    .select("id");

  if (error) {
    logger.error("update_player_failed", { playerId: playerId.data, error });
    return fail("save_failed");
  }
  if (data.length === 0) return fail("not_found");

  revalidatePath(ADMIN_PLAYERS_PATH);
  revalidatePath(adminPlayerPath(playerId.data));
  return ok({ savedAt: Date.now() });
}
