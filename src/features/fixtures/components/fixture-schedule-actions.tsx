import { Card } from "@/ui/card";

import type { FixtureStatus } from "@/config/fixture-status";

import { fixturesCopy } from "../copy";
import { PostponeFixtureButton } from "./postpone-fixture-button";
import { SetFixtureDateButton } from "./set-fixture-date-button";

type FixtureScheduleActionsProps = {
  tournamentId: string;
  fixtureId: string;
  status: FixtureStatus;
  locked: boolean;
};

export function FixtureScheduleActions({
  tournamentId,
  fixtureId,
  status,
  locked,
}: FixtureScheduleActionsProps): React.JSX.Element | null {
  if (locked) return null;
  if (status !== "published" && status !== "postponed") return null;

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-display text-lg uppercase">{fixturesCopy.scheduleTitle}</h2>
      {status === "published" ? (
        <PostponeFixtureButton tournamentId={tournamentId} fixtureId={fixtureId} />
      ) : (
        <SetFixtureDateButton tournamentId={tournamentId} fixtureId={fixtureId} />
      )}
    </Card>
  );
}
