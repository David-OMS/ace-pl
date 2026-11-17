import { FANTASY_FORMATIONS, type FantasyFormation } from "@/config/fantasy";

import { fantasyCopy } from "../copy";

type CreateStepFormationProps = {
  formation: FantasyFormation;
  onChange: (formation: FantasyFormation) => void;
  /** When set, other shapes are disabled (position lock). */
  allowed?: ReadonlySet<FantasyFormation> | undefined;
};

export function CreateStepFormation({
  formation,
  onChange,
  allowed,
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
              disabled={locked}
              onClick={() => onChange(option)}
              className={`min-h-11 rounded-card border-2 border-line px-3 font-display text-lg disabled:cursor-not-allowed disabled:opacity-40 ${
                selected ? "bg-accent text-on-accent" : "bg-surface"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {allowed ? <p className="text-xs text-muted">{fantasyCopy.formationLockedHint}</p> : null}
    </fieldset>
  );
}
