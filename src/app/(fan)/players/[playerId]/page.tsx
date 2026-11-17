import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fanPlayersCopy, FanPlayerDetailScreen, getFanPlayerDetail } from "@/features/fan-players";

type PlayerDetailPageProps = {
  params: Promise<{ playerId: string }>;
};

export async function generateMetadata({ params }: PlayerDetailPageProps): Promise<Metadata> {
  const { playerId } = await params;
  const detail = await getFanPlayerDetail(playerId);
  if (!detail) return { title: fanPlayersCopy.title };
  return { title: detail.name };
}

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps): Promise<React.JSX.Element> {
  const { playerId } = await params;
  const detail = await getFanPlayerDetail(playerId);
  if (!detail) notFound();
  return <FanPlayerDetailScreen detail={detail} />;
}
