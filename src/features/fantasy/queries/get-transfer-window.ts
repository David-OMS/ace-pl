import "server-only";

import type { FixtureStatus } from "@/config/fixture-status";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { resolveTransferWindow, type TransferWindowMode } from "../domain/resolve-transfer-window";

export type { TransferWindowMode };

/** Live transfer window for a tournament (unlimited / locked / open). */
export async function getTransferWindow(tournamentId: string): Promise<TransferWindowMode> {
  const supabase = await createSupabaseServerClient();
  const [{ data: days, error: daysError }, { data: fixtures, error: fixturesError }] =
    await Promise.all([
      supabase
        .from("game_days")
        .select("id, played_on")
        .eq("tournament_id", tournamentId)
        .order("played_on", { ascending: true }),
      supabase.from("fixtures").select("game_day_id, status").eq("tournament_id", tournamentId),
    ]);

  if (daysError) throw daysError;
  if (fixturesError) throw fixturesError;

  const byDay = new Map<string, { status: FixtureStatus }[]>();
  for (const row of fixtures ?? []) {
    const list = byDay.get(row.game_day_id) ?? [];
    list.push({ status: row.status });
    byDay.set(row.game_day_id, list);
  }

  return resolveTransferWindow({
    nowMs: Date.now(),
    gameDays: (days ?? []).map((day) => ({
      playedOn: day.played_on,
      fixtures: byDay.get(day.id) ?? [],
    })),
  });
}
