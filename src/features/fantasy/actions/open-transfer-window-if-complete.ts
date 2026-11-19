import "server-only";

import type { FixtureStatus } from "@/config/fixture-status";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import {
  fixtureFinishedForTransfers,
  gameDayFixturesFinished,
} from "../domain/fixture-finished-for-transfers";
import { refreshFreeTransfers } from "./refresh-free-transfers";

/**
 * When the last unfinished fixture of a game day finishes, open the transfer
 * window by refreshing free transfers for the tournament.
 */
export async function openTransferWindowIfComplete(args: {
  gameDayId: string;
  tournamentId: string;
  unfinishedBefore: number;
}): Promise<void> {
  if (args.unfinishedBefore <= 0) return;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fixtures")
    .select("status")
    .eq("game_day_id", args.gameDayId);
  if (error) throw error;

  const fixtures = (data ?? []).map((row) => ({ status: row.status as FixtureStatus }));
  if (!gameDayFixturesFinished(fixtures)) return;

  await refreshFreeTransfers(args.tournamentId);
}

export async function countUnfinishedFixtures(gameDayId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fixtures")
    .select("status")
    .eq("game_day_id", gameDayId);
  if (error) throw error;
  return (data ?? []).filter((row) => !fixtureFinishedForTransfers(row.status)).length;
}
