import { homeCopy } from "../copy";

export function HomePlaceholder(): React.JSX.Element {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-5">
      <p className="font-display text-5xl uppercase">
        {homeCopy.logoPrimary}{" "}
        <span className="bg-accent px-1 text-on-accent">{homeCopy.logoAccent}</span>
      </p>
      <section className="rounded-card border-2 border-line bg-surface p-4 shadow-offset">
        <h1 className="font-display text-xl uppercase">{homeCopy.placeholderTitle}</h1>
        <p className="mt-2 text-sm text-muted">{homeCopy.placeholderBody}</p>
      </section>
    </main>
  );
}
