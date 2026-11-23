type PlayerAvatarProps = {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  priority?: boolean;
};

const SIZES = {
  sm: "size-8",
  md: "size-10",
  lg: "size-[84px]",
  xl: "size-28",
} as const;

/**
 * Photos are already cropped to 512px JPEG on upload (Supabase Storage).
 * Load them direct — no Vercel Image Optimization quota.
 */
export function PlayerAvatar({
  name,
  photoUrl,
  size = "md",
  priority = false,
}: PlayerAvatarProps): React.JSX.Element {
  const box = SIZES[size];
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- intentional: skip Vercel image transforms
      <img
        src={photoUrl}
        alt={name}
        width={128}
        height={128}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
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
