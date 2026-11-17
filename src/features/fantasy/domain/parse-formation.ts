import { FANTASY_FORMATIONS, type FantasyFormation } from "@/config/fantasy";

export type FormationCounts = {
  def: number;
  mid: number;
  fwd: number;
  starters: number;
};

export function parseFormation(value: string): FormationCounts | null {
  if (!(FANTASY_FORMATIONS as readonly string[]).includes(value)) return null;
  const [defRaw, midRaw, fwdRaw] = value.split("-");
  const def = Number(defRaw);
  const mid = Number(midRaw);
  const fwd = Number(fwdRaw);
  if (![def, mid, fwd].every((n) => Number.isInteger(n) && n > 0)) return null;
  return { def, mid, fwd, starters: 1 + def + mid + fwd };
}

export function isFantasyFormation(value: string): value is FantasyFormation {
  return (FANTASY_FORMATIONS as readonly string[]).includes(value);
}
