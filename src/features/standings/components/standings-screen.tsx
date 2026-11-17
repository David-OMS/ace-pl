import { SamePagePending } from "@/ui/same-page-pending";

import { getTournamentForm } from "../queries/get-tournament-form";
import type { StandingsTournamentChip } from "../queries/list-standings-tournaments";
import type { TournamentStandings } from "../queries/get-tournament-standings";
import { standingsCopy } from "../copy";
import { StandingsForm } from "./standings-form";
import { StandingsTable } from "./standings-table";
import { StandingsTournamentChips } from "./standings-tournament-chips";

type StandingsScreenProps = {
  standings: TournamentStandings | null;
  tournaments: readonly StandingsTournamentChip[];
  selectedTournamentId: string | null;
};

export async function StandingsScreen({
  standings,
  tournaments,
  selectedTournamentId,
}: StandingsScreenProps): Promise<React.JSX.Element> {
  const formRows = selectedTournamentId ? await getTournamentForm(selectedTournamentId) : [];

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <StandingsTournamentChips tournaments={tournaments} selectedId={selectedTournamentId} />
      <SamePagePending>
        <div className="flex flex-col gap-4">
          {standings ? (
            <>
              <div className="flex items-end justify-between gap-2 px-1">
                <h1 className="font-display text-xl uppercase">{standingsCopy.title}</h1>
                <p className="text-xs text-muted">{standings.tournamentName}</p>
              </div>
              <StandingsTable rows={standings.rows} />
              <StandingsForm rows={orderFormByTable(formRows, standings.rows)} />
            </>
          ) : (
            <p className="text-sm text-muted">{standingsCopy.noTournament}</p>
          )}
        </div>
      </SamePagePending>
    </div>
  );
}

function orderFormByTable(
  formRows: Awaited<ReturnType<typeof getTournamentForm>>,
  tableRows: TournamentStandings["rows"],
): Awaited<ReturnType<typeof getTournamentForm>> {
  const byId = new Map(formRows.map((row) => [row.teamId, row]));
  return tableRows.flatMap((row) => {
    const form = byId.get(row.teamId);
    return form ? [form] : [];
  });
}
