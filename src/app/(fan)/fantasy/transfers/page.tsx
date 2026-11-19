import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buildSignInHref, getCurrentUser } from "@/features/auth";
import {
  FantasyEmptyCta,
  FantasyTheme,
  FantasyTransfersScreen,
  fantasyCopy,
  FANTASY_CREATE_PATH,
  FANTASY_PATH,
  FANTASY_TRANSFERS_PATH,
  getMyFantasyTeam,
  getTransferWindow,
  listPickablePlayers,
} from "@/features/fantasy";
import { resolveFanTournament } from "@/features/home";
import { ButtonLink } from "@/ui/button-link";
import { PageHeader } from "@/ui/page-header";

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

  const [pool, transferWindow] = await Promise.all([
    listPickablePlayers(tournament.id),
    getTransferWindow(tournament.id),
  ]);

  if (transferWindow === "locked") {
    return (
      <FantasyTheme className="flex flex-col gap-4 px-4 py-4">
        <PageHeader
          title={fantasyCopy.transfersTitle}
          back={{ href: FANTASY_PATH, label: fantasyCopy.backToFantasy }}
        />
        <p className="text-sm">
          <span className="font-bold">{fantasyCopy.transfersLockedTitle}. </span>
          {fantasyCopy.transfersLockedBody}
        </p>
        <ButtonLink href={FANTASY_PATH} fullWidth>
          {fantasyCopy.backToFantasy}
        </ButtonLink>
      </FantasyTheme>
    );
  }

  return (
    <FantasyTransfersScreen
      team={team}
      pool={pool}
      budget={tournament.fantasyBudget}
      beforeFirstDeadline={transferWindow === "unlimited"}
    />
  );
}
