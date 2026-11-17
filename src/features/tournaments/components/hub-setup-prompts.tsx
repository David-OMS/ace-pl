import { ButtonLink } from "@/ui/button-link";
import { Card } from "@/ui/card";

import { tournamentsCopy } from "../copy";
import { adminNewTeamPath, adminTournamentPlayersPath } from "../routes";
import { HubActionLinks } from "./hub-action-links";

type HubSetupPromptsProps = {
  tournamentId: string;
  needsRoster: boolean;
  needsTeams: boolean;
  needsFixtures: boolean;
};

export function HubSetupPrompts({
  tournamentId,
  needsRoster,
  needsTeams,
  needsFixtures,
}: HubSetupPromptsProps): React.JSX.Element {
  const copy = tournamentsCopy.workspace;
  return (
    <>
      {needsRoster ? (
        <Card className="flex flex-col gap-3">
          <p className="text-sm text-muted">{copy.rosterEmpty}</p>
          <ButtonLink href={adminTournamentPlayersPath(tournamentId)} fullWidth>
            {copy.managePlayers}
          </ButtonLink>
        </Card>
      ) : null}
      {needsTeams ? (
        <Card className="flex flex-col gap-3">
          <p className="text-sm text-muted">{copy.teamsEmpty}</p>
          <ButtonLink href={adminNewTeamPath(tournamentId)} fullWidth>
            {copy.createTeams}
          </ButtonLink>
        </Card>
      ) : null}
      {!needsRoster ? (
        <HubActionLinks tournamentId={tournamentId} needsFixtures={needsFixtures} />
      ) : null}
    </>
  );
}
