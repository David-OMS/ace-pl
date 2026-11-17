import { fanFixturePath } from "@/features/fan";
import type { FixtureListItem } from "@/features/fixtures";
import { Card } from "@/ui/card";

import { fanFixturesCopy } from "../copy";
import { pickDefaultGameDayId } from "../domain/pick-default-game-day";
import { findSelectedGroup, listPastGameDayGroups } from "../domain/partition-fan-fixture-board";
import type { FanFixtureBoard } from "../queries/get-fan-fixture-board";
import type { FixtureListScore } from "../queries/load-fan-fixture-scores";
import { FanFixtureDayChips } from "./fan-fixture-day-chips";
import { FanFixtureDaySection } from "./fan-fixture-day-section";
import { FanFixtureRow } from "./fan-fixture-row";

type FanFixturesScreenProps = {
  data: FanFixtureBoard;
  selectedGameDayId: string | null;
  todayIso: string;
};

export function FanFixturesScreen({
  data,
  selectedGameDayId,
  todayIso,
}: FanFixturesScreenProps): React.JSX.Element {
  const { board, scores, tournamentName } = data;
  const defaultDayId = pickDefaultGameDayId(board.groups, todayIso);
  const activeDayId = resolveSelectedDayId(selectedGameDayId, defaultDayId, board.gameDays);
  const selectedGroup = findSelectedGroup(board.groups, activeDayId);
  const pastGroups = listPastGameDayGroups(board.groups, selectedGroup?.gameDay.playedOn ?? null);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-end justify-between gap-2 px-1">
        <h1 className="font-display text-xl uppercase">{fanFixturesCopy.title}</h1>
        <p className="text-xs text-muted">{tournamentName}</p>
      </div>

      <FanFixtureDayChips gameDays={board.gameDays} selectedId={activeDayId} />

      {board.undated.length > 0 ? (
        <PostponedFixtures fixtures={board.undated} scores={scores} />
      ) : null}

      {selectedGroup ? (
        <FanFixtureDaySection group={selectedGroup} scores={scores} />
      ) : (
        <p className="text-sm text-muted">{fanFixturesCopy.emptyDay}</p>
      )}

      {pastGroups.map((group) => (
        <FanFixtureDaySection key={group.gameDay.id} group={group} scores={scores} pill="past" />
      ))}
    </div>
  );
}

function resolveSelectedDayId(
  fromUrl: string | null,
  defaultId: string | null,
  gameDays: { id: string }[],
): string | null {
  if (fromUrl && gameDays.some((day) => day.id === fromUrl)) return fromUrl;
  return defaultId;
}

function PostponedFixtures({
  fixtures,
  scores,
}: {
  fixtures: readonly FixtureListItem[];
  scores: ReadonlyMap<string, FixtureListScore>;
}): React.JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2 px-1">
        <h2 className="font-display text-lg uppercase">{fanFixturesCopy.statuses.postponed}</h2>
      </div>
      <Card className="px-3 py-1">
        {fixtures.map((fixture) => (
          <FanFixtureRow
            key={fixture.id}
            fixture={fixture}
            href={fanFixturePath(fixture.id)}
            score={scores.get(fixture.id) ?? null}
          />
        ))}
      </Card>
    </section>
  );
}
