import type { Route } from "next";

import type { FixtureStatus } from "@/config/fixture-status";
import { formatKickoffTime } from "@/lib/dates/format-kickoff-time";
import { FixturePairRow } from "@/ui/fixture-pair-row";

import { fanFixturesCopy } from "../copy";
import { isFixtureFinished } from "../domain/is-fixture-finished";
import type { FixtureListScore } from "../queries/load-fan-fixture-scores";

export type FanFixtureRowData = {
  id: string;
  kickoffTime: string;
  status: FixtureStatus;
  homeTeamName: string;
  homeTeamColor: string;
  awayTeamName: string;
  awayTeamColor: string;
};

type FanFixtureRowProps = {
  fixture: FanFixtureRowData;
  href: Route;
  score: FixtureListScore | null;
};

export function FanFixtureRow({ fixture, href, score }: FanFixtureRowProps): React.JSX.Element {
  return (
    <FixturePairRow
      href={href}
      homeName={fixture.homeTeamName}
      homeColor={fixture.homeTeamColor}
      awayName={fixture.awayTeamName}
      awayColor={fixture.awayTeamColor}
      centre={centreLabel(fixture, score)}
      centreSub={
        fixture.status === "walkover" ? (
          <span className="text-[9px] font-bold tracking-wide text-muted uppercase">
            {fanFixturesCopy.statuses.walkover}
          </span>
        ) : undefined
      }
    />
  );
}

function centreLabel(fixture: FanFixtureRowData, score: FixtureListScore | null): string {
  if (isFixtureFinished(fixture.status) && score) {
    return `${score.homeGoals} – ${score.awayGoals}`;
  }
  if (fixture.status === "postponed") return fanFixturesCopy.statuses.postponed;
  if (fixture.status === "published" || fixture.status === "draft") {
    return formatKickoffTime(fixture.kickoffTime);
  }
  return fanFixturesCopy.statuses[fixture.status];
}
