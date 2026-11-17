import type { PlayerPosition } from "@/config/player-positions";
import { PlayerAvatar } from "@/ui/player-avatar";
import { Card } from "@/ui/card";

import { fanPlayersCopy } from "../copy";
import { formatFantasyPrice } from "../domain/format-fantasy-price";

type PlayerDetailHeroProps = {
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
  priceMillions: number;
};

export function PlayerDetailHero({
  name,
  position,
  photoUrl,
  priceMillions,
}: PlayerDetailHeroProps): React.JSX.Element {
  return (
    <Card className="flex items-center gap-4 p-4">
      <PlayerAvatar name={name} photoUrl={photoUrl} size="lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="truncate font-display text-xl uppercase">{name}</h1>
        <p className="text-sm text-muted">{fanPlayersCopy.position(position)}</p>
        <p className="text-sm font-bold">{formatFantasyPrice(priceMillions)}</p>
      </div>
    </Card>
  );
}
