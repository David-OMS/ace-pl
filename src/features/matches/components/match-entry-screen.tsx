import { FixtureScheduleActions } from "@/features/fixtures";
import { adminTournamentFixturesPath } from "@/features/tournaments";
import { PageHeader } from "@/ui/page-header";

import { matchesCopy } from "../copy";
import type { MatchEntry } from "../queries/get-match-entry";
import { MatchActionsBar } from "./match-actions-bar";
import { MatchEventsCard } from "./match-events-card";
import { MatchScoreHeader } from "./match-score-header";
import { WhoPlayedSection } from "./who-played-section";

type MatchEntryScreenProps = { match: MatchEntry };

export function MatchEntryScreen({ match }: MatchEntryScreenProps): React.JSX.Element {
  const allPlayers = [...match.homePlayers, ...match.awayPlayers].map((p) => ({
    id: p.playerId,
    name: p.name,
    teamId: p.teamId,
  }));

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pb-4">
      <PageHeader
        title={matchesCopy.title}
        back={{
          href: adminTournamentFixturesPath(match.tournamentId),
          label: matchesCopy.back,
        }}
      />
      <MatchScoreHeader match={match} />
      <FixtureScheduleActions
        tournamentId={match.tournamentId}
        fixtureId={match.fixtureId}
        status={match.status}
        locked={match.isLocked}
      />
      <WhoPlayedSection match={match} />
      <MatchEventsCard match={match} players={allPlayers} />
      {match.isLocked ? null : (
        <MatchActionsBar
          tournamentId={match.tournamentId}
          fixtureId={match.fixtureId}
          homeTeamId={match.homeTeamId}
          awayTeamId={match.awayTeamId}
          homeTeamName={match.homeTeamName}
          awayTeamName={match.awayTeamName}
        />
      )}
    </main>
  );
}
