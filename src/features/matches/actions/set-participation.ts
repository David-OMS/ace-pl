"use server";

import { z } from "zod";

import { PARTICIPATION_STATUSES } from "@/config/match-events";
import { checkAdminAccess } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { clearPlayerMatchEvents } from "./clear-player-match-events";
import { revalidateAfterMatchEdit } from "./revalidate-after-match-edit";

export type SetParticipationState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  participationId: z.uuid(),
  tournamentId: z.uuid(),
  fixtureId: z.uuid(),
  status: z.enum(PARTICIPATION_STATUSES),
});

export async function setParticipation(
  _previous: SetParticipationState,
  formData: FormData,
): Promise<SetParticipationState> {
  const parsed = schema.safeParse({
    participationId: formData.get("participationId"),
    tournamentId: formData.get("tournamentId"),
    fixtureId: formData.get("fixtureId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { participationId, tournamentId, fixtureId, status } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data: row, error: loadError } = await supabase
    .from("match_participations")
    .select("player_id")
    .eq("id", participationId)
    .maybeSingle();

  if (loadError || !row) {
    logger.error("set_participation_load_failed", { participationId, error: loadError });
    return fail("save_failed");
  }

  const { error } = await supabase
    .from("match_participations")
    .update({ status })
    .eq("id", participationId);

  if (error) {
    logger.error("set_participation_failed", { participationId, error });
    return fail("save_failed");
  }

  if (status === "absent") {
    const cleared = await clearPlayerMatchEvents(supabase, {
      fixtureId,
      playerId: row.player_id,
    });
    if (cleared.error) {
      logger.error("set_participation_clear_events_failed", {
        participationId,
        error: cleared.error,
      });
      return fail("save_failed");
    }
  }

  await revalidateAfterMatchEdit({ tournamentId, fixtureId });
  return ok({ savedAt: Date.now() });
}
