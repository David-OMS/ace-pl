"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ADMIN_HOME_PATH } from "@/features/admin";
import { TEAM_COLOR_PALETTE, type TeamColor } from "@/config/team-colors";
import { checkAdminAccess } from "@/features/auth";
import {
  adminTeamPath,
  adminTournamentFixturesPath,
  adminTournamentPath,
} from "@/features/tournaments";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type UpdateTeamColorState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  teamId: z.uuid(),
  color: z
    .string()
    .refine((value): value is TeamColor =>
      (TEAM_COLOR_PALETTE as readonly string[]).includes(value),
    ),
});

export async function updateTeamColor(
  _previous: UpdateTeamColorState,
  formData: FormData,
): Promise<UpdateTeamColorState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    teamId: formData.get("teamId"),
    color: formData.get("color"),
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, teamId, color } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("teams")
    .update({ color })
    .eq("id", teamId)
    .eq("tournament_id", tournamentId)
    .select("id");

  if (error) {
    logger.error("update_team_color_failed", { teamId, error });
    return fail("save_failed");
  }
  if (!data.length) return fail("not_found");

  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(adminTournamentFixturesPath(tournamentId));
  revalidatePath(adminTeamPath(tournamentId, teamId));
  revalidatePath(ADMIN_HOME_PATH);
  return ok({ savedAt: Date.now() });
}
