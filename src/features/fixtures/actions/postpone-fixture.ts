"use server";

import { revalidatePath } from "next/cache";

import { revalidateFanPublic } from "@/lib/cache/fan-public-cache";
import { z } from "zod";

import { ADMIN_HOME_PATH } from "@/features/admin";
import { checkAdminAccess } from "@/features/auth";
import { adminTournamentFixturesPath } from "@/features/tournaments";
import { syncTournamentStatus } from "@/features/tournaments/server";
import { fail, type ActionResult } from "@/lib/action-result";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { adminFixturePath } from "../routes";
import { applyPostpone } from "./apply-postpone";

export type PostponeFixtureState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  fixtureId: z.uuid(),
  playedOn: z.union([z.literal(""), z.iso.date()]).optional(),
  kickoffTime: z.union([z.literal(""), z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/)]).optional(),
});

/** Park a match with no date, or move it straight onto a free date + kick-off. */
export async function postponeFixture(
  _previous: PostponeFixtureState,
  formData: FormData,
): Promise<PostponeFixtureState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    fixtureId: formData.get("fixtureId"),
    playedOn: formData.get("playedOn") ?? undefined,
    kickoffTime: formData.get("kickoffTime") ?? undefined,
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, fixtureId } = parsed.data;
  const playedOn =
    parsed.data.playedOn && parsed.data.playedOn !== "" ? parsed.data.playedOn : null;
  const kickoffRaw =
    parsed.data.kickoffTime && parsed.data.kickoffTime !== "" ? parsed.data.kickoffTime : null;

  const supabase = await createSupabaseServerClient();
  const result = await applyPostpone(supabase, {
    tournamentId,
    fixtureId,
    playedOn,
    kickoffRaw,
  });
  if (!result.ok) return result;

  await syncTournamentStatus(supabase, tournamentId);
  revalidatePath(adminTournamentFixturesPath(tournamentId));
  revalidatePath(adminFixturePath(tournamentId, fixtureId));
  revalidatePath(ADMIN_HOME_PATH);
  revalidateFanPublic();
  return result;
}
