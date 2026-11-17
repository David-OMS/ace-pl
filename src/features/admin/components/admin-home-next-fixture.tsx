import { adminFixturePath } from "@/features/fixtures";
import { formatKickoffTime } from "@/lib/dates/format-kickoff-time";
import { SoftNavLink } from "@/ui/soft-nav-link";
import { TeamCrest } from "@/ui/team-crest";

import { adminCopy } from "../copy";
import type { NextHomeFixture } from "../queries/get-next-fixture";

export function AdminHomeNextFixture({
  fixture,
}: {
  fixture: NextHomeFixture | null;
}): React.JSX.Element {
  const { home } = adminCopy;

  if (!fixture) {
    return (
      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg uppercase">{home.nextMatch}</h2>
        <p className="text-sm text-muted">{home.noNextMatch}</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-lg uppercase">
          {home.gmMatch(fixture.gameweek, fixture.matchIndex, fixture.matchesOnDay)}
        </h2>
        <span className="text-xs font-bold text-muted">
          {fixture.playedOnLabel} · {formatKickoffTime(fixture.kickoffTime)}
        </span>
      </div>
      <SoftNavLink
        href={adminFixturePath(fixture.tournamentId, fixture.id)}
        className="flex items-center justify-between border-2 border-line bg-hero px-3.5 py-3.5 text-on-hero shadow-[4px_4px_0_var(--color-hot)]"
      >
        <ScoreSide name={fixture.homeTeamName} color={fixture.homeTeamColor} />
        <div className="flex flex-col items-center gap-0.5 text-center">
          <span className="font-display text-4xl tracking-wide text-accent">vs</span>
          <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">
            {home.tapToEnter}
          </span>
        </div>
        <ScoreSide name={fixture.awayTeamName} color={fixture.awayTeamColor} />
      </SoftNavLink>
    </section>
  );
}

function ScoreSide({ name, color }: { name: string; color: string }): React.JSX.Element {
  return (
    <div className="flex w-[90px] flex-col items-center gap-1.5 text-center text-xs font-bold">
      <TeamCrest name={name} color={color} size="md" />
      <span className="w-full truncate">{name}</span>
    </div>
  );
}
