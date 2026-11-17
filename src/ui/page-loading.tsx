const BLOCK_CLASSES = ["h-8 w-40", "h-24", "h-40", "h-28"] as const;

type PageLoadingProps = {
  label?: string;
  blocks?: 2 | 3 | 4;
};

/** Shared route / soft-nav skeleton. Keep pages free of one-off pulse markup. */
export function PageLoading({
  label = "Loading",
  blocks = 4,
}: PageLoadingProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 px-4 py-4" aria-busy="true" aria-label={label}>
      {BLOCK_CLASSES.slice(0, blocks).map((blockClass) => (
        <div key={blockClass} className={`${blockClass} animate-pulse bg-surface-alt`} />
      ))}
    </div>
  );
}
