import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth";
import { NEW_PLAYER_PATH, PlayerEditScreen, playersCopy } from "@/features/players";

export const metadata: Metadata = { title: playersCopy.newPlayerTitle };

export default async function NewPlayerPage(): Promise<React.JSX.Element> {
  await requireAdmin(NEW_PLAYER_PATH);
  return <PlayerEditScreen />;
}
