import type { Metadata } from "next";

import { AdminHomeScreen, ADMIN_HOME_PATH, adminCopy } from "@/features/admin";
import { getAdminHomeSnapshot } from "@/features/admin/server";
import { requireAdmin } from "@/features/auth";
import { ADMIN_PLAYERS_PATH } from "@/features/players";
import {
  adminNewTeamPath,
  adminTournamentFixturesPath,
  adminTournamentPath,
  adminTournamentPlayersPath,
  adminTournamentSettingsPath,
  NEW_TOURNAMENT_PATH,
  tournamentsCopy,
} from "@/features/tournaments";

export const metadata: Metadata = { title: adminCopy.home.title };

export default async function AdminHomePage(): Promise<React.JSX.Element> {
  await requireAdmin(ADMIN_HOME_PATH);
  const snapshot = await getAdminHomeSnapshot();
  const tournament = snapshot.tournament;

  return (
    <AdminHomeScreen
      snapshot={snapshot}
      statusLabel={tournament ? tournamentsCopy.statuses[tournament.status] : null}
      playersHref={ADMIN_PLAYERS_PATH}
      createTournamentHref={NEW_TOURNAMENT_PATH}
      tournamentHref={tournament ? adminTournamentPath(tournament.id) : null}
      fixturesHref={tournament ? adminTournamentFixturesPath(tournament.id) : null}
      settingsHref={tournament ? adminTournamentSettingsPath(tournament.id) : null}
      manageRosterHref={tournament ? adminTournamentPlayersPath(tournament.id) : null}
      createTeamHref={tournament ? adminNewTeamPath(tournament.id) : null}
    />
  );
}
