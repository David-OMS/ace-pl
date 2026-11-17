"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { PARTICIPATION_STATUSES } from "@/config/match-events";
import { checkAdminAccess } from "@/features/auth";
import { adminFixturePath } from "@/features/fixtures";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

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
  const { error } = await supabase
    .from("match_participations")
    .update({ status })
    .eq("id", participationId);

  if (error) {
    logger.error("set_participation_failed", { participationId, error });
    return fail("save_failed");
  }
  revalidatePath(adminFixturePath(tournamentId, fixtureId));
  return ok({ savedAt: Date.now() });
}
