import { Card } from "@/ui/card";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { authCopy } from "../copy";
import type { SignInError } from "../routes";
import { buildSignInHref, buildSignUpHref } from "../routes";
import { PasswordSignInForm } from "./password-sign-in-form";
import { SignUpOptions } from "./sign-up-options";

type SignInPanelProps = {
  next: string;
  error: SignInError | null;
  mode: "sign-in" | "sign-up";
};

export function SignInPanel({ next, error, mode }: SignInPanelProps): React.JSX.Element {
  const isSignUp = mode === "sign-up";

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-5 px-5 py-10">
      <h1 className="font-display text-4xl uppercase">
        {isSignUp ? authCopy.createAccountTitle : authCopy.signInTitle}
      </h1>
      <p className="text-sm text-muted">{authCopy.signInIntro}</p>

      {error ? (
        <p role="alert" className="rounded-card border-2 border-hot p-3 text-sm font-bold text-hot">
          {authCopy.pageErrors[error]}
        </p>
      ) : null}

      <Card>{isSignUp ? <SignUpOptions next={next} /> : <PasswordSignInForm next={next} />}</Card>
      <SoftNavLink
        href={isSignUp ? buildSignInHref(next) : buildSignUpHref(next)}
        className="text-sm font-bold"
      >
        {isSignUp ? authCopy.alreadyHaveAccount : authCopy.createAccount}
      </SoftNavLink>
    </main>
  );
}
