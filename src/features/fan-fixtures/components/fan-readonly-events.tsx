import type { MatchEntry, MatchEventRow } from "@/features/matches";
import { Card } from "@/ui/card";

import { fanFixturesCopy } from "../copy";

type FanReadonlyEventsProps = {
  match: MatchEntry;
  borrowFrom: ReadonlyMap<string, string>;
};

export function FanReadonlyEvents({
  match,
  borrowFrom,
}: FanReadonlyEventsProps): React.JSX.Element | null {
  if (!match.isLocked) return null;

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-display text-lg uppercase">{fanFixturesCopy.events}</h2>
      {match.events.length === 0 ? (
        <p className="text-sm text-muted">{fanFixturesCopy.noEvents}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line-soft">
          {match.events.map((event) => (
            <EventLine key={event.id} event={event} match={match} borrowFrom={borrowFrom} />
          ))}
        </ul>
      )}
    </Card>
  );
}

function EventLine({
  event,
  match,
  borrowFrom,
}: {
  event: MatchEventRow;
  match: MatchEntry;
  borrowFrom: ReadonlyMap<string, string>;
}): React.JSX.Element {
  const player = [...match.homePlayers, ...match.awayPlayers].find(
    (row) => row.playerId === event.playerId,
  );
  const fromTeam = borrowFrom.get(event.playerId);
  const playedFor = player ? teamNameForId(match, player.teamId) : null;
  const borrowNote =
    player?.isBorrowed && fromTeam && playedFor
      ? fanFixturesCopy.borrowNote(event.playerName, fromTeam, playedFor)
      : null;
  const detail =
    event.eventType === "saves"
      ? String(event.quantity)
      : event.assistPlayerName
        ? `· ${event.assistPlayerName}`
        : "";

  return (
    <li className="flex flex-col gap-0.5 py-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-24 font-bold uppercase">
          {fanFixturesCopy.eventTypes[event.eventType]}
        </span>
        <span className="flex-1 font-bold">
          {event.playerName} {detail}
        </span>
      </div>
      {borrowNote ? <span className="text-xs text-muted">{borrowNote}</span> : null}
    </li>
  );
}

function teamNameForId(match: MatchEntry, teamId: string): string {
  return teamId === match.homeTeamId ? match.homeTeamName : match.awayTeamName;
}
