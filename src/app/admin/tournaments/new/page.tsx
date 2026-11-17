import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth";
import {
  NEW_TOURNAMENT_PATH,
  TournamentCreateScreen,
  tournamentsCopy,
} from "@/features/tournaments";

export const metadata: Metadata = { title: tournamentsCopy.newTournament };

export default async function NewTournamentPage(): Promise<React.JSX.Element> {
  await requireAdmin(NEW_TOURNAMENT_PATH);
  return <TournamentCreateScreen />;
}
