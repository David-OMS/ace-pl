import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth";
import { loadFanFixtureScores } from "@/features/fan-fixtures";
import { syncTournamentFantasyScores } from "@/features/fantasy";
import { FixturesPanel, fixturesCopy, listTournamentFixtures } from "@/features/fixtures";
import { ADMIN_TOURNAMENTS_PATH, adminTournamentPath, getTournament } from "@/features/tournaments";
import { PageHeader } from "@/ui/page-header";

export const metadata: Metadata = { title: fixturesCopy.manageTitle };

export default async function TournamentFixturesPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}): Promise<React.JSX.Element> {
  const { tournamentId } = await params;
  await requireAdmin(`${ADMIN_TOURNAMENTS_PATH}/${tournamentId}/fixtures`);

  const tournament = await getTournament(tournamentId);
  if (!tournament) notFound();

  const board = await listTournamentFixtures(tournament.id);
  await syncTournamentFantasyScores(tournament.id);

  const scoreInputs = [...board.undated, ...board.groups.flatMap((group) => group.fixtures)].map(
    (fixture) => ({
      id: fixture.id,
      status: fixture.status,
      homeTeamId: fixture.homeTeamId,
      awayTeamId: fixture.awayTeamId,
    }),
  );
  const scores = await loadFanFixtureScores(scoreInputs);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pb-4">
      <PageHeader
        title={fixturesCopy.manageTitle}
        back={{ href: adminTournamentPath(tournament.id), label: tournament.name }}
      />
      <FixturesPanel tournamentId={tournament.id} board={board} scores={scores} />
    </main>
  );
}
