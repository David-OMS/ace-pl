import { PlayerAvatar } from "@/ui/player-avatar";

import { pitchSlotToneClasses, type PitchSlotTone } from "./pitch-slot-tone";

type FantasyPitchSlotProps = {
  name: string;
  photoUrl: string | null;
  badge?: string | null;
  meta?: string | undefined;
  tone?: PitchSlotTone;
  selected?: boolean;
  /** Same-position swap partner while someone else is selected. */
  swapTarget?: boolean;
  dimmed?: boolean;
  onSelect?: (() => void) | undefined;
};

type EmptyPitchSlotProps = {
  label: string;
  tone?: PitchSlotTone;
  onSelect: () => void;
};

// eslint-disable-next-line complexity -- slot chrome variants
export function FantasyPitchSlot({
  name,
  photoUrl,
  badge = null,
  meta,
  tone = "pitch",
  selected = false,
  swapTarget = false,
  dimmed = false,
  onSelect,
}: FantasyPitchSlotProps): React.JSX.Element {
  const { nameClass, metaClass } = pitchSlotToneClasses(tone);
  const dimClass = dimmed ? "opacity-40" : "";
  const body = (
    <>
      <div className="relative">
        <PlayerAvatar name={name} photoUrl={photoUrl} size="md" />
        {badge ? (
          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-card bg-accent text-[10px] font-bold text-on-accent">
            {badge}
          </span>
        ) : null}
      </div>
      <p className={`w-full truncate text-center text-[10px] font-bold ${nameClass}`}>{name}</p>
      {meta ? <p className={`text-[10px] font-bold ${metaClass}`}>{meta}</p> : null}
    </>
  );

  const className = `relative flex w-16 flex-col items-center gap-1 ${dimClass}`;
  if (!onSelect) return <div className={className}>{body}</div>;

  const ringClass = selected
    ? "ring-2 ring-accent ring-offset-2 ring-offset-pitch"
    : swapTarget
      ? "ring-2 ring-hot ring-offset-2 ring-offset-pitch animate-pulse"
      : "";
  return (
    <button type="button" onClick={onSelect} className={`${className} rounded-card ${ringClass}`}>
      {body}
    </button>
  );
}

/** Empty + slot — same tone rules as a filled FantasyPitchSlot. */
export function EmptyPitchSlot({
  label,
  tone = "pitch",
  onSelect,
}: EmptyPitchSlotProps): React.JSX.Element {
  const { emptyClass, plusBorder, plusBg } = pitchSlotToneClasses(tone);
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative flex w-16 flex-col items-center gap-1"
    >
      <span
        className={`grid size-10 place-items-center border-2 border-dashed text-xs font-bold ${plusBorder} ${plusBg}`}
      >
        +
      </span>
      <span className={`w-full truncate text-center text-[10px] font-bold ${emptyClass}`}>
        {label}
      </span>
    </button>
  );
}
