import { Card } from "@/ui/card";

import { matchesCopy } from "../copy";
import type { MatchEntry } from "../queries/get-match-entry";
import { TeamSquadCard } from "./team-squad-card";

export function WhoPlayedSection({ match }: { match: MatchEntry }): React.JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-lg uppercase">{matchesCopy.whoPlayed}</h2>
        <span className="text-xs font-bold text-muted">{matchesCopy.whoPlayedHint}</span>
      </div>
      <Card className="grid grid-cols-2 gap-3">
        <TeamSquadCard
          teamName={match.homeTeamName}
          teamColor={match.homeTeamColor}
          tournamentId={match.tournamentId}
          fixtureId={match.fixtureId}
          teamId={match.homeTeamId}
          players={match.homePlayers}
          borrowPool={match.homeBorrowPool}
          locked={!match.canEditResult}
        />
        <TeamSquadCard
          teamName={match.awayTeamName}
          teamColor={match.awayTeamColor}
          tournamentId={match.tournamentId}
          fixtureId={match.fixtureId}
          teamId={match.awayTeamId}
          players={match.awayPlayers}
          borrowPool={match.awayBorrowPool}
          locked={!match.canEditResult}
        />
      </Card>
    </section>
  );
}
