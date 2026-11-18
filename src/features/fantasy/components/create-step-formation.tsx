import { FANTASY_FORMATIONS, type FantasyFormation } from "@/config/fantasy";

import { fantasyCopy } from "../copy";

type CreateStepFormationProps = {
  formation: FantasyFormation;
  onChange: (formation: FantasyFormation) => void;
  /** When set, shapes outside this set look locked; tap still fires onBlocked. */
  allowed?: ReadonlySet<FantasyFormation> | undefined;
  onBlocked?: (formation: FantasyFormation) => void;
};

export function CreateStepFormation({
  formation,
  onChange,
  allowed,
  onBlocked,
}: CreateStepFormationProps): React.JSX.Element {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-xs font-bold tracking-wider text-muted uppercase">
        {fantasyCopy.formationLabel}
      </legend>
      <p className="text-xs text-muted">{fantasyCopy.formationHint}</p>
      <div className="grid grid-cols-2 gap-2">
        {FANTASY_FORMATIONS.map((option) => {
          const selected = option === formation;
          const locked = Boolean(allowed && !allowed.has(option));
          return (
            <button
              key={option}
              type="button"
              aria-disabled={locked}
              onClick={() => {
                // Keep the current shape tappable so a messy squad can re-snap into place.
                if (locked && option !== formation) {
                  onBlocked?.(option);
                  return;
                }
                onChange(option);
              }}
              className={`min-h-11 rounded-card border-2 border-line px-3 font-display text-lg ${
                locked ? "cursor-pointer opacity-40" : ""
              } ${selected ? "bg-accent text-on-accent" : "bg-surface"}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
