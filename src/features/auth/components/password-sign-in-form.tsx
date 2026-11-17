"use client";

import { useActionState } from "react";

import { Button } from "@/ui/button";
import { SoftNavLink } from "@/ui/soft-nav-link";
import { TextField } from "@/ui/text-field";

import { signInWithPassword, type PasswordSignInState } from "../actions/sign-in-with-password";
import { authCopy, describeActionError } from "../copy";
import { PASSWORD_MIN_LENGTH } from "../domain/password-length";
import { buildForgotPasswordHref } from "../routes";
import { PasswordField } from "./password-field";

type PasswordSignInFormProps = { next: string };

export function PasswordSignInForm({ next }: PasswordSignInFormProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<PasswordSignInState, FormData>(
    signInWithPassword,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <TextField
        label={authCopy.emailLabel}
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        placeholder={authCopy.emailPlaceholder}
      />
      <PasswordField
        label={authCopy.passwordLabel}
        name="password"
        autoComplete="current-password"
        required
        minLength={PASSWORD_MIN_LENGTH}
      />
      <SoftNavLink href={buildForgotPasswordHref(next)} className="text-xs font-bold text-muted">
        {authCopy.forgotPasswordLink}
      </SoftNavLink>
      {state && !state.ok ? (
        <p role="alert" className="text-sm font-bold text-hot">
          {describeActionError(state.error)}
        </p>
      ) : null}
      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? authCopy.signingIn : authCopy.signInButton}
      </Button>
    </form>
  );
}
