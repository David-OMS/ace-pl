import { homeCopy } from "../copy";
import type { HomeHero as HomeHeroData } from "../queries/load-home-hero";

type HomeHeroProps = { hero: HomeHeroData | null };

export function HomeHero({ hero }: HomeHeroProps): React.JSX.Element {
  if (!hero) {
    return (
      <section className="bg-hero px-4 py-5 text-on-hero">
        <p className="font-display text-2xl uppercase">{homeCopy.tournamentIdle}</p>
      </section>
    );
  }

  const eyebrow = hero.gameweekLabel
    ? `Current tournament · GW ${hero.gameweekLabel}`
    : "Current tournament";

  return (
    <section className="bg-hero px-4 py-5 text-on-hero">
      <p className="text-xs font-bold tracking-wide text-on-hero/70 uppercase">{eyebrow}</p>
      <h1 className="mt-1 font-display text-3xl uppercase">{hero.tournamentName}</h1>
      <p className="mt-2 text-sm text-on-hero/80">
        {hero.nextUpLabel
          ? homeCopy.nextUp(hero.nextUpLabel, hero.nextMatchCount)
          : homeCopy.nextUpIdle}
      </p>
      <div className="mt-4 flex gap-6">
        <HeroStat value={hero.played} label={homeCopy.stats.played} />
        <HeroStat value={hero.goals} label={homeCopy.stats.goals} />
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: number; label: string }): React.JSX.Element {
  return (
    <div className="flex flex-col">
      <span className="font-display text-2xl">{value}</span>
      <span className="text-[11px] font-bold tracking-wide uppercase opacity-70">{label}</span>
    </div>
  );
}
