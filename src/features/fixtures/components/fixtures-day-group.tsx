import { Card } from "@/ui/card";

import { fixturesCopy } from "../copy";
import type { FixtureGameDayGroup } from "../domain/group-fixtures-by-game-day";
import type { FixtureListItem } from "../queries/list-tournament-fixtures";
import { FixtureMockRow } from "./fixture-mock-row";

type FixtureScore = { homeGoals: number; awayGoals: number };

type FixturesDayGroupProps = {
  tournamentId: string;
  group: FixtureGameDayGroup<FixtureListItem>;
  scores?: ReadonlyMap<string, FixtureScore> | undefined;
};

export function FixturesDayGroup({
  tournamentId,
  group,
  scores,
}: FixturesDayGroupProps): React.JSX.Element {
  const live = group.fixtures.some(
    (fixture) => fixture.status === "published" || fixture.status === "completed",
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-lg uppercase">
          {fixturesCopy.gameweekHeading(group.gameDay.gameweek ?? 0, group.gameDay.label)}
        </h3>
        <span
          className={`border px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${
            live ? "border-line bg-accent text-on-accent" : "border-line bg-surface-alt text-ink"
          }`}
        >
          {live ? fixturesCopy.dayPublished : fixturesCopy.dayDraft}
        </span>
      </div>
      {group.fixtures.length === 0 ? (
        <p className="text-sm text-muted">{fixturesCopy.emptyGameDay}</p>
      ) : (
        <Card className="flex flex-col gap-0 p-3">
          {group.fixtures.map((fixture) => (
            <FixtureMockRow
              key={fixture.id}
              tournamentId={tournamentId}
              fixture={fixture}
              score={scores?.get(fixture.id) ?? null}
            />
          ))}
        </Card>
      )}
    </div>
  );
}
