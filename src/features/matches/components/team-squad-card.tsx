import { TeamCrest } from "@/ui/team-crest";

import { matchesCopy } from "../copy";
import type { MatchPlayer } from "../queries/get-match-entry";
import { BorrowPlayerForm } from "./borrow-player-form";
import { ParticipationRow } from "./participation-row";

type TeamSquadCardProps = {
  teamName: string;
  teamColor: string;
  tournamentId: string;
  fixtureId: string;
  teamId: string;
  players: readonly MatchPlayer[];
  borrowPool: readonly { id: string; name: string }[];
  locked: boolean;
};

export function TeamSquadCard({
  teamName,
  teamColor,
  tournamentId,
  fixtureId,
  teamId,
  players,
  borrowPool,
  locked,
}: TeamSquadCardProps): React.JSX.Element {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h3 className="flex items-center gap-1.5 text-sm font-bold">
        <TeamCrest name={teamName} color={teamColor} />
        <span className="truncate">{teamName}</span>
      </h3>
      {players.length === 0 ? (
        <p className="text-xs text-muted">{matchesCopy.emptySquad}</p>
      ) : (
        <ul className="flex flex-col">
          {players.map((player) => (
            <ParticipationRow
              key={player.participationId}
              tournamentId={tournamentId}
              fixtureId={fixtureId}
              player={player}
              locked={locked}
            />
          ))}
        </ul>
      )}
      {locked ? null : (
        <BorrowPlayerForm
          tournamentId={tournamentId}
          fixtureId={fixtureId}
          teamId={teamId}
          pool={borrowPool}
        />
      )}
    </div>
  );
}
