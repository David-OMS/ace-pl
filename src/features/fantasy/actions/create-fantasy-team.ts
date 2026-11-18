"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FANTASY_SQUAD_SIZE } from "@/config/fantasy";
import { getCurrentUser } from "@/features/auth";
import { fail, type ActionResult } from "@/lib/action-result";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { normalizeFantasyTeamName } from "../domain/fantasy-team-name";
import { isFantasyFormation } from "../domain/parse-formation";
import { listPickablePlayers } from "../queries/list-pickable-players";
import { FANTASY_CREATE_PATH, FANTASY_PATH } from "../routes";
import { createFantasyTeamSchema, readCreateFantasyTeamForm } from "../schemas/create-team-schema";
import { buildValidatedSquadPicks } from "./build-squad-picks";
import { insertFantasyTeamRow } from "./insert-fantasy-team-row";
import { loadCreateFantasyContext } from "./load-create-fantasy-context";
import { slotCreatePicks } from "./slot-create-picks";

export type CreateFantasyTeamState = ActionResult<{ teamId: string }> | null;

export async function createFantasyTeam(
  _previous: CreateFantasyTeamState,
  formData: FormData,
): Promise<CreateFantasyTeamState> {
  const parsed = createFantasyTeamSchema.safeParse(readCreateFantasyTeamForm(formData));
  if (!parsed.success) return fail("invalid_input");
  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated");

  const { tournamentId, formation, picks } = parsed.data;
  if (!isFantasyFormation(formation)) return fail("invalid_input");
  const name = normalizeFantasyTeamName(parsed.data.name);
  const supabase = await createSupabaseServerClient();
  const context = await loadCreateFantasyContext(supabase, {
    tournamentId,
    userId: user.id,
    name,
  });
  if (!context.ok) return fail(context.error);

  const pool = await listPickablePlayers(tournamentId);
  const validated = buildValidatedSquadPicks({
    picks,
    pool,
    formation,
    squadSize: FANTASY_SQUAD_SIZE,
    budget: context.budget,
  });
  if (!validated.ok) return fail("invalid_input");

  const slotted = slotCreatePicks(formation, picks, pool);
  if (!slotted) return fail("invalid_input");

  const saved = await insertFantasyTeamRow({
    tournamentId,
    userId: user.id,
    name,
    formation,
    bank: validated.value.bank,
    picks: slotted,
  });
  if (!saved.ok) return saved;
  revalidatePath(FANTASY_PATH);
  revalidatePath(FANTASY_CREATE_PATH);
  redirect(FANTASY_PATH);
  return saved;
}
