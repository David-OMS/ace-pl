import type { MatchEntry } from "@/features/matches";
import { Card } from "@/ui/card";

import { fanFixturesCopy } from "../copy";

import { FanReadonlySquad } from "./fan-readonly-squad";

type FanReadonlyLineupsProps = {
  match: MatchEntry;
  borrowFrom: ReadonlyMap<string, string>;
};

export function FanReadonlyLineups({
  match,
  borrowFrom,
}: FanReadonlyLineupsProps): React.JSX.Element {
  const hasPlayers = match.homePlayers.length + match.awayPlayers.length > 0;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg uppercase">{fanFixturesCopy.lineups}</h2>
      {hasPlayers ? (
        <Card className="grid grid-cols-2 gap-3">
          <FanReadonlySquad
            teamName={match.homeTeamName}
            teamColor={match.homeTeamColor}
            players={match.homePlayers}
            borrowFrom={borrowFrom}
          />
          <FanReadonlySquad
            teamName={match.awayTeamName}
            teamColor={match.awayTeamColor}
            players={match.awayPlayers}
            borrowFrom={borrowFrom}
          />
        </Card>
      ) : (
        <p className="text-sm text-muted">{fanFixturesCopy.noLineups}</p>
      )}
    </section>
  );
}
