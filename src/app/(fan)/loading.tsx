export default function FanLoading(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 px-4 py-4" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-40 animate-pulse bg-surface-alt" />
      <div className="h-24 animate-pulse bg-surface-alt" />
      <div className="h-40 animate-pulse bg-surface-alt" />
      <div className="h-28 animate-pulse bg-surface-alt" />
    </div>
  );
}
