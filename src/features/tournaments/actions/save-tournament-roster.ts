"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { checkAdminAccess } from "@/features/auth";
import { fail, type ActionResult } from "@/lib/action-result";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import { adminNewTeamPath, adminTournamentPath, adminTournamentPlayersPath } from "../routes";
import { addRosterPlayers, removeRosterPlayers } from "./sync-tournament-roster";

export type SaveRosterState = ActionResult<{ savedAt: number }> | null;

const schema = z.object({
  tournamentId: z.uuid(),
  playerIds: z.array(z.uuid()),
  next: z.enum(["teams", "hub"]).default("hub"),
});

/** Replaces the tournament roster with the submitted player ids. */
export async function saveTournamentRoster(
  _previous: SaveRosterState,
  formData: FormData,
): Promise<SaveRosterState> {
  const parsed = schema.safeParse({
    tournamentId: formData.get("tournamentId"),
    playerIds: formData.getAll("playerIds"),
    next: formData.get("next") ?? "hub",
  });
  if (!parsed.success) return fail("invalid_input");

  const accessError = await checkAdminAccess();
  if (accessError) return fail(accessError);

  const { tournamentId, playerIds, next } = parsed.data;
  const selected = new Set(playerIds);
  const supabase = await createSupabaseServerClient();
  const { data: current, error: currentError } = await supabase
    .from("tournament_players")
    .select("player_id")
    .eq("tournament_id", tournamentId);
  if (currentError) {
    logger.error("save_roster_load_failed", { tournamentId, error: currentError });
    return fail("save_failed");
  }

  const existing = new Set((current ?? []).map((row) => row.player_id));
  const toAdd = [...selected].filter((id) => !existing.has(id));
  const toRemove = [...existing].filter((id) => !selected.has(id));

  if (!(await removeRosterPlayers(supabase, tournamentId, toRemove))) return fail("save_failed");
  if (!(await addRosterPlayers(supabase, tournamentId, toAdd))) return fail("save_failed");

  revalidatePath(adminTournamentPath(tournamentId));
  revalidatePath(adminTournamentPlayersPath(tournamentId));
  redirect(next === "teams" ? adminNewTeamPath(tournamentId) : adminTournamentPath(tournamentId));
}
