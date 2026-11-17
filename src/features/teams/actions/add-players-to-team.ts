"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { adminTeamPath, adminTournamentPath } from "@/features/tournaments";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { assignPlayersToTeam, rosterContainsAll } from "./assign-players-to-team";

export type AddPlayersState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  teamId: z.uuid(),
  playerIds: z.array(z.uuid()).min(1),
});

export async function addPlayersToTeam(
  _previous: AddPlayersState,
  formData: FormData,
): Promise<AddPlayersState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    teamId: formData.get("teamId"),
    playerIds: formData.getAll("playerIds"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, teamId, playerIds } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const [{ data: tournament }, { count }, onRoster] = await Promise.all([
    supabase.from("tournaments").select("squad_size").eq("id", tournamentId).maybeSingle(),
    supabase
      .from("team_memberships")
      .select("id", { count: "exact", head: true })
      .eq("team_id", teamId)
      .is("left_on", null),
    rosterContainsAll(supabase, tournamentId, playerIds),
  ]);

  if (!tournament) return fail("not_found");
  if (onRoster === "error") return fail("save_failed");
  if (!onRoster) return fail("invalid_input");
  if ((count ?? 0) + playerIds.length > tournament.squad_size) return fail("invalid_input");
  if (!(await assignPlayersToTeam(supabase, teamId, playerIds))) return fail("save_failed");

  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(adminTeamPath(tournamentId, teamId));
  return ok({ savedAt: Date.now() });
}
