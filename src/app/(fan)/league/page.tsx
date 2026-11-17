import type { Metadata } from "next";

import { resolveFanTournament } from "@/features/home";
import {
  getTournamentStandings,
  listStandingsTournaments,
  standingsCopy,
  StandingsScreen,
} from "@/features/standings";

export const metadata: Metadata = { title: standingsCopy.title };

type LeaguePageProps = {
  searchParams: Promise<{ tournament?: string }>;
};

export default async function LeaguePage({
  searchParams,
}: LeaguePageProps): Promise<React.JSX.Element> {
  const [params, tournaments, current] = await Promise.all([
    searchParams,
    listStandingsTournaments(),
    resolveFanTournament(),
  ]);
  const selectedId = pickTournamentId(tournaments, params.tournament, current?.id ?? null);
  const standings = selectedId ? await getTournamentStandings(selectedId) : null;

  return (
    <StandingsScreen
      standings={standings}
      tournaments={tournaments}
      selectedTournamentId={selectedId}
    />
  );
}

function pickTournamentId(
  tournaments: readonly { id: string }[],
  requested: string | undefined,
  currentId: string | null,
): string | null {
  if (requested && tournaments.some((tournament) => tournament.id === requested)) return requested;
  if (currentId && tournaments.some((tournament) => tournament.id === currentId)) return currentId;
  return tournaments[0]?.id ?? null;
}
