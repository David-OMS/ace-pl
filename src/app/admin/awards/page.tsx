import type { Metadata } from "next";

import { ADMIN_AWARDS_PATH, adminCopy } from "@/features/admin";
import { getWorkingTournament } from "@/features/admin/server";
import { AdminAwardsScreen, loadAwardsAdminSnapshot } from "@/features/awards";
import { requireAdmin } from "@/features/auth";

export const metadata: Metadata = { title: adminCopy.awards.title };

export default async function AdminAwardsPage(): Promise<React.JSX.Element> {
  await requireAdmin(ADMIN_AWARDS_PATH);
  const tournament = await getWorkingTournament();
  const snapshot = tournament
    ? await loadAwardsAdminSnapshot(tournament.id, tournament.name)
    : null;
  return <AdminAwardsScreen snapshot={snapshot} title={adminCopy.awards.title} />;
}
