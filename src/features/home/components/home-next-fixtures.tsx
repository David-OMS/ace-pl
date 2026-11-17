import { FAN_FIXTURES_PATH, fanFixturePath } from "@/features/fan";
import { formatKickoffTime } from "@/lib/dates/format-kickoff-time";
import { Card } from "@/ui/card";
import { FixturePairRow } from "@/ui/fixture-pair-row";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { homeCopy } from "../copy";
import type { HomeFixtureRow } from "../queries/load-home-next-fixtures";

type HomeNextFixturesProps = { fixtures: readonly HomeFixtureRow[] };

export function HomeNextFixtures({ fixtures }: HomeNextFixturesProps): React.JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-end justify-between px-1">
        <h2 className="font-display text-lg uppercase">{homeCopy.nextFixtures}</h2>
        <SoftNavLink href={FAN_FIXTURES_PATH} className="text-xs font-bold text-muted">
          {homeCopy.allFixtures}
        </SoftNavLink>
      </div>
      <Card className="px-3 py-1">
        {fixtures.length === 0 ? (
          <p className="py-3 text-sm text-muted">{homeCopy.noFixtures}</p>
        ) : (
          <ul>
            {fixtures.map((fixture) => (
              <li key={fixture.id}>
                <FixturePairRow
                  href={fanFixturePath(fixture.id)}
                  homeName={fixture.homeTeamName}
                  homeColor={fixture.homeTeamColor}
                  awayName={fixture.awayTeamName}
                  awayColor={fixture.awayTeamColor}
                  centre={formatKickoffTime(fixture.kickoffTime)}
                />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
