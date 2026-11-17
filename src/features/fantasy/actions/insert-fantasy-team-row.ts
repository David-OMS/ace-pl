import { FANTASY_FREE_TRANSFERS_PER_GW } from "@/config/fantasy";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type PickInput = {
  playerId: string;
  isBench: boolean;
  isCaptain: boolean;
  isVice: boolean;
  purchasePrice: number;
};

export async function insertFantasyTeamRow(args: {
  tournamentId: string;
  userId: string;
  name: string;
  formation: string;
  bank: number;
  picks: readonly PickInput[];
}): Promise<ActionResult<{ teamId: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: team, error: insertError } = await supabase
    .from("fantasy_teams")
    .insert({
      tournament_id: args.tournamentId,
      user_id: args.userId,
      name: args.name,
      formation: args.formation,
      bank: args.bank,
      free_transfers: FANTASY_FREE_TRANSFERS_PER_GW,
      total_points: 0,
    })
    .select("id")
    .single();

  if (insertError || !team) {
    if (insertError?.code === "23505") return fail("conflict");
    logger.error("create_fantasy_team_failed", { error: insertError });
    return fail("save_failed");
  }

  const teamId = team.id;
  const { error: picksError } = await supabase.from("fantasy_picks").insert(
    args.picks.map((pick, slot) => ({
      team_id: teamId,
      player_id: pick.playerId,
      slot,
      is_bench: pick.isBench,
      is_captain: pick.isCaptain,
      is_vice: pick.isVice,
      purchase_price: pick.purchasePrice,
    })),
  );

  if (picksError) {
    logger.error("create_fantasy_picks_failed", { error: picksError, teamId });
    await supabase.from("fantasy_teams").delete().eq("id", teamId);
    return fail("save_failed");
  }

  return ok({ teamId });
}
