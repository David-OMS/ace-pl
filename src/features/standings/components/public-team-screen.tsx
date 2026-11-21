import type { Route } from "next";

import { PageHeader } from "@/ui/page-header";
import { PlayerAvatar } from "@/ui/player-avatar";
import { TeamCrest } from "@/ui/team-crest";

import { standingsCopy } from "../copy";
import type { PublicTeamPage } from "../queries/get-public-team-page";
import { FormDots } from "./form-dots";

type PublicTeamScreenProps = {
  team: PublicTeamPage;
  backHref: Route;
};

export function PublicTeamScreen({ team, backHref }: PublicTeamScreenProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <PageHeader
        title={team.teamName}
        back={{ href: backHref, label: standingsCopy.title }}
      />
      <div className="flex items-center gap-3">
        <TeamCrest name={team.teamName} color={team.teamColor} size="md" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-muted uppercase">{team.tournamentName}</p>
          <p className="text-sm text-muted">{standingsCopy.formTitle}</p>
          <FormDots results={team.form} teamId={team.teamId} />
        </div>
      </div>
      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg uppercase">{standingsCopy.squadTitle}</h2>
        {team.squad.length === 0 ? (
          <p className="text-sm text-muted">{standingsCopy.squadEmpty}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {team.squad.map((player) => (
              <li
                key={player.id}
                className="flex items-center gap-3 border-2 border-line bg-surface px-3 py-2"
              >
                <PlayerAvatar name={player.name} photoUrl={player.photoUrl} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">
                    {player.name}
                    {player.isCaptain ? (
                      <span className="ml-1 text-xs text-muted">(C)</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted">{player.position}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
