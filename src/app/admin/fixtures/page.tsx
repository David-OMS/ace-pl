import { redirect } from "next/navigation";

import { ADMIN_FIXTURES_PATH } from "@/features/admin";
import { getWorkingTournament } from "@/features/admin/server";
import { requireAdmin } from "@/features/auth";
import { adminTournamentFixturesPath, NEW_TOURNAMENT_PATH } from "@/features/tournaments";

/** Old fixtures tab — send people to the tournament fixtures page. */
export default async function AdminFixturesRedirectPage(): Promise<never> {
  await requireAdmin(ADMIN_FIXTURES_PATH);
  const tournament = await getWorkingTournament();
  if (tournament) redirect(adminTournamentFixturesPath(tournament.id));
  redirect(NEW_TOURNAMENT_PATH);
}
