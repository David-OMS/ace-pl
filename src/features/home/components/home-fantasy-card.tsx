import { buildSignInHref } from "@/features/auth";
import { FAN_FANTASY_PATH } from "@/features/fan";
import { ButtonLink } from "@/ui/button-link";
import { Card } from "@/ui/card";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { homeCopy } from "../copy";
import type { HomeFantasyTeaser } from "../queries/get-home-snapshot";

type HomeFantasyCardProps = { fantasy: HomeFantasyTeaser };

export function HomeFantasyCard({ fantasy }: HomeFantasyCardProps): React.JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-end justify-between px-1">
        <h2 className="font-display text-lg uppercase">{homeCopy.fantasy}</h2>
        {fantasy.kind === "has_team" ? (
          <SoftNavLink href={FAN_FANTASY_PATH} className="text-xs font-bold text-muted">
            {homeCopy.fantasyOpen}
          </SoftNavLink>
        ) : null}
      </div>
      <Card>
        {fantasy.kind === "signed_out" ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">{homeCopy.fantasyIdle}</p>
            <ButtonLink href={buildSignInHref(FAN_FANTASY_PATH)}>
              {homeCopy.fantasySignIn}
            </ButtonLink>
          </div>
        ) : null}
        {fantasy.kind === "no_team" ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">{homeCopy.fantasyIdle}</p>
            <ButtonLink href={FAN_FANTASY_PATH}>{homeCopy.fantasyCreate}</ButtonLink>
          </div>
        ) : null}
        {fantasy.kind === "has_team" ? (
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-bold">{fantasy.teamName}</p>
              <p className="text-xs text-muted">{fantasy.rankLabel}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl">{fantasy.points ?? 0}</p>
              <p className="text-[11px] text-muted">pts</p>
            </div>
          </div>
        ) : null}
      </Card>
    </section>
  );
}
