import Image from "next/image";

type PlayerAvatarProps = {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  priority?: boolean;
};

const SIZES = {
  sm: { box: "size-8", px: 32 },
  md: { box: "size-10", px: 40 },
  lg: { box: "size-[84px]", px: 84 },
  xl: { box: "size-28", px: 112 },
} as const;

/** Photo when set; otherwise a blank silhouette. Requests a 2x thumbnail, not the original file. */
export function PlayerAvatar({
  name,
  photoUrl,
  size = "md",
  priority = false,
}: PlayerAvatarProps): React.JSX.Element {
  const { box, px } = SIZES[size];
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={name}
        width={px * 2}
        height={px * 2}
        sizes={`${px}px`}
        priority={priority}
        className={`${box} shrink-0 object-cover`}
      />
    );
  }
  return (
    <span
      className={`${box} inline-flex shrink-0 items-end justify-center bg-surface-alt`}
      aria-hidden
    >
      <svg viewBox="0 0 40 40" className="h-[85%] w-[85%] text-muted" fill="currentColor">
        <circle cx="20" cy="14" r="8" />
        <path d="M6 38c0-8 6-14 14-14s14 6 14 14" />
      </svg>
    </span>
  );
}
