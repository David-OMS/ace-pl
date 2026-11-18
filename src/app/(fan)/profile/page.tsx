import type { Metadata } from "next";
import Link from "next/link";

import { buildSignInHref, getCurrentUser, SIGN_IN_PATH } from "@/features/auth";
import { FAN_HOME_PATH, FAN_PROFILE_PATH, fanCopy } from "@/features/fan";
import { getMyFantasyTeam } from "@/features/fantasy";
import { resolveFanTournament } from "@/features/home";
import { getMyLinkedPlayer, PlayerPhotoForm } from "@/features/players";
import { SignedInProfile } from "@/features/profile";
import { ButtonLink } from "@/ui/button-link";
import { Card } from "@/ui/card";

export const metadata: Metadata = { title: fanCopy.profile };

type ProfilePageProps = {
  searchParams: Promise<{ setup?: string }>;
};

export default async function ProfilePage({
  searchParams,
}: ProfilePageProps): Promise<React.JSX.Element> {
  const [{ setup }, user] = await Promise.all([searchParams, getCurrentUser()]);
  const player = user ? await getMyLinkedPlayer(user.id) : null;
  const fantasyTeam = user ? await loadFantasyTeamForProfile(user.id) : null;

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <h1 className="font-display text-2xl uppercase">{fanCopy.profile}</h1>
      {user && player ? (
        <Card>
          <PlayerPhotoForm
            name={player.name}
            photoUrl={player.photoUrl}
            offerSkip={setup === "photo"}
          />
        </Card>
      ) : null}
      {user ? (
        <SignedInProfile user={user} fantasyTeam={fantasyTeam} />
      ) : (
        <Card className="flex flex-col gap-3">
          <p className="text-sm text-muted">{fanCopy.signIn}</p>
          <ButtonLink href={buildSignInHref(FAN_PROFILE_PATH)}>{fanCopy.signIn}</ButtonLink>
          <Link href={FAN_HOME_PATH} className="text-sm text-muted">
            Back home
          </Link>
          <Link href={SIGN_IN_PATH} className="sr-only">
            Sign in
          </Link>
        </Card>
      )}
    </div>
  );
}

async function loadFantasyTeamForProfile(userId: string) {
  const tournament = await resolveFanTournament();
  if (!tournament) return null;
  return getMyFantasyTeam({ tournamentId: tournament.id, userId });
}
