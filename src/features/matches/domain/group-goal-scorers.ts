import { resolveEventTeam } from "./resolve-event-team";

export type GoalScorerLine = {
  playerName: string;
  assistName: string | null;
};

type GoalEvent = {
  eventType: string;
  playerId: string;
  playerName: string;
  assistPlayerName: string | null;
};

type LineupPlayer = { playerId: string; teamId: string };

/** Goal lines for the scoreboard, home/away under each crest. */
export function groupGoalScorers(args: {
  homeTeamId: string;
  awayTeamId: string;
  lineup: readonly LineupPlayer[];
  events: readonly GoalEvent[];
}): { home: GoalScorerLine[]; away: GoalScorerLine[] } {
  const home: GoalScorerLine[] = [];
  const away: GoalScorerLine[] = [];

  for (const event of args.events) {
    if (event.eventType !== "goal" && event.eventType !== "own_goal") continue;
    const teamId = resolveEventTeam(event.playerId, args.lineup);
    if (!teamId) continue;
    const line = {
      playerName: event.playerName,
      assistName: event.eventType === "goal" ? event.assistPlayerName : null,
    };
    if (teamId === args.homeTeamId) home.push(line);
    else if (teamId === args.awayTeamId) away.push(line);
  }

  return { home, away };
}
