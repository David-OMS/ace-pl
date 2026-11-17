"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { checkAdminAccess } from "@/features/auth";
import { fail, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { ADMIN_PLAYERS_PATH, adminPlayerPath } from "../routes";
import { playerInputSchema, readPlayerForm } from "../schemas/player-input-schema";

export type PlayerFormState = ActionResult<{ savedAt: number }> | null;

export async function createPlayer(
  _previous: PlayerFormState,
  formData: FormData,
): Promise<PlayerFormState> {
  const parsed = playerInputSchema.safeParse(readPlayerForm(formData));
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { name, position } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .insert({ name, position, is_active: true })
    .select("id")
    .single();

  if (error) {
    logger.error("create_player_failed", { error });
    return fail("save_failed");
  }
  revalidatePath(ADMIN_PLAYERS_PATH);
  redirect(adminPlayerPath(data.id));
}
