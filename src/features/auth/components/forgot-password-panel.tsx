import { Card } from "@/ui/card";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { authCopy } from "../copy";
import { buildSignInHref } from "../routes";
import { ForgotPasswordForm } from "./forgot-password-form";

type ForgotPasswordPanelProps = { next: string };

export function ForgotPasswordPanel({ next }: ForgotPasswordPanelProps): React.JSX.Element {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-5 px-5 py-10">
      <h1 className="font-display text-4xl uppercase">{authCopy.forgotPasswordTitle}</h1>
      <Card>
        <ForgotPasswordForm />
      </Card>
      <SoftNavLink href={buildSignInHref(next)} className="text-sm font-bold">
        {authCopy.signIn}
      </SoftNavLink>
    </main>
  );
}
