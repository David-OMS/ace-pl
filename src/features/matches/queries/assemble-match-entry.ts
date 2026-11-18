import type { FixtureStatus } from "@/config/fixture-status";
import type { MatchEventType, ParticipationStatus } from "@/config/match-events";
import type { PlayerPosition } from "@/config/player-positions";
import type { KeeperMode } from "@/config/tournament-rules";
import { DEFAULT_TEAM_COLOR } from "@/config/team-colors";
import { sortPlayers } from "@/features/players";
import { formatGameDay } from "@/lib/dates/format-game-day";

import { borrowPoolForTeam, teamHasGoalkeeper } from "../domain/borrow-pool-for-team";
import { calculateMatchScore } from "../domain/calculate-match-score";
import { resolveEventTeam } from "../domain/resolve-event-team";
import type { MatchEntry, MatchEventRow } from "./match-entry-types";
import { mapMatchPlayers } from "./map-match-players";

export type AssembleMatchEntryInput = {
  fixture: {
    id: string;
    tournament_id: string;
    status: FixtureStatus;
    kickoff_time: string;
    home_team_id: string;
    away_team_id: string;
  };
  teams: { id: string; name: string; color: string }[];
  gameDayPlayedOn: string | null;
  participations: {
    id: string;
    player_id: string;
    team_id: string;
    status: ParticipationStatus;
    is_goalkeeper: boolean;
  }[];
  events: {
    id: string;
    event_type: MatchEventType;
    player_id: string;
    assist_player_id: string | null;
    quantity: number;
    sort_order: number;
  }[];
  memberships: { player_id: string; team_id: string; is_captain: boolean }[];
  players: { id: string; name: string; position: PlayerPosition; is_active: boolean }[];
  keeperMode: KeeperMode;
  sharedKeeperIds: readonly string[];
};

const LOCKED: ReadonlySet<FixtureStatus> = new Set(["completed", "void", "walkover"]);

export function assembleMatchEntry(input: AssembleMatchEntryInput): MatchEntry {
  const { fixture, teams, gameDayPlayedOn, participations, events, memberships, players } = input;
  const teamName = new Map(teams.map((t) => [t.id, t.name]));
  const teamColor = new Map(teams.map((t) => [t.id, t.color]));
  const playerById = new Map(players.map((p) => [p.id, p]));
  const { homePlayers, awayPlayers } = mapMatchPlayers({
    participations,
    players,
    registered: new Map(memberships.map((m) => [m.player_id, m.team_id])),
    captainIds: new Set(memberships.filter((m) => m.is_captain).map((m) => m.player_id)),
    homeTeamId: fixture.home_team_id,
    awayTeamId: fixture.away_team_id,
  });
  const pools = sideBorrowPools(input, homePlayers, awayPlayers);

  return {
    fixtureId: fixture.id,
    tournamentId: fixture.tournament_id,
    status: fixture.status,
    homeTeamId: fixture.home_team_id,
    homeTeamName: teamName.get(fixture.home_team_id) ?? "?",
    homeTeamColor: teamColor.get(fixture.home_team_id) ?? DEFAULT_TEAM_COLOR,
    awayTeamId: fixture.away_team_id,
    awayTeamName: teamName.get(fixture.away_team_id) ?? "?",
    awayTeamColor: teamColor.get(fixture.away_team_id) ?? DEFAULT_TEAM_COLOR,
    kickoffTime: fixture.kickoff_time,
    gameDayLabel: gameDayPlayedOn ? formatGameDay(gameDayPlayedOn) : "",
    homePlayers,
    awayPlayers,
    ...pools,
    events: toEventRows(events, playerById),
    score: scoreFromEvents({
      homeTeamId: fixture.home_team_id,
      awayTeamId: fixture.away_team_id,
      events,
      lineup: [...homePlayers, ...awayPlayers],
    }),
    isLocked: LOCKED.has(fixture.status),
  };
}

function sideBorrowPools(
  input: AssembleMatchEntryInput,
  homePlayers: { playerId: string; isGoalkeeper: boolean }[],
  awayPlayers: { playerId: string; isGoalkeeper: boolean }[],
) {
  const onFixture = new Set([...homePlayers, ...awayPlayers].map((p) => p.playerId));
  const openPool = sortPlayers(
    input.players
      .filter((p) => p.is_active && !onFixture.has(p.id))
      .map((p) => ({ id: p.id, name: p.name, position: p.position, isActive: p.is_active })),
  ).map((p) => ({ id: p.id, name: p.name, position: p.position }));
  const poolArgs = {
    pool: openPool,
    sharedKeeperIds: input.sharedKeeperIds,
    keeperMode: input.keeperMode,
  };
  return {
    homeBorrowPool: borrowPoolForTeam({
      ...poolArgs,
      teamHasGoalkeeper: teamHasGoalkeeper(homePlayers),
    }),
    awayBorrowPool: borrowPoolForTeam({
      ...poolArgs,
      teamHasGoalkeeper: teamHasGoalkeeper(awayPlayers),
    }),
  };
}

function toEventRows(
  events: AssembleMatchEntryInput["events"],
  playerById: Map<string, { name: string }>,
): MatchEventRow[] {
  return events.map((row) => ({
    id: row.id,
    eventType: row.event_type,
    playerId: row.player_id,
    playerName: playerById.get(row.player_id)?.name ?? "?",
    assistPlayerId: row.assist_player_id,
    assistPlayerName: row.assist_player_id
      ? (playerById.get(row.assist_player_id)?.name ?? "?")
      : null,
    quantity: row.quantity,
    sortOrder: row.sort_order,
  }));
}

function scoreFromEvents({
  homeTeamId,
  awayTeamId,
  events,
  lineup,
}: {
  homeTeamId: string;
  awayTeamId: string;
  events: AssembleMatchEntryInput["events"];
  lineup: { playerId: string; teamId: string }[];
}) {
  const scoreEvents = events.flatMap((row) => {
    if (row.event_type !== "goal" && row.event_type !== "own_goal") return [];
    const teamId = resolveEventTeam(row.player_id, lineup);
    return teamId ? [{ eventType: row.event_type, teamId }] : [];
  });
  return calculateMatchScore({ homeTeamId, awayTeamId, events: scoreEvents });
}
