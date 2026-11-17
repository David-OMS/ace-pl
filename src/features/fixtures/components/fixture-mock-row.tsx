import { formatKickoffTime } from "@/lib/dates/format-kickoff-time";
import { FixturePairRow } from "@/ui/fixture-pair-row";

import type { FixtureListItem } from "../queries/list-tournament-fixtures";
import { adminFixturePath } from "../routes";
import { DeleteFixtureButton } from "./delete-fixture-button";

type FixtureScore = { homeGoals: number; awayGoals: number };

type FixtureMockRowProps = {
  tournamentId: string;
  fixture: FixtureListItem;
  showTime?: boolean;
  score?: FixtureScore | null;
};

export function FixtureMockRow({
  tournamentId,
  fixture,
  showTime = true,
  score = null,
}: FixtureMockRowProps): React.JSX.Element {
  const finished = fixture.status === "completed" || fixture.status === "walkover";
  const centre = finished
    ? score
      ? `${score.homeGoals} – ${score.awayGoals}`
      : "FT"
    : showTime
      ? formatKickoffTime(fixture.kickoffTime)
      : "TBD";

  return (
    <FixturePairRow
      href={adminFixturePath(tournamentId, fixture.id)}
      homeName={fixture.homeTeamName}
      homeColor={fixture.homeTeamColor}
      awayName={fixture.awayTeamName}
      awayColor={fixture.awayTeamColor}
      centre={centre}
      centreSub={
        fixture.status === "walkover" ? (
          <span className="text-[9px] font-bold tracking-wide text-muted uppercase">WO</span>
        ) : undefined
      }
      trailing={
        finished ? undefined : (
          <DeleteFixtureButton tournamentId={tournamentId} fixtureId={fixture.id} />
        )
      }
    />
  );
}
