import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth";
import {
  ADMIN_TOURNAMENTS_PATH,
  listTournaments,
  tournamentsCopy,
  TournamentsAdminScreen,
} from "@/features/tournaments";

export const metadata: Metadata = { title: tournamentsCopy.adminTitle };

export default async function AdminTournamentsPage(): Promise<React.JSX.Element> {
  await requireAdmin(ADMIN_TOURNAMENTS_PATH);
  return <TournamentsAdminScreen tournaments={await listTournaments()} />;
}
