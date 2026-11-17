import type { Route } from "next";

import { ButtonLink } from "@/ui/button-link";
import { Card } from "@/ui/card";

import { playersCopy } from "../copy";
import { ClaimPlayerForm } from "./claim-player-form";

type ClaimPlayerScreenProps = {
  token: string;
  /** Null when the visitor is signed in and can claim straight away. */
  signInHref: Route | null;
};

export function ClaimPlayerScreen({
  token,
  signInHref,
}: ClaimPlayerScreenProps): React.JSX.Element {
  const copy = playersCopy.claimPage;

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <Card className="flex flex-col gap-3">
        <h1 className="font-display text-2xl uppercase">{copy.title}</h1>
        <p className="text-sm text-muted">{copy.intro}</p>
        {signInHref ? (
          <>
            <p className="text-sm">{copy.signInFirst}</p>
            <ButtonLink href={signInHref} fullWidth>
              {copy.signIn}
            </ButtonLink>
          </>
        ) : (
          <ClaimPlayerForm token={token} />
        )}
      </Card>
    </main>
  );
}
