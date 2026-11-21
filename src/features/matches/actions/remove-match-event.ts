"use server";

import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { revalidateAfterMatchEdit } from "./revalidate-after-match-edit";

export type RemoveMatchEventState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  eventId: z.uuid(),
  tournamentId: z.uuid(),
  fixtureId: z.uuid(),
});

export async function removeMatchEvent(
  _previous: RemoveMatchEventState,
  formData: FormData,
): Promise<RemoveMatchEventState> {
  const parsed = schema.safeParse({
    eventId: formData.get("eventId"),
    tournamentId: formData.get("tournamentId"),
    fixtureId: formData.get("fixtureId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { eventId, tournamentId, fixtureId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("match_events").delete().eq("id", eventId);

  if (error) {
    logger.error("remove_match_event_failed", { eventId, error });
    return fail("save_failed");
  }
  await revalidateAfterMatchEdit({ tournamentId, fixtureId });
  return ok({ savedAt: Date.now() });
}
