import type { Route } from "next";
import Link from "next/link";

import { TeamCrest } from "@/ui/team-crest";

import { tournamentsCopy } from "../copy";
import { adminTeamPath } from "../routes";
import type { HubPlayer, HubTeam } from "./tournament-hub-screen";

type HubTeamListProps = {
  tournamentId: string;
  squadSize: number;
  teams: readonly HubTeam[];
};

export function HubTeamList({
  tournamentId,
  squadSize,
  teams,
}: HubTeamListProps): React.JSX.Element {
  const copy = tournamentsCopy.workspace;
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg uppercase">{copy.teamsTitle}</h2>
      {teams.length === 0 ? (
        <p className="text-sm text-muted">{copy.teamsEmpty}</p>
      ) : (
        <ul className="flex flex-col divide-y-2 divide-line-soft rounded-card border-2 border-line bg-surface shadow-offset">
          {teams.map((team) => (
            <li key={team.id}>
              <Link
                href={adminTeamPath(tournamentId, team.id) as Route}
                className="flex min-h-14 items-center gap-3 px-3"
              >
                <TeamCrest name={team.name} color={team.color} />
                <span className="flex-1 font-bold">{team.name}</span>
                <span className="text-xs font-bold text-muted">
                  {team.playerCount}/{squadSize}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

type HubUnassignedProps = { players: readonly HubPlayer[] };

export function HubUnassignedList({ players }: HubUnassignedProps): React.JSX.Element {
  const copy = tournamentsCopy.workspace;
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg uppercase">{copy.unassignedTitle}</h2>
      {players.length === 0 ? (
        <p className="text-sm text-muted">{copy.unassignedEmpty}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line-soft rounded-card border-2 border-line bg-surface shadow-offset">
          {players.map((player) => (
            <li key={player.id} className="flex min-h-11 items-center gap-2 px-3 text-sm">
              <span className="w-10 text-xs font-bold">{player.position}</span>
              <span className="font-bold">{player.name}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
