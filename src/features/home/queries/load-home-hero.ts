import "server-only";

import { formatGameDay } from "@/lib/dates/format-game-day";
import { fanPublicCache } from "@/lib/cache/fan-public-cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public-client";

import type { FanTournament } from "./resolve-fan-tournament";

export type HomeHero = {
  tournamentName: string;
  gameweekLabel: string | null;
  nextUpLabel: string | null;
  nextMatchCount: number;
  played: number;
  goals: number;
};

export function loadHomeHero(tournament: FanTournament): Promise<HomeHero> {
  return fanPublicCache(`home-hero:${tournament.id}`, () => readHomeHero(tournament));
}

async function readHomeHero(tournament: FanTournament): Promise<HomeHero> {
  const supabase = createPublicSupabaseClient();
  const [gameDays, fixtures, events] = await Promise.all([
    supabase
      .from("game_days")
      .select("id, played_on")
      .eq("tournament_id", tournament.id)
      .order("played_on"),
    supabase.from("fixtures").select("id, game_day_id, status").eq("tournament_id", tournament.id),
    supabase
      .from("match_events")
      .select("quantity, event_type")
      .eq("tournament_id", tournament.id)
      .eq("event_type", "goal"),
  ]);

  for (const result of [gameDays, fixtures, events]) {
    if (result.error) throw result.error;
  }

  const days = gameDays.data ?? [];
  const allFixtures = fixtures.data ?? [];
  const gw = pickGameweek(days, allFixtures);

  return {
    tournamentName: tournament.name,
    gameweekLabel: days.length > 0 ? `${gw.currentGw} of ${days.length}` : null,
    nextUpLabel: gw.nextDay ? formatGameDay(gw.nextDay.played_on) : null,
    nextMatchCount: gw.nextMatchCount,
    played: countFinished(allFixtures),
    goals: (events.data ?? []).reduce((sum, e) => sum + e.quantity, 0),
  };
}

function countFinished(fixtures: readonly { status: string }[]): number {
  return fixtures.filter((f) => f.status === "completed" || f.status === "walkover").length;
}

function pickGameweek(
  days: readonly { id: string; played_on: string }[],
  fixtures: readonly { game_day_id: string; status: string }[],
): {
  currentGw: number;
  nextDay: { id: string; played_on: string } | null;
  nextMatchCount: number;
} {
  for (let i = 0; i < days.length; i += 1) {
    const day = days[i];
    if (!day) continue;
    const dayFixtures = fixtures.filter((f) => f.game_day_id === day.id);
    const upcoming = dayFixtures.filter((f) => f.status === "draft" || f.status === "published");
    if (upcoming.length > 0 || !isDayComplete(dayFixtures)) {
      return {
        currentGw: i + 1,
        nextDay: day,
        nextMatchCount: upcoming.length || dayFixtures.length,
      };
    }
  }
  return {
    currentGw: days.length,
    nextDay: days[days.length - 1] ?? null,
    nextMatchCount: 0,
  };
}

function isDayComplete(dayFixtures: readonly { status: string }[]): boolean {
  return (
    dayFixtures.length > 0 &&
    dayFixtures.every((f) => f.status === "completed" || f.status === "walkover")
  );
}
