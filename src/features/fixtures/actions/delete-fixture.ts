"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ADMIN_HOME_PATH } from "@/features/admin";
import { checkAdminAccess } from "@/features/auth";
import { adminTournamentFixturesPath, adminTournamentPath } from "@/features/tournaments";
import { syncTournamentStatus } from "@/features/tournaments/server";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type DeleteFixtureState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  fixtureId: z.uuid(),
});

export async function deleteFixture(
  _previous: DeleteFixtureState,
  formData: FormData,
): Promise<DeleteFixtureState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    fixtureId: formData.get("fixtureId"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, fixtureId } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("fixtures").delete().eq("id", fixtureId);

  if (error) {
    logger.error("delete_fixture_failed", { fixtureId, error });
    return fail("save_failed");
  }
  await syncTournamentStatus(supabase, tournamentId);
  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(adminTournamentFixturesPath(tournamentId));
  revalidatePath(ADMIN_HOME_PATH);
  return ok({ savedAt: Date.now() });
}
