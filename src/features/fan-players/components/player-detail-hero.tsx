import type { PlayerPosition } from "@/config/player-positions";
import { PlayerAvatar } from "@/ui/player-avatar";
import { Card } from "@/ui/card";
import { TeamNameBadge } from "@/ui/team-name-badge";

import { fanPlayersCopy } from "../copy";
import { formatFantasyPrice } from "../domain/format-fantasy-price";

type PlayerDetailHeroProps = {
  name: string;
  position: PlayerPosition;
  photoUrl: string | null;
  priceMillions: number;
  teamName?: string | null;
  teamColor?: string | null;
};

export function PlayerDetailHero({
  name,
  position,
  photoUrl,
  priceMillions,
  teamName = null,
  teamColor = null,
}: PlayerDetailHeroProps): React.JSX.Element {
  return (
    <Card className="flex items-center gap-4 p-4">
      <PlayerAvatar name={name} photoUrl={photoUrl} size="lg" priority />
      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate font-display text-xl uppercase">{name}</h1>
          <p className="text-sm text-muted">{fanPlayersCopy.position(position)}</p>
          <p className="text-sm font-bold">{formatFantasyPrice(priceMillions)}</p>
        </div>
        {teamName && teamColor ? <TeamNameBadge name={teamName} color={teamColor} /> : null}
      </div>
    </Card>
  );
}
