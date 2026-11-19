import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function loadFixtureGameDayId(fixtureId: string): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("fixtures")
    .select("game_day_id")
    .eq("id", fixtureId)
    .maybeSingle();
  if (error) throw error;
  return data?.game_day_id ?? null;
}
