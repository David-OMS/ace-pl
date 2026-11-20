import { gameweekDeadlineMs } from "./gameweek-deadline-ms";

/**
 * Late joiners miss any GW whose Thursday deadline already passed when they
 * created the team. Scoring starts from the next GW.
 */
export function teamScoresGameweek(args: { createdAtMs: number; playedOn: string }): boolean {
  return args.createdAtMs <= gameweekDeadlineMs(args.playedOn);
}
