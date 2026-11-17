import type { Metadata } from "next";

import { ADMIN_AWARDS_PATH, adminCopy } from "@/features/admin";
import { getWorkingTournament } from "@/features/admin/server";
import { AdminAwardsScreen, loadAwardsAdminSnapshot, loadFraudWatchAdmin } from "@/features/awards";
import { requireAdmin } from "@/features/auth";

export const metadata: Metadata = { title: adminCopy.awards.title };

export default async function AdminAwardsPage(): Promise<React.JSX.Element> {
  await requireAdmin(ADMIN_AWARDS_PATH);
  const tournament = await getWorkingTournament();
  const [fraud, snapshot] = await Promise.all([
    loadFraudWatchAdmin(),
    tournament ? loadAwardsAdminSnapshot(tournament.id, tournament.name) : Promise.resolve(null),
  ]);
  return <AdminAwardsScreen fraud={fraud} snapshot={snapshot} title={adminCopy.awards.title} />;
}
