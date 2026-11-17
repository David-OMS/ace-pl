import type { Route } from "next";

import { fanFixturePath } from "@/features/fan";
import { Card } from "@/ui/card";

import { fanFixturesCopy } from "../copy";
import {
  selectedDayHasOpenFixtures,
  type FanFixtureGameDayGroup,
} from "../domain/partition-fan-fixture-board";
import type { FixtureListScore } from "../queries/load-fan-fixture-scores";
import { FanFixtureRow, type FanFixtureRowData } from "./fan-fixture-row";

type FanFixtureDaySectionProps = {
  group: FanFixtureGameDayGroup<FanFixtureRowData>;
  scores: Record<string, FixtureListScore>;
  fixtureHref?: (fixtureId: string) => Route;
  pill?: "upcoming" | "past";
};

export function FanFixtureDaySection({
  group,
  scores,
  fixtureHref = fanFixturePath,
  pill,
}: FanFixtureDaySectionProps): React.JSX.Element {
  const resolvedPill = pill ?? (selectedDayHasOpenFixtures(group) ? "upcoming" : "past");

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2 px-1">
        <h2 className="font-display text-lg uppercase">{group.gameDay.label}</h2>
        <span
          className={`border px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${
            resolvedPill === "upcoming"
              ? "border-line bg-accent text-on-accent"
              : "border-line bg-surface-alt text-ink"
          }`}
        >
          {resolvedPill === "upcoming" ? fanFixturesCopy.upcomingPill : fanFixturesCopy.pastPill}
        </span>
      </div>
      <Card className="px-3 py-1">
        {group.fixtures.length === 0 ? (
          <p className="py-3 text-sm text-muted">{fanFixturesCopy.emptyDay}</p>
        ) : (
          group.fixtures.map((fixture) => (
            <FanFixtureRow
              key={fixture.id}
              fixture={fixture}
              href={fixtureHref(fixture.id)}
              score={scores[fixture.id] ?? null}
            />
          ))
        )}
      </Card>
    </section>
  );
}
