"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { pickTeamColor } from "@/config/team-colors";
import { TEAM_NAME_MAX_LENGTH } from "@/config/tournament-rules";
import { checkAdminAccess } from "@/features/auth";
import { adminNewTeamPath, adminTournamentPath } from "@/features/tournaments";
import { fail, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { assignPlayersToTeam, rosterContainsAll } from "./assign-players-to-team";

export type CreateTeamState = ActionResult<{ savedAt: number }> | null;

const UNIQUE_VIOLATION = "23505";
const schema = z.object({
  tournamentId: z.uuid(),
  name: z.string().trim().min(1).max(TEAM_NAME_MAX_LENGTH),
  playerIds: z.array(z.uuid()).default([]),
  next: z.enum(["another", "hub"]).default("hub"),
});

export async function createTeam(
  _previous: CreateTeamState,
  formData: FormData,
): Promise<CreateTeamState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    name: formData.get("name"),
    playerIds: formData.getAll("playerIds"),
    next: formData.get("next") ?? "hub",
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, name, playerIds, next } = parsed.data;
  const created = await insertTeamWithPlayers(tournamentId, name, playerIds);
  if (!created.ok) return fail(created.error);

  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(adminNewTeamPath(tournamentId));
  redirect(next === "another" ? adminNewTeamPath(tournamentId) : adminTournamentPath(tournamentId));
}

// Roster + colour + insert + memberships in one write path; splitting hides the flow.
// eslint-disable-next-line complexity -- create team write is one transaction story
async function insertTeamWithPlayers(
  tournamentId: string,
  name: string,
  playerIds: readonly string[],
): Promise<{ ok: true } | { ok: false; error: "invalid_input" | "conflict" | "save_failed" }> {
  const supabase = await createSupabaseServerClient();
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("squad_size")
    .eq("id", tournamentId)
    .maybeSingle();
  if (!tournament || playerIds.length > tournament.squad_size) {
    return { ok: false, error: "invalid_input" };
  }

  const onRoster = await rosterContainsAll(supabase, tournamentId, playerIds);
  if (onRoster === "error") return { ok: false, error: "save_failed" };
  if (!onRoster) return { ok: false, error: "invalid_input" };

  const { data: existingColors } = await supabase
    .from("teams")
    .select("color")
    .eq("tournament_id", tournamentId);
  const color = pickTeamColor((existingColors ?? []).map((row) => row.color));

  const { data: team, error } = await supabase
    .from("teams")
    .insert({ tournament_id: tournamentId, name, color })
    .select("id")
    .maybeSingle();

  if (error?.code === UNIQUE_VIOLATION) return { ok: false, error: "conflict" };
  if (error || !team) {
    logger.error("create_team_failed", { tournamentId, error });
    return { ok: false, error: "save_failed" };
  }
  if (!(await assignPlayersToTeam(supabase, team.id, playerIds))) {
    return { ok: false, error: "save_failed" };
  }
  return { ok: true };
}
