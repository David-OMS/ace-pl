import "server-only";

import { fail, type ActionResult } from "@/lib/action-result";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { getTransferWindow, type TransferWindowMode } from "../queries/get-transfer-window";
import { listPickablePlayers, type PickablePlayer } from "../queries/list-pickable-players";

export type TransferContext = {
  team: {
    id: string;
    tournament_id: string;
    formation: string;
    bank: number;
    free_transfers: number;
    total_points: number;
  };
  picks: {
    player_id: string;
    slot: number;
    is_bench: boolean;
    is_captain: boolean;
    is_vice: boolean;
  }[];
  pool: PickablePlayer[];
  transferWindow: TransferWindowMode;
  isUnlimited: boolean;
};

export async function loadTransferContext(
  teamId: string,
  userId: string,
): Promise<ActionResult<TransferContext>> {
  const supabase = await createSupabaseServerClient();
  const { data: team, error: teamError } = await supabase
    .from("fantasy_teams")
    .select("id, tournament_id, user_id, formation, bank, free_transfers, total_points")
    .eq("id", teamId)
    .maybeSingle();

  if (teamError) throw teamError;
  if (!team) return fail("not_found");
  if (team.user_id !== userId) return fail("forbidden");

  const { data: picks, error: picksError } = await supabase
    .from("fantasy_picks")
    .select("player_id, slot, is_bench, is_captain, is_vice")
    .eq("team_id", teamId);

  if (picksError) throw picksError;

  const [pool, transferWindow] = await Promise.all([
    listPickablePlayers(team.tournament_id),
    getTransferWindow(team.tournament_id),
  ]);

  return {
    ok: true,
    data: {
      team: {
        id: team.id,
        tournament_id: team.tournament_id,
        formation: team.formation,
        bank: Number(team.bank),
        free_transfers: team.free_transfers,
        total_points: team.total_points,
      },
      picks: picks ?? [],
      pool,
      transferWindow,
      isUnlimited: transferWindow === "unlimited",
    },
  };
}
