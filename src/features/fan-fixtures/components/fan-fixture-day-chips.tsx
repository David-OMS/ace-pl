import Link from "next/link";

import { FAN_FIXTURES_PATH } from "@/features/fan";
import type { FixtureGameDayHeading } from "@/features/fixtures";

import { fanFixturesCopy } from "../copy";

type FanFixtureDayChipsProps = {
  gameDays: readonly FixtureGameDayHeading[];
  selectedId: string | null;
};

export function FanFixtureDayChips({
  gameDays,
  selectedId,
}: FanFixtureDayChipsProps): React.JSX.Element | null {
  if (gameDays.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto px-1 pb-1">
      {gameDays.map((day) => {
        const active = day.id === selectedId;
        const href = `${FAN_FIXTURES_PATH}?day=${day.id}` as const;
        return (
          <Link
            key={day.id}
            href={href}
            className={`shrink-0 border-2 px-3 py-1.5 text-xs font-extrabold tracking-wide uppercase ${
              active
                ? "border-line bg-accent text-on-accent"
                : "border-line-soft bg-surface text-muted"
            }`}
          >
            {fanFixturesCopy.gameDayChip(day.gameweek, day.label)}
          </Link>
        );
      })}
    </div>
  );
}
