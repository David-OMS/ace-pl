"use client";

import { SoftNavLink } from "@/ui/soft-nav-link";
import { useSoftNavOptional } from "@/ui/soft-nav-context";
import { TeamCrest } from "@/ui/team-crest";

import type { StandingTeamRow } from "../queries/get-tournament-standings";
import { standingsTeamPath } from "../routes";

type StandingRowProps = { row: StandingTeamRow };

/**
 * Whole-row navigate without absolute overlays — `position:relative` on `<tr>`
 * is unreliable and was covering the viewport (every click → one team).
 */
export function StandingRow({ row }: StandingRowProps): React.JSX.Element {
  const softNav = useSoftNavOptional();
  const href = standingsTeamPath(row.teamId);

  return (
    <tr
      className="cursor-pointer border-b border-line-soft last:border-b-0"
      onClick={() => softNav?.navigate(href)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        softNav?.navigate(href);
      }}
      tabIndex={0}
    >
      <td className="px-2 py-3 font-bold">{row.position}</td>
      <td className="px-2 py-3" onClick={(event) => event.stopPropagation()}>
        <SoftNavLink href={href} className="inline-flex items-center gap-2 font-bold">
          <TeamCrest name={row.teamName} color={row.teamColor} />
          {row.teamName}
        </SoftNavLink>
      </td>
      <td className="px-2 py-3 text-center">{row.played}</td>
      <td className="px-2 py-3 text-center">{row.won}</td>
      <td className="px-2 py-3 text-center">{row.drawn}</td>
      <td className="px-2 py-3 text-center">{row.lost}</td>
      <td className="px-2 py-3 text-center">{row.goalsFor}</td>
      <td className="px-2 py-3 text-center">{row.goalsAgainst}</td>
      <td className="px-2 py-3 text-center">{formatGd(row.goalDifference)}</td>
      <td className="px-2 py-3 text-center font-bold">{row.points}</td>
    </tr>
  );
}

function formatGd(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}
