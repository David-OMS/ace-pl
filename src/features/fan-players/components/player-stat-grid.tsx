import { fanPlayersCopy } from "../copy";
import type { FanPlayerStatSnapshot } from "../queries/build-fan-player-stats";

type PlayerStatGridProps = { stats: FanPlayerStatSnapshot };

const CELLS: readonly { key: keyof FanPlayerStatSnapshot; label: string }[] = [
  { key: "apps", label: fanPlayersCopy.stat.apps },
  { key: "goals", label: fanPlayersCopy.stat.goals },
  { key: "assists", label: fanPlayersCopy.stat.assists },
  { key: "motm", label: fanPlayersCopy.stat.motm },
  { key: "yellowCards", label: fanPlayersCopy.stat.cards },
  { key: "fantasyPoints", label: fanPlayersCopy.stat.fantasy },
];

export function PlayerStatGrid({ stats }: PlayerStatGridProps): React.JSX.Element {
  return (
    <dl className="grid grid-cols-3 gap-2">
      {CELLS.map((cell) => (
        <StatCell key={cell.key} stat={stats} cell={cell} />
      ))}
    </dl>
  );
}

function StatCell({
  stat,
  cell,
}: {
  stat: FanPlayerStatSnapshot;
  cell: (typeof CELLS)[number];
}): React.JSX.Element {
  const value =
    cell.key === "yellowCards"
      ? fanPlayersCopy.cards(stat.yellowCards, stat.redCards)
      : stat[cell.key];
  return (
    <div className="border-2 border-line-soft bg-surface px-2 py-2 text-center">
      <dt className="text-[10px] font-bold tracking-wide text-muted uppercase">{cell.label}</dt>
      <dd className="font-display text-lg">{value}</dd>
    </div>
  );
}
