import { Card } from "@/ui/card";

import { fantasyCopy } from "../copy";
import type { FantasyTransferLogRow } from "../queries/list-my-fantasy-transfers";

type FantasyTransferLogProps = {
  rows: readonly FantasyTransferLogRow[];
};

export function FantasyTransferLog({ rows }: FantasyTransferLogProps): React.JSX.Element | null {
  if (rows.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg uppercase">{fantasyCopy.transferLog}</h2>
      <p className="px-1 text-xs text-muted">{fantasyCopy.transferLogHint}</p>
      <Card className="flex flex-col p-0">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-start justify-between gap-3 border-b border-line-soft px-3 py-2.5 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {row.playerOutName} → {row.playerInName}
              </p>
              <p className="text-[10px] font-bold tracking-wide text-muted uppercase">
                {formatTransferWhen(row.createdAt)}
              </p>
            </div>
            <span className="shrink-0 font-display text-base">
              {row.pointCost > 0
                ? fantasyCopy.transferHit(row.pointCost)
                : fantasyCopy.transferFree}
            </span>
          </div>
        ))}
      </Card>
    </section>
  );
}

function formatTransferWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
