import { formatKickoffTime } from "@/lib/dates/format-kickoff-time";
import { TeamCrest } from "@/ui/team-crest";

import { matchesCopy } from "../copy";
import { groupGoalScorers, type GoalScorerLine } from "../domain/group-goal-scorers";
import type { MatchEntry } from "../queries/get-match-entry";

type MatchScoreHeaderProps = {
  match: MatchEntry;
  /** Fan view hides the admin locked note. */
  showLockedNote?: boolean;
  /** Fan preview hides 0–0 until the result is published. */
  showScore?: boolean;
};

export function MatchScoreHeader({
  match,
  showLockedNote = true,
  showScore = true,
}: MatchScoreHeaderProps): React.JSX.Element {
  const scorers = showScore
    ? groupGoalScorers({
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        lineup: [...match.homePlayers, ...match.awayPlayers].map((p) => ({
          playerId: p.playerId,
          teamId: p.teamId,
        })),
        events: match.events,
      })
    : { home: [], away: [] };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-lg uppercase">{match.gameDayLabel}</h2>
        <span className="text-xs font-bold text-muted">{formatKickoffTime(match.kickoffTime)}</span>
      </div>
      <div className="flex items-center justify-between border-2 border-line bg-hero px-3.5 py-3.5 text-on-hero shadow-[4px_4px_0_var(--color-hot)]">
        <ScoreSide name={match.homeTeamName} color={match.homeTeamColor} scorers={scorers.home} />
        <div className="flex flex-col items-center gap-0.5 text-center">
          <span className="font-display text-4xl tracking-wide text-accent">
            {showScore
              ? `${match.score.homeGoals}–${match.score.awayGoals}`
              : formatKickoffTime(match.kickoffTime)}
          </span>
        </div>
        <ScoreSide name={match.awayTeamName} color={match.awayTeamColor} scorers={scorers.away} />
      </div>
      {showLockedNote && match.isLocked ? (
        <p className="text-sm font-bold text-muted">{matchesCopy.locked}</p>
      ) : null}
    </div>
  );
}

function ScoreSide({
  name,
  color,
  scorers,
}: {
  name: string;
  color: string;
  scorers: readonly GoalScorerLine[];
}): React.JSX.Element {
  return (
    <div className="flex w-[90px] flex-col items-center gap-1.5 text-center text-xs font-bold">
      <TeamCrest name={name} color={color} size="md" />
      <span className="w-full truncate">{name}</span>
      {scorers.length > 0 ? (
        <ul className="flex w-full flex-col gap-0.5 text-[10px] font-bold text-on-hero/80">
          {scorers.map((line, index) => (
            <li key={`${line.playerName}-${index}`} className="truncate">
              {line.playerName}
              {line.assistName ? ` (${line.assistName})` : ""}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
