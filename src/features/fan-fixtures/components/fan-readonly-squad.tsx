import type { MatchPlayer } from "@/features/matches";
import { TeamCrest } from "@/ui/team-crest";

import { fanFixturesCopy } from "../copy";

type FanReadonlySquadProps = {
  teamName: string;
  teamColor: string;
  players: readonly MatchPlayer[];
  borrowFrom: ReadonlyMap<string, string>;
};

export function FanReadonlySquad({
  teamName,
  teamColor,
  players,
  borrowFrom,
}: FanReadonlySquadProps): React.JSX.Element {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h3 className="flex items-center gap-1.5 text-sm font-bold">
        <TeamCrest name={teamName} color={teamColor} />
        <span className="truncate">{teamName}</span>
      </h3>
      {players.length === 0 ? (
        <p className="text-xs text-muted">{fanFixturesCopy.emptySquad}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {players.map((player) => (
            <li
              key={player.participationId}
              className={`flex min-h-10 items-center gap-2 border-2 px-2 text-sm font-bold ${
                player.status === "absent"
                  ? "border-dashed border-line bg-canvas text-muted line-through opacity-50"
                  : "border-line bg-surface"
              }`}
            >
              <span className="bg-surface-alt px-1 py-0.5 text-[9px] font-extrabold tracking-wide">
                {player.position}
              </span>
              <span className="flex-1 truncate">{player.name}</span>
              <PlayerLabels
                player={player}
                fromTeam={borrowFrom.get(player.playerId)}
                forTeam={teamName}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlayerLabels({
  player,
  fromTeam,
  forTeam,
}: {
  player: MatchPlayer;
  fromTeam: string | undefined;
  forTeam: string;
}): React.JSX.Element {
  return (
    <>
      {player.isBorrowed && fromTeam ? (
        <span
          className="max-w-[5.5rem] truncate text-[9px] font-bold text-muted"
          title={fanFixturesCopy.borrowNote(player.name, fromTeam, forTeam)}
        >
          {fanFixturesCopy.loan}
        </span>
      ) : null}
      {player.isGoalkeeper ? (
        <span className="text-xs font-bold text-accent" title={fanFixturesCopy.keeper}>
          GK
        </span>
      ) : null}
    </>
  );
}
