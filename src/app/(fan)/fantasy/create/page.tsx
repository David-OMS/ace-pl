import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildSignInHref, getCurrentUser } from "@/features/auth";
import {
  FantasyCreateWizard,
  FantasyEmptyCta,
  FantasyTheme,
  fantasyCopy,
  FANTASY_CREATE_PATH,
  FANTASY_PATH,
  getMyFantasyTeam,
  listPickablePlayers,
} from "@/features/fantasy";
import { resolveFanTournament } from "@/features/home";

export const metadata: Metadata = { title: fantasyCopy.createTitle };

export default async function FantasyCreatePage(): Promise<React.JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect(buildSignInHref(FANTASY_CREATE_PATH));

  const tournament = await resolveFanTournament();
  if (!tournament) {
    return (
      <FantasyTheme className="px-4 py-4">
        <FantasyEmptyCta kind="no_tournament" />
      </FantasyTheme>
    );
  }

  const existing = await getMyFantasyTeam({
    tournamentId: tournament.id,
    userId: user.id,
  });
  if (existing) redirect(FANTASY_PATH);

  const pool = await listPickablePlayers(tournament.id);

  return (
    <FantasyCreateWizard
      tournamentId={tournament.id}
      squadSize={tournament.fantasySquadSize}
      budget={tournament.fantasyBudget}
      pool={pool}
    />
  );
}
