import { Card } from "@/ui/card";

import { matchesCopy } from "../copy";
import type { MatchEntry } from "../queries/get-match-entry";
import { AddEventForm } from "./add-event-form";
import type { EventPlayerOption } from "./event-fields";
import { MatchEventsList } from "./match-events-list";

type MatchEventsCardProps = {
  match: MatchEntry;
  players: readonly EventPlayerOption[];
};

export function MatchEventsCard({ match, players }: MatchEventsCardProps): React.JSX.Element {
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-display text-lg uppercase">{matchesCopy.events}</h2>
      <MatchEventsList
        tournamentId={match.tournamentId}
        fixtureId={match.fixtureId}
        events={match.events}
        locked={!match.canEditResult}
      />
      {match.canEditResult ? (
        <AddEventForm
          tournamentId={match.tournamentId}
          fixtureId={match.fixtureId}
          players={players}
        />
      ) : null}
    </Card>
  );
}
