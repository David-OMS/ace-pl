"use server";

import { revalidatePath } from "next/cache";

import { checkAdminAccess } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { loadAwardsAdminSnapshot } from "../queries/load-awards-admin-snapshot";
import { AWARDS_ADMIN_PATH } from "../routes";

export type OpenBallonVotingState = ActionResult<{ roundId: string }> | null;

// eslint-disable-next-line complexity -- admin form validation branches
export async function openBallonVoting(
  _previous: OpenBallonVotingState,
  formData: FormData,
): Promise<OpenBallonVotingState> {
  const access = await checkAdminAccess();
  if (access) return fail(access);

  const tournamentId = String(formData.get("tournamentId") ?? "");
  const tournamentName = String(formData.get("tournamentName") ?? "");
  const closesRaw = String(formData.get("votingClosesAt") ?? "");
  if (!tournamentId || !closesRaw) return fail("invalid_input");

  const closesAt = new Date(closesRaw);
  if (Number.isNaN(closesAt.getTime())) return fail("invalid_input");

  const snapshot = await loadAwardsAdminSnapshot(tournamentId, tournamentName || "?");
  if (snapshot.shortlistPreview.length === 0) return fail("invalid_input");

  const supabase = await createSupabaseServerClient();
  const { data: round, error: roundError } = await supabase
    .from("ballon_dor_rounds")
    .upsert(
      {
        tournament_id: tournamentId,
        status: "open",
        voting_closes_at: closesAt.toISOString(),
      },
      { onConflict: "tournament_id" },
    )
    .select("id")
    .single();

  if (roundError || !round) {
    logger.error("open_ballon_round_failed", { error: roundError });
    return fail("save_failed");
  }

  await supabase.from("ballon_dor_shortlist").delete().eq("round_id", round.id);
  const { error: listError } = await supabase.from("ballon_dor_shortlist").insert(
    snapshot.shortlistPreview.map((row) => ({
      round_id: round.id,
      player_id: row.playerId,
      stats_score: row.statsScore,
    })),
  );
  if (listError) {
    logger.error("open_ballon_shortlist_failed", { error: listError });
    return fail("save_failed");
  }

  revalidatePath(AWARDS_ADMIN_PATH);
  return ok({ roundId: round.id });
}
