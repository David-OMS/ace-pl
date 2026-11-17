import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type FantasyTransferLogRow = {
  id: string;
  createdAt: string;
  playerOutName: string;
  playerInName: string;
  pointCost: number;
};

export async function listMyFantasyTransfers(teamId: string): Promise<FantasyTransferLogRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fantasy_transfers")
    .select(
      "id, created_at, point_cost, out:players!fantasy_transfers_player_out_id_fkey(name), in:players!fantasy_transfers_player_in_id_fkey(name)",
    )
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    playerOutName: row.out?.name ?? "?",
    playerInName: row.in?.name ?? "?",
    pointCost: row.point_cost,
  }));
}
