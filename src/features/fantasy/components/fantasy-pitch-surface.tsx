type FantasyPitchSurfaceProps = {
  children: React.ReactNode;
  className?: string;
};

/** Grass pitch with centre circle, halfway line and boxes. */
export function FantasyPitchSurface({
  children,
  className = "",
}: FantasyPitchSurfaceProps): React.JSX.Element {
  return (
    <div
      className={`relative overflow-hidden rounded-card border-2 border-line bg-pitch ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--ace-pitch) 0 12%, var(--ace-pitch-alt) 12% 24%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-[8%] inset-y-[6%] border border-on-hero/35" />
      <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-on-hero/40" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-on-hero/40" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[18%] w-[42%] -translate-x-1/2 border border-t-0 border-on-hero/35" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[18%] w-[42%] -translate-x-1/2 border border-b-0 border-on-hero/35" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[8%] w-[22%] -translate-x-1/2 border border-t-0 border-on-hero/35" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[8%] w-[22%] -translate-x-1/2 border border-b-0 border-on-hero/35" />
      <div className="relative flex flex-col gap-4 px-2 py-4">{children}</div>
    </div>
  );
}
