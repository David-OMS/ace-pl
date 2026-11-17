import Link from "next/link";

import { buildSignInHref, SignUpOptions } from "@/features/auth";
import { Card } from "@/ui/card";

import { playersCopy } from "../copy";
import { claimPath } from "../routes";
import { ClaimPlayerForm } from "./claim-player-form";

type ClaimPlayerScreenProps = {
  token: string;
  playerName: string | null;
  /** True when the visitor still needs to sign up before the link can be used. */
  needsSignUp: boolean;
};

export function ClaimPlayerScreen({
  token,
  playerName,
  needsSignUp,
}: ClaimPlayerScreenProps): React.JSX.Element {
  const copy = playersCopy.claimPage;

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <Card className="flex flex-col gap-3">
        {playerName ? (
          <>
            <h1 className="font-display text-3xl uppercase">{copy.hey(playerName)}</h1>
            {needsSignUp ? (
              <>
                <p className="text-sm">{copy.signUp}</p>
                <SignUpOptions next={claimPath(token)} lockedName={playerName} />
                <Link
                  href={buildSignInHref(claimPath(token))}
                  className="text-sm font-bold underline"
                >
                  {copy.alreadySignedUp}
                </Link>
              </>
            ) : (
              <ClaimPlayerForm token={token} />
            )}
          </>
        ) : (
          <p className="text-sm">{copy.invalid}</p>
        )}
      </Card>
    </main>
  );
}
