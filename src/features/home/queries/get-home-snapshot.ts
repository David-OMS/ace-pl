import "server-only";

import type { CurrentUser } from "@/features/auth";
import { loadFantasyHomeTeaser } from "@/features/fantasy";
import { loadHomeFraudWatch, type HomeFraudWatchEntry } from "@/features/fraud-watch";
import {
  getTournamentForm,
  getTournamentStandings,
  type FormResult,
  type StandingTeamRow,
} from "@/features/standings";

import type { HomeHero } from "./load-home-hero";
import { loadHomeHero } from "./load-home-hero";
import type { HomeFixtureRow } from "./load-home-next-fixtures";
import { loadHomeNextFixtures } from "./load-home-next-fixtures";
import type { HomeStatBoard } from "./load-home-stat-boards";
import { loadHomeStatBoards } from "./load-home-stat-boards";
import { resolveFanTournament } from "./resolve-fan-tournament";

export type HomeTableRow = StandingTeamRow & {
  form: readonly FormResult[];
};

export type HomeFantasyTeaser = {
  kind: "signed_out" | "no_team" | "has_team";
  teamName?: string;
  rankLabel?: string;
  points?: number;
};

export type HomeSnapshot = {
  user: CurrentUser | null;
  hero: HomeHero | null;
  fraudWatch: HomeFraudWatchEntry[];
  tableRows: HomeTableRow[];
  nextFixtures: HomeFixtureRow[];
  statBoards: HomeStatBoard[];
  fantasy: HomeFantasyTeaser;
};

const COMPACT_TABLE = 5;

export async function getHomeSnapshot(user: CurrentUser | null): Promise<HomeSnapshot> {
  const tournament = await resolveFanTournament();
  if (!tournament) {
    return {
      user,
      hero: null,
      fraudWatch: [],
      tableRows: [],
      nextFixtures: [],
      statBoards: [],
      fantasy: await loadFantasyHomeTeaser({
        userId: user?.id ?? null,
        tournamentId: null,
      }),
    };
  }

  const [hero, fraudWatch, standings, formRows, nextFixtures, statBoards, fantasy] =
    await Promise.all([
      loadHomeHero(tournament),
      loadHomeFraudWatch(tournament.id),
      getTournamentStandings(tournament.id),
      getTournamentForm(tournament.id),
      loadHomeNextFixtures(tournament.id),
      loadHomeStatBoards(tournament.id),
      loadFantasyHomeTeaser({
        userId: user?.id ?? null,
        tournamentId: tournament.id,
      }),
    ]);

  const formByTeam = new Map(formRows.map((row) => [row.teamId, row.results]));

  return {
    user,
    hero,
    fraudWatch,
    tableRows: mergeForm((standings?.rows ?? []).slice(0, COMPACT_TABLE), formByTeam),
    nextFixtures,
    statBoards,
    fantasy,
  };
}

function mergeForm(
  rows: readonly StandingTeamRow[],
  formByTeam: ReadonlyMap<string, readonly FormResult[]>,
): HomeTableRow[] {
  return rows.map((row) => ({
    ...row,
    form: formByTeam.get(row.teamId) ?? [],
  }));
}
