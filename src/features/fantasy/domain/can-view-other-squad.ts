/** Other managers' GW squad is visible once that gameweek has a locked snapshot. */
export function canViewOtherSquadGameweek(hasLockedSnapshot: boolean): boolean {
  return hasLockedSnapshot;
}
