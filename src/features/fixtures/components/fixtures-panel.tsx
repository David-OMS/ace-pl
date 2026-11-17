import { Card } from "@/ui/card";

import { fixturesCopy } from "../copy";
import type { TournamentFixtureBoard } from "../queries/list-tournament-fixtures";
import { CreateFixtureForm } from "./create-fixture-form";
import { FixtureMockRow } from "./fixture-mock-row";
import { FixturesDayGroup } from "./fixtures-day-group";
import { GenerateFixturesButton } from "./generate-fixtures-button";

type FixtureScore = { homeGoals: number; awayGoals: number };

type FixturesPanelProps = {
  tournamentId: string;
  board: TournamentFixtureBoard;
  scores?: ReadonlyMap<string, FixtureScore> | undefined;
};

export function FixturesPanel({
  tournamentId,
  board,
  scores,
}: FixturesPanelProps): React.JSX.Element {
  const hasAny =
    board.undated.length > 0 || board.groups.some((group) => group.fixtures.length > 0);

  return (
    <section className="flex flex-col gap-3">
      <Card className="flex flex-col gap-4">
        <h3 className="font-display text-lg uppercase">{fixturesCopy.generateTitle}</h3>
        <GenerateFixturesButton tournamentId={tournamentId} hasExisting={hasAny} />
        <h3 className="font-display text-lg uppercase">{fixturesCopy.form.addTitle}</h3>
        <AddFixtureBlock tournamentId={tournamentId} board={board} />
      </Card>

      {board.undated.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-lg uppercase">{fixturesCopy.undatedTitle}</h3>
            <span className="border border-hot bg-hot px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-on-hot uppercase">
              {fixturesCopy.undatedPill}
            </span>
          </div>
          <Card className="flex flex-col gap-0 p-3">
            {board.undated.map((fixture) => (
              <FixtureMockRow
                key={fixture.id}
                tournamentId={tournamentId}
                fixture={fixture}
                showTime={false}
                score={scores?.get(fixture.id) ?? null}
              />
            ))}
          </Card>
          <p className="text-xs text-muted">{fixturesCopy.undatedHint}</p>
        </div>
      ) : null}

      {board.groups.map((group) => (
        <FixturesDayGroup
          key={group.gameDay.id}
          tournamentId={tournamentId}
          group={group}
          scores={scores}
        />
      ))}

      {!hasAny ? <p className="text-sm text-muted">{fixturesCopy.empty}</p> : null}
    </section>
  );
}

function AddFixtureBlock({
  tournamentId,
  board,
}: {
  tournamentId: string;
  board: TournamentFixtureBoard;
}): React.JSX.Element {
  if (board.teams.length < 2) {
    return <p className="text-sm text-muted">{fixturesCopy.needTeams}</p>;
  }
  if (board.gameDays.length === 0) {
    return <p className="text-sm text-muted">{fixturesCopy.needGameDay}</p>;
  }
  return (
    <CreateFixtureForm tournamentId={tournamentId} teams={board.teams} gameDays={board.gameDays} />
  );
}
