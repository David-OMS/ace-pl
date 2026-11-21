import { crestInkForBackground } from "@/theme/crest-ink";

type TeamNameBadgeProps = {
  name: string;
  color: string;
};

/** Full club name on a kit-coloured chip (same ink rule as TeamCrest). */
export function TeamNameBadge({ name, color }: TeamNameBadgeProps): React.JSX.Element {
  return (
    <span
      className="inline-flex max-w-full truncate border border-line px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase"
      style={{ backgroundColor: color, color: crestInkForBackground(color) }}
    >
      {name}
    </span>
  );
}
