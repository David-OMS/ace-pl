import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/auth";
import { ADMIN_PLAYER_PRICES_PATH } from "@/features/players";
import { ADMIN_TOURNAMENTS_PATH } from "@/features/tournaments";

/** Prices moved under Admin → Players → Prices. */
export default async function FantasyRanksAdminPage({
  params,
}: PageProps<"/admin/tournaments/[tournamentId]/fantasy-ranks">): Promise<never> {
  const { tournamentId } = await params;
  await requireAdmin(`${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/fantasy-ranks`);
  redirect(ADMIN_PLAYER_PRICES_PATH);
}
