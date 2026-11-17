"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { adminTournamentPath } from "../routes";

export type SharedKeeperState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  playerId: z.uuid(),
});

export async function addSharedKeeper(
  _previous: SharedKeeperState,
  formData: FormData,
): Promise<SharedKeeperState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    playerId: formData.get("playerId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, playerId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("tournament_keepers")
    .insert({ tournament_id: tournamentId, player_id: playerId });

  if (error?.code === "23505") return fail("conflict");
  if (error) {
    logger.error("add_shared_keeper_failed", { tournamentId, error });
    return fail("save_failed");
  }
  revalidatePath(adminTournamentPath(tournamentId));
  return ok({ savedAt: Date.now() });
}

export async function removeSharedKeeper(
  _previous: SharedKeeperState,
  formData: FormData,
): Promise<SharedKeeperState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    playerId: formData.get("playerId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, playerId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("tournament_keepers")
    .delete()
    .eq("tournament_id", tournamentId)
    .eq("player_id", playerId);

  if (error) {
    logger.error("remove_shared_keeper_failed", { tournamentId, error });
    return fail("save_failed");
  }
  revalidatePath(adminTournamentPath(tournamentId));
  return ok({ savedAt: Date.now() });
}
