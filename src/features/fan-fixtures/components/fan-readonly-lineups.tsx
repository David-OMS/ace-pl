import type { MatchEntry } from "@/features/matches";
import { Card } from "@/ui/card";

import { fanFixturesCopy } from "../copy";
import type { FanLineupMode } from "../domain/resolve-fan-lineups";

import { FanReadonlySquad } from "./fan-readonly-squad";

type FanReadonlyLineupsProps = {
  match: MatchEntry;
  borrowFrom: ReadonlyMap<string, string>;
  mode: FanLineupMode;
};

export function FanReadonlyLineups({
  match,
  borrowFrom,
  mode,
}: FanReadonlyLineupsProps): React.JSX.Element {
  const hasPlayers = match.homePlayers.length + match.awayPlayers.length > 0;
  const title =
    mode === "squad_preview" ? fanFixturesCopy.squadsTitle : fanFixturesCopy.playedTitle;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg uppercase">{title}</h2>
      {hasPlayers ? (
        <Card className="grid grid-cols-2 gap-3">
          <FanReadonlySquad
            teamName={match.homeTeamName}
            teamColor={match.homeTeamColor}
            players={match.homePlayers}
            borrowFrom={borrowFrom}
            preview={mode === "squad_preview"}
          />
          <FanReadonlySquad
            teamName={match.awayTeamName}
            teamColor={match.awayTeamColor}
            players={match.awayPlayers}
            borrowFrom={borrowFrom}
            preview={mode === "squad_preview"}
          />
        </Card>
      ) : (
        <p className="text-sm text-muted">
          {mode === "squad_preview" ? fanFixturesCopy.noSquads : fanFixturesCopy.noLineups}
        </p>
      )}
    </section>
  );
}
