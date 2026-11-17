type CountFraudWeeksArgs = {
  startedOn: string;
  endedOn: string | null;
  /** Game day dates (YYYY-MM-DD), typically Fridays. */
  gameDays: readonly string[];
  today: string;
};

/**
 * Weeks on Fraud Watch = game days that fall in [startedOn, end].
 * Open entries show at least 1 so a fresh naming still reads as a streak.
 */
export function countFraudWeeks(args: CountFraudWeeksArgs): number {
  const end = args.endedOn ?? args.today;
  const count = args.gameDays.filter((day) => day >= args.startedOn && day <= end).length;
  if (args.endedOn === null) return Math.max(1, count);
  return count;
}
