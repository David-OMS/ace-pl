import type { Route } from "next";

import { SoftNavLink } from "./soft-nav-link";
import { TeamCrest } from "./team-crest";

type FixturePairRowProps = {
  homeName: string;
  homeColor: string;
  awayName: string;
  awayColor: string;
  centre: React.ReactNode;
  centreSub?: React.ReactNode;
  href?: Route;
  trailing?: React.ReactNode;
};

/** Shared match row: home | centre | away — fan + admin. */
export function FixturePairRow({
  homeName,
  homeColor,
  awayName,
  awayColor,
  centre,
  centreSub,
  href,
  trailing,
}: FixturePairRowProps): React.JSX.Element {
  const body = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-2 text-sm font-bold">
        <TeamCrest name={homeName} color={homeColor} />
        <span className="truncate">{homeName}</span>
      </span>
      <span className="flex w-16 shrink-0 flex-col items-center gap-0.5 text-center">
        <span className="font-display text-lg">{centre}</span>
        {centreSub}
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-end gap-2 text-sm font-bold">
        <span className="truncate text-right">{awayName}</span>
        <TeamCrest name={awayName} color={awayColor} />
      </span>
    </>
  );

  return (
    <div className="flex items-center gap-2 border-b border-dashed border-line py-3 first:pt-0 last:border-b-0">
      {href ? (
        <SoftNavLink href={href} className="flex min-w-0 flex-1 items-center gap-2.5">
          {body}
        </SoftNavLink>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-2.5">{body}</div>
      )}
      {trailing}
    </div>
  );
}
