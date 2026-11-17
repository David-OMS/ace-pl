import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { firstGameweekDeadlineMs } from "../domain/first-gameweek-deadline";

/**
 * Unlimited squad/formation edits until Thu 23:59 Lagos before the first game day.
 * After that, the 1 free transfer / GW rule applies.
 */
export async function isUnlimitedTransferPeriod(tournamentId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("game_days")
    .select("played_on")
    .eq("tournament_id", tournamentId)
    .order("played_on", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data?.played_on) return true;

  return Date.now() < firstGameweekDeadlineMs(data.played_on);
}
