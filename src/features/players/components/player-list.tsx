"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PLAYER_POSITIONS, type PlayerPosition } from "@/config/player-positions";
import { Icon } from "@/ui/icon";
import { SelectField } from "@/ui/select-field";

import { playersCopy } from "../copy";
import type { PlayerSummary } from "../queries/list-players";
import { adminPlayerPath } from "../routes";

type PlayerListProps = { players: readonly PlayerSummary[] };

type PositionFilter = PlayerPosition | "all";

export function PlayerList({ players }: PlayerListProps): React.JSX.Element {
  const [position, setPosition] = useState<PositionFilter>("all");
  const options = useMemo(
    () => [
      { value: "all", label: playersCopy.filter.all },
      ...PLAYER_POSITIONS.map((value) => ({
        value,
        label: playersCopy.positions[value],
      })),
    ],
    [],
  );
  const visible =
    position === "all" ? players : players.filter((player) => player.position === position);

  return (
    <div className="flex flex-col gap-3">
      <SelectField
        label={playersCopy.filter.position}
        name="positionFilter"
        options={options}
        value={position}
        onChange={(value) => setPosition(value as PositionFilter)}
      />
      {visible.length === 0 ? (
        <p className="text-sm text-muted">{playersCopy.emptyList}</p>
      ) : (
        <ul className="flex flex-col divide-y-2 divide-line-soft rounded-card border-2 border-line bg-surface">
          {visible.map((player) => (
            <li key={player.id}>
              <Link
                href={adminPlayerPath(player.id)}
                className="flex min-h-14 items-center gap-3 px-3"
              >
                <span className="w-10 font-display text-sm">{player.position}</span>
                <span className="flex-1 font-bold">{player.name}</span>
                {player.isClaimed ? <Badge>{playersCopy.claimed}</Badge> : null}
                <Icon icon={ChevronRight} size="sm" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Badge({ children }: { children: string }): React.JSX.Element {
  return (
    <span className="rounded-card border border-line px-2 py-0.5 text-xs font-bold uppercase">
      {children}
    </span>
  );
}
