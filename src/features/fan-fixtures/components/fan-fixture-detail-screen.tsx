import { FAN_FIXTURES_PATH } from "@/features/fan";
import { MatchScoreHeader } from "@/features/matches";
import { PageHeader } from "@/ui/page-header";

import { fanFixturesCopy } from "../copy";
import type { FanFixtureDetail } from "../queries/get-fan-fixture-detail";
import { FanReadonlyEvents } from "./fan-readonly-events";
import { FanReadonlyLineups } from "./fan-readonly-lineups";

type FanFixtureDetailScreenProps = {
  detail: FanFixtureDetail;
  borrowFrom: ReadonlyMap<string, string>;
};

export function FanFixtureDetailScreen({
  detail,
  borrowFrom,
}: FanFixtureDetailScreenProps): React.JSX.Element {
  const { match, mode, showScore } = detail;
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-4">
      <PageHeader
        title={fanFixturesCopy.detailTitle}
        back={{ href: FAN_FIXTURES_PATH, label: fanFixturesCopy.back }}
      />
      <MatchScoreHeader match={match} showLockedNote={false} showScore={showScore} />
      <FanReadonlyLineups match={match} borrowFrom={borrowFrom} mode={mode} />
      <FanReadonlyEvents match={match} borrowFrom={borrowFrom} />
    </div>
  );
}
