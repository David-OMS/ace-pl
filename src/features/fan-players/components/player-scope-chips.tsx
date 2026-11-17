import { fanPlayersCopy } from "../copy";

type PlayerScope = "tournament" | "allTime";

type PlayerScopeChipsProps = {
  scope: PlayerScope;
  tournamentLabel: string;
  onScope: (scope: PlayerScope) => void;
  tournamentDisabled: boolean;
};

export function PlayerScopeChips({
  scope,
  tournamentLabel,
  onScope,
  tournamentDisabled,
}: PlayerScopeChipsProps): React.JSX.Element {
  return (
    <div className="flex gap-2 overflow-x-auto px-1 pb-1">
      <ScopeChip
        label={tournamentLabel}
        active={scope === "tournament"}
        disabled={tournamentDisabled}
        onClick={() => onScope("tournament")}
      />
      <ScopeChip
        label={fanPlayersCopy.scopeAllTime}
        active={scope === "allTime"}
        onClick={() => onScope("allTime")}
      />
    </div>
  );
}

type ScopeChipProps = {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ScopeChip({ label, active, disabled, onClick }: ScopeChipProps): React.JSX.Element {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`shrink-0 border-2 px-3 py-1.5 text-xs font-extrabold tracking-wide uppercase ${
        active ? "border-line bg-accent text-on-accent" : "border-line-soft bg-surface text-muted"
      } ${disabled ? "opacity-40" : ""}`}
    >
      {label}
    </button>
  );
}
