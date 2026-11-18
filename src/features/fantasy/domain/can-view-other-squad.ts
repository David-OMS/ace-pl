/** Other managers' live squad stays private until a gameweek is locked in. */
export function canViewOtherSquad(lockedGameweekCount: number): boolean {
  return lockedGameweekCount > 0;
}
