import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildSignInHref, getCurrentUser } from "@/features/auth";
import {
  FantasyEmptyCta,
  FantasyTheme,
  FantasyTransfersScreen,
  fantasyCopy,
  FANTASY_CREATE_PATH,
  FANTASY_TRANSFERS_PATH,
  getMyFantasyTeam,
  isUnlimitedTransferPeriod,
  listPickablePlayers,
} from "@/features/fantasy";
import { resolveFanTournament } from "@/features/home";

export const metadata: Metadata = { title: fantasyCopy.transfersTitle };

export default async function FantasyTransfersPage(): Promise<React.JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect(buildSignInHref(FANTASY_TRANSFERS_PATH));

  const tournament = await resolveFanTournament();
  if (!tournament) {
    return (
      <FantasyTheme className="px-4 py-4">
        <FantasyEmptyCta kind="no_tournament" />
      </FantasyTheme>
    );
  }

  const team = await getMyFantasyTeam({
    tournamentId: tournament.id,
    userId: user.id,
  });
  if (!team) redirect(FANTASY_CREATE_PATH);

  const [pool, beforeFirstDeadline] = await Promise.all([
    listPickablePlayers(tournament.id),
    isUnlimitedTransferPeriod(tournament.id),
  ]);

  return (
    <FantasyTransfersScreen
      team={team}
      pool={pool}
      budget={tournament.fantasyBudget}
      beforeFirstDeadline={beforeFirstDeadline}
    />
  );
}
