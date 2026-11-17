"use client";

import type { Route } from "next";

import { PageHeader } from "@/ui/page-header";

import type { TeamDetailPlayer } from "../team-detail-player";
import { teamsCopy } from "../copy";
import { AddTeamPlayersForm } from "./add-team-players-form";
import type { PickablePlayer } from "./player-multi-picker";
import { RemoveTeamButton } from "./remove-team-button";
import { TeamColorPicker } from "./team-color-picker";
import { TeamSquadList } from "./team-squad-list";

export type { TeamDetailPlayer };

type TeamDetailScreenProps = {
  tournamentId: string;
  tournamentName: string;
  teamId: string;
  teamName: string;
  teamColor: string;
  squadSize: number;
  players: readonly TeamDetailPlayer[];
  availablePlayers: readonly PickablePlayer[];
  backHref: Route;
};

export function TeamDetailScreen({
  tournamentId,
  tournamentName,
  teamId,
  teamName,
  teamColor,
  squadSize,
  players,
  availablePlayers,
  backHref,
}: TeamDetailScreenProps): React.JSX.Element {
  const openSpots = squadSize - players.length;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
      <PageHeader title={teamName} back={{ href: backHref, label: tournamentName }} />
      <p className="text-xs font-bold text-muted uppercase">
        {openSpots > 0 ? teamsCopy.openSpots(openSpots) : teamsCopy.full}
      </p>
      <TeamColorPicker tournamentId={tournamentId} teamId={teamId} color={teamColor} />
      <TeamSquadList tournamentId={tournamentId} teamId={teamId} players={players} />
      <AddTeamPlayersForm
        tournamentId={tournamentId}
        teamId={teamId}
        openSpots={openSpots}
        availablePlayers={availablePlayers}
      />
      <RemoveTeamButton tournamentId={tournamentId} teamId={teamId} teamName={teamName} />
    </main>
  );
}
