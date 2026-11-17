import { PlayerAvatar } from "@/ui/player-avatar";

import { fraudWatchCopy } from "../copy";
import type { HomeFraudWatchEntry } from "../queries/load-home-fraud-watch";

type HomeFraudWatchProps = {
  entries: readonly HomeFraudWatchEntry[];
};

export function HomeFraudWatch({ entries }: HomeFraudWatchProps): React.JSX.Element | null {
  if (entries.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="px-1 font-display text-lg uppercase">{fraudWatchCopy.title}</h2>
      <div className="bg-[repeating-linear-gradient(-45deg,var(--color-hazard)_0_14px,var(--color-hazard-alt)_14px_28px)] p-3">
        <ul className="flex flex-col gap-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 border-2 border-line bg-surface p-3"
            >
              <PlayerAvatar name={entry.playerName} photoUrl={entry.photoUrl} size="xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xl uppercase">{entry.playerName}</p>
                {entry.caption ? (
                  <p className="truncate text-sm text-muted">{entry.caption}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
