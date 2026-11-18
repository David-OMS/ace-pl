import Link from "next/link";

import { ADMIN_HOME_PATH } from "@/features/admin";
import { DisplayNameForm, SignOutButton, type CurrentUser } from "@/features/auth";
import { FantasyTeamNameForm, type MyFantasyTeam } from "@/features/fantasy";
import { Card } from "@/ui/card";

type SignedInProfileProps = {
  user: CurrentUser;
  fantasyTeam: MyFantasyTeam | null;
};

export function SignedInProfile({ user, fantasyTeam }: SignedInProfileProps): React.JSX.Element {
  return (
    <>
      <Card className="flex flex-col gap-3">
        <DisplayNameForm currentName={user.displayName} />
        {user.isAdmin ? (
          <Link href={ADMIN_HOME_PATH} className="text-sm font-bold underline">
            Admin
          </Link>
        ) : null}
        <SignOutButton />
      </Card>
      {fantasyTeam ? (
        <Card className="flex flex-col gap-3">
          <FantasyTeamNameForm
            teamId={fantasyTeam.id}
            currentName={fantasyTeam.name}
            nameChangeCount={fantasyTeam.nameChangeCount}
          />
        </Card>
      ) : null}
    </>
  );
}
