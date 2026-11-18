"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { adminFixturePath } from "@/features/fixtures";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { sharedKeeperBlocked } from "./shared-keeper-blocked";

export type BorrowPlayerState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  fixtureId: z.uuid(),
  teamId: z.uuid(),
  playerId: z.uuid(),
});

export async function borrowPlayer(
  _previous: BorrowPlayerState,
  formData: FormData,
): Promise<BorrowPlayerState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    fixtureId: formData.get("fixtureId"),
    teamId: formData.get("teamId"),
    playerId: formData.get("playerId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, fixtureId, teamId, playerId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const [{ data: player, error: playerError }, blocked] = await Promise.all([
    supabase.from("players").select("position").eq("id", playerId).maybeSingle(),
    sharedKeeperBlocked(supabase, { tournamentId, fixtureId, teamId, playerId }),
  ]);

  if (playerError || !player) return fail("not_found");
  if (blocked) return fail("conflict");

  const { error } = await supabase.from("match_participations").insert({
    tournament_id: tournamentId,
    fixture_id: fixtureId,
    player_id: playerId,
    team_id: teamId,
    status: "played",
    is_goalkeeper: player.position === "GK",
  });

  if (error?.code === "23505") return fail("conflict");
  if (error) {
    logger.error("borrow_player_failed", { fixtureId, playerId, error });
    return fail("save_failed");
  }
  revalidatePath(adminFixturePath(tournamentId, fixtureId));
  return ok({ savedAt: Date.now() });
}
