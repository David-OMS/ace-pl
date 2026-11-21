import { fantasyCopy } from "../copy";
import { clubLimitBreaches } from "../domain/club-limit-breaches";

type ClubLimitBannerProps = {
  picks: readonly { clubTeamId?: string | null; clubName?: string | null }[];
};

export function ClubLimitBanner({ picks }: ClubLimitBannerProps): React.JSX.Element | null {
  const breaches = clubLimitBreaches(picks);
  if (breaches.length === 0) return null;

  return (
    <div role="alert" className="rounded-card border-2 border-hot bg-surface px-3 py-3 text-sm">
      <ul className="flex flex-col gap-1">
        {breaches.map((breach) => (
          <li key={breach.clubTeamId} className="font-bold text-hot">
            {fantasyCopy.clubLimitBanner(breach.count, breach.clubName)}
          </li>
        ))}
      </ul>
    </div>
  );
}
