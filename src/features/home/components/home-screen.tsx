import { HomeFraudWatch } from "@/features/fraud-watch";

import type { HomeSnapshot } from "../queries/get-home-snapshot";
import { HomeCompactTable } from "./home-compact-table";
import { HomeFantasyCard } from "./home-fantasy-card";
import { HomeHero } from "./home-hero";
import { HomeNextFixtures } from "./home-next-fixtures";
import { HomeRotatingStats } from "./home-rotating-stats";

type HomeScreenProps = { snapshot: HomeSnapshot };

export function HomeScreen({ snapshot }: HomeScreenProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <HomeHero hero={snapshot.hero} />
      <div className="flex flex-col gap-6 px-4">
        <HomeFraudWatch entries={snapshot.fraudWatch} />
        <HomeCompactTable rows={snapshot.tableRows} />
        <HomeNextFixtures fixtures={snapshot.nextFixtures} />
        <HomeRotatingStats boards={snapshot.statBoards} />
        <HomeFantasyCard fantasy={snapshot.fantasy} />
      </div>
    </div>
  );
}
