import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/ui/button-link";
import { Icon } from "@/ui/icon";
import { PageHeader } from "@/ui/page-header";

import { tournamentsCopy } from "../copy";
import type { TournamentSummary } from "../queries/list-tournaments";
import { adminTournamentPath, NEW_TOURNAMENT_PATH } from "../routes";

type TournamentsAdminScreenProps = { tournaments: readonly TournamentSummary[] };

export function TournamentsAdminScreen({
  tournaments,
}: TournamentsAdminScreenProps): React.JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
      <PageHeader
        title={tournamentsCopy.adminTitle}
        action={
          <ButtonLink href={NEW_TOURNAMENT_PATH}>
            <Icon icon={Plus} size="sm" />
            {tournamentsCopy.newTournament}
          </ButtonLink>
        }
      />
      {tournaments.length === 0 ? (
        <p className="text-sm text-muted">{tournamentsCopy.emptyList}</p>
      ) : (
        <ul className="flex flex-col divide-y-2 divide-line-soft rounded-card border-2 border-line bg-surface">
          {tournaments.map((tournament) => (
            <li key={tournament.id}>
              <Link
                href={adminTournamentPath(tournament.id)}
                className="flex min-h-14 items-center gap-3 px-3"
              >
                <span className="flex-1 font-bold">{tournament.name}</span>
                <span className="text-xs font-bold text-muted uppercase">
                  {tournamentsCopy.statuses[tournament.status]}
                </span>
                <Icon icon={ChevronRight} size="sm" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
