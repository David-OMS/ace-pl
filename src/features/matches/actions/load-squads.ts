"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { adminFixturePath } from "@/features/fixtures";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { seedFixtureSquad } from "./seed-fixture-squad";

export type LoadSquadsState = ActionResult<{ savedAt: number }> | null;

const LOCKED = new Set(["completed", "void", "walkover"]);

/** Seeds played rows for every current member of the home and away teams. */
export async function loadSquads(
  _previous: LoadSquadsState,
  formData: FormData,
): Promise<LoadSquadsState> {
  const fixtureId = z.uuid().safeParse(formData.get("fixtureId"));
  if (!fixtureId.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const supabase = await createSupabaseServerClient();
  const { data: fixture, error: fixtureError } = await supabase
    .from("fixtures")
    .select("id, tournament_id, home_team_id, away_team_id, status")
    .eq("id", fixtureId.data)
    .maybeSingle();

  if (fixtureError) {
    logger.error("load_squads_fixture_failed", { error: fixtureError });
    return fail("save_failed");
  }
  if (!fixture) return fail("not_found");
  if (LOCKED.has(fixture.status)) return fail("forbidden");

  await seedFixtureSquad(fixture);
  revalidatePath(adminFixturePath(fixture.tournament_id, fixture.id));
  return ok({ savedAt: Date.now() });
}
