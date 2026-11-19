"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FANTASY_DEFAULT_BUDGET } from "@/config/fantasy";
import { getCurrentUser } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { formationFitsSquad } from "../domain/formation-fits-squad";
import { ownedSwapsValid } from "../domain/owned-swaps-valid";
import { FANTASY_PATH, FANTASY_TRANSFERS_PATH } from "../routes";
import { applyFantasyTransfersSchema, readTransfersForm } from "../schemas/transfer-schema";
import { loadTransferContext } from "./load-transfer-context";
import { persistFantasyTransfers } from "./persist-fantasy-transfers";
import { persistUnlimitedSquad } from "./persist-unlimited-squad";
import { priceTransferSwaps } from "./price-transfer-swaps";

export type ApplyFantasyTransfersState = ActionResult<{ hit: number }> | null;

// eslint-disable-next-line max-lines-per-function, complexity -- transfer save branches
export async function applyFantasyTransfers(
  _previous: ApplyFantasyTransfersState,
  formData: FormData,
): Promise<ApplyFantasyTransfersState> {
  const parsed = applyFantasyTransfersSchema.safeParse(readTransfersForm(formData));
  if (!parsed.success) return fail("invalid_input");
  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated");

  const { teamId, swaps, formation, squad } = parsed.data;
  const context = await loadTransferContext(teamId, user.id);
  if (!context.ok) return context;

  if (context.data.transferWindow === "locked") return fail("forbidden");

  // Unlimited edits, or free lineup/captain/pitch-swap with no market transfers.
  if (context.data.isUnlimited || swaps.length === 0) {
    if (!squad) return fail("invalid_input");
    const budget = await loadTournamentBudget(context.data.team.tournament_id);
    const saved = await persistUnlimitedSquad({
      teamId,
      formation,
      budget,
      squad,
      pool: context.data.pool,
    });
    if (saved === "invalid_input") return fail("invalid_input");
    if (saved !== "ok") return fail("save_failed");
    revalidatePath(FANTASY_PATH);
    revalidatePath(FANTASY_TRANSFERS_PATH);
    redirect(FANTASY_PATH);
    return ok({ hit: 0 });
  }

  const positions = context.data.picks.map((pick) => {
    const player = context.data.pool.find((p) => p.id === pick.player_id);
    return player?.position ?? "MID";
  });
  if (!formationFitsSquad({ formation, positions }) && formation !== context.data.team.formation) {
    return fail("invalid_input");
  }

  const owned = new Set(context.data.picks.map((p) => p.player_id));
  if (!ownedSwapsValid(owned, swaps)) return fail("invalid_input");

  const batch = priceTransferSwaps({
    swaps,
    pool: context.data.pool,
    bank: context.data.team.bank,
    freeTransfers: context.data.team.free_transfers,
    isUnlimited: false,
  });
  if (!batch) return fail("invalid_input");
  const hit = batch.totalHit;

  const saved = await persistFantasyTransfers({
    teamId,
    formation,
    currentPoints: context.data.team.total_points,
    picks: context.data.picks,
    pool: context.data.pool,
    batch,
  });
  if (saved !== "ok") return fail("save_failed");

  revalidatePath(FANTASY_PATH);
  revalidatePath(FANTASY_TRANSFERS_PATH);
  redirect(FANTASY_PATH);
  return ok({ hit });
}

async function loadTournamentBudget(tournamentId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("fantasy_budget")
    .eq("id", tournamentId)
    .maybeSingle();
  if (error) throw error;
  return Number(data?.fantasy_budget ?? FANTASY_DEFAULT_BUDGET);
}
