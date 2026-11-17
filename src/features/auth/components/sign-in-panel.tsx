import { Button } from "@/ui/button";
import { Card } from "@/ui/card";

import { signInWithGoogle } from "../actions/sign-in-with-google";
import { authCopy } from "../copy";
import type { SignInError } from "../routes";
import { MagicLinkForm } from "./magic-link-form";

type SignInPanelProps = {
  next: string;
  error: SignInError | null;
};

export function SignInPanel({ next, error }: SignInPanelProps): React.JSX.Element {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-5 px-5 py-10">
      <h1 className="font-display text-4xl uppercase">{authCopy.signInTitle}</h1>
      <p className="text-sm text-muted">{authCopy.signInIntro}</p>

      {error ? (
        <p role="alert" className="rounded-card border-2 border-hot p-3 text-sm font-bold text-hot">
          {authCopy.pageErrors[error]}
        </p>
      ) : null}

      <Card className="flex flex-col gap-4">
        <MagicLinkForm next={next} />
        <p className="text-center text-xs font-bold text-muted uppercase">{authCopy.divider}</p>
        <form action={signInWithGoogle}>
          <input type="hidden" name="next" value={next} />
          <Button type="submit" variant="secondary" fullWidth>
            {authCopy.continueWithGoogle}
          </Button>
        </form>
      </Card>
    </main>
  );
}
