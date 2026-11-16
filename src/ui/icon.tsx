import type { LucideIcon } from "lucide-react";

const SIZE_CLASSES = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

export type IconSize = keyof typeof SIZE_CLASSES;

export type IconProps = {
  icon: LucideIcon;
  size?: IconSize;
  /** Give a label when the icon carries meaning on its own; omit it when text sits next to it. */
  label?: string;
  className?: string;
};

/** The only way to render an icon, so the icon library can be swapped in one place. */
export function Icon({
  icon: Glyph,
  size = "md",
  label,
  className = "",
}: IconProps): React.JSX.Element {
  const sizeClass = SIZE_CLASSES[size];

  if (label) {
    return <Glyph className={`${sizeClass} ${className}`} role="img" aria-label={label} />;
  }
  return <Glyph className={`${sizeClass} ${className}`} aria-hidden="true" />;
}
