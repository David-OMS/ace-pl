export type ScoreEvent = {
  eventType: "goal" | "own_goal";
  /** Team the player was lined up for in this match. */
  teamId: string;
};

export type MatchScore = { homeGoals: number; awayGoals: number };

type CalculateMatchScoreInput = {
  homeTeamId: string;
  awayTeamId: string;
  events: readonly ScoreEvent[];
};

/**
 * Score from goals only. A goal counts for the scorer's team; an own goal
 * counts for the other team. Saves, cards and MOTM never change the score.
 */
export function calculateMatchScore({
  homeTeamId,
  awayTeamId,
  events,
}: CalculateMatchScoreInput): MatchScore {
  let homeGoals = 0;
  let awayGoals = 0;

  for (const event of events) {
    const forHome =
      event.eventType === "goal" ? event.teamId === homeTeamId : event.teamId === awayTeamId;
    if (forHome) homeGoals += 1;
    else awayGoals += 1;
  }

  return { homeGoals, awayGoals };
}
