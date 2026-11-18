"use server";

import { revalidatePath } from "next/cache";

import { FANTASY_TEAM_NAME_MAX_CHANGES } from "@/config/fantasy";
import { getCurrentUser } from "@/features/auth";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import {
  canChangeFantasyTeamName,
  isSameFantasyTeamName,
  normalizeFantasyTeamName,
} from "../domain/fantasy-team-name";
import { isFantasyTeamNameTaken } from "../queries/is-fantasy-team-name-taken";
import { FANTASY_PATH } from "../routes";
import { readRenameFantasyTeamForm, renameFantasyTeamSchema } from "../schemas/rename-team-schema";

export type RenameFantasyTeamState = ActionResult<{ savedAt: number }> | null;

type OwnedTeam = {
  id: string;
  tournament_id: string;
  name: string;
  name_change_count: number;
  user_id: string;
};

export async function renameFantasyTeam(
  _previous: RenameFantasyTeamState,
  formData: FormData,
): Promise<RenameFantasyTeamState> {
  const parsed = renameFantasyTeamSchema.safeParse(readRenameFantasyTeamForm(formData));
  if (!parsed.success) return fail("invalid_input");

  const user = await getCurrentUser();
  if (!user) return fail("unauthenticated");

  const name = normalizeFantasyTeamName(parsed.data.name);
  const supabase = await createSupabaseServerClient();
  const { data: team, error: teamError } = await supabase
    .from("fantasy_teams")
    .select("id, tournament_id, name, name_change_count, user_id")
    .eq("id", parsed.data.teamId)
    .maybeSingle();
  if (teamError) throw teamError;

  const guard = renameGuard(team, user.id, name);
  if (guard) return guard;

  const owned = team as OwnedTeam;
  if (
    await isFantasyTeamNameTaken(supabase, {
      tournamentId: owned.tournament_id,
      name,
      exceptTeamId: owned.id,
    })
  ) {
    return fail("conflict");
  }

  return persistRename({ supabase, team: owned, userId: user.id, name });
}

function renameGuard(team: OwnedTeam | null, userId: string, name: string): RenameFantasyTeamState {
  if (!team || team.user_id !== userId) return fail("not_found");
  if (isSameFantasyTeamName(team.name, name)) return ok({ savedAt: Date.now() });
  if (!canChangeFantasyTeamName(team.name_change_count, FANTASY_TEAM_NAME_MAX_CHANGES)) {
    return fail("rate_limited");
  }
  return null;
}

async function persistRename(input: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  team: OwnedTeam;
  userId: string;
  name: string;
}): Promise<RenameFantasyTeamState> {
  const { supabase, team, userId, name } = input;
  const { data: updated, error } = await supabase
    .from("fantasy_teams")
    .update({
      name,
      name_change_count: team.name_change_count + 1,
    })
    .eq("id", team.id)
    .eq("user_id", userId)
    .lt("name_change_count", FANTASY_TEAM_NAME_MAX_CHANGES)
    .select("id")
    .maybeSingle();

  if (error?.code === "23505") return fail("conflict");
  if (error) {
    logger.error("rename_fantasy_team_failed", { teamId: team.id, error });
    return fail("save_failed");
  }
  if (!updated) return fail("rate_limited");

  revalidatePath(FANTASY_PATH);
  revalidatePath("/profile");
  return ok({ savedAt: Date.now() });
}
