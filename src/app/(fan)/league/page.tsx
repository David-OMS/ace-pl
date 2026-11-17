import type { Metadata } from "next";

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
  const params = await searchParams;
  const tournaments = await listStandingsTournaments();
  const selectedId =
    params.tournament && tournaments.some((t) => t.id === params.tournament)
      ? params.tournament
      : (tournaments[0]?.id ?? null);
  const standings = selectedId ? await getTournamentStandings(selectedId) : null;

  return (
    <StandingsScreen
      standings={standings}
      tournaments={tournaments}
      selectedTournamentId={selectedId}
    />
  );
}
