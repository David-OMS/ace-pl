import { fantasyCopy } from "../copy";

type FantasyGwScoreStripProps = {
  average: number | null;
  points: number | null;
  highest: number | null;
};

export function FantasyGwScoreStrip({
  average,
  points,
  highest,
}: FantasyGwScoreStripProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <ScoreCell value={average} label={fantasyCopy.averagePoints} />
      <ScoreCell value={points} label={fantasyCopy.gameweekPoints} emphasize />
      <ScoreCell value={highest} label={fantasyCopy.highestPoints} />
    </div>
  );
}

function ScoreCell(args: {
  value: number | null;
  label: string;
  emphasize?: boolean;
}): React.JSX.Element {
  const display = args.value === null ? "—" : String(args.value);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <p className={args.emphasize ? "font-display text-4xl" : "font-display text-2xl"}>{display}</p>
      <p className="text-[10px] font-bold tracking-wide text-muted uppercase">{args.label}</p>
    </div>
  );
}
