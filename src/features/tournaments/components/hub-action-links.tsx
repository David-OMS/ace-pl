import { adminFantasyRanksPath, fantasyCopy } from "@/features/fantasy";
import { ButtonLink } from "@/ui/button-link";

import { tournamentsCopy } from "../copy";
import {
  adminNewTeamPath,
  adminTournamentFixturesPath,
  adminTournamentPlayersPath,
} from "../routes";

type HubActionLinksProps = {
  tournamentId: string;
  needsFixtures: boolean;
};

export function HubActionLinks({
  tournamentId,
  needsFixtures,
}: HubActionLinksProps): React.JSX.Element {
  const copy = tournamentsCopy.workspace;
  return (
    <div className="flex flex-col gap-2">
      <ButtonLink href={adminTournamentPlayersPath(tournamentId)} variant="secondary" fullWidth>
        {copy.managePlayers}
      </ButtonLink>
      <ButtonLink href={adminNewTeamPath(tournamentId)} variant="secondary" fullWidth>
        {copy.createTeams}
      </ButtonLink>
      <ButtonLink
        href={adminTournamentFixturesPath(tournamentId)}
        variant={needsFixtures ? "primary" : "secondary"}
        fullWidth
      >
        {copy.manageFixtures}
      </ButtonLink>
      <ButtonLink href={adminFantasyRanksPath(tournamentId)} variant="secondary" fullWidth>
        {fantasyCopy.adminRanksLink}
      </ButtonLink>
    </div>
  );
}
