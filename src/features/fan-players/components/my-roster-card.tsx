import type { PlayerPosition } from "@/config/player-positions";
import { Card } from "@/ui/card";

import { fanPlayersCopy } from "../copy";
import type { FanPlayerStatSnapshot } from "../queries/build-fan-player-stats";
import { PlayerDetailHero } from "./player-detail-hero";
import { PlayerStatGrid } from "./player-stat-grid";

export type MyRosterPlayer = {
  id: string;
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
  priceMillions: number;
  teamName: string | null;
  stats: FanPlayerStatSnapshot;
};

export function MyRosterCard({ player }: { player: MyRosterPlayer }): React.JSX.Element {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-lg uppercase">{fanPlayersCopy.you}</h2>
      <PlayerDetailHero
        name={player.name}
        position={player.position}
        photoUrl={player.photoUrl}
        priceMillions={player.priceMillions}
        teamName={player.teamName}
      />
      <Card className="p-3">
        <PlayerStatGrid stats={player.stats} />
      </Card>
      <p className="text-xs text-muted">{fanPlayersCopy.statsScope}</p>
    </section>
  );
}
