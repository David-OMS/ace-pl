"use client";

import { useState } from "react";

import { FAN_PLAYERS_PATH } from "@/features/fan";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { fanPlayersCopy } from "../copy";
import type { FanPlayerDetail } from "../queries/fan-player-detail-model";
import { PlayerDetailHero } from "./player-detail-hero";
import { PlayerLeaderboardPanel } from "./player-leaderboard-panel";
import { PlayerScopeChips } from "./player-scope-chips";
import { PlayerStatGrid } from "./player-stat-grid";

type FanPlayerDetailScreenProps = { detail: FanPlayerDetail };

type Scope = "tournament" | "allTime";

export function FanPlayerDetailScreen({ detail }: FanPlayerDetailScreenProps): React.JSX.Element {
  const [scope, setScope] = useState<Scope>(detail.tournamentName ? "tournament" : "allTime");
  const stats = scope === "tournament" ? detail.tournament : detail.allTime;
  const boards = scope === "tournament" ? detail.leaderboardTournament : detail.leaderboardAllTime;
  const tournamentLabel = detail.tournamentName ?? fanPlayersCopy.scopeTournament;

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <SoftNavLink href={FAN_PLAYERS_PATH} className="text-xs font-bold text-muted">
        {fanPlayersCopy.backToList}
      </SoftNavLink>
      <PlayerDetailHero
        name={detail.name}
        position={detail.position}
        photoUrl={detail.photoUrl}
        priceMillions={detail.priceMillions}
        teamName={detail.teamName}
        teamColor={detail.teamColor}
      />
      <PlayerScopeChips
        scope={scope}
        tournamentLabel={tournamentLabel}
        onScope={setScope}
        tournamentDisabled={!detail.tournamentName}
      />
      <PlayerStatGrid stats={stats} />
      <PlayerLeaderboardPanel boards={boards} />
    </div>
  );
}
