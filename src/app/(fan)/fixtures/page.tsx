import type { Metadata } from "next";

import { fanFixturesCopy, FanFixturesScreen, getFanFixtureBoard } from "@/features/fan-fixtures";
import { leagueToday } from "@/lib/dates/league-today";

export const metadata: Metadata = { title: fanFixturesCopy.title };

type FixturesPageProps = {
  searchParams: Promise<{ day?: string }>;
};

export default async function FanFixturesPage({
  searchParams,
}: FixturesPageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  const data = await getFanFixtureBoard();

  if (!data) {
    return <p className="px-4 py-4 text-sm text-muted">{fanFixturesCopy.noTournament}</p>;
  }

  return (
    <FanFixturesScreen
      data={data}
      selectedGameDayId={params.day ?? null}
      todayIso={leagueToday()}
    />
  );
}
