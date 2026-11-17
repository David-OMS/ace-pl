import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth";
import {
  ADMIN_PLAYERS_PATH,
  listPlayers,
  playersCopy,
  PlayersAdminScreen,
} from "@/features/players";

export const metadata: Metadata = { title: playersCopy.adminTitle };

export default async function AdminPlayersPage(): Promise<React.JSX.Element> {
  await requireAdmin(ADMIN_PLAYERS_PATH);
  return <PlayersAdminScreen players={await listPlayers()} />;
}
