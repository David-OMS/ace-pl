/** Budget is tournament.fantasy_budget — this only checks spent vs that value. */
export function isWithinBudget(spent: number, nextPrice: number, budget: number): boolean {
  return spent + nextPrice <= budget;
}

export function remainingBank(budget: number, spent: number): number {
  return budget - spent;
}
