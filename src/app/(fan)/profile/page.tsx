import type { Metadata } from "next";
import Link from "next/link";

import { ADMIN_HOME_PATH } from "@/features/admin";
import { buildSignInHref, getCurrentUser, SIGN_IN_PATH, SignOutButton } from "@/features/auth";
import { FAN_HOME_PATH, FAN_PROFILE_PATH, fanCopy } from "@/features/fan";
import { getMyLinkedPlayer, PlayerPhotoForm } from "@/features/players";
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
        <Card className="flex flex-col gap-3">
          <p className="font-bold">{user.displayName}</p>
          {user.isAdmin ? (
            <Link href={ADMIN_HOME_PATH} className="text-sm font-bold underline">
              Admin
            </Link>
          ) : null}
          <SignOutButton />
        </Card>
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
