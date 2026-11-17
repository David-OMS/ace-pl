"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FANTASY_DEFAULT_BUDGET, FANTASY_SQUAD_SIZE } from "@/config/fantasy";
import { getCurrentUser } from "@/features/auth";
import { fail, type ActionResult } from "@/lib/action-result";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { listPickablePlayers } from "../queries/list-pickable-players";
import { FANTASY_CREATE_PATH, FANTASY_PATH } from "../routes";
import { createFantasyTeamSchema, readCreateFantasyTeamForm } from "../schemas/create-team-schema";
import { buildValidatedSquadPicks } from "./build-squad-picks";
import { insertFantasyTeamRow } from "./insert-fantasy-team-row";

export type CreateFantasyTeamState = ActionResult<{ teamId: string }> | null;

export async function createFantasyTeam(
  _previous: CreateFantasyTeamState,
  formData: FormData,
): Promise<CreateFantasyTeamState> {
  const parsed = createFantasyTeamSchema.safeParse(readCreateFantasyTeamForm(formData));
  if (!parsed.success) return fail("invalid_input");

  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated");

  const { tournamentId, name, formation, picks } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data: tournament, error: tournamentError } = await supabase
    .from("tournaments")
    .select("id, fantasy_budget")
    .eq("id", tournamentId)
    .maybeSingle();

  if (tournamentError) throw tournamentError;
  if (!tournament) return fail("not_found");

  const budget = Number(tournament.fantasy_budget ?? FANTASY_DEFAULT_BUDGET);
  const pool = await listPickablePlayers(tournamentId);
  const validated = buildValidatedSquadPicks({
    picks,
    pool,
    formation,
    squadSize: FANTASY_SQUAD_SIZE,
    budget,
  });
  if (!validated.ok) return fail("invalid_input");

  const saved = await insertFantasyTeamRow({
    tournamentId,
    userId: user.id,
    name,
    formation,
    bank: validated.value.bank,
    picks: picks.map((pick) => {
      const priced = pool.find((p) => p.id === pick.playerId);
      return {
        ...pick,
        purchasePrice: priced?.price ?? 0,
      };
    }),
  });
  if (!saved.ok) return saved;

  revalidatePath(FANTASY_PATH);
  revalidatePath(FANTASY_CREATE_PATH);
  redirect(FANTASY_PATH);
  return saved;
}
