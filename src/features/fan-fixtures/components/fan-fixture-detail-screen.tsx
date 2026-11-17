import { FAN_FIXTURES_PATH } from "@/features/fan";
import type { MatchEntry } from "@/features/matches";
import { MatchScoreHeader } from "@/features/matches";
import { PageHeader } from "@/ui/page-header";

import { fanFixturesCopy } from "../copy";
import { FanReadonlyEvents } from "./fan-readonly-events";
import { FanReadonlyLineups } from "./fan-readonly-lineups";

type FanFixtureDetailScreenProps = {
  match: MatchEntry;
  borrowFrom: ReadonlyMap<string, string>;
};

export function FanFixtureDetailScreen({
  match,
  borrowFrom,
}: FanFixtureDetailScreenProps): React.JSX.Element {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-4">
      <PageHeader
        title={fanFixturesCopy.detailTitle}
        back={{ href: FAN_FIXTURES_PATH, label: fanFixturesCopy.back }}
      />
      <MatchScoreHeader match={match} showLockedNote={false} />
      <FanReadonlyLineups match={match} borrowFrom={borrowFrom} />
      <FanReadonlyEvents match={match} borrowFrom={borrowFrom} />
    </div>
  );
}
