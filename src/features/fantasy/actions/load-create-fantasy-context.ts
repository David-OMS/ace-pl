import { FANTASY_DEFAULT_BUDGET } from "@/config/fantasy";
import type { ActionErrorCode } from "@/lib/action-result";
import type { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { assertFantasyTeamCreate } from "./assert-fantasy-team-create";

type Supabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export async function loadCreateFantasyContext(
  supabase: Supabase,
  args: { tournamentId: string; userId: string; name: string },
): Promise<{ ok: true; budget: number } | { ok: false; error: ActionErrorCode }> {
  const { data: tournament, error: tournamentError } = await supabase
    .from("tournaments")
    .select("id, fantasy_budget")
    .eq("id", args.tournamentId)
    .maybeSingle();
  if (tournamentError) throw tournamentError;
  if (!tournament) return { ok: false, error: "not_found" };

  const blocked = await assertFantasyTeamCreate(supabase, {
    tournamentId: args.tournamentId,
    userId: args.userId,
    name: args.name,
  });
  if (blocked) return { ok: false, error: blocked };

  return {
    ok: true,
    budget: Number(tournament.fantasy_budget ?? FANTASY_DEFAULT_BUDGET),
  };
}
