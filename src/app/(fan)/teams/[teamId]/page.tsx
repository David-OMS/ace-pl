import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FAN_LEAGUE_PATH } from "@/features/fan";
import { getPublicTeamPage, PublicTeamScreen, standingsCopy } from "@/features/standings";

export const metadata: Metadata = { title: standingsCopy.teamPageTitle };

type TeamPageProps = {
  params: Promise<{ teamId: string }>;
};

export default async function PublicTeamPage({
  params,
}: TeamPageProps): Promise<React.JSX.Element> {
  const { teamId } = await params;
  const team = await getPublicTeamPage(teamId);
  if (!team) notFound();

  return <PublicTeamScreen team={team} backHref={FAN_LEAGUE_PATH} />;
}
