"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/features/auth";
import { FAN_PLAYERS_PATH, FAN_PROFILE_PATH } from "@/features/fan";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { revalidateFanPublic } from "@/lib/cache/fan-public-cache";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type RemovePhotoState = ActionResult<{ clearedAt: number }> | null;

/** Clears the signed-in player's picture. */
export async function removeMyPlayerPhoto(
  _previous: RemovePhotoState,
  _formData: FormData,
): Promise<RemovePhotoState> {
  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("clear_my_player_photo");
  if (error) {
    if (error.message === "no_linked_player") return fail("not_found");
    logger.error("player_photo_clear_failed", { error });
    return fail("save_failed");
  }

  revalidatePath(FAN_PROFILE_PATH);
  revalidatePath(FAN_PLAYERS_PATH);
  revalidateFanPublic();
  return ok({ clearedAt: Date.now() });
}
