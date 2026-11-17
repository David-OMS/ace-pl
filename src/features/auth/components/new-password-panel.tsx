import { Card } from "@/ui/card";
import { SoftNavLink } from "@/ui/soft-nav-link";

import { authCopy } from "../copy";
import { buildForgotPasswordHref } from "../routes";
import { NewPasswordForm } from "./new-password-form";

type NewPasswordPanelProps = { hasSession: boolean };

export function NewPasswordPanel({ hasSession }: NewPasswordPanelProps): React.JSX.Element {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-5 px-5 py-10">
      <h1 className="font-display text-4xl uppercase">{authCopy.newPasswordTitle}</h1>
      {hasSession ? (
        <>
          <p className="text-sm text-muted">{authCopy.newPasswordIntro}</p>
          <Card>
            <NewPasswordForm />
          </Card>
        </>
      ) : (
        <>
          <p className="text-sm">{authCopy.resetLinkExpired}</p>
          <SoftNavLink href={buildForgotPasswordHref("/")} className="text-sm font-bold">
            {authCopy.forgotPasswordLink}
          </SoftNavLink>
        </>
      )}
    </main>
  );
}
